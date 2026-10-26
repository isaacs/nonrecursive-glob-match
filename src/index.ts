import { type Form, parseClass } from './parse-class.js'

export type { Form }

export type MatcherOptions = {
  /** perform a case-insensitive match */
  nocase?: boolean
  /** do not treat strings starting with `.` specially */
  dot?: boolean
  /** do not match extglobs (treat them as normal strings) */
  noext?: boolean
  /**
   * normalize unicode in the pattern and the tested strings, with
   * this form. `true` means `'NFC'`.
   */
  normalize?: boolean | Form
}

// parsed pattern items
export type Item =
  | { t: 'lit'; ch: string }
  | { t: 'any' | 'star' }
  | { t: 'class'; re: RegExp }
  | { t: 'ext'; type: string; alts: Item[][] }

// extglob syntax tokens become literals if they are not part of a
// closed extglob
export type Token =
  Item | { t: 'open'; type: string } | { t: 'bar' } | { t: 'close' }

// state machine nodes
export type NegNode = { t: 'neg'; id: number; sub: Node; next: Node }
export type SplitNode = { t: 'split'; id: number; out: Node[] }
export type Node =
  // `re` folds case, if `nocase:true`
  | { t: 'lit'; id: number; ch: string; re?: RegExp; next: Node }
  | { t: 'any' | 'star'; id: number; next: Node }
  | { t: 'class'; id: number; re: RegExp; next: Node }
  | SplitNode
  | NegNode
  | { t: 'match'; id: number }

// the end of the pattern, or of a negated sub-pattern
const MATCH: Node = { t: 'match', id: 0 }
const MATCH_KEY = '0'

const extTypes = '!?+*@'

const lit = (ch: string): Item => ({ t: 'lit', ch })

const reEscape = (s: string) => s.replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&')

// a RegExp that only matches `s`, with unicode case folding
const foldRe = (s: string) => new RegExp(`^${reEscape(s)}$`, 'iu')

const tokenize = (
  p: string,
  nocase: boolean,
  noext: boolean,
  form?: Form,
) => {
  const toks: Token[] = []
  for (let i = 0; i < p.length;) {
    const c = String.fromCodePoint(p.codePointAt(i)!)
    if (c === '\\') {
      // a trailing \ is a literal \
      const e = p.codePointAt(i + 1)
      const ch = e === undefined ? c : String.fromCodePoint(e)
      toks.push(lit(ch))
      i += 1 + ch.length
      continue
    }
    if (c === '[') {
      const [re, consumed] = parseClass(p, i, nocase, form)
      if (consumed) {
        toks.push({ t: 'class', re })
        i += consumed
        continue
      }
    }
    if (!noext && extTypes.includes(c) && p[i + 1] === '(') {
      toks.push({ t: 'open', type: c })
      i += 2
      continue
    }
    toks.push(
      !noext && c === '|' ? { t: 'bar' }
      : !noext && c === ')' ? { t: 'close' }
      : c === '*' ? { t: 'star' }
      : c === '?' ? { t: 'any' }
      : lit(c),
    )
    i += c.length
  }
  return toks
}

// map each open token index to the index of its close token
const pair = (toks: Token[]) => {
  const pairs = new Map<number, number>()
  const stack: number[] = []
  toks.forEach((tok, i) => {
    if (tok.t === 'open') stack.push(i)
    else if (tok.t === 'close' && stack.length) pairs.set(stack.pop()!, i)
  })
  return pairs
}

// build the alternatives between start and end. An open token that
// is not closed is never inside a closed extglob, so bar and close
// tokens are only literal at the top level.
const build = (
  toks: Token[],
  pairs: Map<number, number>,
  start: number,
  end: number,
  top: boolean,
): Item[][] => {
  let seq: Item[] = []
  const alts = [seq]
  for (let i = start; i < end; i++) {
    const tok = toks[i]!
    const close = pairs.get(i)
    if (tok.t === 'open' && close !== undefined) {
      const sub = build(toks, pairs, i + 1, close, false)
      seq.push({ t: 'ext', type: tok.type, alts: sub })
      i = close
    } else if (tok.t === 'bar' && !top) {
      alts.push((seq = []))
    } else if (tok.t === 'open') {
      seq.push(lit(tok.type), lit('('))
    } else if (tok.t === 'bar') {
      seq.push(lit('|'))
    } else if (tok.t === 'close') {
      seq.push(lit(')'))
    } else {
      seq.push(tok)
    }
  }
  return alts
}

// normalize each run of literal chars as one string, so that a char
// and the combining marks after it compose (or decompose) together.
// Syntax is already parsed, so a char that normalizes to a syntax
// char (such as full-width `＊` in NFKC) stays a literal.
const normalize = (items: Item[], form: Form): Item[] => {
  const out: Item[] = []
  let run = ''
  const flush = () => {
    for (const ch of run.normalize(form)) out.push(lit(ch))
    run = ''
  }
  for (const it of items) {
    if (it.t === 'lit') {
      run += it.ch
      continue
    }
    flush()
    out.push(
      it.t === 'ext' ?
        { ...it, alts: it.alts.map(a => normalize(a, form)) }
      : it,
    )
  }
  flush()
  return out
}

const compile = (items: Item[], nocase: boolean): Node => {
  let id = 1
  const split = (out: Node[]): SplitNode => ({ t: 'split', id: id++, out })
  const seq = (items: Item[], next: Node): Node =>
    items.reduceRight((next, it) => item(it, next), next)
  const item = (it: Item, next: Node): Node => {
    switch (it.t) {
      case 'lit':
        const re = nocase ? foldRe(it.ch) : undefined
        return { t: 'lit', id: id++, ch: it.ch, re, next }
      case 'any':
      case 'star':
        return { t: it.t, id: id++, next }
      case 'class':
        return { t: 'class', id: id++, re: it.re, next }
    }
    const alts = (next: Node) => it.alts.map(a => seq(a, next))
    switch (it.type) {
      case '@':
        return split(alts(next))
      case '?':
        return split([next, ...alts(next)])
      case '!':
        return { t: 'neg', id: id++, sub: split(alts(MATCH)), next }
    }
    // * and +, loop back after each match
    const after = split([])
    const entry = split(alts(after))
    after.out.push(next, entry)
    return it.type === '*' ? after : entry
  }
  return seq(items, MATCH)
}

// one line per node, in the order that a walk from the start
// reaches them. Edges point to node ids. The nodes of a negated
// sub-pattern are indented under their negation.
const show = (start: Node): string => {
  const lines: string[] = []
  const seen = new Set<Node>()
  const ref = (n: Node) => (n.t === 'match' ? 'match' : String(n.id))
  const walk = (n: Node, indent: string) => {
    if (n.t === 'match' || seen.has(n)) return
    seen.add(n)
    const line = (desc: string) => lines.push(`${indent}${n.id}: ${desc}`)
    switch (n.t) {
      case 'split':
        line(`split -> ${n.out.map(ref).join(', ')}`)
        for (const o of n.out) walk(o, indent)
        return
      case 'neg':
        line(`!(${ref(n.sub)}) -> ${ref(n.next)}`)
        walk(n.sub, indent + '  ')
        return walk(n.next, indent)
      case 'lit':
        line(`${JSON.stringify(n.ch)} -> ${ref(n.next)}`)
        break
      case 'class':
        line(`${n.re} -> ${ref(n.next)}`)
        break
      default:
        line(`${n.t === 'any' ? '?' : '*'} -> ${ref(n.next)}`)
    }
    walk(n.next, indent)
  }
  walk(start, '')
  return [`start -> ${ref(start)}`, ...lines].join('\n')
}

// A thread inside a !(...) negation. It holds the threads of the
// negated sub-pattern, started where the negation started. The
// negation matches the chars so far if the sub-pattern does not.
type Run = { t: 'run'; neg: NegNode; state: State }
type Thread = Node | Run

// The threads at one position in the string, keyed so that
// identical threads merge. `seen` holds the nodes walked to get to
// the threads, so that loops in the graph stop.
class State {
  threads = new Map<string, Thread>()
  seen = new Set<Node>()
}

class Sim {
  chars: string[]
  dots: boolean
  dotStart: boolean

  constructor(s: string, { dot }: MatcherOptions) {
    this.chars = [...s]
    // `.` and `..` only match literal dots, even with `dot:true`
    this.dots = s === '.' || s === '..'
    this.dotStart = !dot && s.startsWith('.')
  }

  // wildcards only match a leading dot if `dot:true`. In a negated
  // sub-pattern, this does not apply, because the negation itself
  // can not match a leading dot.
  restricted(i: number, top: boolean) {
    return top && (this.dots || (this.dotStart && i === 0))
  }

  add(state: State, node: Node, i: number, top: boolean): void {
    switch (node.t) {
      case 'split':
        if (state.seen.has(node)) return
        state.seen.add(node)
        for (const o of node.out) this.add(state, o, i, top)
        return
      case 'neg':
        if (state.seen.has(node)) return
        state.seen.add(node)
        const sub = new State()
        this.add(sub, node.sub, i, false)
        return this.addRun(
          state,
          { t: 'run', neg: node, state: sub },
          i,
          top,
        )
      case 'star':
        // a * can not start a dotfile, even if it matches nothing
        if (this.restricted(i, top)) return
        if (state.threads.has(String(node.id))) return
        state.threads.set(String(node.id), node)
        return this.add(state, node.next, i, top)
      default:
        state.threads.set(String(node.id), node)
    }
  }

  addRun(state: State, run: Run, i: number, top: boolean) {
    const keys = [...run.state.threads.keys()].sort().join()
    const key = `${run.neg.id}(${keys})`
    if (state.threads.has(key)) return
    state.threads.set(key, run)
    if (!run.state.threads.has(MATCH_KEY)) {
      this.add(state, run.neg.next, i, top)
    }
  }

  step(state: State, i: number, top: boolean): State {
    const next = new State()
    for (const th of state.threads.values()) {
      switch (th.t) {
        case 'lit':
          const c = this.chars[i]!
          if (th.re ? th.re.test(c) : c === th.ch) {
            this.add(next, th.next, i + 1, top)
          }
          break
        case 'any':
          if (!this.restricted(i, top)) this.add(next, th.next, i + 1, top)
          break
        case 'class':
          if (!this.restricted(i, top) && th.re.test(this.chars[i]!)) {
            this.add(next, th.next, i + 1, top)
          }
          break
        case 'star':
          if (!this.restricted(i, top)) this.add(next, th, i + 1, top)
          break
        case 'run':
          if (!this.restricted(i, top)) {
            const state = this.step(th.state, i, false)
            this.addRun(next, { t: 'run', neg: th.neg, state }, i + 1, top)
          }
      }
    }
    return next
  }
}

export class Matcher {
  pattern: string
  options: MatcherOptions
  #start: Node
  // the string to compare, if the pattern has no magic. The RegExp
  // folds case, if `nocase:true`.
  #literal?: string
  #literalRe?: RegExp
  #form?: Form

  constructor(pattern: string, options: MatcherOptions = {}) {
    if (pattern.includes('/')) {
      throw new Error(
        'can only match a single path portion, got pattern: ' + pattern,
      )
    }
    this.pattern = pattern
    this.options = options
    const { nocase = false, noext = false, normalize: n } = options
    this.#form = n === true ? 'NFC' : n || undefined
    // a pattern that is only an empty extglob is a literal string,
    // except for `!()`, which matches any non-empty string
    const literal = /^[?*+@]\(\)$/.test(pattern)
    const toks = tokenize(pattern, nocase, noext || literal, this.#form)
    let [items] = build(toks, pair(toks), 0, toks.length, true)
    if (this.#form) items = normalize(items!, this.#form)
    this.#start = compile(items!, nocase)
    if (items!.every(it => it.t === 'lit')) {
      this.#literal = items!.map(it => it.ch).join('')
      if (nocase) this.#literalRe = foldRe(this.#literal)
    }
  }

  test(s: string): boolean {
    if (s.includes('/')) {
      throw new Error('can only match a single path portion, got: ' + s)
    }
    if (this.#form) s = s.normalize(this.#form)
    if (this.#literal !== undefined) {
      return this.#literalRe ?
          this.#literalRe.test(s)
        : s === this.#literal
    }
    const sim = new Sim(s, this.options)
    let state = new State()
    sim.add(state, this.#start, 0, true)
    for (let i = 0; i < sim.chars.length && state.threads.size; i++) {
      state = sim.step(state, i, true)
    }
    return state.threads.has(MATCH_KEY)
  }

  /** a readable listing of the state machine */
  toString(): string {
    return show(this.#start)
  }
}

import { State } from './state.js'
import { parseClass } from './parse-class.js'
//import assert from 'node:assert'

export type MatcherOptions = {
  /** perform a case-insensitive match */
  nocase?: boolean
  /** do not treat strings starting with `.` specially */
  dot?: boolean
  /** do not match extglobs (treat them as normal strings) */
  noext?: boolean
}

export class Node {
  in: Node[] = []
  out: Node[] = []
  name = this.constructor.name
  toString() {
    return this.name
  }
  append<N extends Node>(to: N): N {
    return append(this, to)
  }
  test?: TestFunction
  get [Symbol.toStringTag]() {
    return this.name
  }
}

const append = <T extends Node>(from: Node, to: T): T => {
  if (isExtNode(to)) {
    for (const s of to.subs) {
      from.append(s)
    }
  } else {
    from.out.push(to)
    to.in.push(from)
  }
  return to
}

export const isExtNode = (s: Node): s is NodeExt => !!(s as NodeExt).subs
export const isEvalNegationNode = (s: Node): s is NodeEvalNegation =>
  !!(s as NodeEvalNegation).evaluate

export type NodeTest = Node & {
  test: Exclude<Node['test'], undefined>
}

export const isTestNode = (n: Node): n is NodeTest => !!n.test

const appendPassthrough = <N extends Node>(
  // the spot where the skip-over starts, entry to this machine
  from: Node,
  // node being attached
  to: N,
  // spot where the new node is attached, exit of this machine
  // in *, this is the same, but for extglobs, it's the eval
  tail: Node = from,
): N => {
  if (isExtNode(to)) {
    for (const s of to.subs) {
      tail.append(s)
    }
  } else {
    tail.out.push(to)
    to.in.push(tail)
  }
  for (const i of from.in) {
    console.error('append pt %s -> %s -> %s', i, from, to)
    i.append(to)
  }
  return to
}

export type TestFunction = (s: State) => boolean

const TEST: Record<string, TestFunction> = {
  anyNonDot: (s: State) =>
    s.pos === 0 ? s.str.charAt(s.pos) !== '.' : s.pos < s.length,
  any: (s: State) => s.pos < s.length,
  exit: (s: State) => s.pos >= s.length,
} as const

const getCharTest = (c: string) =>
  (TEST[`char-${c}]`] ??= (s: State) => s.str.charAt(s.pos) === c)

const getCharTestNoCase = (c: string) =>
  (TEST[`nocase-${c}]`] ??= (s: State) =>
    !s.str.charAt(s.pos).localeCompare(c, 'en', { sensitivity: 'accent' }))

const getReTest = (re: RegExp) =>
  (TEST[`re-${re}`] ??= (s: State) => re.test(s.str.charAt(s.pos)))

export class NodeStar extends Node {
  name = '<*>'
  out = [this]
  test = TEST.anyNonDot
  append<N extends Node>(to: N): N {
    return appendPassthrough(this, to)
  }
}

export class NodeStarDot extends Node {
  name = '<*>'
  out = [this]
  test = TEST.any
  append<N extends Node>(to: N): N {
    return appendPassthrough(this, to)
  }
}

export class NodeQmark extends Node {
  test = TEST.anyNonDot
}

export class NodeQmarkDot extends Node {
  test = TEST.any
}

export class NodeChar extends Node {
  constructor(c: string) {
    super()
    this.test = getCharTest(c)
    this.name = '<"' + c + '">'
  }
}

export class NodeCharNoCase extends Node {
  constructor(c: string) {
    super()
    this.test = getCharTestNoCase(c)
    this.name = '<"' + c + '">'
  }
}

export class NodeRE extends Node {
  constructor(re: RegExp) {
    super()
    this.test = getReTest(re)
    this.name = '<' + String(re) + '>'
  }
}

export class NodeExit extends Node {
  name = '<Exit>'
  test = TEST.exit
}

/**
 * An evaluator node gets a list of the nodes feeding into from the
 * prior step. If any are on the negated list, then the result is negated.
 */
export class NodeEvalNegation extends Node {
  name = '<NegEval>'
  evaluate(node: Node) {
    return node === this.in[0]
  }
}

let ID = 0
// TODO: make this dot-sensitive
export class NodeExtNeg extends Node implements NodeExt {
  subs: Node[] = []
  id = ID++
  eval = new NodeEvalNegation()
  constructor(subs: string[], options: MatcherOptions) {
    super()
    this.eval.name = '<NegEval ' + this.id + ' ' + subs.join('|') + '>'
    const subStar = new Node()
    subStar.name = '<Neg *' + this.id + '>'
    const negPass = new Node()
    negPass.name = '<Neg * PASS ' + this.id + '>'
    // negPass has to be the first thing into the eval
    const ns = new NodeStar()
    //ns.append(subStar)
    subStar.append(ns).append(negPass).append(this.eval)

    const negFail = new Node()
    negFail.name = '<Neg sub FAIL ' + this.id + '>'
    negFail.append(this.eval)
    this.subs.push(subStar)
    for (const s of subs) {
      const enter = new Node()
      enter.name = 'SUB' + this.id + '<' + s + '>'
      this.subs.push(enter)
      parse(enter, s, options).append(negFail)
      //parse(enter, s, options).append(this.eval)
    }
    console.error('evals in', this.eval.in.join(', '))
    this.name = '!(' + subs.join('|') + this.id + ')'
  }
  append<N extends Node>(to: N): N {
    return this.eval.append(to)
  }
}

export interface NodeExt extends Node {
  subs: Node[]
  eval: Node
}

export class NodeExtAt extends Node implements NodeExt {
  subs: Node[] = []
  eval = new Node()
  constructor(subs: string[], options: MatcherOptions) {
    super()
    this.eval.name = '<Eval @>'
    for (const s of subs) {
      const enter = new Node()
      enter.name = 'SUB<' + s + '>'
      this.subs.push(enter)
      parse(enter, s, options).append(this.eval)
    }
    this.name = '@(' + subs.join('|') + ')'
  }
  append<N extends Node>(to: N): N {
    return this.eval.append(to)
  }
}

export class NodeExtStar extends Node implements NodeExt {
  subs: Node[] = []
  eval = new Node()
  constructor(subs: string[], options: MatcherOptions) {
    super()
    this.eval.name = '<Eval *>'
    for (const s of subs) {
      const enter = new Node()
      enter.name = 'SUB<' + s + '>'
      this.subs.push(enter)
      parse(enter, s, options).append(this.eval)
    }
    this.name = '*(' + subs.join('|') + ')'
    this.eval.append(this)
  }
  append<N extends Node>(to: N): N {
    return appendPassthrough(this, to, this.eval)
  }
}

export class NodeExtPlus extends Node implements NodeExt {
  subs: Node[] = []
  eval = new Node()
  constructor(subs: string[], options: MatcherOptions) {
    super()
    this.eval.name = '<Eval +>'
    for (const s of subs) {
      const enter = new Node()
      enter.name = 'SUB<' + s + '>'
      this.subs.push(enter)
      parse(enter, s, options).append(this.eval)
    }
    this.name = '+(' + subs.join('|') + ')'
    this.eval.append(this)
  }
  append<N extends Node>(to: N): N {
    return this.eval.append(to)
  }
}

export class NodeExtQmark extends Node implements NodeExt {
  subs: Node[] = []
  eval = new Node()
  constructor(subs: string[], options: MatcherOptions) {
    super()
    this.eval.name = '<Eval ?>'
    for (const s of subs) {
      const enter = new Node()
      enter.name = 'SUB<' + s + '>'
      this.subs.push(enter)
      parse(enter, s, options).append(this.eval)
    }
    this.name = '?(' + subs.join('|') + ')'
  }
  append<N extends Node>(to: N): N {
    return appendPassthrough(this, to, this.eval)
  }
}

export type ExtGlobType = '*' | '?' | '@' | '+' | '!'
export const isExtType = (c: string): c is ExtGlobType => extTypes.has(c)
export const extTypes: Set<string> = new Set(['*', '?', '@', '+', '!'])

export const parse = (
  enter: Node,
  pattern: string,
  options: MatcherOptions,
): Node => {
  let exit = enter
  let escaping = false
  let inStar = false
  const len = pattern.length
  const STAR = options.dot ? NodeStarDot : NodeStar
  const QMARK = options.dot ? NodeQmarkDot : NodeQmark
  const CHAR = options.nocase ? NodeCharNoCase : NodeChar
  for (let i = 0; i < len; i++) {
    const c = pattern.charAt(i)

    if (escaping) {
      exit = exit.append(new CHAR(c))
      escaping = false
      continue
    }

    if (!options.noext && isExtType(c) && pattern[i + 1] === '(') {
      const [subs, consumed] = parseExt(pattern, i)
      if (consumed) {
        i += consumed - 1
        const ext =
          c === '?' ? new NodeExtQmark(subs, options)
          : c === '@' ? new NodeExtAt(subs, options)
          : c === '+' ? new NodeExtPlus(subs, options)
          : c === '*' ? new NodeExtStar(subs, options)
          : new NodeExtNeg(subs, options)

        exit = exit.append(ext)

        continue
      }
    }

    if (c === '*') {
      if (inStar) continue
      inStar = true
      exit = exit.append(new STAR())
      continue
    }
    inStar = false
    if (c === '\\') {
      escaping = true
      continue
    }
    if (c === '?') {
      exit = exit.append(new QMARK())
      continue
    }

    if (c === '[') {
      const [re, consumed] = parseClass(
        pattern,
        i,
        options.nocase,
        options.dot,
      )
      if (consumed) {
        i += consumed - 1
        exit = exit.append(new NodeRE(re))
        continue
      }
      // else, fall through to treat the [ as a normal character
    }

    // lastly, just a char of some sort
    exit = exit.append(new CHAR(c))
  }
  if (escaping) {
    exit = exit.append(new CHAR('\\'))
  }

  return exit
}

// this is *slightly* less efficient than it could be, because we break
// the string up into parts, then pass the list of subs back. those sub
// expression strings might contain further extglobs, so the string gets
// effectively parsed multiple times. Since these pattern strings
// tend to be short, it's likely not much of a problem, but it could be
// better to do the full AST split all the way down, create the actual
// subexpression nodes, and pass those to the extglob node, which is
// then returned by this function instead of just a list of strings.
// This would require updating the Ext node types to take a list of
// nodes, rather than a list of string pattern expressions.
const parseExt = (
  pattern: string,
  position: number,
): [string[], number] => {
  const pos = position
  /* c8 ignore start - should be impossible */
  if (pattern.charAt(pos + 1) !== '(') {
    throw new Error('not in an extglob expression')
  }
  /* c8 ignore stop */
  let escaping = false
  const subs: string[] = ['']
  let s = 0
  for (let i = pos + 2; i < pattern.length; i++) {
    const c = pattern.charAt(i)
    if (escaping) {
      subs[s] += '\\' + c
      escaping = false
      continue
    }
    if (c === '\\') {
      escaping = true
      continue
    }
    if (isExtType(c) && pattern[i + 1] === '(') {
      const [_, consumed] = parseExt(pattern, i)
      if (consumed) {
        subs[s] += pattern.substring(i, i + consumed)
        i += consumed - 1
        continue
      }
    }
    if (c === '|') {
      ++s
      subs[s] = ''
      continue
    }
    if (c === ')') {
      return [subs, i + 1 - pos]
    }
    subs[s] += c
  }

  return [[], 0]
}

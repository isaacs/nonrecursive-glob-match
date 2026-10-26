import {
  Node,
  parse,
  isEvalNegationNode,
  isTestNode,
  NodeExit,
} from './node.js'
import type { NodeTest, MatcherOptions } from './node.js'

import { State } from './state.js'
import { s } from './util.js'

const debug = process.env.DEBUG_MATCHER === '1' ? console.error : () => {}

const addToMapSet = <K, V>(map: Map<K, Set<V>>, k: K, v: V) => {
  const s = map.get(k)
  if (s) s.add(v)
  else map.set(k, new Set([v]))
}

const pruneRemoveNode = (
  node: Node,
  from: Map<Node, Set<Node | null>>,
  nodes: Set<Node | null>,
): void => {
  debug('PRN %s', node)
  from.delete(node)
  nodes.delete(node)
  for (const n of node.out) {
    const f = from.get(n)
    if (!f?.size || !f.has(node)) continue
    f.delete(node)
    if (!f?.size) pruneRemoveNode(n, from, nodes)
  }
}

const pruneEvalFailed = (
  nodes: Set<Node | null>,
  from: Map<Node, Set<Node | null>>,
  seen = new Set<Set<Node | null>>(),
): void => {
  if (!nodes.size || seen.has(nodes)) return
  seen.add(nodes)

  for (const t of nodes) {
    if (!t) continue
    const f = from.get(t)
    if (!f) {
      pruneRemoveNode(t, from, nodes)
      continue
    }
    pruneEvalFailed(f, from, seen)
    debug('prune step n=%s from=%s', t, [...f])
    if (!f.size) {
      console.error('prune because no paths in %s', t, [...f])
      pruneRemoveNode(t, from, nodes)
      continue
    }
    if (isEvalNegationNode(t)) {
      let passing = !!f.size
      for (const inp of f) {
        if (!inp) continue
        passing &&= t.evaluate(inp)
        debug('> test eval %s(%s)', t, inp, passing)
      }
      if (!passing) {
        debug('not passing, remove %s', t)
        pruneRemoveNode(t, from, nodes)
      }
    }
  }
}

export class Matcher {
  enter = new Node()
  exit: Node
  pattern: string
  constructor(pattern: string, options: MatcherOptions = {}) {
    this.pattern = pattern
    this.enter.name = '<Enter>'
    const exit = parse(this.enter, pattern, options)
    this.exit = exit.append(new NodeExit())
  }

  test(str: string) {
    let walk = new Set<Node>([this.enter])
    const state = new State(str)

    while (state.pos <= state.length) {
      const from = new Map<Node, Set<Node | null>>()
      const tests = new Set<NodeTest>()
      debug('\nWALK', this.pattern, state, walk)
      // for each item in the walk, what paths led into it?
      // this will be relevant when we negate an eval, because we need to
      // remove the paths that depended on that eval, but NOT any other
      // paths that may lead to the same target.

      // walk up to tests, tracking evals and from steps
      for (const node of walk) {
        debug(
          'STEP %s',
          node,
          [...(from.get(node) ?? new Set())].map(String),
        )
        s(node)
        if (!from.has(node)) addToMapSet(from, node, null)

        if (isTestNode(node)) {
          debug('add to tests')
          tests.add(node)
          continue
        }

        for (const next of node.out) {
          addToMapSet(from, next, node)
          walk.add(next)
        }
      }

      debug(
        'post walk, pre prune',
        [...tests].map(String),
        Object.fromEntries(
          [...from].map(([n, f]) => [String(n), [...f].map(String)]),
        ),
      )

      // now tests has all the test nodes we could walk to, *including*
      // by walking past eval nodes that may evaluate false.
      // Walk back from the tests to ensure that they have a route into
      // them that doesn't pass through a failed eval.
      pruneEvalFailed(tests, from)

      debug(
        'post prune',
        [...tests].map(String),
        Object.fromEntries(
          [...from].map(([n, f]) => [String(n), [...f].map(String)]),
        ),
      )

      // now the tests are only those that are reachable without passing
      // through a failed eval
      debug('TESTS', tests, state)
      walk = new Set<Node>()
      for (const t of tests) {
        if (t.test(state)) {
          debug('pass test!', String(t))
          if (t === this.exit) return true
          for (const next of t.out) {
            debug('post-test walk %s -> %s', t, next)
            walk.add(next)
            addToMapSet(from, next, t)
          }
        }
      }
      pruneEvalFailed(walk, from)
      ++state.pos
    }
    return false
  }
}

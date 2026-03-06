import {
  Node,
  parse,
  isEvalNegationNode,
  isTestNode,
  NodeExit,
  NodeEvalNegation,
} from './node.js'
import type { NodeTest, MatcherOptions } from './node.js'

import { State } from './state.js'

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

    // find all test nodes reachable from all active nodes
    // active nodes are thus either the start, or those that have tests
    let nextTestSet: Set<NodeTest> | undefined = undefined
    while (state.pos <= state.length) {
      const testNodes: Set<NodeTest> = nextTestSet ?? new Set<NodeTest>()
      nextTestSet = undefined
      const next = new Set<Node>()
      let walking = true
      while (walking) {
        walking = false
        const evals = new Map<NodeEvalNegation, Set<Node>>()
        for (const node of walk) {
          for (const n of node.out) {
            if (isTestNode(n)) {
              testNodes.add(n)
            } else if (isEvalNegationNode(n)) {
              const e = evals.get(n)
              if (e) e.add(node)
              evals.set(n, new Set<Node>([node]))
            } else {
              walk.add(n)
            }
          }
        }

        let postEvalWalk: Set<Node> | undefined = undefined
        // if the evaluate() returns false, then the state is negated
        // if we did anything, then we need to continue walking to get to
        // any test nodes we can hit to consume more chars.
        for (const [e, set] of evals) {
          if (e.evaluate([...set])) {
            for (const n of e.out) {
              if (isTestNode(n)) {
                testNodes.add(n)
              } else {
                walking = true
                if (postEvalWalk) postEvalWalk.add(n)
                else postEvalWalk = new Set([n])
                walk = postEvalWalk
              }
            }
          }
        }
      }

      for (const node of testNodes) {
        if (node.test(state)) {
          if (node === this.exit) {
            return true
          }
          for (const n of node.out) {
            if (isTestNode(n)) {
              if (nextTestSet) nextTestSet.add(n)
              else nextTestSet = new Set([n])
            } else {
              next.add(n)
            }
          }
        }
      }
      walk = next
      ++state.pos
    }
    return false
  }
}

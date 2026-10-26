import { type Node, isEvalNegationNode, isTestNode } from './node.js'

// not stuff anyone actually needs, just some useful debugging things
export const s = (n: Node) =>
  process.env.DEBUG_MATCHER === '1' ? showTree(tree(n)) : () => {}

const showTree = (t: T, indent = '', lastChild = true) => {
  const [name, body = {}] = t
  const next = lastChild ? '    ' : '\x1b[40m|\x1b[m   '
  console.log(indent + name)
  const entries = Object.entries(body)
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i]!
    const last = i === entries.length - 1
    showTree([k, v], indent + next, last)
  }
}
type T = [string, Record<string, T> | 'loop'] | []
const tree = (n: Node, seen: Node[] = []): T => {
  const s = seen.includes(n)
  seen = seen.concat(n)
  const before =
    isTestNode(n) ? '\x1b[31;40;1m['
    : isEvalNegationNode(n) ? '\x1b[40;33m<'
    : '\x1b[36;40m('
  const after =
    isTestNode(n) ? ']\x1b[0m'
    : isEvalNegationNode(n) ? '>\x1b[0m'
    : ')\x1b[0m'
  return [
    before + n.name + after,
    s ? {} : Object.fromEntries(n.out.map(n => tree(n, seen))),
  ]
}

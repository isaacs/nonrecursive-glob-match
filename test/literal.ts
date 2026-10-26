import t from 'tap'
import { Matcher } from '../src/index.js'

// patterns without magic use a string compare. Wrapping them in
// @(...) uses the state machine, which must give the same result.
const cases: [p: string, s: string, nocase?: boolean][] = [
  ['abc', 'abc'],
  ['abc', 'abd'],
  ['abc', 'ABC'],
  ['abc', 'ABC', true],
  ['\\*x', '*x'],
  ['\\*x', '\\*x'],
  ['.', '.'],
  ['..', '..'],
  ['.a', '.a'],
  ['Å', 'å', true],
  // final sigma folds to σ
  ['ΑΣ', 'ας', true],
]

for (const [p, s, nocase] of cases) {
  const simple = new Matcher(p, { nocase }).test(s)
  const machine = new Matcher(`@(${p})`, { nocase }).test(s)
  t.equal(simple, machine, JSON.stringify({ p, s, nocase, machine }))
}

t.equal(new Matcher('\\*x').test('*x'), true)
t.equal(new Matcher('abc', { nocase: true }).test('aBc'), true)
t.equal(new Matcher('abc').test('aBc'), false)
t.equal(new Matcher('').test(''), true)
t.equal(new Matcher('').test('a'), false)

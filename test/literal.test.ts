import { assert, test } from 'ubqtest'
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
  test(JSON.stringify({ p, s, nocase }), () => {
    const simple = new Matcher(p, { nocase }).test(s)
    const machine = new Matcher(`@(${p})`, { nocase }).test(s)
    assert.equal(simple, machine)
  })
}

test('string compare', () => {
  assert.equal(new Matcher('\\*x').test('*x'), true)
  assert.equal(new Matcher('abc', { nocase: true }).test('aBc'), true)
  assert.equal(new Matcher('abc').test('aBc'), false)
  assert.equal(new Matcher('').test(''), true)
  assert.equal(new Matcher('').test('a'), false)
})

import { assert, describe, test } from 'ubqtest'
import { Matcher } from '../src/index.js'

const M = '\uE000'
const range = (lo: string, hi: string, before = '', after = '') =>
  new Matcher(`${before}${M}${lo}..${hi}${M}${after}`, { rangeMark: M })

// the strings that brace expansion makes, from bash
const cases: [lo: string, hi: string, yes: string[], no: string[]][] = [
  [
    '0',
    '100',
    ['0', '7', '10', '99', '100'],
    ['00', '07', '101', '-1', ''],
  ],
  ['100', '0', ['0', '50', '100'], ['101', '050']],
  ['7', '1234', ['7', '10', '999', '1000', '1234'], ['6', '1235', '0999']],
  ['01', '100', ['001', '010', '100'], ['1', '01', '10', '000', '101']],
  [
    '-05',
    '3',
    ['-05', '-01', '000', '003'],
    ['-5', '-1', '0', '3', '-00'],
  ],
  ['-12', '-3', ['-12', '-10', '-9', '-3'], ['-2', '-13', '3', '-09']],
  ['-0', '2', ['0', '1', '2'], ['-0', '00']],
  ['-00', '2', ['000', '002'], ['0', '-00', '-0']],
  ['5', '5', ['5'], ['4', '6', '05']],
  ['0', '9', ['0', '9'], ['10', 'a', '-0']],
  [
    '0',
    '9007199254740991',
    ['0', '9007199254740991', '123456789'],
    ['9007199254740992', '01'],
  ],
]

for (const [lo, hi, yes, no] of cases) {
  const m = range(lo, hi)
  for (const s of yes)
    test(`{${lo}..${hi}} ${s}`, () => assert.equal(m.test(s), true))
  for (const s of no)
    test(`{${lo}..${hi}} ${s}`, () => assert.equal(m.test(s), false))
}

test('with other pattern parts', () => {
  const m = range('0', '999', 'file-', '.@(txt|md)')
  assert.equal(m.test('file-0.txt'), true)
  assert.equal(m.test('file-999.md'), true)
  assert.equal(m.test('file-1000.txt'), false)
  assert.equal(m.test('file-.txt'), false)
  // * can take the leading digits
  assert.equal(range('0', '9', '*').test('x1234'), true)
  assert.equal(range('10', '99', '*').test('x5'), false)
  assert.equal(
    new Matcher(`@(a|${M}1..99${M})`, { rangeMark: M }).test('42'),
    true,
  )
})

test('a \\ before the mark does not change it', () => {
  const m = new Matcher(`\\${M}1..300${M}`, { rangeMark: M })
  assert.equal(m.test('250'), true)
  assert.equal(m.test(`${M}1..300${M}`), false)
})

test('with noext and nocase', () => {
  assert.equal(range('1', '300', 'A').test('a20'), false)
  const opts = { rangeMark: M, noext: true, nocase: true }
  const m = new Matcher(`A${M}1..300${M}`, opts)
  assert.equal(m.test('a20'), true)
})

describe('a mark without a valid range is a literal', () => {
  for (const body of [
    '1..',
    'a..b',
    '1..2..3',
    '1.2',
    '9007199254740992..1',
  ]) {
    test(body, () => {
      const p = `${M}${body}${M}`
      assert.equal(new Matcher(p, { rangeMark: M }).test(p), true)
    })
  }
})

test('an open mark, or no rangeMark, is a literal', () => {
  const open = `x${M}1..300`
  assert.equal(new Matcher(open, { rangeMark: M }).test(open), true)
  assert.equal(new Matcher(`${M}1..3${M}`).test('2'), false) // no rangeMark
})

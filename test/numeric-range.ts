import t from 'tap'
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
  for (const s of yes) t.equal(m.test(s), true, `{${lo}..${hi}} ${s}`)
  for (const s of no) t.equal(m.test(s), false, `{${lo}..${hi}} ${s}`)
}

t.test('with other pattern parts', t => {
  const m = range('0', '999', 'file-', '.@(txt|md)')
  t.equal(m.test('file-0.txt'), true)
  t.equal(m.test('file-999.md'), true)
  t.equal(m.test('file-1000.txt'), false)
  t.equal(m.test('file-.txt'), false)
  // * can take the leading digits
  t.equal(range('0', '9', '*').test('x1234'), true)
  t.equal(range('10', '99', '*').test('x5'), false)
  t.equal(
    new Matcher(`@(a|${M}1..99${M})`, { rangeMark: M }).test('42'),
    true,
  )
  t.end()
})

t.test('a \\ before the mark does not change it', t => {
  const m = new Matcher(`\\${M}1..300${M}`, { rangeMark: M })
  t.equal(m.test('250'), true)
  t.equal(m.test(`${M}1..300${M}`), false)
  t.end()
})

t.test('with noext and nocase', t => {
  t.equal(range('1', '300', 'A').test('a20'), false)
  const opts = { rangeMark: M, noext: true, nocase: true }
  const m = new Matcher(`A${M}1..300${M}`, opts)
  t.equal(m.test('a20'), true)
  t.end()
})

t.test('a mark without a valid range is a literal', t => {
  for (const body of [
    '1..',
    'a..b',
    '1..2..3',
    '1.2',
    '9007199254740992..1',
  ]) {
    const p = `${M}${body}${M}`
    t.equal(new Matcher(p, { rangeMark: M }).test(p), true, body)
  }
  const open = `x${M}1..300`
  t.equal(new Matcher(open, { rangeMark: M }).test(open), true)
  t.equal(new Matcher(`${M}1..3${M}`).test('2'), false, 'no rangeMark')
  t.end()
})

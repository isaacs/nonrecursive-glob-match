import t from 'tap'
import { Matcher } from '../src/index.js'

// nocase uses unicode simple case folding, one code point at a
// time, the same as a RegExp with the `iu` flags. There are no
// locale rules (such as Turkish i), and no folds that change the
// length of the string (such as ß to ss).
//
// Each case is tested as a plain string (string compare), as
// @(...) (the state machine), and as [...] if it is one char.
const cases: [p: string, s: string, match: boolean][] = [
  // sigma, small sigma, and final sigma all fold to σ
  ['Σ', 'σ', true],
  ['Σ', 'ς', true],
  ['σ', 'ς', true],
  ['ς', 'Σ', true],
  ['ΟΔΟΣ', 'οδος', true],
  ['ΟΔΟΣ', 'οδοσ', true],

  // Turkish dotted and dotless i only match themselves
  ['I', 'i', true],
  ['i', 'I', true],
  ['İ', 'İ', true],
  ['ı', 'ı', true],
  ['İ', 'i', false],
  ['İ', 'I', false],
  ['ı', 'I', false],
  ['ı', 'i', false],
  ['i', 'İ', false],
  ['I', 'ı', false],
  // İ lowercases to i + U+0307, but that is two chars
  ['İ', 'i̇', false],
  ['i̇', 'İ', false],
  ['İstanbul', 'istanbul', false],
  ['İSTANBUL', 'İstanbul', true],

  // micro sign folds to Greek mu
  ['µ', 'μ', true],
  ['µ', 'Μ', true],
  ['Μ', 'µ', true],

  // Kelvin sign and Angstrom sign fold to k and å
  ['K', 'k', true],
  ['K', 'K', true],
  ['k', 'K', true],
  ['Å', 'å', true],
  ['Å', 'Å', true],

  // long s folds to s
  ['ſ', 's', true],
  ['S', 'ſ', true],

  // capital sharp s folds to ß, but ß does not fold to ss
  ['ẞ', 'ß', true],
  ['ß', 'ẞ', true],
  ['ß', 'ss', false],
  ['SS', 'ß', false],
  ['STRASSE', 'straße', false],

  // ligatures do not expand
  ['ﬁ', 'fi', false],
  ['FI', 'ﬁ', false],

  // titlecase digraphs: Ǆ ǅ ǆ all fold together
  ['ǅ', 'Ǆ', true],
  ['ǅ', 'ǆ', true],
  ['Ǆ', 'ǆ', true],

  // Cherokee folds to the upper case letters
  ['Ꭰ', 'ꭰ', true],
  ['ꭰ', 'Ꭰ', true],

  // astral (non-BMP) letters, Deseret
  ['𐐀', '𐐨', true],
  ['𐐨', '𐐀', true],
  ['𐐀𐐁', '𐐨𐐩', true],

  // the dot rules are not changed by case
  ['.A', '.a', true],
  ['A', '.a', false],
]

for (const [p, s, match] of cases) {
  const forms = [p, `@(${p})`]
  if ([...p].length === 1) forms.push(`[${p}]`)
  for (const f of forms) {
    t.equal(new Matcher(f, { nocase: true }).test(s), match, `${f} ${s}`)
  }
}

// with nocase:false, case variants never match
for (const [p, s] of [
  ['Σ', 'σ'],
  ['Σ', 'ς'],
  ['K', 'k'],
  ['𐐀', '𐐨'],
  ['ẞ', 'ß'],
]) {
  for (const f of [p!, `@(${p})`, `[${p}]`]) {
    t.equal(new Matcher(f).test(s!), false, `${f} ${s} case sensitive`)
  }
}

// ranges fold too
t.equal(new Matcher('[a-z]', { nocase: true }).test('K'), true)
t.equal(new Matcher('[a-z]', { nocase: true }).test('ſ'), true)
t.equal(new Matcher('[A-Z]', { nocase: true }).test('ı'), false)
t.equal(new Matcher('[A-Z]', { nocase: true }).test('İ'), false)
t.equal(new Matcher('[𐐀-𐐏]', { nocase: true }).test('𐐨'), true)
t.equal(new Matcher('[𐐀-𐐏]').test('𐐨'), false)
t.equal(new Matcher('[^σ]', { nocase: true }).test('ς'), false)
t.equal(new Matcher('[^σ]', { nocase: true }).test('Σ'), false)

// classes read whole code points, not UTF-16 halves
t.equal(new Matcher('[😀]').test('😀'), true)
t.equal(new Matcher('[😀-😂]').test('😁'), true)
t.equal(new Matcher('[😀-😂]').test('😃'), false)
t.equal(new Matcher('[!😀]').test('😀'), false)
t.equal(new Matcher('[!😀]').test('😁'), true)
t.equal(new Matcher('[😀-]').test('-'), true)
t.equal(new Matcher('[-😀]').test(''), true)

// literals before and after an extglob fold case
t.equal(new Matcher('a@(b|c)d', { nocase: true }).test('ABD'), true)
t.equal(new Matcher('a@(b|c)d', { nocase: true }).test('aCd'), true)
t.equal(new Matcher('a@(b|c)d', { nocase: true }).test('xbd'), false)
t.equal(new Matcher('a@(b|c)d', { nocase: true }).test('abx'), false)

// literals between wildcards fold case
t.equal(new Matcher('*b*', { nocase: true }).test('aBc'), true)
t.equal(new Matcher('*Σ?', { nocase: true }).test('ας!'), true)
t.equal(new Matcher('*b*', { nocase: true }).test('axc'), false)

// more chars than the cache of case folds keeps
for (let i = 0; i < 2; i++) {
  for (let c = 0x100; c < 0x600; c++) {
    const ch = String.fromCharCode(c)
    const up = ch.toUpperCase()
    const expect = new RegExp(`^\\u{${c.toString(16)}}$`, 'iu').test(up)
    const m = new Matcher(`*${ch}`, { nocase: true })
    if (m.test(`x${up}`) !== expect) t.fail(`folds ${ch}`)
  }
}
t.pass('folds all chars')

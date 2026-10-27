import t from 'tap'
import { Matcher, type MatcherOptions } from '../src/index.js'

const composed = 'café' // é as one code point
const decomposed = 'café' // e + combining acute accent

const cases: [p: string, s: string, o: MatcherOptions, match: boolean][] =
  [
    // without the option, the two forms differ
    [composed, decomposed, {}, false],
    [decomposed, composed, {}, false],
    [composed, decomposed, { normalize: false }, false],

    // true means NFC
    [composed, decomposed, { normalize: true }, true],
    [decomposed, composed, { normalize: true }, true],
    [composed, decomposed, { normalize: 'NFC' }, true],
    [composed, decomposed, { normalize: 'NFD' }, true],
    [decomposed, composed, { normalize: 'NFD' }, true],
    [composed, decomposed, { normalize: 'NFKC' }, true],
    [composed, decomposed, { normalize: 'NFKD' }, true],

    // with NFC, ? matches é as one char. With NFD, é is two.
    ['caf?', decomposed, { normalize: 'NFC' }, true],
    ['caf?', composed, { normalize: 'NFD' }, false],
    ['caf??', composed, { normalize: 'NFD' }, true],
    ['???', 'née', { normalize: 'NFC' }, true],
    ['???', 'née', { normalize: 'NFD' }, false],

    // a run of literals normalizes as one string, also in extglobs
    // and across an escape
    [`@(${decomposed}|x)`, composed, { normalize: true }, true],
    [`!(${decomposed})`, composed, { normalize: true }, false],
    ['cafe\\́', composed, { normalize: true }, true],
    ['*é', composed, { normalize: true }, true],

    // classes, one code point per member
    ['caf[é]', decomposed, { normalize: 'NFC' }, true],
    ['[Å]', 'Å', {}, false],
    ['[Å]', 'Å', { normalize: true }, true],
    ['[Å]', 'Å', { normalize: true }, true],
    ['[K-K]', 'K', { normalize: true }, true],
    ['[!Å]', 'Å', { normalize: true }, false],
    // é decomposes to two code points, so the member stays é, but
    // NFD strings never hold é as one code point
    ['caf[é]', composed, { normalize: 'NFD' }, false],

    // canonical singletons: Kelvin, Angstrom, Ohm
    ['K', 'K', {}, false],
    ['K', 'K', { normalize: true }, true],
    ['Å', 'Å', { normalize: true }, true],
    ['Ω', 'Ω', { normalize: true }, true],

    // compatibility forms only fold with NFKC and NFKD
    ['ﬁle', 'file', { normalize: 'NFC' }, false],
    ['ﬁle', 'file', { normalize: 'NFKC' }, true],
    ['file', 'ﬁle', { normalize: 'NFKD' }, true],
    ['Ａ', 'A', { normalize: 'NFKC' }, true],
    ['①', '1', { normalize: 'NFKC' }, true],

    // a char that normalizes to syntax stays a literal
    ['＊.js', 'a.js', { normalize: 'NFKC' }, false],
    ['＊.js', '*.js', { normalize: 'NFKC' }, true],
    ['＊.js', '＊.js', { normalize: 'NFKC' }, true],
    ['？', 'a', { normalize: 'NFKC' }, false],
    ['？', '?', { normalize: 'NFKC' }, true],
    ['⑴', '(1)', { normalize: 'NFKC' }, true],
    ['⑴', '1', { normalize: 'NFKC' }, false],
    ['[＊]', '*', { normalize: 'NFKC' }, true],
    ['[＼]', '\\', { normalize: 'NFKC' }, true],
    // full-width solidus is not a path separator
    ['／', '／', { normalize: 'NFKC' }, true],
    ['*', 'a／b', { normalize: 'NFKC' }, true],

    // with nocase, normalize first, then fold case
    ['CAFÉ', decomposed, { normalize: true, nocase: true }, true],
    ['CAFÉ', composed, { normalize: true, nocase: true }, true],
    ['CAF?', decomposed, { normalize: true, nocase: true }, true],
    // NFC keeps İ as one code point, so it only matches itself
    ['İ', 'i̇', { normalize: 'NFC', nocase: true }, false],
    // NFD splits İ into I + U+0307, and I folds to i
    ['İ', 'i̇', { normalize: 'NFD', nocase: true }, true],

    // the dot rules apply to the normalized string
    ['*', '.é', { normalize: true }, false],
    ['.*', '.é', { normalize: true }, true],

    // a combining mark after a wildcard is its own literal. This
    // matches code points, not grapheme clusters.
    ['?́', 'é', { normalize: 'NFC' }, false],
    ['?́', 'é', { normalize: 'NFC' }, false],
    ['caf?́', composed, { normalize: 'NFC' }, false],
    ['?́', 'é', { normalize: 'NFD' }, true],
    ['?́', 'é', { normalize: 'NFD' }, true],
    ['caf?́', composed, { normalize: 'NFD' }, true],
  ]

for (const [p, s, o, match] of cases) {
  t.equal(new Matcher(p, o).test(s), match, JSON.stringify([p, s, o]))
}

// the `/` check uses the raw strings
t.throws(() => new Matcher('a/b', { normalize: 'NFKC' }))
t.throws(() => new Matcher('*', { normalize: 'NFKC' }).test('a/b'))

// the pattern property keeps the raw pattern
t.equal(new Matcher(decomposed, { normalize: true }).pattern, decomposed)

// chars outside the BMP are one char each, after normalization
t.equal(new Matcher('caf?😀', { normalize: true }).test('café😀'), true)
t.equal(new Matcher('caf??', { normalize: true }).test('café😀'), true)
t.equal(new Matcher('caf?', { normalize: true }).test('café😀'), false)

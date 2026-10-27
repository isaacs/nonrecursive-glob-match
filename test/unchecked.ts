import t from 'tap'
import { Matcher, type MatcherOptions } from '../src/index.js'

// testUnchecked() only finds the code points of a string when a step
// needs them, so it must give the same result as test() for any
// string with no `/`.
const patterns = [
  // literals
  'abc',
  // `*` and `?` with string prefix and suffix
  '*',
  '?',
  '??',
  '*.js',
  'a*',
  'a?b*c',
  '?😀*',
  // linear, but not only `*` and `?`
  '*[a-c]',
  '[😀]*',
  // extglobs
  '@(a|b)*',
  '*.@(js|😀)',
  '!(x)',
  '+(?)',
]

const strings = [
  '',
  '.',
  '..',
  '.js',
  'a',
  'ab',
  'abc',
  'a.js',
  'x.js',
  '.a.js',
  'a😀',
  '😀',
  '😀😀',
  '😀.js',
  'a😀b😀c',
  'a😀b😀😀c',
  '😀'.repeat(5),
]

const options: MatcherOptions[] = [
  {},
  { dot: true },
  { nocase: true },
  { normalize: true },
]

for (const o of options) {
  for (const p of patterns) {
    const m = new Matcher(p, o)
    for (const s of strings) {
      t.equal(m.testUnchecked(s), m.test(s), JSON.stringify([p, s, o]))
    }
  }
}

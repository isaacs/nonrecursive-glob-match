import type { MatcherOptions } from '../src/index.js'
import t from 'tap'
import { Matcher } from '../src/index.js'

export let files = [
  'a',
  'b',
  'c',
  'd',
  'abc',
  'abd',
  'abe',
  'bb',
  'bcd',
  'ca',
  'cb',
  'dd',
  'de',
]

export const patterns: (
  | string
  | (() => unknown)
  | [p: string, m: string[], mo?: MatcherOptions, f?: string[]]
)[] = [
  'http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test',
  ['a*', ['a', 'abc', 'abd', 'abe']],

  // allow null glob expansion
  ['X*', []],

  // isaacs: Slightly different than bash/sh/ksh
  // \\* is not un-escaped to literal "*" in a failed match,
  // but it does make it get treated as a literal star
  ['\\*x', ['*x'], {}, ['\\*', '*', '*x', '\\*x', 'x', 'ax']],
  ['\\**', ['*', '*x'], {}, ['\\*', '*', '*x', '\\*x', 'x', 'ax']],
  ['\\*\\*', [], {}, ['\\*', '*', '*x', '\\*x', 'x', 'ax']],

  ['c*', ['c', 'ca', 'cb']],

  'character classes',
  ['[a-c]b*', ['abc', 'abd', 'abe', 'bb', 'cb']],
  ['[a-y]*[^c]', ['abd', 'abe', 'bb', 'bcd', 'ca', 'cb', 'dd', 'de']],
  ['a*[^c]', ['abd', 'abe']],
  () => files.push('a-b', 'aXb'),
  ['a[X-]b', ['a-b', 'aXb']],
  () => files.push('.x', '.y'),
  ['[^a-c]*', ['d', 'dd', 'de']],
  ['*\\\\!*', [], undefined, ['echo !7']],
  ['*\\!*', ['echo !7'], undefined, ['echo !7']],
  ['*!*', ['echo !7'], undefined, ['echo !7']],
  ['*.\\*', ['r.*'], undefined, ['r.*']],
  ['a[b]c', ['abc']],
  ['a[\\b]c', ['abc']],
  ['a?c', ['abc']],
  ['a\\*c', [], undefined, ['abc']],
  // empty pattern string matches empty string.
  // not like you'd have a file named this, but still.
  ['', [''], undefined, ['']],

  'http://www.opensource.apple.com/source/bash/bash-23/' +
    'bash/tests/glob-test',
  ['*****??', ['abc'], undefined, ['abc']],
  ['?*****?c', ['abc'], undefined, ['abc']],
  ['?***?****c', ['abc'], undefined, ['abc']],
  ['?***?****?', ['abc'], undefined, ['abc']],
  ['?***?****', ['abc'], undefined, ['abc']],
  ['*******c', ['abc'], undefined, ['abc']],
  ['*******?', ['abc'], undefined, ['abc']],
  ['a*cd**?**??k', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['a**?**cd**?**??k', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['a**?**cd**?**??k***', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['a**?**cd**?**??***k', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['a**?**cd**?**??***k**', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['a****c**?**??*****', ['abcdecdhjk'], undefined, ['abcdecdhjk']],
  ['[-abc]', ['-'], undefined, ['-']],
  ['[abc-]', ['-'], undefined, ['-']],
  ['\\', ['\\'], undefined, ['\\']],
  ['a\\', ['a\\'], undefined, ['a', 'a\\']],
  ['\\\\', ['\\'], undefined, ['\\', '\\\\']],
  ['a\\\\', ['a\\'], undefined, ['a\\', 'a\\\\']],
  ['\\\\\\\\', ['\\\\'], undefined, ['\\\\']],
  ['[\\\\]', ['\\'], undefined, ['\\', '\\\\']],
  ['[[]', ['['], undefined, ['[']],
  ['[', ['['], undefined, ['[']],
  ['[*', ['[abc'], undefined, ['[abc']],

  'a right bracket shall lose its special meaning and\n' +
    'represent itself in a bracket expression if it occurs\n' +
    'first in the list.  -- POSIX.2 2.8.3.2',
  ['[]]', [']'], undefined, [']']],
  ['[]-]', [']'], undefined, [']']],
  ['[a-z]', ['p'], undefined, ['p']],
  ['??**********?****?', [], undefined, ['abc']],
  ['??**********?****c', [], undefined, ['abc']],
  ['?************c****?****', [], undefined, ['abc']],
  ['*c*?**', [], undefined, ['abc']],
  ['a*****c*?**', [], undefined, ['abc']],
  ['a********???*******', [], undefined, ['abc']],
  ['[]', [], undefined, ['a']],
  ['[abc', [], undefined, ['[']],

  'nocase tests',
  ['XYZ', ['xYz'], { nocase: true }, ['xYz', 'ABC', 'IjK']],
  ['ab*', ['ABC'], { nocase: true }, ['xYz', 'ABC', 'IjK']],
  ['[ia]?[ck]', ['ABC', 'IjK'], { nocase: true }, ['xYz', 'ABC', 'IjK']],

  'dots should not match unless requested',
  ['*', ['a'], {}, ['a', '.d', '.a']],

  // test partial parsing in the presence of comment/negation chars
  ['[!a*', ['[!ab'], {}, ['[!ab', '[ab']],
  ['[#a*', ['[#ab'], {}, ['[#ab', '[ab']],

  // like: {a,b|c\\,d\\\|e} except it's unclosed, so it has to be escaped.
  [
    '+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g',
    ['+(a|b|c\\|d\\|e\\\\|f\\\\|g'],
    {},
    ['+(a|b|c\\|d\\|e\\\\|f\\\\|g', 'a', 'b\\c'],
  ],

  () =>
    (files = [
      'a',
      'b',
      'c',
      'd',
      'ab',
      'ac',
      'ad',
      'bc',
      'cb',
      'bc,d',
      'c,db',
      'c,d',
      'd)',
      '(b|c',
      '*(b|c',
      'b|c',
      'b|cc',
      'cb|c',
      'x(a|b|c)',
      'x(a|c)',
      '(a|b|c)',
      '(a|c)',
    ]),
  ['*(a|b|c)', ['x(a|b|c)', '(a|b|c)'], { noext: true }],

  ['#*', ['#a', '#b'], {}, ['#a', '#b', 'c#d']],

  // begin channelling Boole and deMorgan...
  'negation tests',
  () => (files = ['d', 'e', '!ab', '!abc', 'a!b', '\\!a']),

  // anything that is NOT a* matches.
  ['!(a*)', ['\\!a', 'd', 'e', '!ab', '!abc']],

  // anything that IS !a* matches.
  ['!a*', ['!ab', '!abc']],

  ['!(a*)', ['d', 'e', '!ab', '!abc', '\\!a']],

  // anything that IS a* matches
  ['!(!(a*))', ['a!b']],

  // anything that is NOT !a* matches
  ['!(!a*)', ['a!b', 'd', 'e', '\\!a']],
  ['!(\\!a*)', ['a!b', 'd', 'e', '\\!a']],

  'negation nestled within a pattern',
  () =>
    (files = [
      'foo.js',
      'foo.bar',
      'foo.js.js',
      'blar.js',
      'foo.',
      'boo.js.boo',
    ]),
  // * matches foo, . matches ., and 'js.js' != 'js'
  ['*.!(js)', ['foo.bar', 'foo.', 'boo.js.boo', 'foo.js.js']],

  'https://github.com/isaacs/minimatch/issues/59',
  ['[z-a]', []],
  ['[a-0][a-\u0100]', []],

  'escape regex properly within classes',
  ['[\\z-a]', []],
  ['[\\b-a]', []],
  ['[]+*]', []],
  ['[z\\-a]', []],
  ['[\\-\\]]', []],
  ['[a-b-c]', []],

  'https://github.com/isaacs/node-glob/issues/415',
  () => {
    files = ['ac', 'abc', 'acd', 'acc', 'acd', 'adc', 'bbc', 'bac', 'bcc']
  },
  ['+(a)!(b)+(c)', ['ac', 'acc', 'adc']],

  'https://github.com/isaacs/node-glob/issues/394',
  () => (files = ['å', 'a', 'A']),
  ['å', ['å']],
  ['å', ['å'], { nocase: true }],
  ['Å', ['å'], { nocase: true }],
  ['Å', [], {}],
  ['A', ['A']],
  ['a', ['a', 'A'], { nocase: true }],
  ['A', ['a', 'A'], { nocase: true }],
  ['a', ['a'], {}],
  () => (files = ['Å', 'a', 'A']),
  ['Å', ['Å']],
  ['å', ['Å'], { nocase: true }],
  ['Å', ['Å'], { nocase: true }],
  ['å', [], {}],
  ['A', ['A']],
  ['a', ['a', 'A'], { nocase: true }],
  ['A', ['a', 'A'], { nocase: true }],
  ['a', ['a'], {}],

  'https://github.com/isaacs/node-glob/issues/387',
  () => (files = ['.a', '.a.js', '.js', 'a', 'a.js', 'js']),
  ['.*', ['.a', '.a.js', '.js']],
  ['*', ['.a', '.a.js', '.js', 'a', 'a.js', 'js'], { dot: true }],
  ['@(*|.*)', ['.a', '.a.js', '.js', 'a', 'a.js', 'js']],
  ['@(.*|*)', ['.a', '.a.js', '.js', 'a', 'a.js', 'js']],
  ['@(*|a)', ['.a', '.a.js', '.js', 'a', 'a.js', 'js'], { dot: true }],
  ['@(.*)', ['.a', '.a.js', '.js']],
  ['@(.*)', ['.a', '.a.js', '.js'], { dot: true }],
  ['@(js|.*)', ['js', '.a', '.a.js', '.js']],
  ['@(.*|js)', ['js', '.a', '.a.js', '.js']],
  ['@(+(.*))', ['.a', '.a.js', '.js']],
  // Known deviation from bash (and old minimatch), which match none
  // of the dotfiles here. `!(.a|js)` matches the empty string, so
  // `@(.*)` matches the whole dotfile with its explicit `.`.
  // https://lists.gnu.org/archive/html/bug-bash/2026-03/msg00034.html
  ['!(.a|js)@(.*)', ['.a', '.a.js', '.js', 'a.js']],
  () => (files = ['a(b', 'ab', 'a)b']),
  ['@(a|a[(])b', ['a(b', 'ab']],
  ['@(a|a[)])b', ['a)b', 'ab']],

  'optimized checking for some common patterns',
  () =>
    (files = [
      '.a',
      '.a.js',
      '.js',
      'a',
      'a.js',
      'js',
      'JS',
      'a.JS',
      '.a.JS',
      '.JS',
      '.',
      '..',
    ]),
  ['?', ['a']],
  ['??', ['js', 'JS']],
  ['??', ['js', 'JS', '.a'], { dot: true }],
  ['??', ['js', 'JS', '.a'], { dot: true }],
  ['??', ['js', 'JS']],
  ['???', []],
  ['???', ['.js', '.JS'], { dot: true }],
  ['?.js', ['a.js']],
  ['?js', []],
  ['?.js', ['a.js'], { dot: true }],
  ['?js', ['.js'], { dot: true }],
  ['?.js', ['a.js', 'a.JS'], { nocase: true }],
  ['?js', ['.js', '.JS'], { dot: true, nocase: true }],
  ['?.js', ['a.js', 'a.JS'], { dot: true, nocase: true }],
  ['*.js', ['a.js']],
  ['*js', ['a.js', 'js']],
  ['*.js', ['a.js', '.a.js', '.js'], { dot: true }],
  ['*.js', ['a.js', 'a.JS'], { nocase: true }],
  [
    '*.js',
    ['a.js', 'a.JS', '.a.js', '.a.JS', '.js', '.JS'],
    { dot: true, nocase: true },
  ],
  ['*.*', ['a.js', 'a.JS']],
  [
    '*.*',
    ['.a', '.a.js', '.js', 'a.js', 'a.JS', '.a.JS', '.JS'],
    { dot: true },
  ],
  ['.*', ['.a', '.a.js', '.js', '.a.JS', '.JS']],
  ['*', ['a', 'a.js', 'js', 'a.JS', 'JS']],
  [
    '*',
    [
      '.a',
      '.a.js',
      '.js',
      'a',
      'a.js',
      'js',
      'a.JS',
      '.a.JS',
      '.JS',
      'JS',
    ],
    { dot: true },
  ],

  () => (files = ['åéîøü', 'aeiou', 'fffff', '0f7fa', '99999']),
  [
    '[[:alpha:]][[:alpha:]][[:alpha:]][[:alpha:]][[:alpha:]]',
    ['åéîøü', 'aeiou', 'fffff'],
  ],
  [
    '[[:ascii:]][[:ascii:]][[:ascii:]][[:ascii:]][[:ascii:]]',
    ['aeiou', 'fffff', '0f7fa', '99999'],
  ],
  ['[a-[:alpha:]*]', []],
  ['[z-a]*', []],
  ['[z-af]*', ['fffff']],
  ['[fz-a]*', ['fffff']],
  ['[f-gz-a]*', ['fffff']],
  ['[f-fz-a]*', ['fffff']],
  [
    '[[:xdigit:]][[:xdigit:]][[:xdigit:]][[:xdigit:]][[:xdigit:]]',
    ['fffff', '0f7fa', '99999'],
  ],
  [
    '[[:alnum:]][[:alnum:]][[:alnum:]][[:alnum:]][[:alnum:]]',
    ['åéîøü', 'aeiou', 'fffff', '0f7fa', '99999'],
  ],
  ['[[:xdigit:]][[:xdigit:]]???', ['aeiou', 'fffff', '0f7fa', '99999']],
  ['[[:graph:]]f*', ['fffff', '0f7fa']],
  ['[[:graph:][:digit:]]f*', ['fffff', '0f7fa']],

  'fast track the *.ext patterns',
  () =>
    (files = [
      'x.y',
      'a.y',
      'x.z',
      'a.z',
      'xy',
      'ay',
      'x',
      'a',
      '.y',
      '.z',
    ]),
  ['*.y', ['x.y', 'a.y']],
  ['*.z', ['x.z', 'a.z', '.z'], { dot: true }],
  ['*.Y', ['x.y', 'a.y'], { nocase: true }],
  ['*.Z', ['x.z', 'a.z', '.z'], { dot: true, nocase: true }],

  () => files.push('+()'),
  ['+()', ['+()']],
  ['+()*(x|a)', ['x', 'a']],
  ['+(x|a[^)]y)', ['x', 'a.y']],
  ['!()y', ['x.y', 'a.y', 'xy', 'ay']],
  ['!()y', ['x.y', 'a.y', 'xy', 'ay', '.y'], { dot: true }],

  () => (files = ['x-a', 'x-ab', 'x-z', 'a-z', 'zb']),
  ['?(x-!(y)|z)', ['x-a', 'x-ab', 'x-z']],
  ['?(x-!(y)|z)b', ['x-ab', 'zb']],

  () =>
    (files = [
      '.aa',
      '.ab',
      '.ba',
      '.bb',
      'a.a',
      'a.b',
      'b.a',
      'b.b',
      'aa',
      'ab',
      'ba',
      'bb',
      'aa.',
      'ab.',
      'ba.',
      'bb.',
    ]),

  [
    '*(?)',
    [
      'a.a',
      'a.b',
      'b.a',
      'b.b',
      'aa',
      'ab',
      'ba',
      'bb',
      'aa.',
      'ab.',
      'ba.',
      'bb.',
    ],
  ],

  [
    '+(?)',
    [
      'a.a',
      'a.b',
      'b.a',
      'b.b',
      'aa',
      'ab',
      'ba',
      'bb',
      'aa.',
      'ab.',
      'ba.',
      'bb.',
    ],
  ],

  [
    '+(a|?)',
    [
      'a.a',
      'a.b',
      'b.a',
      'b.b',
      'aa',
      'ab',
      'ba',
      'bb',
      'aa.',
      'ab.',
      'ba.',
      'bb.',
    ],
  ],

  [
    '+(a|!(b))',
    [
      'a.a',
      'a.b',
      'aa',
      'aa.',
      'ab',
      'ab.',
      'b.a',
      'b.b',
      'ba',
      'ba.',
      'bb',
      'bb.',
    ],
  ],

  [
    '+(.|a|!(b))',
    [
      '.aa',
      '.ab',
      '.ba',
      '.bb',
      'a.a',
      'a.b',
      'aa',
      'aa.',
      'ab',
      'ab.',
      'b.a',
      'b.b',
      'ba',
      'ba.',
      'bb',
      'bb.',
    ],
  ],

  ['+(a|.)', ['a.a', 'aa', 'aa.', '.aa']],
]

for (const c of patterns) {
  if (typeof c === 'string') {
    t.comment(c)
    continue
  }
  if (typeof c === 'function') {
    c()
    continue
  }
  const [pattern, expect, matcherOptions, f = files, testOptions = {}] = c
  t.test(pattern, testOptions, t => {
    const matcher = new Matcher(pattern, matcherOptions)
    t.matchSnapshot(String(matcher), 'parsed matcher')
    const actual: string[] = f.filter(file => matcher.test(file))
    t.strictSame(new Set(actual), new Set(expect), {
      pattern,
      files,
    })
    t.end()
  })
}

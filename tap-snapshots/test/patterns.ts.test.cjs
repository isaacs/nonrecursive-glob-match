/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/patterns.ts > TAP > !(!(a*)) > parsed matcher 1`] = `
start -> 1
1: !(6) -> match
  6: split -> 2
  2: !(5) -> match
    5: split -> 4
    4: "a" -> 3
    3: * -> match
`

exports[`test/patterns.ts > TAP > !(!a*) > parsed matcher 1`] = `
start -> 1
1: !(5) -> match
  5: split -> 4
  4: "!" -> 3
  3: "a" -> 2
  2: * -> match
`

exports[`test/patterns.ts > TAP > !(.a|js)@(.*) > parsed matcher 1`] = `
start -> 4
4: !(9) -> 3
  9: split -> 6, 8
  6: "." -> 5
  5: "a" -> match
  8: "j" -> 7
  7: "s" -> match
3: split -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > !()y > parsed matcher 1`] = `
start -> 2
2: !(3) -> 1
  3: split -> match
1: "y" -> match
`

exports[`test/patterns.ts > TAP > !()y > parsed matcher 2`] = `
start -> 2
2: !(3) -> 1
  3: split -> match
1: "y" -> match
`

exports[`test/patterns.ts > TAP > !(\\!a*) > parsed matcher 1`] = `
start -> 1
1: !(5) -> match
  5: split -> 4
  4: "!" -> 3
  3: "a" -> 2
  2: * -> match
`

exports[`test/patterns.ts > TAP > !(a*) > parsed matcher 1`] = `
start -> 1
1: !(4) -> match
  4: split -> 3
  3: "a" -> 2
  2: * -> match
`

exports[`test/patterns.ts > TAP > !(a*) > parsed matcher 2`] = `
start -> 1
1: !(4) -> match
  4: split -> 3
  3: "a" -> 2
  2: * -> match
`

exports[`test/patterns.ts > TAP > !a* > parsed matcher 1`] = `
start -> 3
3: "!" -> 2
2: "a" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > ? > parsed matcher 1`] = `
start -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ?? > parsed matcher 1`] = `
start -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ?? > parsed matcher 2`] = `
start -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ?? > parsed matcher 3`] = `
start -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ?? > parsed matcher 4`] = `
start -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ??? > parsed matcher 1`] = `
start -> 3
3: ? -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ??? > parsed matcher 2`] = `
start -> 3
3: ? -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ??**********?****? > parsed matcher 1`] = `
start -> 18
18: ? -> 17
17: ? -> 16
16: * -> 15
15: * -> 14
14: * -> 13
13: * -> 12
12: * -> 11
11: * -> 10
10: * -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ??**********?****c > parsed matcher 1`] = `
start -> 18
18: ? -> 17
17: ? -> 16
16: * -> 15
15: * -> 14
14: * -> 13
13: * -> 12
12: * -> 11
11: * -> 10
10: * -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > ?.js > parsed matcher 1`] = `
start -> 4
4: ? -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?.js > parsed matcher 2`] = `
start -> 4
4: ? -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?.js > parsed matcher 3`] = `
start -> 4
4: ? -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?.js > parsed matcher 4`] = `
start -> 4
4: ? -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?(x-!(y)|z) > parsed matcher 1`] = `
start -> 7
7: split -> match, 5, 6
5: "x" -> 4
4: "-" -> 1
1: !(3) -> match
  3: split -> 2
  2: "y" -> match
6: "z" -> match
`

exports[`test/patterns.ts > TAP > ?(x-!(y)|z)b > parsed matcher 1`] = `
start -> 8
8: split -> 1, 6, 7
1: "b" -> match
6: "x" -> 5
5: "-" -> 2
2: !(4) -> 1
  4: split -> 3
  3: "y" -> match
7: "z" -> 1
`

exports[`test/patterns.ts > TAP > ?***?**** > parsed matcher 1`] = `
start -> 9
9: ? -> 8
8: * -> 7
7: * -> 6
6: * -> 5
5: ? -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > ?***?****? > parsed matcher 1`] = `
start -> 10
10: ? -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > ?***?****c > parsed matcher 1`] = `
start -> 10
10: ? -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > ?*****?c > parsed matcher 1`] = `
start -> 8
8: ? -> 7
7: * -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: ? -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > ?************c****?**** > parsed matcher 1`] = `
start -> 23
23: ? -> 22
22: * -> 21
21: * -> 20
20: * -> 19
19: * -> 18
18: * -> 17
17: * -> 16
16: * -> 15
15: * -> 14
14: * -> 13
13: * -> 12
12: * -> 11
11: * -> 10
10: "c" -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: * -> 5
5: ? -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > ?js > parsed matcher 1`] = `
start -> 3
3: ? -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?js > parsed matcher 2`] = `
start -> 3
3: ? -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > ?js > parsed matcher 3`] = `
start -> 3
3: ? -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > .* > parsed matcher 1`] = `
start -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > .* > parsed matcher 2`] = `
start -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > (unnamed test) > parsed matcher 1`] = `
start -> match
`

exports[`test/patterns.ts > TAP > [ > parsed matcher 1`] = `
start -> 1
1: "[" -> match
`

exports[`test/patterns.ts > TAP > [-abc] > parsed matcher 1`] = `
start -> 1
1: /^[\\-abc]/ -> match
`

exports[`test/patterns.ts > TAP > [!a* > parsed matcher 1`] = `
start -> 4
4: "[" -> 3
3: "!" -> 2
2: "a" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [[:alnum:]][[:alnum:]][[:alnum:]][[:alnum:]][[:alnum:]] > parsed matcher 1`] = `
start -> 5
5: /^[\\p{L}\\p{Nl}\\p{Nd}]/u -> 4
4: /^[\\p{L}\\p{Nl}\\p{Nd}]/u -> 3
3: /^[\\p{L}\\p{Nl}\\p{Nd}]/u -> 2
2: /^[\\p{L}\\p{Nl}\\p{Nd}]/u -> 1
1: /^[\\p{L}\\p{Nl}\\p{Nd}]/u -> match
`

exports[`test/patterns.ts > TAP > [[:alpha:]][[:alpha:]][[:alpha:]][[:alpha:]][[:alpha:]] > parsed matcher 1`] = `
start -> 5
5: /^[\\p{L}\\p{Nl}]/u -> 4
4: /^[\\p{L}\\p{Nl}]/u -> 3
3: /^[\\p{L}\\p{Nl}]/u -> 2
2: /^[\\p{L}\\p{Nl}]/u -> 1
1: /^[\\p{L}\\p{Nl}]/u -> match
`

exports[`test/patterns.ts > TAP > [[:ascii:]][[:ascii:]][[:ascii:]][[:ascii:]][[:ascii:]] > parsed matcher 1`] = `
start -> 5
5: /^[\\x00-\\x7f]/ -> 4
4: /^[\\x00-\\x7f]/ -> 3
3: /^[\\x00-\\x7f]/ -> 2
2: /^[\\x00-\\x7f]/ -> 1
1: /^[\\x00-\\x7f]/ -> match
`

exports[`test/patterns.ts > TAP > [[:graph:][:digit:]]f* > parsed matcher 1`] = `
start -> 3
3: /^([\\p{Nd}]|[^\\p{Z}\\p{C}])/u -> 2
2: "f" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [[:graph:]]f* > parsed matcher 1`] = `
start -> 3
3: /^[^\\p{Z}\\p{C}]/u -> 2
2: "f" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [[:xdigit:]][[:xdigit:]]??? > parsed matcher 1`] = `
start -> 5
5: /^[A-Fa-f0-9]/ -> 4
4: /^[A-Fa-f0-9]/ -> 3
3: ? -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > [[:xdigit:]][[:xdigit:]][[:xdigit:]][[:xdigit:]][[:xdigit:]] > parsed matcher 1`] = `
start -> 5
5: /^[A-Fa-f0-9]/ -> 4
4: /^[A-Fa-f0-9]/ -> 3
3: /^[A-Fa-f0-9]/ -> 2
2: /^[A-Fa-f0-9]/ -> 1
1: /^[A-Fa-f0-9]/ -> match
`

exports[`test/patterns.ts > TAP > [[] > parsed matcher 1`] = `
start -> 1
1: /^[\\[]/ -> match
`

exports[`test/patterns.ts > TAP > [] > parsed matcher 1`] = `
start -> 2
2: "[" -> 1
1: "]" -> match
`

exports[`test/patterns.ts > TAP > []-] > parsed matcher 1`] = `
start -> 1
1: /^[\\]\\-]/ -> match
`

exports[`test/patterns.ts > TAP > []] > parsed matcher 1`] = `
start -> 1
1: /^[\\]]/ -> match
`

exports[`test/patterns.ts > TAP > []+*] > parsed matcher 1`] = `
start -> 1
1: /^[\\]+*]/ -> match
`

exports[`test/patterns.ts > TAP > [* > parsed matcher 1`] = `
start -> 2
2: "[" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [\\-\\]] > parsed matcher 1`] = `
start -> 1
1: /^[\\-\\]]/ -> match
`

exports[`test/patterns.ts > TAP > [\\\\] > parsed matcher 1`] = `
start -> 1
1: /^[\\\\]/ -> match
`

exports[`test/patterns.ts > TAP > [\\b-a] > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [\\z-a] > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [#a* > parsed matcher 1`] = `
start -> 4
4: "[" -> 3
3: "#" -> 2
2: "a" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [^a-c]* > parsed matcher 1`] = `
start -> 2
2: /^[^a-c]/ -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [a-[:alpha:]*] > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [a-0][a-Ā] > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [a-b-c] > parsed matcher 1`] = `
start -> 1
1: /^[a-b\\-c]/ -> match
`

exports[`test/patterns.ts > TAP > [a-c]b* > parsed matcher 1`] = `
start -> 3
3: /^[a-c]/ -> 2
2: "b" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [a-y]*[^c] > parsed matcher 1`] = `
start -> 3
3: /^[a-y]/ -> 2
2: * -> 1
1: /^[^c]/ -> match
`

exports[`test/patterns.ts > TAP > [a-z] > parsed matcher 1`] = `
start -> 1
1: /^[a-z]/ -> match
`

exports[`test/patterns.ts > TAP > [abc > parsed matcher 1`] = `
start -> 4
4: "[" -> 3
3: "a" -> 2
2: "b" -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > [abc-] > parsed matcher 1`] = `
start -> 1
1: /^[abc\\-]/ -> match
`

exports[`test/patterns.ts > TAP > [f-fz-a]* > parsed matcher 1`] = `
start -> 2
2: /^[f]/ -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [f-gz-a]* > parsed matcher 1`] = `
start -> 2
2: /^[f-g]/ -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [fz-a]* > parsed matcher 1`] = `
start -> 2
2: /^[f]/ -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [ia]?[ck] > parsed matcher 1`] = `
start -> 3
3: /^[ia]/i -> 2
2: ? -> 1
1: /^[ck]/i -> match
`

exports[`test/patterns.ts > TAP > [z-a] > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [z-a]* > parsed matcher 1`] = `
start -> 1
1: /$./ -> match
`

exports[`test/patterns.ts > TAP > [z-af]* > parsed matcher 1`] = `
start -> 2
2: /^[f]/ -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > [z\\-a] > parsed matcher 1`] = `
start -> 1
1: /^[z\\-a]/ -> match
`

exports[`test/patterns.ts > TAP > @(.*) > parsed matcher 1`] = `
start -> 3
3: split -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > @(.*) > parsed matcher 2`] = `
start -> 3
3: split -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > @(.*|*) > parsed matcher 1`] = `
start -> 4
4: split -> 2, 3
2: "." -> 1
1: * -> match
3: * -> match
`

exports[`test/patterns.ts > TAP > @(.*|js) > parsed matcher 1`] = `
start -> 5
5: split -> 2, 4
2: "." -> 1
1: * -> match
4: "j" -> 3
3: "s" -> match
`

exports[`test/patterns.ts > TAP > @(*|.*) > parsed matcher 1`] = `
start -> 4
4: split -> 1, 3
1: * -> match
3: "." -> 2
2: * -> match
`

exports[`test/patterns.ts > TAP > @(*|a) > parsed matcher 1`] = `
start -> 3
3: split -> 1, 2
1: * -> match
2: "a" -> match
`

exports[`test/patterns.ts > TAP > @(+(.*)) > parsed matcher 1`] = `
start -> 5
5: split -> 4
4: split -> 3
3: "." -> 2
2: * -> 1
1: split -> match, 4
`

exports[`test/patterns.ts > TAP > @(a|a[(])b > parsed matcher 1`] = `
start -> 5
5: split -> 2, 4
2: "a" -> 1
1: "b" -> match
4: "a" -> 3
3: /^[(]/ -> 1
`

exports[`test/patterns.ts > TAP > @(a|a[)])b > parsed matcher 1`] = `
start -> 5
5: split -> 2, 4
2: "a" -> 1
1: "b" -> match
4: "a" -> 3
3: /^[)]/ -> 1
`

exports[`test/patterns.ts > TAP > @(js|.*) > parsed matcher 1`] = `
start -> 5
5: split -> 2, 4
2: "j" -> 1
1: "s" -> match
4: "." -> 3
3: * -> match
`

exports[`test/patterns.ts > TAP > * > parsed matcher 1`] = `
start -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > * > parsed matcher 2`] = `
start -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > * > parsed matcher 3`] = `
start -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > * > parsed matcher 4`] = `
start -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *!* > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "!" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *.!(js) > parsed matcher 1`] = `
start -> 6
6: * -> 5
5: "." -> 1
1: !(4) -> match
  4: split -> 3
  3: "j" -> 2
  2: "s" -> match
`

exports[`test/patterns.ts > TAP > *.* > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *.* > parsed matcher 2`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *.\\* > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: "*" -> match
`

exports[`test/patterns.ts > TAP > *.js > parsed matcher 1`] = `
start -> 4
4: * -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > *.js > parsed matcher 2`] = `
start -> 4
4: * -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > *.js > parsed matcher 3`] = `
start -> 4
4: * -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > *.js > parsed matcher 4`] = `
start -> 4
4: * -> 3
3: "." -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > *.y > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: "y" -> match
`

exports[`test/patterns.ts > TAP > *.Y > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: "y" -> match
`

exports[`test/patterns.ts > TAP > *.z > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: "z" -> match
`

exports[`test/patterns.ts > TAP > *.Z > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "." -> 1
1: "z" -> match
`

exports[`test/patterns.ts > TAP > *(?) > parsed matcher 1`] = `
start -> 1
1: split -> match, 3
3: split -> 2
2: ? -> 1
`

exports[`test/patterns.ts > TAP > *(a|b|c) > parsed matcher 1`] = `
start -> 8
8: * -> 7
7: "(" -> 6
6: "a" -> 5
5: "|" -> 4
4: "b" -> 3
3: "|" -> 2
2: "c" -> 1
1: ")" -> match
`

exports[`test/patterns.ts > TAP > *****?? > parsed matcher 1`] = `
start -> 7
7: * -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: ? -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > *******? > parsed matcher 1`] = `
start -> 8
8: * -> 7
7: * -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: ? -> match
`

exports[`test/patterns.ts > TAP > *******c > parsed matcher 1`] = `
start -> 8
8: * -> 7
7: * -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > *\\!* > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "!" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *\\\\!* > parsed matcher 1`] = `
start -> 4
4: * -> 3
3: "\\\\" -> 2
2: "!" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *c*?** > parsed matcher 1`] = `
start -> 6
6: * -> 5
5: "c" -> 4
4: * -> 3
3: ? -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > *js > parsed matcher 1`] = `
start -> 3
3: * -> 2
2: "j" -> 1
1: "s" -> match
`

exports[`test/patterns.ts > TAP > \\ > parsed matcher 1`] = `
start -> 1
1: "\\\\" -> match
`

exports[`test/patterns.ts > TAP > \\** > parsed matcher 1`] = `
start -> 2
2: "*" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > \\*\\* > parsed matcher 1`] = `
start -> 2
2: "*" -> 1
1: "*" -> match
`

exports[`test/patterns.ts > TAP > \\*x > parsed matcher 1`] = `
start -> 2
2: "*" -> 1
1: "x" -> match
`

exports[`test/patterns.ts > TAP > \\\\ > parsed matcher 1`] = `
start -> 1
1: "\\\\" -> match
`

exports[`test/patterns.ts > TAP > \\\\\\\\ > parsed matcher 1`] = `
start -> 2
2: "\\\\" -> 1
1: "\\\\" -> match
`

exports[`test/patterns.ts > TAP > #* > parsed matcher 1`] = `
start -> 2
2: "#" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > +(?) > parsed matcher 1`] = `
start -> 3
3: split -> 2
2: ? -> 1
1: split -> match, 3
`

exports[`test/patterns.ts > TAP > +(.|a|!(b)) > parsed matcher 1`] = `
start -> 7
7: split -> 2, 3, 4
2: "." -> 1
1: split -> match, 7
3: "a" -> 1
4: !(6) -> 1
  6: split -> 5
  5: "b" -> match
`

exports[`test/patterns.ts > TAP > +() > parsed matcher 1`] = `
start -> 3
3: "+" -> 2
2: "(" -> 1
1: ")" -> match
`

exports[`test/patterns.ts > TAP > +()*(x|a) > parsed matcher 1`] = `
start -> 6
6: split -> 5
5: split -> 1, 6
1: split -> match, 4
4: split -> 2, 3
2: "x" -> 1
3: "a" -> 1
`

exports[`test/patterns.ts > TAP > +(a)!(b)+(c) > parsed matcher 1`] = `
start -> 9
9: split -> 8
8: "a" -> 7
7: split -> 4, 9
4: !(6) -> 3
  6: split -> 5
  5: "b" -> match
3: split -> 2
2: "c" -> 1
1: split -> match, 3
`

exports[`test/patterns.ts > TAP > +(a|!(b)) > parsed matcher 1`] = `
start -> 6
6: split -> 2, 3
2: "a" -> 1
1: split -> match, 6
3: !(5) -> 1
  5: split -> 4
  4: "b" -> match
`

exports[`test/patterns.ts > TAP > +(a|?) > parsed matcher 1`] = `
start -> 4
4: split -> 2, 3
2: "a" -> 1
1: split -> match, 4
3: ? -> 1
`

exports[`test/patterns.ts > TAP > +(a|.) > parsed matcher 1`] = `
start -> 4
4: split -> 2, 3
2: "a" -> 1
1: split -> match, 4
3: "." -> 1
`

exports[`test/patterns.ts > TAP > +(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g > parsed matcher 1`] = `
start -> 21
21: "+" -> 20
20: "(" -> 19
19: "a" -> 18
18: "|" -> 17
17: * -> 16
16: "|" -> 15
15: "c" -> 14
14: "\\\\" -> 13
13: "|" -> 12
12: "d" -> 11
11: "\\\\" -> 10
10: "|" -> 9
9: "e" -> 8
8: "\\\\" -> 7
7: "\\\\" -> 6
6: "|" -> 5
5: "f" -> 4
4: "\\\\" -> 3
3: "\\\\" -> 2
2: "|" -> 1
1: "g" -> match
`

exports[`test/patterns.ts > TAP > +(x|a[^)]y) > parsed matcher 1`] = `
start -> 6
6: split -> 2, 5
2: "x" -> 1
1: split -> match, 6
5: "a" -> 4
4: /^[^)]/ -> 3
3: "y" -> 1
`

exports[`test/patterns.ts > TAP > a > parsed matcher 1`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > A > parsed matcher 1`] = `
start -> 1
1: "A" -> match
`

exports[`test/patterns.ts > TAP > å > parsed matcher 1`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > Å > parsed matcher 1`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > a > parsed matcher 2`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > A > parsed matcher 2`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > å > parsed matcher 2`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > Å > parsed matcher 2`] = `
start -> 1
1: "Å" -> match
`

exports[`test/patterns.ts > TAP > a > parsed matcher 3`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > A > parsed matcher 3`] = `
start -> 1
1: "A" -> match
`

exports[`test/patterns.ts > TAP > å > parsed matcher 3`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > Å > parsed matcher 3`] = `
start -> 1
1: "Å" -> match
`

exports[`test/patterns.ts > TAP > a > parsed matcher 4`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > A > parsed matcher 4`] = `
start -> 1
1: "a" -> match
`

exports[`test/patterns.ts > TAP > å > parsed matcher 4`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > Å > parsed matcher 4`] = `
start -> 1
1: "å" -> match
`

exports[`test/patterns.ts > TAP > a?c > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: ? -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > a[\\b]c > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: /^[b]/ -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > a[b]c > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: /^[b]/ -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > a[X-]b > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: /^[X\\-]/ -> 1
1: "b" -> match
`

exports[`test/patterns.ts > TAP > a* > parsed matcher 1`] = `
start -> 2
2: "a" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a*[^c] > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: * -> 1
1: /^[^c]/ -> match
`

exports[`test/patterns.ts > TAP > a**?**cd**?**??***k > parsed matcher 1`] = `
start -> 19
19: "a" -> 18
18: * -> 17
17: * -> 16
16: ? -> 15
15: * -> 14
14: * -> 13
13: "c" -> 12
12: "d" -> 11
11: * -> 10
10: * -> 9
9: ? -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: ? -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: "k" -> match
`

exports[`test/patterns.ts > TAP > a**?**cd**?**??***k** > parsed matcher 1`] = `
start -> 21
21: "a" -> 20
20: * -> 19
19: * -> 18
18: ? -> 17
17: * -> 16
16: * -> 15
15: "c" -> 14
14: "d" -> 13
13: * -> 12
12: * -> 11
11: ? -> 10
10: * -> 9
9: * -> 8
8: ? -> 7
7: ? -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: "k" -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a**?**cd**?**??k > parsed matcher 1`] = `
start -> 16
16: "a" -> 15
15: * -> 14
14: * -> 13
13: ? -> 12
12: * -> 11
11: * -> 10
10: "c" -> 9
9: "d" -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: ? -> 2
2: ? -> 1
1: "k" -> match
`

exports[`test/patterns.ts > TAP > a**?**cd**?**??k*** > parsed matcher 1`] = `
start -> 19
19: "a" -> 18
18: * -> 17
17: * -> 16
16: ? -> 15
15: * -> 14
14: * -> 13
13: "c" -> 12
12: "d" -> 11
11: * -> 10
10: * -> 9
9: ? -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: ? -> 4
4: "k" -> 3
3: * -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a********???******* > parsed matcher 1`] = `
start -> 19
19: "a" -> 18
18: * -> 17
17: * -> 16
16: * -> 15
15: * -> 14
14: * -> 13
13: * -> 12
12: * -> 11
11: * -> 10
10: ? -> 9
9: ? -> 8
8: ? -> 7
7: * -> 6
6: * -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a*****c*?** > parsed matcher 1`] = `
start -> 11
11: "a" -> 10
10: * -> 9
9: * -> 8
8: * -> 7
7: * -> 6
6: * -> 5
5: "c" -> 4
4: * -> 3
3: ? -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a****c**?**??***** > parsed matcher 1`] = `
start -> 18
18: "a" -> 17
17: * -> 16
16: * -> 15
15: * -> 14
14: * -> 13
13: "c" -> 12
12: * -> 11
11: * -> 10
10: ? -> 9
9: * -> 8
8: * -> 7
7: ? -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: * -> 2
2: * -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > a*cd**?**??k > parsed matcher 1`] = `
start -> 12
12: "a" -> 11
11: * -> 10
10: "c" -> 9
9: "d" -> 8
8: * -> 7
7: * -> 6
6: ? -> 5
5: * -> 4
4: * -> 3
3: ? -> 2
2: ? -> 1
1: "k" -> match
`

exports[`test/patterns.ts > TAP > a\\ > parsed matcher 1`] = `
start -> 2
2: "a" -> 1
1: "\\\\" -> match
`

exports[`test/patterns.ts > TAP > a\\*c > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: "*" -> 1
1: "c" -> match
`

exports[`test/patterns.ts > TAP > a\\\\ > parsed matcher 1`] = `
start -> 2
2: "a" -> 1
1: "\\\\" -> match
`

exports[`test/patterns.ts > TAP > ab* > parsed matcher 1`] = `
start -> 3
3: "a" -> 2
2: "b" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > c* > parsed matcher 1`] = `
start -> 2
2: "c" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > X* > parsed matcher 1`] = `
start -> 2
2: "X" -> 1
1: * -> match
`

exports[`test/patterns.ts > TAP > XYZ > parsed matcher 1`] = `
start -> 3
3: "x" -> 2
2: "y" -> 1
1: "z" -> match
`

# @isaacs/nonrecursive-glob-match

This is a glob matcher that can be applied to a single path
portion (ie, not `/`), which completes in polynomial time because
it doesn't compile to Regular Expressions or any other
backtrack-dependent algorithm.

## USAGE

```ts
import { Matcher } from '@isaacs/nonrecursive-glob-match'

const m = new Matcher('a*a!(y|z)')

console.log(m.test('abcay')) // false
console.log(m.test('abcax')) // true
console.log(m.test('aa')) // true
```

## Why

Patterns like this frustrate most glob matchers: `a*a*a*a*a*a*a`.
They can be used to take down servers if applied to untrusted
input. Fixing these vulns is like playing whack-a-mole with the
whole internet.

If compiled to a regular expression like
`/^a[^/]*a[^/]*a[^/]*a[^/]*a[^/]*a[^/]*a$/`, and then applied to
a path portion like `aaaaaaaaaaaaaaaaaaab`, the engine must check
every possible path through the pattern, constantly rewinding
back to the first character each time and trying a different
number of `a` characters matched against the `[^/]*` to see if it
matches. Because nothing matches, it must test every possible
path before ultimately giving up.

In contrast, the algorithm presented here is based on the
Thompson NFA paper from 1968, which tests every possible path
through the string at the same time, so that it only has to walk
the string one time. This algorithm is also implemented in the
RegExp engines used by `egrep` and `awk`, which is why those
tools are so fast, even when matching complicated RegExps against
extremely large strings.

The `Matcher` objects have a `test` method which takes a string,
just like a `RegExp` object, and can be a drop-in replacement for
the regular expressions used in minimatch and other matchers.
However, they are _not_ a complete drop-in replacement for a
RegExp, so be careful when replacing one with the other. (For
example, they do not capture, do not track match indexes, no
fancy RegExp features, etc.)

## Patterns Supported

Here are the patterns supported, and their effective state
machines drawn in lovely ASCII diagrams.

### `*` 0 or more of any character, not starting with `.`

```
--+-------------------+->
  v                   ^
  +<------------------+
  v                   ^
  +-->any character-->+
```

### `?`

```
-->any character-->
```

### `[<set>]`

```
-->character in set-->
```

This covers named posix sets like `[[:alpha:]]` as well as
character classes like `[a-b]`. (In this case, a regular
expression actually is compiled, but it's not subject to ReDoS,
becuase it's just a `/[a-z]/` style pattern tested against one
character at a time.)

### `@(e1|e2|...)`

"One" extglob.

```
--+--> e1 -->+-->
  v          ^
  +--> e2 -->+
  v          ^
  +--> e3 -->+
  v   ...    ^
```

### `?(e1|e2|...)`

"Zero or one" extglob.

```
--+--------->+-->
  v          ^
  +--> e1 -->+
  v          ^
  +--> e2 -->+
  v          ^
  +--> e3 -->+
  v   ...    ^
```

### `*(e1|e2|...)`

"Zero or more" extglob.

```
--+--------->+-->
  v          ^
  +<---------+
  v          ^
  +--> e1 -->+
  v          ^
  +--> e2 -->+
  v          ^
  +--> e3 -->+
  v   ...    ^
```

### `+(e1|e2|...)`

"One or more" extglob.

```
  +<---------+
  v          ^
--+--> e1 -->+-->
  v          ^
  +--> e2 -->+
  v          ^
  +--> e3 -->+
  v   ...    ^
```

### `!(e1|e2|...)`

"Negative" extglob.

```
--+-->+-----------+-->+------+
  |   v           ^   |      |
  |   +<----------+   | EVAL |-->
  |   v           ^   |      |
  |   +--> any -->+   +------+
  |                      ^
  v                      |
  +--> e1 ----->+------->+
  v             ^
  +--> e2 ----->+
  v             ^
  +--> e3 ----->+
  v   ...       ^
```

If the EVAL node gets a match from any of the bottom
<code>e<i>n</i></code> subexpression inputs, then it kills the
corresponding match from the top `*` input.

## Algorithm

A glob pattern is parsed and compiled into a series of attached
state machines.

For example, the glob patttern `*(a|[c-d]|+(x|y|z))z` would
compile to a state machine matching the following flow diagram:

```
-->+----------------------->+-->8 LITERAL(z)-->9 end
   v                        ^
   +<-----------------------6
   v                        ^
   0-->LITERAL(a)---------->|
   v                        |
   1-->CLASS(c-d)---------->|
   v                        |
   2-->+<---------------+-->+
       v                ^
       3-->LITERAL(x)-->7
       v                |
       4-->LITERAL(y)-->|
       v                |
       5-->LITERAL(z)-->+
```

Then, for each character in the string, we walk through the
resulting graph until we find a test node.

These test nodes are all executed on the current character, and
for any tests pass, their output nodes are added to the walk, and
we proceed to walk until hitting a test node again.

Because all routes eventually get to the exit, which only passes
when the string is at its last character, we are guaranteed to
eventually either fail (and have no more states to process), or
exit with a match.

At each branching point, effectively we increase the memory usage
by a tiny bit to track which nodes are being processed, but
importantly, we _don't_ have to try all the way to the exit and
then backtrack recursively, storing multiple states of the string
in an exponential explosion.

A pattern like `a*a*a*a*a*a*a*a*a*a*a`, which could be naively
converted into a Regular Expression
`^a.*a.*a.*a.*a.*a.*a.*a.*a.*a.*a$`, would take over 33 seconds
to match the string `'a'.repeat(50) + 'b'` using standard
JavaScript regular expressions, because it must attempt every
possible grouping of characters, backtracking after each failure.

By contrast, this implementation can solve this match for either
a pass or failure in roughly the same amount of time, which
is bound by `C * N`, where `C` is the number of states in the
machine, and `N` is the length of the string, finishing both
failure and success cases in polynomial time.

Even on the first rather naive implementation in JavaScript, with
no optimizations for repeated `*` or other common tweaks, this
finishes in 300-400 µs for the pathological case described, and
as the numbers increase, this time rises roughly linearly.

That's somewhat worse than RegExp's performance in the _success_
case, which is around 40µs, but as it's around 100,000x faster in
the failure case, this is already quite promising. And, future
iterations of this can likely bring that performance closer to
the native RegExp implementation.

## Acknowledgement

The algorithm and ideas in this implementation are inspired,
borrowed, and at times outright stolen from [Russ
Cox](https://research.swtch.com)'s explanation of Ken Thompson's
work in [Regular Expression Matching Can Be Simple And
Fast](https://swtch.com/~rsc/regexp/regexp1.html). I am both
impressed by and grateful for their work.

The code here in this library was written entirely by me, [Isaac
Z. Schlueter](https://izs.me), and so you should not blame either
of them (or anyone else) for any problems it might have. You
should also not blame me. It's open source, after all, no
warrantees express or implied, etc.

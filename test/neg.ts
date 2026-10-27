import t from 'tap'
import { Matcher } from '../src/index.js'

t.equal(new Matcher('@(a)').test('a'), true)
t.equal(new Matcher('!(!(a))').test('a'), true)
t.equal(new Matcher('!(!(a))').test('b'), false)
t.equal(new Matcher('@(a|!(a))').test('a'), true)
t.equal(new Matcher('@(x|!(a))').test('x'), true)
t.equal(new Matcher('@(x|!(a))').test('a'), false)
t.equal(new Matcher('@(x|!(x|a))').test('a'), false)
t.equal(new Matcher('@(x|!(x|a))').test('x'), true)
t.equal(new Matcher('!(x)foo').test('.foo'), false)
t.equal(new Matcher('!(x)foo').test('xfoo'), false)
t.equal(new Matcher('!(x)foo').test('foo'), true)
t.equal(new Matcher('@(.|a|!(y))').test('a.ay'), true)
t.equal(new Matcher('@(.|a|!(y))').test('a.ya'), true)
t.equal(new Matcher('@(.|a|!(y))').test('y'), false)
t.equal(new Matcher('?(.|a|!(y))').test('a.ay'), true)
t.equal(new Matcher('?(.|a|!(y))').test('a.ya'), true)
t.equal(new Matcher('?(.|a|!(y))').test('y'), false)
t.equal(new Matcher('*(.|a|!(y))').test('.ay'), true)
t.equal(new Matcher('*(.|a|!(y))').test('.ya'), true)
t.equal(new Matcher('*(.|a|!(y))').test('y'), false)
t.equal(new Matcher('+(.|a|!(y))').test('.ay'), true)
t.equal(new Matcher('+(.|a|!(y))').test('.ya'), true)
t.equal(new Matcher('+(.|a|!(y))').test('y'), false)

const pattern = new Matcher('!(a)')
t.equal(pattern.test('a'), false)
t.equal(pattern.test('b'), true)
t.equal(pattern.test('ab'), true)
t.equal(pattern.test('ba'), true)
t.equal(pattern.test('c'), true)

// this actually does NOT match bash, but I think that's a bug in bash
// https://lists.gnu.org/archive/html/bug-bash/2026-03/msg00034.html
t.equal(new Matcher('!(.a|js)@(.*)').test('.foo'), true)
t.equal(new Matcher('@(.|!(a))*').test('.foo'), true)

// two empty paths reach the same negation at one position
t.equal(new Matcher('@(|)!(a)').test('a'), false)
t.equal(new Matcher('@(|)!(a)').test('b'), true)

// the negation starts at two positions, so two runs of it have
// sub-states with the same thread count but not the same runs
t.equal(new Matcher('?(a)!(a!(b))').test('aa'), false)
t.equal(new Matcher('?(a)!(a!(b))').test('aab'), true)

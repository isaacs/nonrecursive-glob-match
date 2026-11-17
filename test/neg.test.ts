import { assert, test } from 'ubqtest'
import { Matcher } from '../src/index.js'

test('nested negations', () => {
  assert.equal(new Matcher('@(a)').test('a'), true)
  assert.equal(new Matcher('!(!(a))').test('a'), true)
  assert.equal(new Matcher('!(!(a))').test('b'), false)
  assert.equal(new Matcher('@(a|!(a))').test('a'), true)
  assert.equal(new Matcher('@(x|!(a))').test('x'), true)
  assert.equal(new Matcher('@(x|!(a))').test('a'), false)
  assert.equal(new Matcher('@(x|!(x|a))').test('a'), false)
  assert.equal(new Matcher('@(x|!(x|a))').test('x'), true)
  assert.equal(new Matcher('!(x)foo').test('.foo'), false)
  assert.equal(new Matcher('!(x)foo').test('xfoo'), false)
  assert.equal(new Matcher('!(x)foo').test('foo'), true)
  assert.equal(new Matcher('@(.|a|!(y))').test('a.ay'), true)
  assert.equal(new Matcher('@(.|a|!(y))').test('a.ya'), true)
  assert.equal(new Matcher('@(.|a|!(y))').test('y'), false)
  assert.equal(new Matcher('?(.|a|!(y))').test('a.ay'), true)
  assert.equal(new Matcher('?(.|a|!(y))').test('a.ya'), true)
  assert.equal(new Matcher('?(.|a|!(y))').test('y'), false)
  assert.equal(new Matcher('*(.|a|!(y))').test('.ay'), true)
  assert.equal(new Matcher('*(.|a|!(y))').test('.ya'), true)
  assert.equal(new Matcher('*(.|a|!(y))').test('y'), false)
  assert.equal(new Matcher('+(.|a|!(y))').test('.ay'), true)
  assert.equal(new Matcher('+(.|a|!(y))').test('.ya'), true)
  assert.equal(new Matcher('+(.|a|!(y))').test('y'), false)
})

test('!(a)', () => {
  const pattern = new Matcher('!(a)')
  assert.equal(pattern.test('a'), false)
  assert.equal(pattern.test('b'), true)
  assert.equal(pattern.test('ab'), true)
  assert.equal(pattern.test('ba'), true)
  assert.equal(pattern.test('c'), true)
})

test('dotfile', () => {
  // this actually does NOT match bash, but I think that's a bug in bash
  // https://lists.gnu.org/archive/html/bug-bash/2026-03/msg00034.html
  assert.equal(new Matcher('!(.a|js)@(.*)').test('.foo'), true)
  assert.equal(new Matcher('@(.|!(a))*').test('.foo'), true)
})

test('two empty paths', () => {
  // two empty paths reach the same negation at one position
  assert.equal(new Matcher('@(|)!(a)').test('a'), false)
  assert.equal(new Matcher('@(|)!(a)').test('b'), true)
})

test('negation at two positions', () => {
  // the negation starts at two positions, so two runs of it have
  // sub-states with the same thread count but not the same runs
  assert.equal(new Matcher('?(a)!(a!(b))').test('aa'), false)
  assert.equal(new Matcher('?(a)!(a!(b))').test('aab'), true)
})

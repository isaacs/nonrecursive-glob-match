import t from 'tap'
import { Matcher } from '../src/index.js'

t.equal(new Matcher('@(a)').test('a'), true)
t.equal(new Matcher('!(!(a))').test('a'), true)
t.equal(new Matcher('@(a|!(a))').test('a'), true)
t.equal(new Matcher('@(x|!(a))').test('x'), true)
t.equal(new Matcher('@(x|!(a))').test('a'), false)
t.equal(new Matcher('@(x|!(x|a))').test('a'), false)
t.equal(new Matcher('@(x|!(x|a))').test('x'), true)
t.equal(new Matcher('!(x)foo').test('.foo'), false)
t.equal(new Matcher('!(x)foo').test('xfoo'), false)
t.equal(new Matcher('!(x)foo').test('foo'), true)

const pattern = new Matcher('!(a)')
t.equal(pattern.test('a'), false)
t.equal(pattern.test('b'), true)
t.equal(pattern.test('ab'), true)
t.equal(pattern.test('ba'), true)
t.equal(pattern.test('c'), true)

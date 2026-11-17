import { assert, test } from 'ubqtest'
import { Matcher } from '../src/index.js'

test('a string with a slash', () => {
  assert.throws(() => new Matcher('*').test('a/b'), Error)
  assert.throws(() => new Matcher('a').test('/'), Error)
})

test('a pattern with a slash', () => {
  assert.throws(() => new Matcher('a/b'), Error)
  assert.throws(() => new Matcher('a/[2015-03-10T00:23:08.647Z]/z'), Error)
  assert.throws(() => new Matcher('a\\/b'), Error)
})

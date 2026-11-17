import { assert, test } from 'ubqtest'
import { Matcher } from '../src/index.js'

// The cached states must give the same results as the first time.
// This pattern has a state for each set of positions of the last 17
// chars that are `a`, so random strings fill the cache, and it is
// cleared many times. A string matches if the char 17 from the end
// is `a`.
test('cache that fills up', () => {
  const m = new Matcher('@(*a' + '?'.repeat(16) + ')')
  let seed = 1
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return (seed >> 16) & 1 ? 'a' : 'b'
  }
  let fails = 0
  for (let i = 0; i < 200; i++) {
    const s = Array.from({ length: 500 }, rnd).join('')
    if (m.test(s) !== (s.at(-17) === 'a')) fails++
  }
  assert.equal(fails, 0)
})

// a dotfile starts at its own state, and the others must not
// reuse it
test('dotfile start state', () => {
  const m = new Matcher('@(*.js)')
  assert.equal(m.test('.a.js'), false)
  assert.equal(m.test('a.js'), true)
  assert.equal(m.test('.b.js'), false)
  assert.equal(m.test('b.js'), true)
  const d = new Matcher('@(*.js)', { dot: true })
  assert.equal(d.test('.a.js'), true)
  assert.equal(d.test('a.js'), true)
})

// chars that are not ASCII use the same cached states
test('non-ASCII chars', () => {
  const m = new Matcher('@(*é)')
  assert.equal(m.test('aé'), true)
  assert.equal(m.test('bé'), true)
  assert.equal(m.test('éb'), false)
  assert.equal(m.test('é😀é'), true)
  assert.equal(m.test('é😀'), false)
})

import t from 'tap'
import { Matcher } from '../src/index.js'

// The cached states must give the same results as the first time.
// This pattern has a state for each set of positions of the last 17
// chars that are `a`, so random strings fill the cache, and it is
// cleared many times. A string matches if the char 17 from the end
// is `a`.
t.test('cache that fills up', t => {
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
  t.equal(fails, 0)
  t.end()
})

// a dotfile starts at its own state, and the others must not
// reuse it
t.test('dotfile start state', t => {
  const m = new Matcher('@(*.js)')
  t.equal(m.test('.a.js'), false)
  t.equal(m.test('a.js'), true)
  t.equal(m.test('.b.js'), false)
  t.equal(m.test('b.js'), true)
  const d = new Matcher('@(*.js)', { dot: true })
  t.equal(d.test('.a.js'), true)
  t.equal(d.test('a.js'), true)
  t.end()
})

// chars that are not ASCII use the same cached states
t.test('non-ASCII chars', t => {
  const m = new Matcher('@(*é)')
  t.equal(m.test('aé'), true)
  t.equal(m.test('bé'), true)
  t.equal(m.test('éb'), false)
  t.equal(m.test('é😀é'), true)
  t.equal(m.test('é😀'), false)
  t.end()
})

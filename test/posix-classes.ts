import t from 'tap'
import { Matcher } from '../src/index.js'

// [:print:] is every character other than a control character
t.test('[:print:]', t => {
  const m = new Matcher('[[:print:]]')
  t.equal(m.test('a'), true)
  t.equal(m.test(' '), true)
  t.equal(m.test('é'), true)
  t.equal(m.test('\x01'), false)
  t.equal(m.test('\x7f'), false)
  t.equal(new Matcher('[^[:print:]]').test('\x01'), true)
  t.end()
})

// in ascii, [:punct:] is every visible character that is not a
// letter or a digit, so it includes symbols like $ and +
t.test('[:punct:]', t => {
  const m = new Matcher('[[:punct:]]', { dot: true })
  for (let i = 0x21; i < 0x7f; i++) {
    const c = String.fromCharCode(i)
    if (c === '/' || c === '.') continue
    t.equal(m.test(c), !/[a-z0-9]/i.test(c), JSON.stringify(c))
  }
  t.equal(m.test(' '), false)
  t.end()
})

t.test('literal carets in character classes', t => {
  const caret = new Matcher('[\\^]')
  t.equal(caret.test('^'), true)
  t.equal(caret.test('b'), false)
  const afterRange = new Matcher('[z-a^]')
  t.equal(afterRange.test('^'), true)
  t.equal(afterRange.test('b'), false)
  t.end()
})

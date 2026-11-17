import { assert, describe, test } from 'ubqtest'
import { Matcher } from '../src/index.js'

// [:print:] is every character other than a control character
test('[:print:]', () => {
  const m = new Matcher('[[:print:]]')
  assert.equal(m.test('a'), true)
  assert.equal(m.test(' '), true)
  assert.equal(m.test('é'), true)
  assert.equal(m.test('\x01'), false)
  assert.equal(m.test('\x7f'), false)
  assert.equal(new Matcher('[^[:print:]]').test('\x01'), true)
})

// in ascii, [:punct:] is every visible character that is not a
// letter or a digit, so it includes symbols like $ and +
describe('[:punct:]', () => {
  const m = new Matcher('[[:punct:]]', { dot: true })
  for (let i = 0x21; i < 0x7f; i++) {
    const c = String.fromCharCode(i)
    if (c === '/' || c === '.') continue
    test(JSON.stringify(c), () => {
      assert.equal(m.test(c), !/[a-z0-9]/i.test(c))
    })
  }
  test('space', () => assert.equal(m.test(' '), false))
})

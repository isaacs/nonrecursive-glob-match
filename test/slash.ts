import t from 'tap'
import { Matcher } from '../src/index.js'

t.throws(() => new Matcher('*').test('a/b'))
t.throws(() => new Matcher('a').test('/'))

t.throws(() => new Matcher('a/b'))
t.throws(() => new Matcher('a/[2015-03-10T00:23:08.647Z]/z'))
t.throws(() => new Matcher('a\\/b'))

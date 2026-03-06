import { Matcher } from '../dist/esm/index.js'
import { equal } from 'node:assert'
import { writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, parentPort } from 'node:worker_threads'

const dir = dirname(fileURLToPath(import.meta.url))

const maxTime = 120_000

if (isMainThread) {
  const data: Record<
    `${number}-${number}`,
    [number, number, number, number]
  > = {}
  const fields = {
    pass: 0,
    fail: 1,
    regexpPass: 2,
    regexpFail: 3,
  } as const
  for (const PN of [2, 5, 10, 20, 50, 100]) {
    for (const SN of [5, 10, 20, 50, 100, 200]) {
      // string has to be longer than pattern, or else it won't match
      if (SN <= PN) {
        continue
      }
      const k: `${number}-${number}` = `${SN}-${PN}`
      const value: (typeof data)[keyof typeof data] = [-1, -1, -1, -1]
      data[k] = value
      const worker = new Worker(new URL(import.meta.url))
      worker.on('message', (m: typeof fields) => {
        value[fields.pass] = m.pass ?? value[fields.pass]
        value[fields.fail] = m.fail ?? value[fields.fail]
        value[fields.regexpPass] = m.regexpPass ?? value[fields.regexpPass]
        value[fields.regexpFail] = m.regexpFail ?? value[fields.regexpFail]
      })
      worker.on('exit', () => clearTimeout(to))
      const to = setTimeout(() => {
        worker.terminate()
      }, maxTime)
      to.unref()
      worker.postMessage({ SN, PN })
      await new Promise(res => worker.once('exit', res))
    }
  }
  const d = JSON.stringify(data, null, 2)
  writeFileSync(dir + '/data.json', d + '\n')
  const tab: (string[] | number[])[] = [
    ['pattern', 'string', 'pass', 'fail', 'repass', 'refail'],
  ]
  for (const [k, [pass, fail, repass, refail]] of Object.entries(data)) {
    const [s, p] = k.split('-').map(s => Number(s))
    tab.push([p as number, s as number, pass, fail, repass, refail])
  }
  writeFileSync(
    dir + '/data.tab',
    tab.map(line => line.join('\t') + '\n').join(''),
  )
  console.log(d)
} else {
  parentPort?.once('message', (message: { SN: number; PN: number }) => {
    const { SN, PN } = message
    const time = (name: string, fn: () => void) => {
      const start = performance.now()
      fn()
      parentPort?.postMessage({
        SN,
        PN,
        [name]: performance.now() - start,
      })
    }
    const p = 'a*'.repeat(PN) + 'a'
    const pattern = new Matcher(p)
    time('pass', () => equal(pattern.test('a'.repeat(SN)), true))
    time('fail', () => equal(pattern.test('a'.repeat(SN) + 'b'), false))
    const rep = '^' + p.split('*').join('.*') + '$'
    const re = new RegExp(rep)
    time('regexpPass', () => equal(re.test('a'.repeat(SN)), true))
    time('regexpFail', () => equal(re.test('a'.repeat(SN) + 'b'), false))
  })
}

import process from 'process'
import XSalsa20CSPRNG from '../src/index.nodejs.js'

const rng = new XSalsa20CSPRNG()

const repeat = 10_000_000
const start = process.hrtime.bigint()
for (let i = 0; i < repeat; ++i) {
  rng.randomInt32()
}
const end = process.hrtime.bigint()
const mean = Number(end - start) / repeat

console.log(`Each execution took ${mean} nanoseconds`)

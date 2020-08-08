import assert from 'assert'
import { CSPRNG } from '../index.js'

const zero_nonce = new Uint8Array(24)
const zero_key = new Uint8Array(32)

describe('class CSPRNG', () => {
  it('randomInt32', () => {
    const rng = new CSPRNG(zero_nonce, zero_key)

    for (let i = 0; i < 10000; ++i) {
      const v = rng.randomInt32()
      assert(-(2**31) <= v)
      assert(v < 2**31)
      assert(Number.isInteger(v))
    }
  })

  it('randomUint32', () => {
    const rng = new CSPRNG(zero_nonce, zero_key)

    for (let i = 0; i < 10000; ++i) {
      const v = rng.randomUint32()
      assert(0 <= v)
      assert(v < 2**32)
      assert(Number.isInteger(v))
    }
  })

  it('randomUniform', () => {
    const rng = new CSPRNG(zero_nonce, zero_key)

    for (let i = 0; i < 10000; ++i) {
      const v = rng.uniformInt(10)
      assert(0 <= v)
      assert(v < 10)
      assert(Number.isInteger(v))
    }
  })
})

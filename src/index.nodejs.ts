import { xsalsa20GeneratorInt32, XSalsa20GeneratorInt32, XSalsa20 } from './common.js'
import crypto from 'crypto'

export default class CSPRNG {
  private xsalsa: XSalsa20GeneratorInt32

  constructor() {
    // Node.js
    const buf = crypto.randomBytes(24 + 32)
    const nonce = buf.slice(0, 24)
    const key = buf.slice(24)
    this.xsalsa = xsalsa20GeneratorInt32(nonce, key)
  }

  static of(nonce: Uint8Array, key: Uint8Array) {
    const self = Object.create(CSPRNG.prototype)
    self.xsalsa = xsalsa20GeneratorInt32(nonce, key)
    return self
  }

  randomInt32(): number {
    return this.xsalsa.next().value
  }

  randomUint32(): number {
    return this.xsalsa.next().value + 2**31
  }

  uniformInt(exclusive_upper_bound: number): number {
    if (exclusive_upper_bound < 2) return 0

    const min = 2**32 % exclusive_upper_bound
    let r: number;
    do {
      r = this.randomUint32()
    } while (r < min)
    return r % exclusive_upper_bound
  }
}

export { XSalsa20 }

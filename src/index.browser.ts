import { xsalsa20GeneratorInt32, XSalsa20GeneratorInt32, XSalsa20 } from './common.js'

export default class CSPRNG {
  private xsalsa: XSalsa20GeneratorInt32

  constructor() {
    // Browser
    const nonce = new Uint8Array(24)
    const key = new Uint8Array(32)
    window.crypto.getRandomValues(nonce)
    window.crypto.getRandomValues(key)
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

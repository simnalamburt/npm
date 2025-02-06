// TODO: Web assembly is more advantageous for large inputs. Creating a web
// assembly version.
//
// benchmark with 4B input, 300000 iterations:
//   xsalsa20: 98.654ms
//   wasm: 139.835ms
//
// benchmark with 4096B input, 30000 iterations:
//   xsalsa20: 804.314ms
//   wasm: 325.942ms
//
// benchmark with 41943040B input, 3 iterations:
//   xsalsa20: 828.65ms
//   wasm: 332.185ms

import randomBytes from './random'

export default class XSalsa20CSPRNG {
  private xsalsa: XSalsa20GeneratorInt32

  constructor() {
    const buf = randomBytes(24 + 32)
    const nonce = buf.slice(0, 24)
    const key = buf.slice(24)
    this.xsalsa = xsalsa20GeneratorInt32(nonce, key)
  }

  static of(nonce: Uint8Array, key: Uint8Array) {
    const self = Object.create(XSalsa20CSPRNG.prototype)
    self.xsalsa = xsalsa20GeneratorInt32(nonce, key)
    return self
  }

  randomInt32(): number {
    return this.xsalsa.next().value
  }

  randomUint32(): number {
    return this.xsalsa.next().value + 2 ** 31
  }

  uniformInt(exclusive_upper_bound: number): number {
    if (exclusive_upper_bound < 2) return 0

    const min = 2 ** 32 % exclusive_upper_bound
    let r: number
    do {
      r = this.randomUint32()
    } while (r < min)
    return r % exclusive_upper_bound
  }
}

type XSalsa20Generator = Generator<Uint8Array, never, undefined>
function* xsalsa20Generator(
  nonce: Uint8Array,
  key: Uint8Array
): XSalsa20Generator {
  const s = new Uint8Array(32)
  const z = new Uint8Array(16)
  // biome-ignore format: binary
  const SIGMA = new Uint8Array([
    0x65, 0x78, 0x70, 0x61, 0x6e, 0x64, 0x20, 0x33,
    0x32, 0x2d, 0x62, 0x79, 0x74, 0x65, 0x20, 0x6b,
  ])

  core_hsalsa20(s, nonce, key, SIGMA)
  for (let i = 0; i < 8; i++) z[i] = nonce[i + 16]

  while (true) {
    const output = new Uint8Array(64)
    core_salsa20(output, z, s, SIGMA)
    yield output

    let u = 1
    for (let i = 8; i < 16; i++) {
      u += (z[i] & 0xff) | 0
      z[i] = u & 0xff
      u >>>= 8
    }
  }
}

type XSalsa20GeneratorInt32 = Generator<number, never, undefined>
function* xsalsa20GeneratorInt32(
  nonce: Uint8Array,
  key: Uint8Array
): XSalsa20GeneratorInt32 {
  const generator = xsalsa20Generator(nonce, key)

  while (true) {
    const b = generator.next().value
    // biome-ignore format: vertically aligned
    yield* [
      b[ 0] | b[ 1] << 8 | b[ 2] << 16 | b[ 3] << 24,
      b[ 4] | b[ 5] << 8 | b[ 6] << 16 | b[ 7] << 24,
      b[ 8] | b[ 9] << 8 | b[10] << 16 | b[11] << 24,
      b[12] | b[13] << 8 | b[14] << 16 | b[15] << 24,
      b[16] | b[17] << 8 | b[18] << 16 | b[19] << 24,
      b[20] | b[21] << 8 | b[22] << 16 | b[23] << 24,
      b[24] | b[25] << 8 | b[26] << 16 | b[27] << 24,
      b[28] | b[29] << 8 | b[30] << 16 | b[31] << 24,
      b[32] | b[33] << 8 | b[34] << 16 | b[35] << 24,
      b[36] | b[37] << 8 | b[38] << 16 | b[39] << 24,
      b[40] | b[41] << 8 | b[42] << 16 | b[43] << 24,
      b[44] | b[45] << 8 | b[46] << 16 | b[47] << 24,
      b[48] | b[49] << 8 | b[50] << 16 | b[51] << 24,
      b[52] | b[53] << 8 | b[54] << 16 | b[55] << 24,
      b[56] | b[57] << 8 | b[58] << 16 | b[59] << 24,
      b[60] | b[61] << 8 | b[62] << 16 | b[63] << 24,
    ]
  }
}

export class XSalsa20 {
  private xsalsa: XSalsa20Generator
  private buffer: Uint8Array

  constructor(nonce: Uint8Array, key: Uint8Array) {
    // Check parameter
    if (nonce.length !== 24) throw new Error('nonce must be 24 bytes')
    if (key.length !== 32) throw new Error('key must be 32 bytes')

    // Initialize
    this.xsalsa = xsalsa20Generator(nonce, key)
    this.buffer = new Uint8Array(0)
  }

  stream(length: number): Uint8Array {
    let output: Uint8Array
    let counter: number

    const bufLength = this.buffer.length
    if (bufLength > 0) {
      if (length < bufLength) {
        output = this.buffer.slice(0, length)
        this.buffer = this.buffer.slice(length)
        return output
      } else if (length === bufLength) {
        output = this.buffer
        this.buffer = new Uint8Array(0)
        return output
      } else {
        output = new Uint8Array(length)
        output.set(this.buffer)
        counter = bufLength

        this.buffer = new Uint8Array(0)
      }
    } else {
      output = new Uint8Array(length)
      counter = 0
    }

    while (length - counter >= 64) {
      output.set(this.xsalsa.next().value, counter)
      counter += 64
    }
    const remain = length - counter
    if (remain > 0) {
      const buffer = this.xsalsa.next().value
      output.set(buffer.slice(0, remain), counter)
      this.buffer = buffer.slice(remain)
    }

    return output
  }

  update(
    input: Uint8Array,
    output: Uint8Array = new Uint8Array(input.length)
  ): Uint8Array {
    const stream = this.stream(input.length)
    for (let i = 0; i < input.length; ++i) output[i] = input[i] ^ stream[i]

    // Return
    return output
  }
}

// below methods are ported from tweet nacl
function core_salsa20(
  o: Uint8Array,
  p: Uint8Array,
  k: Uint8Array,
  c: Uint8Array
): void {
  // biome-ignore format: vertically aligned
  const
    j0  = c[ 0] | (c[ 1] << 8) | (c[ 2] << 16) | (c[ 3] << 24),
    j1  = k[ 0] | (k[ 1] << 8) | (k[ 2] << 16) | (k[ 3] << 24),
    j2  = k[ 4] | (k[ 5] << 8) | (k[ 6] << 16) | (k[ 7] << 24),
    j3  = k[ 8] | (k[ 9] << 8) | (k[10] << 16) | (k[11] << 24),
    j4  = k[12] | (k[13] << 8) | (k[14] << 16) | (k[15] << 24),
    j5  = c[ 4] | (c[ 5] << 8) | (c[ 6] << 16) | (c[ 7] << 24),
    j6  = p[ 0] | (p[ 1] << 8) | (p[ 2] << 16) | (p[ 3] << 24),
    j7  = p[ 4] | (p[ 5] << 8) | (p[ 6] << 16) | (p[ 7] << 24),
    j8  = p[ 8] | (p[ 9] << 8) | (p[10] << 16) | (p[11] << 24),
    j9  = p[12] | (p[13] << 8) | (p[14] << 16) | (p[15] << 24),
    j10 = c[ 8] | (c[ 9] << 8) | (c[10] << 16) | (c[11] << 24),
    j11 = k[16] | (k[17] << 8) | (k[18] << 16) | (k[19] << 24),
    j12 = k[20] | (k[21] << 8) | (k[22] << 16) | (k[23] << 24),
    j13 = k[24] | (k[25] << 8) | (k[26] << 16) | (k[27] << 24),
    j14 = k[28] | (k[29] << 8) | (k[30] << 16) | (k[31] << 24),
    j15 = c[12] | (c[13] << 8) | (c[14] << 16) | (c[15] << 24)

  // biome-ignore format: compact
  let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u: number

  for (let i = 0; i < 20; i += 2) {
    u = (x0 + x12) | 0
    x4 ^= (u << 7) | (u >>> 25)
    u = (x4 + x0) | 0
    x8 ^= (u << 9) | (u >>> 23)
    u = (x8 + x4) | 0
    x12 ^= (u << 13) | (u >>> 19)
    u = (x12 + x8) | 0
    x0 ^= (u << 18) | (u >>> 14)

    u = (x5 + x1) | 0
    x9 ^= (u << 7) | (u >>> 25)
    u = (x9 + x5) | 0
    x13 ^= (u << 9) | (u >>> 23)
    u = (x13 + x9) | 0
    x1 ^= (u << 13) | (u >>> 19)
    u = (x1 + x13) | 0
    x5 ^= (u << 18) | (u >>> 14)

    u = (x10 + x6) | 0
    x14 ^= (u << 7) | (u >>> 25)
    u = (x14 + x10) | 0
    x2 ^= (u << 9) | (u >>> 23)
    u = (x2 + x14) | 0
    x6 ^= (u << 13) | (u >>> 19)
    u = (x6 + x2) | 0
    x10 ^= (u << 18) | (u >>> 14)

    u = (x15 + x11) | 0
    x3 ^= (u << 7) | (u >>> 25)
    u = (x3 + x15) | 0
    x7 ^= (u << 9) | (u >>> 23)
    u = (x7 + x3) | 0
    x11 ^= (u << 13) | (u >>> 19)
    u = (x11 + x7) | 0
    x15 ^= (u << 18) | (u >>> 14)

    u = (x0 + x3) | 0
    x1 ^= (u << 7) | (u >>> 25)
    u = (x1 + x0) | 0
    x2 ^= (u << 9) | (u >>> 23)
    u = (x2 + x1) | 0
    x3 ^= (u << 13) | (u >>> 19)
    u = (x3 + x2) | 0
    x0 ^= (u << 18) | (u >>> 14)

    u = (x5 + x4) | 0
    x6 ^= (u << 7) | (u >>> 25)
    u = (x6 + x5) | 0
    x7 ^= (u << 9) | (u >>> 23)
    u = (x7 + x6) | 0
    x4 ^= (u << 13) | (u >>> 19)
    u = (x4 + x7) | 0
    x5 ^= (u << 18) | (u >>> 14)

    u = (x10 + x9) | 0
    x11 ^= (u << 7) | (u >>> 25)
    u = (x11 + x10) | 0
    x8 ^= (u << 9) | (u >>> 23)
    u = (x8 + x11) | 0
    x9 ^= (u << 13) | (u >>> 19)
    u = (x9 + x8) | 0
    x10 ^= (u << 18) | (u >>> 14)

    u = (x15 + x14) | 0
    x12 ^= (u << 7) | (u >>> 25)
    u = (x12 + x15) | 0
    x13 ^= (u << 9) | (u >>> 23)
    u = (x13 + x12) | 0
    x14 ^= (u << 13) | (u >>> 19)
    u = (x14 + x13) | 0
    x15 ^= (u << 18) | (u >>> 14)
  }
  x0 = (x0 + j0) | 0
  x1 = (x1 + j1) | 0
  x2 = (x2 + j2) | 0
  x3 = (x3 + j3) | 0
  x4 = (x4 + j4) | 0
  x5 = (x5 + j5) | 0
  x6 = (x6 + j6) | 0
  x7 = (x7 + j7) | 0
  x8 = (x8 + j8) | 0
  x9 = (x9 + j9) | 0
  x10 = (x10 + j10) | 0
  x11 = (x11 + j11) | 0
  x12 = (x12 + j12) | 0
  x13 = (x13 + j13) | 0
  x14 = (x14 + j14) | 0
  x15 = (x15 + j15) | 0

  o[0] = (x0 >>> 0) & 0xff
  o[1] = (x0 >>> 8) & 0xff
  o[2] = (x0 >>> 16) & 0xff
  o[3] = (x0 >>> 24) & 0xff

  o[4] = (x1 >>> 0) & 0xff
  o[5] = (x1 >>> 8) & 0xff
  o[6] = (x1 >>> 16) & 0xff
  o[7] = (x1 >>> 24) & 0xff

  o[8] = (x2 >>> 0) & 0xff
  o[9] = (x2 >>> 8) & 0xff
  o[10] = (x2 >>> 16) & 0xff
  o[11] = (x2 >>> 24) & 0xff

  o[12] = (x3 >>> 0) & 0xff
  o[13] = (x3 >>> 8) & 0xff
  o[14] = (x3 >>> 16) & 0xff
  o[15] = (x3 >>> 24) & 0xff

  o[16] = (x4 >>> 0) & 0xff
  o[17] = (x4 >>> 8) & 0xff
  o[18] = (x4 >>> 16) & 0xff
  o[19] = (x4 >>> 24) & 0xff

  o[20] = (x5 >>> 0) & 0xff
  o[21] = (x5 >>> 8) & 0xff
  o[22] = (x5 >>> 16) & 0xff
  o[23] = (x5 >>> 24) & 0xff

  o[24] = (x6 >>> 0) & 0xff
  o[25] = (x6 >>> 8) & 0xff
  o[26] = (x6 >>> 16) & 0xff
  o[27] = (x6 >>> 24) & 0xff

  o[28] = (x7 >>> 0) & 0xff
  o[29] = (x7 >>> 8) & 0xff
  o[30] = (x7 >>> 16) & 0xff
  o[31] = (x7 >>> 24) & 0xff

  o[32] = (x8 >>> 0) & 0xff
  o[33] = (x8 >>> 8) & 0xff
  o[34] = (x8 >>> 16) & 0xff
  o[35] = (x8 >>> 24) & 0xff

  o[36] = (x9 >>> 0) & 0xff
  o[37] = (x9 >>> 8) & 0xff
  o[38] = (x9 >>> 16) & 0xff
  o[39] = (x9 >>> 24) & 0xff

  o[40] = (x10 >>> 0) & 0xff
  o[41] = (x10 >>> 8) & 0xff
  o[42] = (x10 >>> 16) & 0xff
  o[43] = (x10 >>> 24) & 0xff

  o[44] = (x11 >>> 0) & 0xff
  o[45] = (x11 >>> 8) & 0xff
  o[46] = (x11 >>> 16) & 0xff
  o[47] = (x11 >>> 24) & 0xff

  o[48] = (x12 >>> 0) & 0xff
  o[49] = (x12 >>> 8) & 0xff
  o[50] = (x12 >>> 16) & 0xff
  o[51] = (x12 >>> 24) & 0xff

  o[52] = (x13 >>> 0) & 0xff
  o[53] = (x13 >>> 8) & 0xff
  o[54] = (x13 >>> 16) & 0xff
  o[55] = (x13 >>> 24) & 0xff

  o[56] = (x14 >>> 0) & 0xff
  o[57] = (x14 >>> 8) & 0xff
  o[58] = (x14 >>> 16) & 0xff
  o[59] = (x14 >>> 24) & 0xff

  o[60] = (x15 >>> 0) & 0xff
  o[61] = (x15 >>> 8) & 0xff
  o[62] = (x15 >>> 16) & 0xff
  o[63] = (x15 >>> 24) & 0xff
}

function core_hsalsa20(
  o: Uint8Array,
  p: Uint8Array,
  k: Uint8Array,
  c: Uint8Array
): void {
  // biome-ignore format: vertically aligned
  const
    j0  = c[ 0] | (c[ 1] << 8) | (c[ 2] << 16) | (c[ 3] << 24),
    j1  = k[ 0] | (k[ 1] << 8) | (k[ 2] << 16) | (k[ 3] << 24),
    j2  = k[ 4] | (k[ 5] << 8) | (k[ 6] << 16) | (k[ 7] << 24),
    j3  = k[ 8] | (k[ 9] << 8) | (k[10] << 16) | (k[11] << 24),
    j4  = k[12] | (k[13] << 8) | (k[14] << 16) | (k[15] << 24),
    j5  = c[ 4] | (c[ 5] << 8) | (c[ 6] << 16) | (c[ 7] << 24),
    j6  = p[ 0] | (p[ 1] << 8) | (p[ 2] << 16) | (p[ 3] << 24),
    j7  = p[ 4] | (p[ 5] << 8) | (p[ 6] << 16) | (p[ 7] << 24),
    j8  = p[ 8] | (p[ 9] << 8) | (p[10] << 16) | (p[11] << 24),
    j9  = p[12] | (p[13] << 8) | (p[14] << 16) | (p[15] << 24),
    j10 = c[ 8] | (c[ 9] << 8) | (c[10] << 16) | (c[11] << 24),
    j11 = k[16] | (k[17] << 8) | (k[18] << 16) | (k[19] << 24),
    j12 = k[20] | (k[21] << 8) | (k[22] << 16) | (k[23] << 24),
    j13 = k[24] | (k[25] << 8) | (k[26] << 16) | (k[27] << 24),
    j14 = k[28] | (k[29] << 8) | (k[30] << 16) | (k[31] << 24),
    j15 = c[12] | (c[13] << 8) | (c[14] << 16) | (c[15] << 24)

  // biome-ignore format: compact
  let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u: number

  for (let i = 0; i < 20; i += 2) {
    u = (x0 + x12) | 0
    x4 ^= (u << 7) | (u >>> 25)
    u = (x4 + x0) | 0
    x8 ^= (u << 9) | (u >>> 23)
    u = (x8 + x4) | 0
    x12 ^= (u << 13) | (u >>> 19)
    u = (x12 + x8) | 0
    x0 ^= (u << 18) | (u >>> 14)

    u = (x5 + x1) | 0
    x9 ^= (u << 7) | (u >>> 25)
    u = (x9 + x5) | 0
    x13 ^= (u << 9) | (u >>> 23)
    u = (x13 + x9) | 0
    x1 ^= (u << 13) | (u >>> 19)
    u = (x1 + x13) | 0
    x5 ^= (u << 18) | (u >>> 14)

    u = (x10 + x6) | 0
    x14 ^= (u << 7) | (u >>> 25)
    u = (x14 + x10) | 0
    x2 ^= (u << 9) | (u >>> 23)
    u = (x2 + x14) | 0
    x6 ^= (u << 13) | (u >>> 19)
    u = (x6 + x2) | 0
    x10 ^= (u << 18) | (u >>> 14)

    u = (x15 + x11) | 0
    x3 ^= (u << 7) | (u >>> 25)
    u = (x3 + x15) | 0
    x7 ^= (u << 9) | (u >>> 23)
    u = (x7 + x3) | 0
    x11 ^= (u << 13) | (u >>> 19)
    u = (x11 + x7) | 0
    x15 ^= (u << 18) | (u >>> 14)

    u = (x0 + x3) | 0
    x1 ^= (u << 7) | (u >>> 25)
    u = (x1 + x0) | 0
    x2 ^= (u << 9) | (u >>> 23)
    u = (x2 + x1) | 0
    x3 ^= (u << 13) | (u >>> 19)
    u = (x3 + x2) | 0
    x0 ^= (u << 18) | (u >>> 14)

    u = (x5 + x4) | 0
    x6 ^= (u << 7) | (u >>> 25)
    u = (x6 + x5) | 0
    x7 ^= (u << 9) | (u >>> 23)
    u = (x7 + x6) | 0
    x4 ^= (u << 13) | (u >>> 19)
    u = (x4 + x7) | 0
    x5 ^= (u << 18) | (u >>> 14)

    u = (x10 + x9) | 0
    x11 ^= (u << 7) | (u >>> 25)
    u = (x11 + x10) | 0
    x8 ^= (u << 9) | (u >>> 23)
    u = (x8 + x11) | 0
    x9 ^= (u << 13) | (u >>> 19)
    u = (x9 + x8) | 0
    x10 ^= (u << 18) | (u >>> 14)

    u = (x15 + x14) | 0
    x12 ^= (u << 7) | (u >>> 25)
    u = (x12 + x15) | 0
    x13 ^= (u << 9) | (u >>> 23)
    u = (x13 + x12) | 0
    x14 ^= (u << 13) | (u >>> 19)
    u = (x14 + x13) | 0
    x15 ^= (u << 18) | (u >>> 14)
  }

  o[0] = (x0 >>> 0) & 0xff
  o[1] = (x0 >>> 8) & 0xff
  o[2] = (x0 >>> 16) & 0xff
  o[3] = (x0 >>> 24) & 0xff

  o[4] = (x5 >>> 0) & 0xff
  o[5] = (x5 >>> 8) & 0xff
  o[6] = (x5 >>> 16) & 0xff
  o[7] = (x5 >>> 24) & 0xff

  o[8] = (x10 >>> 0) & 0xff
  o[9] = (x10 >>> 8) & 0xff
  o[10] = (x10 >>> 16) & 0xff
  o[11] = (x10 >>> 24) & 0xff

  o[12] = (x15 >>> 0) & 0xff
  o[13] = (x15 >>> 8) & 0xff
  o[14] = (x15 >>> 16) & 0xff
  o[15] = (x15 >>> 24) & 0xff

  o[16] = (x6 >>> 0) & 0xff
  o[17] = (x6 >>> 8) & 0xff
  o[18] = (x6 >>> 16) & 0xff
  o[19] = (x6 >>> 24) & 0xff

  o[20] = (x7 >>> 0) & 0xff
  o[21] = (x7 >>> 8) & 0xff
  o[22] = (x7 >>> 16) & 0xff
  o[23] = (x7 >>> 24) & 0xff

  o[24] = (x8 >>> 0) & 0xff
  o[25] = (x8 >>> 8) & 0xff
  o[26] = (x8 >>> 16) & 0xff
  o[27] = (x8 >>> 24) & 0xff

  o[28] = (x9 >>> 0) & 0xff
  o[29] = (x9 >>> 8) & 0xff
  o[30] = (x9 >>> 16) & 0xff
  o[31] = (x9 >>> 24) & 0xff
}

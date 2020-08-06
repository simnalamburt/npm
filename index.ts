const SIGMA = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107])

type BufferLike = Uint8Array | Buffer

type xsalsa20Generator = Generator<Uint8Array, never, never>

function* xsalsa20Generator(nonce: BufferLike, key: BufferLike): xsalsa20Generator {
  const s = new Uint8Array(32)
  const z = new Uint8Array(16)
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

export default class XSalsa20 {
  xsalsa: xsalsa20Generator
  buffer: Uint8Array

  constructor(nonce: BufferLike, key: BufferLike) {
    // Check parameter
    if (nonce.length !== 24) throw new Error('nonce must be 24 bytes')
    if (key.length !== 32) throw new Error('key must be 32 bytes')

    // Initialize
    this.xsalsa = xsalsa20Generator(nonce, key)
    this.buffer = new Uint8Array(0)
  }

  stream(length: number) {
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

  update(input: BufferLike, output: BufferLike = new Uint8Array(input.length)) {
    const stream = this.stream(input.length)
    for (let i = 0; i < input.length; ++i) output[i] = input[i] ^ stream[i]

    // Return
    return output
  }
}

// below methods are ported from tweet nacl
function core_salsa20(o: Uint8Array, p: Uint8Array, k: Uint8Array, c: Uint8Array) {
  const O = new DataView(o.buffer, o.byteOffset, o.byteLength)
  const P = new DataView(p.buffer, p.byteOffset, p.byteLength)
  const K = new DataView(k.buffer, k.byteOffset, k.byteLength)
  const C = new DataView(c.buffer, c.byteOffset, c.byteLength)

  const
      j0  = C.getInt32( 0, true),
      j1  = K.getInt32( 0, true),
      j2  = K.getInt32( 4, true),
      j3  = K.getInt32( 8, true),
      j4  = K.getInt32(12, true),
      j5  = C.getInt32( 4, true),
      j6  = P.getInt32( 0, true),
      j7  = P.getInt32( 4, true),
      j8  = P.getInt32( 8, true),
      j9  = P.getInt32(12, true),
      j10 = C.getInt32( 8, true),
      j11 = K.getInt32(16, true),
      j12 = K.getInt32(20, true),
      j13 = K.getInt32(24, true),
      j14 = K.getInt32(28, true),
      j15 = C.getInt32(12, true)

  let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u: number

  for (let i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0
    x4 ^= u << 7 | u >>> 25
    u = x4 + x0 | 0
    x8 ^= u << 9 | u >>> 23
    u = x8 + x4 | 0
    x12 ^= u << 13 | u >>> 19
    u = x12 + x8 | 0
    x0 ^= u << 18 | u >>> 14

    u = x5 + x1 | 0
    x9 ^= u << 7 | u >>> 25
    u = x9 + x5 | 0
    x13 ^= u << 9 | u >>> 23
    u = x13 + x9 | 0
    x1 ^= u << 13 | u >>> 19
    u = x1 + x13 | 0
    x5 ^= u << 18 | u >>> 14

    u = x10 + x6 | 0
    x14 ^= u << 7 | u >>> 25
    u = x14 + x10 | 0
    x2 ^= u << 9 | u >>> 23
    u = x2 + x14 | 0
    x6 ^= u << 13 | u >>> 19
    u = x6 + x2 | 0
    x10 ^= u << 18 | u >>> 14

    u = x15 + x11 | 0
    x3 ^= u << 7 | u >>> 25
    u = x3 + x15 | 0
    x7 ^= u << 9 | u >>> 23
    u = x7 + x3 | 0
    x11 ^= u << 13 | u >>> 19
    u = x11 + x7 | 0
    x15 ^= u << 18 | u >>> 14

    u = x0 + x3 | 0
    x1 ^= u << 7 | u >>> 25
    u = x1 + x0 | 0
    x2 ^= u << 9 | u >>> 23
    u = x2 + x1 | 0
    x3 ^= u << 13 | u >>> 19
    u = x3 + x2 | 0
    x0 ^= u << 18 | u >>> 14

    u = x5 + x4 | 0
    x6 ^= u << 7 | u >>> 25
    u = x6 + x5 | 0
    x7 ^= u << 9 | u >>> 23
    u = x7 + x6 | 0
    x4 ^= u << 13 | u >>> 19
    u = x4 + x7 | 0
    x5 ^= u << 18 | u >>> 14

    u = x10 + x9 | 0
    x11 ^= u << 7 | u >>> 25
    u = x11 + x10 | 0
    x8 ^= u << 9 | u >>> 23
    u = x8 + x11 | 0
    x9 ^= u << 13 | u >>> 19
    u = x9 + x8 | 0
    x10 ^= u << 18 | u >>> 14

    u = x15 + x14 | 0
    x12 ^= u << 7 | u >>> 25
    u = x12 + x15 | 0
    x13 ^= u << 9 | u >>> 23
    u = x13 + x12 | 0
    x14 ^= u << 13 | u >>> 19
    u = x14 + x13 | 0
    x15 ^= u << 18 | u >>> 14
  }
   x0 =  x0 +  j0 | 0
   x1 =  x1 +  j1 | 0
   x2 =  x2 +  j2 | 0
   x3 =  x3 +  j3 | 0
   x4 =  x4 +  j4 | 0
   x5 =  x5 +  j5 | 0
   x6 =  x6 +  j6 | 0
   x7 =  x7 +  j7 | 0
   x8 =  x8 +  j8 | 0
   x9 =  x9 +  j9 | 0
  x10 = x10 + j10 | 0
  x11 = x11 + j11 | 0
  x12 = x12 + j12 | 0
  x13 = x13 + j13 | 0
  x14 = x14 + j14 | 0
  x15 = x15 + j15 | 0

  O.setInt32( 0,  x0, true)
  O.setInt32( 4,  x1, true)
  O.setInt32( 8,  x2, true)
  O.setInt32(12,  x3, true)
  O.setInt32(16,  x4, true)
  O.setInt32(20,  x5, true)
  O.setInt32(24,  x6, true)
  O.setInt32(28,  x7, true)
  O.setInt32(32,  x8, true)
  O.setInt32(36,  x9, true)
  O.setInt32(40, x10, true)
  O.setInt32(44, x11, true)
  O.setInt32(48, x12, true)
  O.setInt32(52, x13, true)
  O.setInt32(56, x14, true)
  O.setInt32(60, x15, true)
}

function core_hsalsa20(o: Uint8Array, p: BufferLike, k: BufferLike, c: Uint8Array) {
  const O = new DataView(o.buffer, o.byteOffset, o.byteLength)
  const P = new DataView(p.buffer, p.byteOffset, p.byteLength)
  const K = new DataView(k.buffer, k.byteOffset, k.byteLength)
  const C = new DataView(c.buffer, c.byteOffset, c.byteLength)

  let x0  = C.getInt32( 0, true),
      x1  = K.getInt32( 0, true),
      x2  = K.getInt32( 4, true),
      x3  = K.getInt32( 8, true),
      x4  = K.getInt32(12, true),
      x5  = C.getInt32( 4, true),
      x6  = P.getInt32( 0, true),
      x7  = P.getInt32( 4, true),
      x8  = P.getInt32( 8, true),
      x9  = P.getInt32(12, true),
      x10 = C.getInt32( 8, true),
      x11 = K.getInt32(16, true),
      x12 = K.getInt32(20, true),
      x13 = K.getInt32(24, true),
      x14 = K.getInt32(28, true),
      x15 = C.getInt32(12, true)

  let u: number

  for (let i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0
    x4 ^= u << 7 | u >>> 25
    u = x4 + x0 | 0
    x8 ^= u << 9 | u >>> 23
    u = x8 + x4 | 0
    x12 ^= u << 13 | u >>> 19
    u = x12 + x8 | 0
    x0 ^= u << 18 | u >>> 14

    u = x5 + x1 | 0
    x9 ^= u << 7 | u >>> 25
    u = x9 + x5 | 0
    x13 ^= u << 9 | u >>> 23
    u = x13 + x9 | 0
    x1 ^= u << 13 | u >>> 19
    u = x1 + x13 | 0
    x5 ^= u << 18 | u >>> 14

    u = x10 + x6 | 0
    x14 ^= u << 7 | u >>> 25
    u = x14 + x10 | 0
    x2 ^= u << 9 | u >>> 23
    u = x2 + x14 | 0
    x6 ^= u << 13 | u >>> 19
    u = x6 + x2 | 0
    x10 ^= u << 18 | u >>> 14

    u = x15 + x11 | 0
    x3 ^= u << 7 | u >>> 25
    u = x3 + x15 | 0
    x7 ^= u << 9 | u >>> 23
    u = x7 + x3 | 0
    x11 ^= u << 13 | u >>> 19
    u = x11 + x7 | 0
    x15 ^= u << 18 | u >>> 14

    u = x0 + x3 | 0
    x1 ^= u << 7 | u >>> 25
    u = x1 + x0 | 0
    x2 ^= u << 9 | u >>> 23
    u = x2 + x1 | 0
    x3 ^= u << 13 | u >>> 19
    u = x3 + x2 | 0
    x0 ^= u << 18 | u >>> 14

    u = x5 + x4 | 0
    x6 ^= u << 7 | u >>> 25
    u = x6 + x5 | 0
    x7 ^= u << 9 | u >>> 23
    u = x7 + x6 | 0
    x4 ^= u << 13 | u >>> 19
    u = x4 + x7 | 0
    x5 ^= u << 18 | u >>> 14

    u = x10 + x9 | 0
    x11 ^= u << 7 | u >>> 25
    u = x11 + x10 | 0
    x8 ^= u << 9 | u >>> 23
    u = x8 + x11 | 0
    x9 ^= u << 13 | u >>> 19
    u = x9 + x8 | 0
    x10 ^= u << 18 | u >>> 14

    u = x15 + x14 | 0
    x12 ^= u << 7 | u >>> 25
    u = x12 + x15 | 0
    x13 ^= u << 9 | u >>> 23
    u = x13 + x12 | 0
    x14 ^= u << 13 | u >>> 19
    u = x14 + x13 | 0
    x15 ^= u << 18 | u >>> 14
  }

  O.setInt32( 0,  x0, true)
  O.setInt32( 4,  x5, true)
  O.setInt32( 8, x10, true)
  O.setInt32(12, x15, true)
  O.setInt32(16,  x6, true)
  O.setInt32(20,  x7, true)
  O.setInt32(24,  x8, true)
  O.setInt32(28,  x9, true)
}

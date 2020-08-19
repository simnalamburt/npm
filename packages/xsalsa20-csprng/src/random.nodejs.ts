import crypto from 'crypto'

export default function randomBytes(length: number): Uint8Array {
  return crypto.randomBytes(length)
}

/// <reference lib="dom"/>

export default function randomBytes(length: number): Uint8Array {
  const buf = new Uint8Array(length)
  window.crypto.getRandomValues(buf)
  return buf
}

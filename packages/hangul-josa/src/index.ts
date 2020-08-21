export const 은_는 = Symbol()
export { 은_는 as 은, 은_는 as 는 }

export const 을_를 = Symbol()
export { 을_를 as 을, 을_를 as 를 }

export const 이_가 = Symbol()
export { 이_가 as 이, 이_가 as 가 }

export const 와_과 = Symbol()
export { 와_과 as 와, 와_과 as 과 }

export function josa(tpl: TemplateStringsArray, ...keys: any[]): string {
  let buf = ''

  for (let i = 0; i < keys.length; ++i) {
    buf += tpl[i]

    const key = keys[i]
    if (key == null) {
      continue
    }

    // This code can handle zero-length stringn with NaN propagation
    const haveJong = (buf.charCodeAt(buf.length - 1) - 0xac00) % 28 > 0
    switch (key) {
      case 은_는:
        buf += haveJong ? '은' : '는'
        break
      case 을_를:
        buf += haveJong ? '을' : '를'
        break
      case 이_가:
        buf += haveJong ? '이' : '가'
        break
      case 와_과:
        buf += haveJong ? '과' : '와'
        break
      default:
        // In this position, key's type is "All types except null or undefined",
        // which makes safe to call `key.toString()`.
        buf += key.toString()
    }
  }

  return buf + tpl[keys.length]
}

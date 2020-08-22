export const 은_는 = Symbol()
export { 은_는 as 은, 은_는 as 는 }

export const 을_를 = Symbol()
export { 을_를 as 을, 을_를 as 를 }

export const 이_가 = Symbol()
export { 이_가 as 이, 이_가 as 가 }

export const 와_과 = Symbol()
export { 와_과 as 와, 와_과 as 과 }

/**
 * Tagged template for {@link 은_는} {@link 이_가} handling.
 *
 * ### Example
 * ```javascript
 * const player = '지현'
 * const skill = '구르기'
 *
 * console.log(josa`${player}${는} ${skill}${을} 사용했다!`)
 * // 지현은 구르기를 사용했다!
 * ```
 *
 * @param tpl   String parts of tagged template.
 * @param keys  Expression parts of tagged template. If one of {@link 은_는},
 *              {@link 이_가} and others is given, it'll be replaced into one of
 *              "은", "는", "이", "가", and etc appropriately. If undefined or
 *              null is geven, it'll be ignore. For all the other types, it'll
 *              be replaced with `exp.toString()`.
 * @returns     Result string
 */
export function josa(tpl: TemplateStringsArray, ...keys: unknown[]): string {
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
        buf += String(key)
    }
  }

  return buf + tpl[keys.length]
}

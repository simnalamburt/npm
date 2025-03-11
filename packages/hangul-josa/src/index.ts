// IE11's Symbol support is incomplete, but calling the Symbol constructor and
// comparing symbols is supported.
//
// IE11 does support the `const` keyword, except in for-in and for-of loops.
const 은_는: unique symbol = Symbol()
const 을_를: unique symbol = Symbol()
const 이_가: unique symbol = Symbol()
const 와_과: unique symbol = Symbol()
const 로_으로: unique symbol = Symbol()

/**
 * Tagged template for {@link 은}, {@link 는}, {@link 이}, {@link 가} handling.
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
 * @param keys  Expression parts of tagged template. If one of {@link 은},
 *              {@link 는}, {@link 이}, {@link 가} and others is given, it'll be
 *              replaced into one of "은", "는", "이", "가", and etc
 *              appropriately. If undefined or null is given, it'll be ignore.
 *              For all the other types, it'll be replaced with
 *              `exp.toString()`.
 * @returns     Result string
 */
export function josa(tpl: TemplateStringsArray, ...keys: unknown[]): string {
  let buf = ''

  for (let i = 0; i < keys.length; ++i) {
    buf += tpl[i]

    if (keys[i] == null) {
      continue
    }

    // This code can handle zero-length string with NaN propagation
    const jong = (buf.charCodeAt(buf.length - 1) - 0xac00) % 28
    switch (keys[i]) {
      case 은_는:
        buf += jong > 0 ? '은' : '는'
        break
      case 을_를:
        buf += jong > 0 ? '을' : '를'
        break
      case 이_가:
        buf += jong > 0 ? '이' : '가'
        break
      case 와_과:
        buf += jong > 0 ? '과' : '와'
        break
      case 로_으로:
        buf += jong > 0 && jong != 8 ? '으로' : '로'
        break
      default:
        buf += String(keys[i])
    }
  }

  return buf + tpl[keys.length]
}

export { 은_는 as 은, 은_는 as 는 }
export { 을_를 as 을, 을_를 as 를 }
export { 이_가 as 이, 이_가 as 가 }
export { 와_과 as 와, 와_과 as 과 }
export { 로_으로 as 로, 로_으로 as 으로 }

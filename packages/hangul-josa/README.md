# hangul-josa [![NPM Version]][NPM Link]

은/는, 을/를, 이/가, 와/과, 로/으로 처리를 현대적인 javascript 문법으로 편하게
해보아요.

Let's handle Korean postposition with ease using modern javascript syntax!

```javascript
import { josa, 는, 을 } from "hangul-josa";

const player = "지현";
const skill = "구르기";

console.log(josa`${player}${는} ${skill}${을} 사용했다!`);
// 지현은 구르기를 사용했다!
```

### Features

- Fast and lightweight (Gzipped size &lt; 500B)
- Utilizes modern JS, easy and simple to use
- [Tree-shakeable, side-effect free, and no dependencies][bundlephobia]
- IE11 support

### Prior works

- [josa-js](https://github.com/e-/Josa.js), best implementation so far
- [flyskyne/Josa.js](https://github.com/flyskyne/Josa.js), added 로/으로 support to the josa-js
- [emptydream/JoLib](https://github.com/emptydream/JoLib), it works but too big (5.53KiB)
- [naradesign/hangul.josa.js](https://github.com/naradesign/hangul.josa.js), jQuery Plugin

[NPM Version]: https://badgen.net/npm/v/hangul-josa
[NPM Link]: https://www.npmjs.com/package/hangul-josa
[bundlephobia]: https://bundlephobia.com/result?p=hangul-josa

xsalsa20-csprng [![NPM Version]][NPM Link]
========
CSPRNG and crypto library powered by XSalsa20. Small, supports both browsers and
Node.js, and optimized for CSPRNG usage.

```bash
yarn add xsalsa20-csprng
```

This library is optimized to be used as CSPRNG rather than encrypting large
data. Thus, this library doesn't contain native code or webassembly binding to
reduce FFI overhead.

### Usage
#### [`class XSalsa20CSPRNG`][xsalsa20csprng]
See [reference][xsalsa20csprng] for the further details.

```js
import XSalsa20CSPRNG from 'xsalsa20-csprng'

const rng = new XSalsa20CSPRNG()

// Random 32bit int (-2147483648 ≤ x < 2147483648)
const i = rng.randomInt32()
// Random 32bit unsigned int (0 ≤ x < 4294967296)
const u = rng.randomUint32()
// Random int of desired range
const n = rng.uniformInt(10)

// You can use fixed nonce and key
const deterministic = XSalsa20CSPRNG.of(nonce, key)
// Fixed nonce and key will result in deterministic output
console.log(deterministic.randomInt32())
console.log(deterministic.randomInt32())
console.log(deterministic.randomInt32())
```

#### [`class XSalsa20`][xsalsa20]
See [reference][xsalsa20] for the further details.

```js
import { XSalsa20 } from 'xsalsa20-csprng'

const nonce = new Uint8Array([/* nonce with 24 bytes */])
const key = new Uint8Array([/* key with 32 bytes */])

// Encrypt
const encoder = new XSalsa20(nonce, key)
const plaintext = Uint8Array.from('message')
const ciphertext = encoder.update(plaintext)

// Decrypt : same with encryption
const decoder = new XSalsa20(nonce, key)
const decrypted = decoder.update(ciphertext)
// plaintext and decrypted have same contents

// You can retrieve XSalsa20 streams if you want
const gen = new XSalsa20(nonce, key)
console.log(gen.stream(64))
console.log(gen.stream(64))
```

&nbsp;

--------
*xsalsa20-csprng* is primarily distributed under the terms of both the [Apache
License (Version 2.0)] and the [MIT license]. See [COPYRIGHT] for details.

[NPM Version]: https://badgen.net/npm/v/xsalsa20-csprng
[NPM Link]: https://www.npmjs.com/package/xsalsa20-csprng

[xsalsa20csprng]: https://simnalamburt.github.io/xsalsa20-csprng/classes/xsalsa20csprng.html
[xsalsa20]: https://simnalamburt.github.io/xsalsa20-csprng/classes/xsalsa20.html

[Apache License (Version 2.0)]: LICENSE-APACHE
[MIT license]: LICENSE-MIT
[COPYRIGHT]: COPYRIGHT

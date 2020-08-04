# xsalsa20

XSalsa20 implemented in Javascript and WebAssembly.

```
npm install xsalsa20
```

[![build status](https://travis-ci.org/mafintosh/xsalsa20.svg?branch=master)](https://travis-ci.org/mafintosh/xsalsa20)


## Usage

``` js
var crypto = require('crypto')
var XSalsa20 = require('xsalsa20')
var key = crypto.randomBytes(32)
var nonce = crypto.randomBytes(24)

var xor = new XSalsa20(nonce, key)

console.log(xor.update(new Buffer('hello')))
console.log(xor.update(new Buffer('world')))
```

## API

#### `var xor = new XSalsa20(nonce, key)`

Create a new xor instance.

Nonce should be a 24 byte buffer/uint8array and key should be 32 bytes.

#### `var output = xor.update(input, [output])`

Update the xor instance with a new input buffer. Optionally you can pass in an output buffer.

## License

MIT

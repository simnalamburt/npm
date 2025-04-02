import { defineConfig, type RslibConfig } from '@rslib/core'

const config: RslibConfig = defineConfig({
  lib: [
    {
      format: 'cjs',
      output: {
        filename: {
          js: 'xsalsa20-csprng.js',
        },
      },
    },
    {
      format: 'esm',
      dts: {
        bundle: true,
      },
      output: {
        filename: {
          js: 'xsalsa20-csprng.modern.js',
        },
      },
    },
    {
      format: 'umd',
      umdName: 'xsalsa20Csprng',
      output: {
        filename: {
          js: 'xsalsa20-csprng.umd.js',
        },
      },
    },
  ],
  output: {
    minify: true,
    sourceMap: true,
    cleanDistPath: true,
  },
})

export default config

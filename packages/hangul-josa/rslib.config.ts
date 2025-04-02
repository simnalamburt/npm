import { defineConfig, type RslibConfig } from '@rslib/core'

const config: RslibConfig = defineConfig({
  lib: [
    {
      format: 'cjs',
      output: {
        filename: {
          js: 'hangul-josa.js',
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
          js: 'hangul-josa.modern.js',
        },
      },
    },
    {
      format: 'umd',
      umdName: 'hangulJosa',
      output: {
        filename: {
          js: 'hangul-josa.umd.js',
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

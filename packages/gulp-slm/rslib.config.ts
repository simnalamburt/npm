import { defineConfig, type RslibConfig } from '@rslib/core'

const config: RslibConfig = defineConfig({
  lib: [
    {
      format: 'cjs',
      output: {
        filename: {
          js: 'gulp-slm.js',
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
          js: 'gulp-slm.modern.js',
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

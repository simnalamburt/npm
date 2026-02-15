import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: true,
  format: ['es'],
  outputOptions(options) {
    delete options.dir
    options.file = 'dist/gulp-slm.js'
    return options
  },
})

export default config

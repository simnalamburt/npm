import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: {
    sourcemap: false,
  },
  format: ['es'],
  outputOptions(options) {
    options.entryFileNames = chunk =>
      chunk.name.endsWith('.d') ? 'index.d.ts' : 'gulp-slm.js'
    return options
  },
})

export default config

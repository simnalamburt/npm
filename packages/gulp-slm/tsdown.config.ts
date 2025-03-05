import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: true,
  format: ['cjs', 'es'],
  outputOptions(options, format) {
    switch (format) {
      case 'cjs':
        delete options.dir
        options.file = 'dist/gulp-slm.js'
        break
      case 'es':
        delete options.dir
        options.file = 'dist/gulp-slm.modern.js' // For backward compatibility
        break
    }
    return options
  },
})

export default config

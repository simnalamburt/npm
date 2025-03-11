import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: true,
  format: ['cjs', 'es', 'umd'],
  outputOptions(options, format) {
    switch (format) {
      case 'cjs':
        delete options.dir
        options.file = 'dist/hangul-josa.js'
        break
      case 'es':
        delete options.dir
        options.file = 'dist/hangul-josa.modern.js' // For backward compatibility
        break
      case 'umd':
        delete options.dir
        options.file = 'dist/hangul-josa.umd.js'
        options.name = 'hangulJosa'
        break
    }
    return options
  },
})

export default config

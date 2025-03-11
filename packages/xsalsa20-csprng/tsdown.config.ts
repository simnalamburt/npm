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
        options.file = 'dist/xsalsa20-csprng.js'
        break
      case 'es':
        delete options.dir
        options.file = 'dist/xsalsa20-csprng.modern.js' // For backward compatibility
        break
      case 'umd':
        delete options.dir
        options.file = 'dist/xsalsa20-csprng.umd.js'
        options.name = 'xsalsa20Csprng'
        break
    }
    return options
  },
})

export default config

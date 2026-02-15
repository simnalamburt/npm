import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: {
    sourcemap: false,
  },
  format: ['es', 'umd'],
  outputOptions(options, format) {
    switch (format) {
      case 'es':
        options.entryFileNames = chunk =>
          chunk.name.endsWith('.d') ? 'index.d.ts' : 'hangul-josa.js'
        break
      case 'umd':
        options.entryFileNames = 'hangul-josa.umd.js'
        options.name = 'hangulJosa'
        break
    }
    return options
  },
})

export default config

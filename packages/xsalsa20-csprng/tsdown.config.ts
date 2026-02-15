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
          chunk.name.endsWith('.d') ? 'index.d.ts' : 'xsalsa20-csprng.js'
        break
      case 'umd':
        options.entryFileNames = 'xsalsa20-csprng.umd.js'
        options.name = 'xsalsa20Csprng'
        break
    }
    return options
  },
})

export default config

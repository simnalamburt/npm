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
  outputOptions: {
    name: 'hangulJosa',
  },
})

export default config

import { defineConfig, type UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  minify: true,
  sourcemap: true,
  inlineOnly: ['replace-ext'],
})

export default config

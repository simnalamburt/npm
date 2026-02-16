import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  minify: true,
  sourcemap: true,
  format: ["es", "umd"],
  outputOptions: {
    name: "hangulJosa",
  },
});

export default config;

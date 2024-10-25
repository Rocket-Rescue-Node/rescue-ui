import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  base: "./",
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  plugins: [react(), checker({ typescript: true })],
});

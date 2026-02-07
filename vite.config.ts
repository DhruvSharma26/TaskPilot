import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ Fix for blank page on Vercel (important)
  base: "./",

  // ✅ Optional: Local dev server settings
  server: {
    port: 3000,
    host: "0.0.0.0",
  },

  // ✅ Path alias support (@ → root folder)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

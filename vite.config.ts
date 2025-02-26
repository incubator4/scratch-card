import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import VitePluginCDN from "vite-plugin-cdn-import";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      emitFile: false,
      filename: "stats.html",
      sourcemap: false,
    }),
    VitePluginCDN({
      modules: [
        {
          name: "react-scratchcard-v2",
          var: "ScratchCard",
          path: "dist/index.min.js",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("scratchcard")) {
              return "scratchcard";
            }
          }
          return "vendor";
        },
        experimentalMinChunkSize: 10 * 1024,
      },
    },
  },
});

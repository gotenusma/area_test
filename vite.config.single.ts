import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

/**
 * Single-file build: inlines the script, the stylesheet and every font as data
 * URIs so the whole app is one HTML document that runs with no network at all.
 * Used to publish a shareable preview — `npm run build:single`.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    outDir: 'dist-single',
    // Large enough that the woff2 files become data URIs rather than requests.
    assetsInlineLimit: 20 * 1024 * 1024,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
})

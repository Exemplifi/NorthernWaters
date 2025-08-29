import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js'),
    }
  },
  server: {
    port: 3000,
    hot: true
  },
  build: {
    outDir: 'src/assets/dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/assets/js/main.js')
      },
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js'
      },
    },
    minify: true,
    sourcemap: true,
    // Disable CSS handling since we only want to process JS
    cssCodeSplit: false,
    cssMinify: true
  },
});
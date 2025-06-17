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
    outDir: 'src/assets',
    assetsDir: '',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/main.js')
      },
      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/[name].min.js',
        assetFileNames: (assetInfo) => {
          // Skip favicon, apple-touch-icon and webmanifest files
          if (assetInfo.name.match(/favicon|apple-touch-icon|site\.webmanifest/)) {
            return false; // This will prevent the file from being copied
          }

          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return '[name][extname]';
        },
        manualChunks: {
          vendor: ['jquery', 'bootstrap', '@popperjs/core']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
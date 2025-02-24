import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: 'html',
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].[hash].mjs',
        chunkFileNames: '[name].[hash].mjs',
        assetFileNames: '[name].[hash].[ext]'
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});

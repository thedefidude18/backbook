import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Specify a different port
    open: true, // Automatically open browser
    host: true, // Listen on all local IPs
    strictPort: false, // Try next available port if 3001 is taken
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

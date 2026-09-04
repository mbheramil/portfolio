import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        case: resolve(__dirname, 'case.html'),
        clients: resolve(__dirname, 'clients.html')
      },
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  server: { port: 5173, open: true }
});

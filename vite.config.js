import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
    plugins: [react()]
  },
  build: {
    target: 'esnext',
    worker: {
      format: 'es'
    }
  }
}); 
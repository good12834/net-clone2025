

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/netflix-clone/', // 👈 Add this line
  plugins: [react()],
  server: {
    port: 5178,
    watch: {
      ignored: ['**/.env.local']
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          swiper: ['swiper', 'swiper/react', 'swiper/modules', 'swiper/css', 'swiper/css/navigation'],
          firebase: ['firebase/app', 'firebase/firestore'],
          ui: ['@fortawesome/fontawesome-free', 'bootstrap', 'bootstrap/dist/css/bootstrap.min.css', 'bootstrap/dist/js/bootstrap.bundle.min.js'],
          tmdb: ['./src/services/tmdb.jsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
});
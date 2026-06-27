import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? '/Agenda-para-Gesti-n-de-Visitas/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
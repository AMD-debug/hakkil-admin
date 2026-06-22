import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Permet au flux de connexion Google (signInWithPopup) de communiquer
      // avec la fenêtre popup (sinon avertissement COOP « window.closed »).
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});

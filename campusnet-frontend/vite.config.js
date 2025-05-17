import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Only one import for tailwindcss

export default defineConfig({
  plugins: [react(), tailwindcss()],
});

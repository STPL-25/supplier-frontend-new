
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4000,
    allowedHosts: ["supp.spacetextiles.net","uat.spacetextiles.net"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

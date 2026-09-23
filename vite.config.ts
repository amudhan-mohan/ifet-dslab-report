import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // GitHub Pages: set base to your repository name.
  // When hosted at https://<user>.github.io/ifet-dslab-report/
  // change this to '/ifet-dslab-report/'
  base: '/ifet-dslab-report/',
})

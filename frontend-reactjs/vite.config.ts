import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'build-storybook',
      closeBundle() {
        if (process.env.NODE_ENV === 'production') {
          console.log('Building Storybook...');
          execSync('npm run build-storybook', { stdio: 'inherit' });

          if (existsSync('storybook-static')) {
            execSync('cp -r storybook-static dist/storybook', {
              stdio: 'inherit'
            });
            console.log('Storybook copied to dist/storybook');
          }
        }
      }
    }
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  preview: {
    port: 8080,
    strictPort: true
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:8080'
  }
});

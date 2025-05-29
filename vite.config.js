import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/cocoedit/', // GitHub Pagesに合わせる
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    globals: true,
  },
  // Add this section to exclude private directory
  server: {
    fs: {
      allow: ['..'],
      deny: ['**/private/**']
    }
  }
});
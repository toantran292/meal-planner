import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = '/meal-planner/' để chạy đúng trên GitHub Pages project site
// (https://<user>.github.io/meal-planner/). Dev server dùng '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/meal-planner/' : '/',
  plugins: [react()],
}));

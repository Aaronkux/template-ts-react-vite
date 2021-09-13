import { defineConfig } from 'vite';
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactConfigRouter from './plugin/rollup-plugin-react-config-router';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, '.'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#e1803b',
          'primary-color-hover': '#e79e6a',
          'field-border-color': '#e79e6a',
        },
      },
    },
  },
  plugins: [
    reactConfigRouter({
      routePaths: ['./config/routes.ts', './config/mainRoutes.ts'],
    }),
    reactRefresh(),
  ],
  build: { minify: false },
});

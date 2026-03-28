import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// vite.config.ts is now strictly for build and dev server config only.
// All AI API calls moved into src/services/aiService.ts for separation of concerns.

export default defineConfig(({ mode }) => {
  // Load env variables into process.env (works in Node context for Vite)
  const processObj = (globalThis as any).process || { env: {}, cwd: () => '' };
  const cwd = processObj.cwd ? processObj.cwd() : '';
  Object.assign(processObj.env, loadEnv(mode, cwd, ''));
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});

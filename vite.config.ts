import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isElectron = process.env.ELECTRON === 'true';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.ELECTRON': JSON.stringify(isElectron)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // NEW CODE START
      /**
       * Electron-specific build optimizations
       * Ensures proper asset loading and security for desktop app
       */
      base: isElectron ? './' : '/',
      build: isElectron ? {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html')
          }
        },
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      } : {},
      optimizeDeps: {
        exclude: ['electron']
      },
      // Ensure proper handling of file:// protocol in Electron
      publicDir: 'public',
      assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico']
      // NEW CODE END
    };
});

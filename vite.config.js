import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Preserve cookies through the proxy
        cookieDomainRewrite: {
          '*': '' // Remove domain from all cookies so browser sets them for localhost:5173
        }
      }
    }
  },

  // Production build optimization
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for faster minification
    target: 'es2015', // Support modern browsers

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React and dependencies
          'react-vendor': ['react', 'react-dom'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Optimize chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500
  },

  // Preview server configuration (for testing production build locally)
  preview: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Preserve cookies through the proxy
        cookieDomainRewrite: {
          '*': '' // Remove domain from all cookies so browser sets them for localhost:5173
        }
      }
    }
  }
})

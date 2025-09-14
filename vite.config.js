export default {
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',  // Local development only
    },
  },
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'https://geoaurora-backend-432163986190.asia-south1.run.app'),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
};

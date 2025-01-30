import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mohsen007/react-goftino': '@mohsen007/react-goftino/dist',
    },
  },
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist/server',
  },
  ssr: {
    noExternal: ["@uiw/react-codemirror", "@uiw/codemirror-extensions-basic-setup"],
    external: ["@mohsen007/react-goftino"],
  },
  define: {
    "process.env.SSR": "true",  // Define an SSR environment variable
  }
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mohsen007/react-goftino': '@mohsen007/react-goftino/dist', // Adjust the path as needed
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Optimize Three.js and R3F bundle — prevents vite from pre-bundling large deps individually
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
});

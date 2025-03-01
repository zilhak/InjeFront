import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, './src'),
      '@style' : path.resolve(__dirname, './static/style'),
      '@component' : path.resolve(__dirname, './src/components'),
    }
  }
})

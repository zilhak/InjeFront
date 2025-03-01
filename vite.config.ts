import { defineConfig } from 'vite'
import path from 'path'
import { babel } from '@rollup/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
    })
  ],
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, './src'),
      '@style' : path.resolve(__dirname, './static/style'),
      '@component' : path.resolve(__dirname, './src/components'),
    }
  }
})

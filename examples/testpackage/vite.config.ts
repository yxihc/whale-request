import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import progress from 'vite-plugin-progress'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    progress(),
    vue(),
    visualizer({
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
    }),
  ],
})

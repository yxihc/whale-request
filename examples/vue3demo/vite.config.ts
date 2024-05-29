import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://lspm.ningdatech.com', // 目标服务器地址
        changeOrigin: true, // 是否改变请求源头
        rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写
      },
      '/pm': {
        // 后台地址
        target: 'http://120.26.44.207:38888',
        changeOrigin: true,
      },
    },
  },
})

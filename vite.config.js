import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173, // 前端端口
    proxy: {
      // ✅✅✅ 关键配置：配置代理
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 关键：把 /api 去掉，变成 /upload 发给后端
      }
    }
  }
})
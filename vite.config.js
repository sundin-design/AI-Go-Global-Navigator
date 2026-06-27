import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      // 百度语音识别 WebSocket 代理
      '/baidu-ws': {
        target: 'wss://vop.baidu.com',
        changeOrigin: true,
        ws: true, // 启用WebSocket代理
        rewrite: (path) => path.replace(/^\/baidu-ws/, '')
      }
    }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/main/vue', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },
  server: {
    host: '0.0.0.0', // 讓外部設備（如 Windows host）可以訪問
    port: 3000,
    open: true,
    watch: {
      usePolling: true, // 解決 WSL 文件監聽問題
      interval: 100
    }
  }
})
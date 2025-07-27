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
  build: {
    // 確保生產環境也能正確處理 SPA 路由
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vuex'],
          vuetify: ['vuetify']
        }
      }
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
    open: false,
    watch: {
      usePolling: true, // 解決 WSL 文件監聽問題
      interval: 100
    },
    // 配置 history API fallback 支援 SPA 路由
    // Vite 開發服務器預設就支援 SPA fallback，無需額外配置
  }
})
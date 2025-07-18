/**
 * Vitest 測試框架配置
 * @description 配置 Vitest 測試環境，包含 Vue 組件測試支援
 */

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 使用全域 API (describe, it, expect 等)
    globals: true,
    
    // 使用 jsdom 模擬瀏覽器環境
    environment: 'jsdom',
    
    // 測試設定檔案
    setupFiles: ['./src/test/setup.js'],
    
    // 覆蓋率設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'src/mocks/',
        '**/*.config.js',
        '**/*.config.ts',
        'coverage/',
        'dist/'
      ]
    },
    
    // 測試檔案匹配模式
    include: [
      'src/**/*.{test,spec}.{js,ts,vue}',
      'tests/**/*.{test,spec}.{js,ts,vue}'
    ],
    
    // 排除檔案
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      'src/mocks/'
    ]
  },
  
  // 路徑別名設定 (與 Vite 配置保持一致)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // 處理 CSS 和其他資源檔案的匯入
  css: {
    modules: {
      classNameStrategy: 'non-scoped'
    }
  }
})
/**
 * 測試環境設定檔
 * @description 配置測試環境，包含 MSW 和全域設定
 */

import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from '../mocks/server.js'
import { config } from '@vue/test-utils'

// 設定 MSW 伺服器
beforeAll(() => {
  // 啟動 MSW 伺服器
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  // 每個測試後重置 handlers
  server.resetHandlers()
})

afterAll(() => {
  // 關閉 MSW 伺服器
  server.close()
})

// 全域 mocks
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// 模擬 localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

// 模擬 sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

// 模擬 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock CSS imports (處理 Vuetify CSS 匯入問題)
vi.mock('vuetify/lib/styles/main.sass', () => ({}))
vi.mock('vuetify/styles', () => ({}))

// Vue Test Utils 全域配置
config.global.stubs = {
  'router-link': true,
  'router-view': true,
  'v-app': true,
  'v-main': true,
  'v-container': true,
  'v-row': true,
  'v-col': true,
  'v-card': true,
  'v-btn': true,
  'v-text-field': true,
  'v-form': true,
}

// 設定測試環境變數
process.env.NODE_ENV = 'test'
/**
 * MSW Browser 設定
 * @description Mock Service Worker 瀏覽器配置，用於開發環境
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

// 建立 MSW Worker 實例
export const worker = setupWorker(...handlers)
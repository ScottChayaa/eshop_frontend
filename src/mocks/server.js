/**
 * MSW Server 設定
 * @description Mock Service Worker 伺服器配置，用於 Node.js 環境 (測試)
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers.js'

// 建立 MSW 伺服器實例
export const server = setupServer(...handlers)
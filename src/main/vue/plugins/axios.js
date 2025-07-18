/**
 * Axios 插件配置
 * @description HTTP 客戶端配置，包含攔截器、錯誤處理、請求重試等功能
 */

import axios from 'axios'
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES, STORAGE_KEYS } from '../utils/constants.js'

// ===== 全域變數 =====
let store = null
let router = null
const pendingRequests = new Map()

// ===== 主要 API 實例 =====
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ===== 工具函數 =====
/**
 * 生成請求唯一鍵值
 * @param {Object} config - Axios 配置
 * @returns {string} 請求鍵值
 */
const generateRequestKey = (config) => {
  return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}`
}

/**
 * 從 localStorage 取得 Token
 * @returns {string|null} JWT Token
 */
const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * 清除認證資料
 */
const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

/**
 * 顯示錯誤通知
 * @param {string} message - 錯誤訊息
 */
const showErrorNotification = (message) => {
  if (store && store.dispatch) {
    store.dispatch('notification/showError', message)
  } else {
    console.error('Error:', message)
  }
}

/**
 * 請求重試機制
 * @param {Object} error - Axios 錯誤
 * @returns {Promise} 重試的 Promise
 */
const retryRequest = (error) => {
  const config = error.config
  if (!config || !config.retry) {
    return Promise.reject(error)
  }

  config.retryCount = config.retryCount || 0
  if (config.retryCount >= config.retry) {
    return Promise.reject(error)
  }

  config.retryCount += 1
  const delay = Math.pow(2, config.retryCount) * 1000 // 指數退避

  return new Promise((resolve) => {
    setTimeout(() => resolve(api(config)), delay)
  })
}

// ===== Request 攔截器 =====
// 1. 添加認證 Token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 2. 防重複請求
api.interceptors.request.use(
  (config) => {
    // 跳過防重複檢查的請求
    if (config.skipDuplicateCheck) {
      return config
    }

    const requestKey = generateRequestKey(config)
    
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey)
      controller.abort()
    }

    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)

    return config
  },
  (error) => Promise.reject(error)
)

// 3. 添加請求時間戳和載入狀態
api.interceptors.request.use(
  (config) => {
    // 添加時間戳記用於效能監控
    config.metadata = { 
      startTime: new Date(),
      requestId: Math.random().toString(36).substr(2, 9)
    }

    // 顯示載入狀態 (如果有 store 的話)
    if (store && store.commit && !config.skipLoading) {
      store.commit('ui/setLoading', true)
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response 攔截器 =====
api.interceptors.response.use(
  (response) => {
    // 移除載入狀態
    if (store && store.commit) {
      store.commit('ui/setLoading', false)
    }

    // 清除防重複請求記錄
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)

    // 效能監控 (開發環境)
    if (import.meta.env.MODE === 'development' && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime
      console.log(`✅ API Request: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`)
      
      if (duration > 3000) {
        console.warn(`⚠️ Slow API Request: ${response.config.url} took ${duration}ms`)
      }
    }

    return response
  },
  async (error) => {
    // 移除載入狀態
    if (store && store.commit) {
      store.commit('ui/setLoading', false)
    }

    // 清除防重複請求記錄
    if (error.config) {
      const requestKey = generateRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }

    // 處理不同類型的錯誤
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // Token 過期或無效
          clearAuthData()
          if (router && router.push) {
            router.push('/user/login')
          }
          showErrorNotification('登入已過期，請重新登入')
          return Promise.reject(new Error('UNAUTHORIZED'))

        case HTTP_STATUS.FORBIDDEN:
          // 權限不足
          showErrorNotification('權限不足，無法執行此操作')
          if (router && router.push) {
            router.push('/403')
          }
          return Promise.reject(new Error('FORBIDDEN'))

        case HTTP_STATUS.NOT_FOUND:
          // 資源不存在
          showErrorNotification(data?.message || '請求的資源不存在')
          return Promise.reject(new Error('NOT_FOUND'))

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          // 伺服器錯誤 - 嘗試重試
          if (error.config.retry !== false) {
            error.config.retry = error.config.retry || API_CONFIG.RETRY_ATTEMPTS
            return retryRequest(error)
          }
          showErrorNotification(ERROR_MESSAGES.SERVER_ERROR)
          return Promise.reject(new Error('SERVER_ERROR'))

        default:
          // 其他 HTTP 錯誤
          const message = data?.message || `請求失敗 (${status})`
          showErrorNotification(message)
          return Promise.reject(error)
      }
    } else if (error.request) {
      // 網路錯誤
      if (error.code === 'ECONNABORTED') {
        showErrorNotification('請求超時，請稍後再試')
      } else {
        showErrorNotification(ERROR_MESSAGES.NETWORK_ERROR)
      }
      return Promise.reject(new Error('NETWORK_ERROR'))
    } else {
      // 其他錯誤
      showErrorNotification('發生未知錯誤')
      return Promise.reject(error)
    }
  }
)

// ===== 特殊用途 API 實例 =====

/**
 * 檔案上傳專用 API
 */
export const uploadApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 60000, // 檔案上傳需要更長時間
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// 為檔案上傳 API 添加認證攔截器
uploadApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 下載檔案專用 API
 */
export const downloadApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  responseType: 'blob',
})

// ===== 插件安裝函數 =====
/**
 * 安裝 Axios 插件
 * @param {Object} app - Vue 應用實例
 * @param {Object} options - 配置選項
 * @param {Object} options.store - Vuex Store
 * @param {Object} options.router - Vue Router
 */
export const installAxios = (app, options = {}) => {
  // 設定全域變數
  store = options.store
  router = options.router

  // 將 API 實例注入到 Vue 應用
  app.config.globalProperties.$api = api
  app.config.globalProperties.$uploadApi = uploadApi
  app.config.globalProperties.$downloadApi = downloadApi
  
  // 提供 inject key (Composition API 使用)
  app.provide('$api', api)
  app.provide('$uploadApi', uploadApi)
  app.provide('$downloadApi', downloadApi)
}

// ===== API 輔助函數 =====

/**
 * GET 請求封裝
 * @param {string} url - 請求 URL
 * @param {Object} params - 查詢參數
 * @param {Object} config - 額外配置
 * @returns {Promise} API 響應
 */
export const get = (url, params = {}, config = {}) => {
  return api.get(url, { params, ...config })
}

/**
 * POST 請求封裝
 * @param {string} url - 請求 URL
 * @param {Object} data - 請求資料
 * @param {Object} config - 額外配置
 * @returns {Promise} API 響應
 */
export const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config)
}

/**
 * PUT 請求封裝
 * @param {string} url - 請求 URL
 * @param {Object} data - 請求資料
 * @param {Object} config - 額外配置
 * @returns {Promise} API 響應
 */
export const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config)
}

/**
 * DELETE 請求封裝
 * @param {string} url - 請求 URL
 * @param {Object} config - 額外配置
 * @returns {Promise} API 響應
 */
export const del = (url, config = {}) => {
  return api.delete(url, config)
}

/**
 * 檔案上傳
 * @param {string} url - 上傳 URL
 * @param {File|FormData} file - 檔案或 FormData
 * @param {Function} onProgress - 進度回調
 * @returns {Promise} 上傳響應
 */
export const uploadFile = (url, file, onProgress = null) => {
  const formData = file instanceof FormData ? file : new FormData()
  if (!(file instanceof FormData)) {
    formData.append('file', file)
  }

  const config = {
    skipLoading: true, // 檔案上傳有自己的進度顯示
  }

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(progress)
    }
  }

  return uploadApi.post(url, formData, config)
}

/**
 * 檔案下載
 * @param {string} url - 下載 URL
 * @param {string} filename - 檔案名稱
 * @returns {Promise} 下載 Promise
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await downloadApi.get(url)
    
    // 建立下載連結
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    
    return response
  } catch (error) {
    showErrorNotification('檔案下載失敗')
    throw error
  }
}

// 預設匯出主要 API 實例
export default api

// ===== 使用範例 =====
/*
// 在 main.js 中安裝插件:
import { installAxios } from '@/plugins/axios'
app.use(installAxios, { store, router })

// 在 Composition API 中使用:
import { inject } from 'vue'
const api = inject('$api')
const response = await api.get('/products')

// 或直接匯入使用:
import { get, post, uploadFile } from '@/plugins/axios'
const products = await get('/products')
const result = await post('/products', { name: 'New Product' })
await uploadFile('/upload', file, (progress) => console.log(`${progress}%`))

// 帶重試的請求:
const response = await get('/products', {}, { retry: 3 })

// 跳過載入狀態的請求:
const response = await get('/products', {}, { skipLoading: true })
*/
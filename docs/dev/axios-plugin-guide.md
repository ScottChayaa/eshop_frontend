# Axios 插件配置指南

> **文件版本**: 1.0  
> **最後更新**: 2025-07-17  
> **適用範圍**: eshop_frontend Vue3 專案

本文檔說明 `src/main/vue/plugins/axios.js` 中各種實際應用情況的配置範例。

## 📋 **插件配置範例說明**

### 🟢 **基本配置類**

#### 1. **API 基本 URL 設定**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
```
**使用時機**: 專案初始化時必須設定，統一管理 API 端點

#### 2. **JWT Token 自動添加**
```javascript
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
```
**使用時機**: 實作使用者認證系統時必備

#### 3. **載入狀態指示器**
```javascript
api.interceptors.request.use(
  config => {
    const store = useStore()
    store.commit('setLoading', true)
    config.metadata = { startTime: new Date() }
    return config
  },
  error => Promise.reject(error)
)
```
**使用時機**: 優化使用者體驗，顯示 loading 狀態

### 🟡 **進階功能類**

#### 4. **防止重複請求**
```javascript
const pendingRequests = new Map()
api.interceptors.request.use(
  config => {
    const requestKey = `${config.method}_${config.url}`
    
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey)
      controller.abort()
    }
    
    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)
    
    return config
  },
  error => Promise.reject(error)
)
```
**使用時機**: 防止使用者快速點擊造成重複 API 調用

#### 5. **統一錯誤處理**
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    // 5a: Token 過期處理
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      store.dispatch('auth/logout')
      router.push('/user/login')
      return Promise.reject(new Error('登入已過期，請重新登入'))
    }
    
    // 5b: 權限不足
    if (error.response?.status === 403) {
      router.push('/403')
      return Promise.reject(new Error('權限不足'))
    }
    
    // 5c: 伺服器錯誤
    if (error.response?.status >= 500) {
      store.dispatch('notification/showError', '伺服器錯誤，請稍後再試')
      return Promise.reject(new Error('伺服器錯誤'))
    }
    
    // 5d: 網路連線問題
    if (error.code === 'NETWORK_ERROR') {
      store.dispatch('notification/showError', '網路連線失敗')
      return Promise.reject(new Error('網路連線失敗'))
    }
    
    return Promise.reject(error)
  }
)
```
**使用時機**: 統一處理各種 HTTP 錯誤狀態碼

#### 6. **檔案上傳配置**
```javascript
export const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000, // 檔案上傳需要更長時間
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```
**使用時機**: 實作圖片上傳、檔案上傳功能

#### 7. **外部 API 調用**
```javascript
export const externalApi = axios.create({
  baseURL: 'https://api.external-service.com',
  timeout: 5000,
  headers: {
    'X-API-Key': import.meta.env.VITE_EXTERNAL_API_KEY
  }
})
```
**使用時機**: 整合第三方服務 (物流查詢、金流、地圖等)

### 🔴 **開發輔助類**

#### 8. **開發環境 Mock 數據**
```javascript
if (import.meta.env.MODE === 'development') {
  api.interceptors.response.use(
    response => {
      // 模擬網路延遲
      return new Promise(resolve => {
        setTimeout(() => resolve(response), 500)
      })
    },
    error => Promise.reject(error)
  )
}
```
**使用時機**: 開發階段測試載入狀態和使用者體驗

#### 9. **請求重試機制**
```javascript
const retryRequest = (error) => {
  const config = error.config
  if (!config || !config.retry) return Promise.reject(error)
  
  config.retryCount = config.retryCount || 0
  if (config.retryCount >= config.retry) {
    return Promise.reject(error)
  }
  
  config.retryCount += 1
  return new Promise(resolve => {
    setTimeout(() => resolve(api(config)), 1000)
  })
}
```
**使用時機**: 處理網路不穩定或伺服器暫時無回應的情況

#### 10. **請求/響應日誌**
```javascript
if (import.meta.env.MODE === 'development') {
  api.interceptors.request.use(
    config => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      console.log('📤 Request Data:', config.data)
      return config
    },
    error => Promise.reject(error)
  )
  
  api.interceptors.response.use(
    response => {
      const duration = new Date() - response.config.metadata?.startTime
      console.log(`✅ API Response: ${response.status} (${duration}ms)`)
      console.log('📥 Response Data:', response.data)
      return response
    },
    error => {
      console.log(`❌ API Error: ${error.response?.status}`)
      console.log('💥 Error Data:', error.response?.data)
      return Promise.reject(error)
    }
  )
}
```
**使用時機**: 開發階段除錯和 API 調用分析

## 🎯 **電商網站實際應用時機**

### 📱 **使用者功能**
- **登入系統** → JWT Token 處理 (情況2)
- **商品瀏覽** → 防重複請求 (情況4) + 載入狀態 (情況3)
- **搜尋功能** → 防重複請求 (情況4) + 請求重試 (情況9)
- **購物車** → 統一錯誤處理 (情況5) + Token 驗證 (情況2)

### 🛒 **電商功能**
- **商品圖片上傳** → 檔案上傳配置 (情況6)
- **訂單查詢** → 權限驗證 (情況5b) + 錯誤處理 (情況5)
- **物流查詢** → 外部 API 調用 (情況7)
- **金流處理** → 外部 API 調用 (情況7) + 請求重試 (情況9)

### 🛠️ **開發階段**
- **API 調試** → 請求日誌 (情況10)
- **效能測試** → Mock 延遲 (情況8)
- **錯誤測試** → 統一錯誤處理 (情況5)
- **網路測試** → 請求重試 (情況9)

## 📝 **實際使用範例**

### 基本 API 調用
```javascript
import api from '@/plugins/axios'

// 獲取商品列表
const response = await api.get('/products')

// 建立新訂單
const orderData = { products: [...], total: 1000 }
const response = await api.post('/orders', orderData)
```

### 帶重試的 API 調用
```javascript
import api from '@/plugins/axios'

// 重要的 API 調用，失敗時重試 3 次
const response = await api.get('/products', { retry: 3 })
```

### 檔案上傳
```javascript
import { uploadApi } from '@/plugins/axios'

const formData = new FormData()
formData.append('file', file)
formData.append('productId', '123')

const response = await uploadApi.post('/upload', formData)
```

### 外部服務調用
```javascript
import { externalApi } from '@/plugins/axios'

// 查詢物流狀態
const trackingResponse = await externalApi.get(`/tracking/${trackingNumber}`)

// 地址驗證
const addressResponse = await externalApi.post('/address/validate', addressData)
```

## 🚨 **注意事項**

### ⚠️ **開發階段**
- 目前 `plugins/axios.js` 檔案包含完整範例，實際使用時需要根據專案需求選擇適合的配置
- 不要一次啟用所有攔截器，可能會造成衝突或效能問題

### ⚠️ **生產環境**
- 確保移除開發階段的 Mock 延遲和詳細日誌
- API Key 和敏感資訊必須使用環境變數管理
- 錯誤處理要考慮使用者體驗，避免暴露技術細節

### ⚠️ **效能考量**
- 請求重試機制要設定合理的重試次數和間隔
- 防重複請求要正確清理 Map 中的記錄
- 檔案上傳要設定適當的 timeout 值

## 📚 **相關文檔**

- [Vue3 專案結構指南](../dev/project-structure.md)
- [API 服務層設計](../api/service-layer.md)
- [錯誤處理規範](../dev/error-handling.md)
- [環境變數配置](../dev/environment-config.md)

---

**最後更新**: 2025-07-17  
**維護者**: Claude Code  
**專案**: eshop_frontend
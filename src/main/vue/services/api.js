import axios from 'axios'

// 創建 axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器
api.interceptors.request.use(
  config => {
    // 在發送請求之前做些什麼
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 對請求錯誤做些什麼
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  response => {
    // 對響應數據做點什麼
    return response.data
  },
  error => {
    // 對響應錯誤做點什麼
    if (error.response?.status === 401) {
      // 記錄 401 錯誤但不立即重定向，讓 Vue 應用處理
      console.warn('🔴 API 401 Unauthorized:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        hasToken: !!localStorage.getItem('auth_token')
      })
      
      // 清除本地存儲
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      
      // 通知 store 更新認證狀態
      if (window.__VUE_STORE__) {
        window.__VUE_STORE__.dispatch('auth/logout')
      }
      
      // 不立即重定向，讓 Vue 路由守衛或組件處理
    }
    return Promise.reject(error)
  }
)

// API 方法
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh')
}

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } })
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCart: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart')
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.put('/user/password', passwordData),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (addressData) => api.post('/user/addresses', addressData),
  updateAddress: (id, addressData) => api.put(`/user/addresses/${id}`, addressData),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`)
}

export default api
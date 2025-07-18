/**
 * 專案常數定義
 * @description 統一管理專案中使用的常數值
 */

// API 相關配置
export const API_CONFIG = {
  BASE_URL: process.env.VUE_APP_API_URL || 'http://localhost:8080',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
}

// 專案色彩主題
export const COLORS = {
  PRIMARY: '#FAE6B1',    // 淺黃
  SECONDARY: '#FFA101',  // 橘黃
  ACCENT: '#B3DEE5',     // 淺藍
  DARK: '#31525B',       // 深藍灰
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3'
}

// 路由路徑常數
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product',
  CATEGORIES: '/categories',
  CATEGORY: '/category',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  PROFILE: '/user/profile',
  ORDERS: '/user/orders',
  NOTIFICATIONS: '/user/notifications',
  SEARCH: '/search',
  PROMOTIONS: '/promotions',
  NOT_FOUND: '/404'
}

// 本地儲存鍵值
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_info',
  CART: 'shopping_cart',
  PREFERENCES: 'user_preferences',
  THEME: 'theme_mode'
}

// 商品相關常數
export const PRODUCT = {
  MAX_IMAGES: 10,
  MIN_PRICE: 0,
  MAX_PRICE: 999999,
  DEFAULT_PAGE_SIZE: 12,
  CATEGORIES: {
    ELECTRONICS: 'electronics',
    CLOTHING: 'clothing',
    BOOKS: 'books',
    HOME: 'home',
    SPORTS: 'sports'
  }
}

// 購物車相關常數
export const CART = {
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30分鐘
}

// 表單驗證規則
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PHONE_REGEX: /^09\d{8}$/
}

// 系統配置
export const SYSTEM = {
  DEFAULT_LOCALE: 'zh-TW',
  SUPPORTED_LOCALES: ['zh-TW', 'en-US'],
  PAGE_SIZES: [12, 24, 48],
  DEBOUNCE_DELAY: 300,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
}

// HTTP 狀態碼
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網路連線錯誤，請檢查網路狀態',
  LOGIN_REQUIRED: '請先登入會員',
  PERMISSION_DENIED: '權限不足',
  VALIDATION_FAILED: '資料驗證失敗',
  SERVER_ERROR: '伺服器錯誤，請稍後再試'
}
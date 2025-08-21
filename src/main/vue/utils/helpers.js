/**
 * 工具函數集合
 */

// 價格格式化
export const formatPrice = (price) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

// 數字千分位格式化
export const formatNumber = (number) => {
  return new Intl.NumberFormat('zh-TW').format(number)
}

// 日期格式化
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return new Intl.DateTimeFormat('zh-TW', { ...defaultOptions, ...options }).format(new Date(date))
}

// 時間格式化
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 生成隨機 ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 深拷貝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// 防抖函數
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 節流函數
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 驗證郵箱格式
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 驗證手機號碼格式（台灣）
export const validatePhone = (phone) => {
  const re = /^09\d{8}$/
  return re.test(phone)
}

// 驗證身分證字號格式（台灣）
export const validateIdCard = (id) => {
  const re = /^[A-Z][12]\d{8}$/
  return re.test(id)
}

// 計算折扣百分比
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// 生成星級評分顯示
export const generateStarRating = (rating, maxStars = 5) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    rating: rating.toFixed(1)
  }
}

// 圖片載入錯誤處理
export const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

// 滾動到頂部
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 檢查是否為行動裝置
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 取得瀏覽器資訊
export const getBrowserInfo = () => {
  const ua = navigator.userAgent
  let browserName = 'Unknown'
  
  if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari'
  } else if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
  } else if (ua.indexOf('Edge') > -1) {
    browserName = 'Edge'
  }
  
  return {
    name: browserName,
    userAgent: ua,
    isMobile: isMobile()
  }
}

// 本地存儲封裝
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('localStorage get error:', error)
      return defaultValue
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}
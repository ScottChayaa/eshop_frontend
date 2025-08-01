const state = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  filters: {
    category: null,
    priceRange: [0, 100000],
    sortBy: 'newest'
  }
}

const getters = {
  products: state => state.products,
  categories: state => state.categories,
  currentProduct: state => state.currentProduct,
  loading: state => state.loading,
  filters: state => state.filters,
  
  // 所有商品的別名，用於保持向下相容
  allProducts: state => state.products,
  
  // 促銷商品相關 getters
  promotionProducts: state => {
    return state.products.filter(product => 
      product.originalPrice && product.originalPrice > product.price
    )
  },
  
  // 新品商品
  newProducts: state => {
    return state.products.filter(product => 
      product.tags && product.tags.includes('新品')
    )
  },
  
  // 熱賣商品
  hotProducts: state => {
    return state.products.filter(product => 
      product.tags && product.tags.includes('熱賣')
    )
  },
  
  // 限時優惠商品 (折扣超過 10%)
  limitedTimeProducts: state => {
    return state.products.filter(product => {
      if (!product.originalPrice || product.originalPrice <= product.price) return false
      const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100
      return discountPercent > 10
    })
  },
  
  // 計算商品折扣百分比
  getDiscountPercent: state => (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  },
  
  // 計算節省金額
  getSavingsAmount: state => (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0
    return product.originalPrice - product.price
  },
  
  filteredProducts: state => {
    let filtered = [...state.products]
    
    // 按分類篩選
    if (state.filters.category) {
      filtered = filtered.filter(product => product.categoryId === state.filters.category)
    }
    
    // 按價格範圍篩選
    filtered = filtered.filter(product => 
      product.price >= state.filters.priceRange[0] && 
      product.price <= state.filters.priceRange[1]
    )
    
    // 排序
    switch (state.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'discount':
        // 按折扣幅度排序
        filtered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
          return discountB - discountA
        })
        break
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id)
        break
    }
    
    return filtered
  }
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_FILTER(state, { key, value }) {
    state.filters[key] = value
  },
  
  RESET_FILTERS(state) {
    state.filters = {
      category: null,
      priceRange: [0, 100000],
      sortBy: 'newest'
    }
  }
}

const actions = {
  // 新增 fetchProducts 別名保持相容性
  async fetchProducts({ commit }, params = {}) {
    return this.dispatch('products/loadProducts', params)
  },
  
  // 新增 fetchCategories 別名保持相容性
  async fetchCategories({ commit }) {
    return this.dispatch('products/loadCategories')
  },

  async loadProducts({ commit }, params = {}) {
    commit('SET_LOADING', true)
    
    try {
      // 導入 ProductService
      const { default: productService } = await import('../../services/product.js')
      
      // 調用真實的 API
      const response = await productService.getProducts(params)
      commit('SET_PRODUCTS', response.data)
      
      // 如果沒有資料，使用 Mock 資料作為後備
      if (!response.data || response.data.length === 0) {
        // Mock 商品資料 - 支援多圖片與規格變體
        const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          price: 36900,
          originalPrice: 39900,
          image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15',
          images: [
            { url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15+正面', alt: 'iPhone 15 Pro 正面' },
            { url: 'https://via.placeholder.com/400x400/31525B/FFFFFF?text=iPhone+15+背面', alt: 'iPhone 15 Pro 背面' },
            { url: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=iPhone+15+側面', alt: 'iPhone 15 Pro 側面' },
            { url: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=iPhone+15+細節', alt: 'iPhone 15 Pro 細節' }
          ],
          rating: 4.5,
          reviews: 128,
          categoryId: 2,
          description: '全新 iPhone 15 Pro，搭載 A17 Pro 晶片，提供卓越的性能和攝影體驗。配備專業級攝影系統，支援 4K ProRes 錄影，是創作者的理想選擇。',
          features: [
            '搭載 A17 Pro 晶片，性能提升 20%',
            '專業級三鏡頭攝影系統',
            '支援 4K ProRes 錄影',
            '鈦金屬機身，更輕更強',
            '支援 MagSafe 無線充電'
          ],
          specifications: {
            '螢幕尺寸': '6.1 吋 Super Retina XDR',
            '處理器': 'A17 Pro 晶片',
            '儲存容量': '128GB / 256GB / 512GB / 1TB',
            '攝影系統': '4800 萬像素主鏡頭',
            '電池續航': '最長 23 小時影片播放',
            '防水等級': 'IP68',
            '重量': '187 公克'
          },
          variants: [
            {
              id: 101,
              specs: { color: '自然鈦金屬', storage: '128GB' },
              price: 36900,
              originalPrice: 39900,
              stock: 15,
              sku: 'IPH15P-NT-128'
            },
            {
              id: 102,
              specs: { color: '自然鈦金屬', storage: '256GB' },
              price: 40900,
              originalPrice: 43900,
              stock: 12,
              sku: 'IPH15P-NT-256'
            },
            {
              id: 103,
              specs: { color: '藍色鈦金屬', storage: '128GB' },
              price: 36900,
              originalPrice: 39900,
              stock: 8,
              sku: 'IPH15P-BT-128'
            },
            {
              id: 104,
              specs: { color: '白色鈦金屬', storage: '128GB' },
              price: 36900,
              originalPrice: 39900,
              stock: 20,
              sku: 'IPH15P-WT-128'
            }
          ],
          stock: 55,
          contentImages: [
            { url: 'https://via.placeholder.com/800x600/FFA101/FFFFFF?text=iPhone+功能介紹', alt: '功能介紹' },
            { url: 'https://via.placeholder.com/800x600/B3DEE5/31525B?text=攝影能力展示', alt: '攝影能力' }
          ]
        },
        {
          id: 2,
          name: 'MacBook Pro 14"',
          price: 59900,
          originalPrice: 65900,
          image: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=MacBook',
          images: [
            { url: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=MacBook+正面', alt: 'MacBook Pro 正面' },
            { url: 'https://via.placeholder.com/400x400/31525B/FFFFFF?text=MacBook+側面', alt: 'MacBook Pro 側面' },
            { url: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=MacBook+開啟', alt: 'MacBook Pro 開啟狀態' }
          ],
          rating: 4.8,
          reviews: 95,
          categoryId: 2,
          description: '搭載 M3 晶片的 MacBook Pro，為專業工作者提供強大的效能。配備 Liquid Retina XDR 顯示器，支援 P3 廣色域和 1000 尼特持續亮度。',
          features: [
            '搭載 M3 晶片，CPU 效能提升 35%',
            'Liquid Retina XDR 顯示器',
            '最長 18 小時電池續航力',
            '6 揚聲器音響系統',
            '3 個 Thunderbolt 4 連接埠'
          ],
          specifications: {
            '螢幕尺寸': '14.2 吋 Liquid Retina XDR',
            '處理器': 'Apple M3 晶片',
            '記憶體': '8GB / 18GB / 36GB 統一記憶體',
            '儲存容量': '512GB / 1TB / 2TB / 4TB SSD',
            '顯示器': '3024 x 1964 像素',
            '重量': '1.55 公斤',
            '電池續航': '最長 18 小時'
          },
          variants: [
            {
              id: 201,
              specs: { color: '太空灰色', memory: '8GB', storage: '512GB' },
              price: 59900,
              originalPrice: 65900,
              stock: 10,
              sku: 'MBP14-SG-8-512'
            },
            {
              id: 202,
              specs: { color: '銀色', memory: '8GB', storage: '512GB' },
              price: 59900,
              originalPrice: 65900,
              stock: 8,
              sku: 'MBP14-SV-8-512'
            },
            {
              id: 203,
              specs: { color: '太空灰色', memory: '18GB', storage: '1TB' },
              price: 74900,
              originalPrice: 79900,
              stock: 5,
              sku: 'MBP14-SG-18-1TB'
            }
          ],
          stock: 23
        },
        {
          id: 3,
          name: 'AirPods Pro',
          price: 7490,
          originalPrice: 8490,
          image: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=AirPods',
          images: [
            { url: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=AirPods+正面', alt: 'AirPods Pro 正面' },
            { url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=AirPods+充電盒', alt: 'AirPods Pro 充電盒' },
            { url: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=AirPods+配件', alt: 'AirPods Pro 配件' }
          ],
          rating: 4.6,
          reviews: 203,
          categoryId: 2,
          description: '主動式降噪功能，提供身臨其境的聆聽體驗。配備 H2 晶片，降噪效果比前一代提升 2 倍，並支援個人化空間音訊。',
          features: [
            '主動式降噪功能，效果提升 2 倍',
            '透明模式讓你聽見周圍環境',
            '個人化空間音訊體驗',
            '最長 6 小時聆聽時間',
            'IPX4 防汗抗水'
          ],
          specifications: {
            '降噪功能': '主動式降噪',
            '晶片': 'H2 晶片',
            '電池續航': '最長 6 小時 (開啟降噪)',
            '充電盒': '最長 30 小時',
            '防水等級': 'IPX4',
            '連接': 'Bluetooth 5.3',
            '重量': '5.3 公克 (單耳)'
          },
          stock: 45,
          contentImages: [
            { url: 'https://via.placeholder.com/800x600/FAE6B1/31525B?text=降噪技術說明', alt: '降噪技術' }
          ]
        },
        {
          id: 4,
          name: 'iPad Air',
          price: 19900,
          originalPrice: 22900,
          image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPad+Air',
          images: [
            { url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPad+正面', alt: 'iPad Air 正面' },
            { url: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=iPad+背面', alt: 'iPad Air 背面' },
            { url: 'https://via.placeholder.com/400x400/31525B/FFFFFF?text=iPad+側面', alt: 'iPad Air 側面' }
          ],
          rating: 4.4,
          reviews: 87,
          categoryId: 2,
          description: '輕薄強大的 iPad Air，適合工作和娛樂。搭載 M1 晶片，效能媲美筆記型電腦，支援 Apple Pencil 和巧控鍵盤。',
          features: [
            '搭載 M1 晶片，效能強大',
            '10.9 吋 Liquid Retina 顯示器',
            '支援 Apple Pencil (第 2 代)',
            '1200 萬像素超廣角前置鏡頭',
            '支援 5G 連線'
          ],
          specifications: {
            '螢幕尺寸': '10.9 吋 Liquid Retina',
            '處理器': 'M1 晶片',
            '儲存容量': '64GB / 256GB',
            '攝影': '1200 萬像素廣角鏡頭',
            '前置鏡頭': '1200 萬像素超廣角',
            '連接': 'Wi-Fi 6 / 5G',
            '重量': '461 公克 (Wi-Fi 機型)'
          },
          variants: [
            {
              id: 401,
              specs: { color: '太空灰色', storage: '64GB', connectivity: 'Wi-Fi' },
              price: 19900,
              originalPrice: 22900,
              stock: 15,
              sku: 'IPAD-SG-64-WIFI'
            },
            {
              id: 402,
              specs: { color: '粉色', storage: '64GB', connectivity: 'Wi-Fi' },
              price: 19900,
              originalPrice: 22900,
              stock: 12,
              sku: 'IPAD-PK-64-WIFI'
            },
            {
              id: 403,
              specs: { color: '太空灰色', storage: '256GB', connectivity: 'Wi-Fi' },
              price: 25900,
              originalPrice: 28900,
              stock: 8,
              sku: 'IPAD-SG-256-WIFI'
            },
            {
              id: 404,
              specs: { color: '太空灰色', storage: '64GB', connectivity: '5G' },
              price: 25900,
              originalPrice: 28900,
              stock: 6,
              sku: 'IPAD-SG-64-5G'
            }
          ],
          stock: 41
        }
      ]
      
        commit('SET_PRODUCTS', mockProducts)
      }
    } catch (error) {
      console.error('載入商品失敗:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async loadCategories({ commit }) {
    try {
      // 導入 ProductService
      const { default: productService } = await import('../../services/product.js')
      
      // 調用真實的 API
      const categories = await productService.getCategories()
      commit('SET_CATEGORIES', categories)
      
      // 如果沒有資料，使用 Mock 資料作為後備
      if (!categories || categories.length === 0) {
        // Mock 分類資料
        const mockCategories = [
        { id: 1, name: '服飾', icon: 'mdi-tshirt-crew' },
        { id: 2, name: '3C產品', icon: 'mdi-laptop' },
        { id: 3, name: '居家生活', icon: 'mdi-home' },
        { id: 4, name: '美妝保養', icon: 'mdi-face-woman' },
        { id: 5, name: '運動戶外', icon: 'mdi-run' },
        { id: 6, name: '書籍文具', icon: 'mdi-book' },
        { id: 7, name: '食品飲料', icon: 'mdi-food' },
        { id: 8, name: '其他', icon: 'mdi-dots-horizontal' }
      ]
      
        commit('SET_CATEGORIES', mockCategories)
      }
    } catch (error) {
      console.error('載入分類失敗:', error)
    }
  },
  
  async loadProduct({ commit, state, dispatch }, productId) {
    commit('SET_LOADING', true)
    
    try {
      // 導入 ProductService
      const { default: productService } = await import('../../services/product.js')
      
      // 調用真實的 API
      const product = await productService.getProduct(productId)
      
      if (product) {
        commit('SET_CURRENT_PRODUCT', product)
      } else {
        // 如果 API 沒有資料，確保先載入所有商品
        if (state.products.length === 0) {
          await dispatch('loadProducts')
        }
        
        // 從現有 products 中尋找
        const fallbackProduct = state.products.find(p => p.id === parseInt(productId))
        
        if (fallbackProduct) {
          commit('SET_CURRENT_PRODUCT', fallbackProduct)
        } else {
          // 如果完全找不到，使用 Mock 資料中的第一個商品作為測試
          const mockProduct = {
            id: parseInt(productId),
            name: 'iPhone 15 Pro',
            price: 36900,
            originalPrice: 39900,
            image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15',
            images: [
              { url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15+正面', alt: 'iPhone 15 Pro 正面' },
              { url: 'https://via.placeholder.com/400x400/31525B/FFFFFF?text=iPhone+15+背面', alt: 'iPhone 15 Pro 背面' },
              { url: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=iPhone+15+側面', alt: 'iPhone 15 Pro 側面' },
              { url: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=iPhone+15+細節', alt: 'iPhone 15 Pro 細節' }
            ],
            rating: 4.5,
            reviews: 128,
            categoryId: 2,
            description: '全新 iPhone 15 Pro，搭載 A17 Pro 晶片，提供卓越的性能和攝影體驗。配備專業級攝影系統，支援 4K ProRes 錄影，是創作者的理想選擇。',
            features: [
              '搭載 A17 Pro 晶片，性能提升 20%',
              '專業級三鏡頭攝影系統',
              '支援 4K ProRes 錄影',
              '鈦金屬機身，更輕更強',
              '支援 MagSafe 無線充電'
            ],
            specifications: {
              '螢幕尺寸': '6.1 吋 Super Retina XDR',
              '處理器': 'A17 Pro 晶片',
              '儲存容量': '128GB / 256GB / 512GB / 1TB',
              '攝影系統': '4800 萬像素主鏡頭',
              '電池續航': '最長 23 小時影片播放',
              '防水等級': 'IP68',
              '重量': '187 公克'
            },
            variants: [
              {
                id: 101,
                specs: { color: '自然鈦金屬', storage: '128GB' },
                price: 36900,
                originalPrice: 39900,
                stock: 15,
                sku: 'IPH15P-NT-128'
              },
              {
                id: 102,
                specs: { color: '自然鈦金屬', storage: '256GB' },
                price: 40900,
                originalPrice: 43900,
                stock: 12,
                sku: 'IPH15P-NT-256'
              },
              {
                id: 103,
                specs: { color: '藍色鈦金屬', storage: '128GB' },
                price: 36900,
                originalPrice: 39900,
                stock: 8,
                sku: 'IPH15P-BT-128'
              },
              {
                id: 104,
                specs: { color: '白色鈦金屬', storage: '128GB' },
                price: 36900,
                originalPrice: 39900,
                stock: 20,
                sku: 'IPH15P-WT-128'
              }
            ],
            stock: 55,
            contentImages: [
              { url: 'https://via.placeholder.com/800x600/FFA101/FFFFFF?text=iPhone+功能介紹', alt: '功能介紹' },
              { url: 'https://via.placeholder.com/800x600/B3DEE5/31525B?text=攝影能力展示', alt: '攝影能力' }
            ]
          }
          commit('SET_CURRENT_PRODUCT', mockProduct)
        }
      }
    } catch (error) {
      console.error('載入商品失敗:', error)
      
      // 錯誤時提供備用商品資料
      const mockProduct = {
        id: parseInt(productId),
        name: 'iPhone 15 Pro',
        price: 36900,
        originalPrice: 39900,
        image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15',
        rating: 4.5,
        reviews: 128,
        description: '全新 iPhone 15 Pro，搭載 A17 Pro 晶片，提供卓越的性能和攝影體驗。',
        stock: 55
      }
      commit('SET_CURRENT_PRODUCT', mockProduct)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setFilter({ commit }, { key, value }) {
    commit('SET_FILTER', { key, value })
  },
  
  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
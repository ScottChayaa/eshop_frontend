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
        filtered.sort((a, b) => b.rating - a.rating)
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
        // Mock 商品資料
        const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          price: 36900,
          originalPrice: 39900,
          image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPhone+15',
          rating: 4.5,
          reviews: 128,
          categoryId: 2,
          description: '全新 iPhone 15 Pro，搭載 A17 Pro 晶片，提供卓越的性能和攝影體驗。',
          specifications: {
            '螢幕尺寸': '6.1 吋',
            '儲存容量': '128GB',
            '顏色': '自然鈦金屬'
          }
        },
        {
          id: 2,
          name: 'MacBook Pro 14"',
          price: 59900,
          originalPrice: 65900,
          image: 'https://via.placeholder.com/400x400/B3DEE5/31525B?text=MacBook',
          rating: 4.8,
          reviews: 95,
          categoryId: 2,
          description: '搭載 M3 晶片的 MacBook Pro，為專業工作者提供強大的效能。',
          specifications: {
            '螢幕尺寸': '14.2 吋',
            '處理器': 'Apple M3',
            '記憶體': '8GB'
          }
        },
        {
          id: 3,
          name: 'AirPods Pro',
          price: 7490,
          originalPrice: 8490,
          image: 'https://via.placeholder.com/400x400/FAE6B1/31525B?text=AirPods',
          rating: 4.6,
          reviews: 203,
          categoryId: 2,
          description: '主動式降噪功能，提供身臨其境的聆聽體驗。',
          specifications: {
            '降噪功能': '主動式降噪',
            '電池續航': '最長 6 小時',
            '充電盒': '最長 30 小時'
          }
        },
        {
          id: 4,
          name: 'iPad Air',
          price: 19900,
          originalPrice: 22900,
          image: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=iPad+Air',
          rating: 4.4,
          reviews: 87,
          categoryId: 2,
          description: '輕薄強大的 iPad Air，適合工作和娛樂。',
          specifications: {
            '螢幕尺寸': '10.9 吋',
            '處理器': 'M1 晶片',
            '儲存容量': '64GB'
          }
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
  
  async loadProduct({ commit, state }, productId) {
    commit('SET_LOADING', true)
    
    try {
      // 導入 ProductService
      const { default: productService } = await import('../../services/product.js')
      
      // 調用真實的 API
      const product = await productService.getProduct(productId)
      commit('SET_CURRENT_PRODUCT', product)
      
      // 如果 API 沒有資料，從現有 products 中尋找
      if (!product) {
        const fallbackProduct = state.products.find(p => p.id === parseInt(productId))
        commit('SET_CURRENT_PRODUCT', fallbackProduct)
      }
    } catch (error) {
      console.error('載入商品失敗:', error)
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
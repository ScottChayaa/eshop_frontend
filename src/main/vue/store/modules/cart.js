const state = {
  items: [],
  isOpen: false
}

const getters = {
  items: state => state.items,
  itemCount: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: state => state.items.reduce((sum, item) => {
    // 使用變體價格（如果存在）或商品價格
    const itemPrice = item.variant?.price || item.price
    return sum + (itemPrice * item.quantity)
  }, 0),
  isOpen: state => state.isOpen,
  
  // 格式化的購物車項目（包含規格資訊）
  formattedItems: state => state.items.map(item => ({
    ...item,
    // 格式化規格顯示
    specsDisplay: item.selectedSpecs ? 
      Object.entries(item.selectedSpecs)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') : 
      null,
    // 計算項目總價
    itemTotal: (item.variant?.price || item.price) * item.quantity,
    // 唯一識別碼
    key: item.cartItemKey || generateCartItemKey(item)
  })),
  
  // 是否有商品在購物車中
  hasItems: state => state.items.length > 0,
  
  // 運費計算
  shippingFee: (state, getters) => {
    const total = getters.totalPrice
    const freeShippingThreshold = 990
    
    if (total >= freeShippingThreshold) {
      return 0
    }
    
    // 檢查是否所有商品都支援超商取貨
    const hasOnlyConvenienceStoreItems = state.items.every(item => 
      item.supportConvenienceStore !== false
    )
    
    return hasOnlyConvenienceStoreItems ? 60 : 100
  },
  
  // 最終總價（包含運費）
  finalTotal: (state, getters) => getters.totalPrice + getters.shippingFee,
  
  // 距離免運費還需多少金額
  amountToFreeShipping: (state, getters) => {
    const freeShippingThreshold = 990
    const remaining = freeShippingThreshold - getters.totalPrice
    return remaining > 0 ? remaining : 0
  }
}

const mutations = {
  ADD_ITEM(state, product) {
    // 為有規格的商品建立唯一識別
    const cartItemKey = generateCartItemKey(product)
    const existingItem = state.items.find(item => 
      generateCartItemKey(item) === cartItemKey
    )
    
    if (existingItem) {
      existingItem.quantity += (product.quantity || 1)
    } else {
      state.items.push({
        ...product,
        quantity: product.quantity || 1,
        cartItemKey, // 加入唯一識別
        addedAt: new Date().toISOString() // 加入時間戳記
      })
    }
  },
  
  REMOVE_ITEM(state, itemKey) {
    const index = state.items.findIndex(item => 
      (item.cartItemKey || generateCartItemKey(item)) === itemKey
    )
    if (index > -1) {
      state.items.splice(index, 1)
    }
  },
  
  UPDATE_QUANTITY(state, { itemKey, quantity }) {
    const item = state.items.find(item => 
      (item.cartItemKey || generateCartItemKey(item)) === itemKey
    )
    if (item) {
      if (quantity <= 0) {
        const index = state.items.findIndex(item => 
          (item.cartItemKey || generateCartItemKey(item)) === itemKey
        )
        state.items.splice(index, 1)
      } else {
        item.quantity = quantity
      }
    }
  },
  
  CLEAR_CART(state) {
    state.items = []
  },
  
  TOGGLE_CART(state) {
    state.isOpen = !state.isOpen
  },
  
  SET_CART_OPEN(state, isOpen) {
    state.isOpen = isOpen
  }
}

// 輔助函數：生成購物車項目唯一識別碼
const generateCartItemKey = (product) => {
  let key = `${product.id}`
  
  // 如果有選擇的規格，加入到識別碼中
  if (product.selectedSpecs) {
    const specsString = Object.keys(product.selectedSpecs)
      .sort()
      .map(key => `${key}:${product.selectedSpecs[key]}`)
      .join('|')
    key += `_${specsString}`
  }
  
  // 如果有變體資訊，加入變體 ID
  if (product.variant && product.variant.id) {
    key += `_v${product.variant.id}`
  }
  
  return key
}

const actions = {
  addItem({ commit, state }, product) {
    // 驗證商品資料
    if (!product || !product.id) {
      throw new Error('商品資料不完整')
    }

    // 如果商品有規格但未選擇，拋出錯誤
    if (product.variants && product.variants.length > 0 && !product.selectedSpecs) {
      throw new Error('請選擇商品規格')
    }

    commit('ADD_ITEM', product)
    
    // 本地存儲
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('儲存購物車到本地存儲失敗:', error)
    }
  },
  
  removeItem({ commit, state }, itemKey) {
    commit('REMOVE_ITEM', itemKey)
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  
  updateQuantity({ commit, state }, payload) {
    commit('UPDATE_QUANTITY', payload)
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  
  clearCart({ commit }) {
    commit('CLEAR_CART')
    localStorage.removeItem('cart')
  },
  
  loadCart({ commit, state }) {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        
        // 清空現有購物車
        commit('CLEAR_CART')
        
        // 重新加載項目
        items.forEach(item => {
          // 確保每個項目都有唯一識別碼
          if (!item.cartItemKey) {
            item.cartItemKey = generateCartItemKey(item)
          }
          // 直接加載完整的項目資料
          state.items.push({
            ...item,
            cartItemKey: item.cartItemKey,
            addedAt: item.addedAt || new Date().toISOString()
          })
        })
      }
    } catch (error) {
      console.error('載入購物車失敗:', error)
      // 如果載入失敗，清空損壞的資料
      localStorage.removeItem('cart')
    }
  },
  
  toggleCart({ commit }) {
    commit('TOGGLE_CART')
  },
  
  setCartOpen({ commit }, isOpen) {
    commit('SET_CART_OPEN', isOpen)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

// 匯出輔助函數供其他模組使用
export { generateCartItemKey }
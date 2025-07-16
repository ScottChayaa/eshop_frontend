const state = {
  items: [],
  isOpen: false
}

const getters = {
  items: state => state.items,
  itemCount: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: state => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  isOpen: state => state.isOpen
}

const mutations = {
  ADD_ITEM(state, product) {
    const existingItem = state.items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      state.items.push({
        ...product,
        quantity: 1
      })
    }
  },
  
  REMOVE_ITEM(state, productId) {
    const index = state.items.findIndex(item => item.id === productId)
    if (index > -1) {
      state.items.splice(index, 1)
    }
  },
  
  UPDATE_QUANTITY(state, { productId, quantity }) {
    const item = state.items.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        const index = state.items.findIndex(item => item.id === productId)
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

const actions = {
  addItem({ commit }, product) {
    commit('ADD_ITEM', product)
    // 可以在這裡加入本地存儲邏輯
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  
  removeItem({ commit }, productId) {
    commit('REMOVE_ITEM', productId)
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  
  updateQuantity({ commit }, payload) {
    commit('UPDATE_QUANTITY', payload)
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  
  clearCart({ commit }) {
    commit('CLEAR_CART')
    localStorage.removeItem('cart')
  },
  
  loadCart({ commit }) {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      items.forEach(item => {
        commit('ADD_ITEM', { ...item, quantity: item.quantity - 1 })
      })
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
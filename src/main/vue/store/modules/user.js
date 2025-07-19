const state = {
  // 認證相關
  user: null,
  isAuthenticated: false,
  token: null,
  
  // 使用者資料相關
  profile: null,
  orders: [],
  addresses: [],
  
  // UI 狀態
  loading: false,
  error: null
}

const getters = {
  // 認證相關
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated,
  token: state => state.token,
  
  // 使用者資料相關
  profile: state => state.profile,
  orders: state => state.orders,
  addresses: state => state.addresses,
  
  // UI 狀態
  loading: state => state.loading,
  error: state => state.error,
  
  // 計算屬性
  pendingOrders: state => state.orders.filter(order => order.status === 'pending'),
  completedOrders: state => state.orders.filter(order => order.status === 'completed'),
  defaultAddress: state => state.addresses.find(address => address.isDefault)
}

const mutations = {
  // 認證相關
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  
  SET_TOKEN(state, token) {
    state.token = token
  },
  
  LOGOUT(state) {
    state.user = null
    state.isAuthenticated = false
    state.token = null
    state.profile = null
    state.orders = []
    state.addresses = []
    state.error = null
  },
  
  // 使用者資料相關
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order)
  },
  
  UPDATE_ORDER(state, { orderId, orderData }) {
    const index = state.orders.findIndex(order => order.id === orderId)
    if (index !== -1) {
      state.orders.splice(index, 1, { ...state.orders[index], ...orderData })
    }
  },
  
  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses
  },
  
  ADD_ADDRESS(state, address) {
    state.addresses.push(address)
  },
  
  UPDATE_ADDRESS(state, { addressId, addressData }) {
    const index = state.addresses.findIndex(address => address.id === addressId)
    if (index !== -1) {
      state.addresses.splice(index, 1, { ...state.addresses[index], ...addressData })
    }
  },
  
  DELETE_ADDRESS(state, addressId) {
    const index = state.addresses.findIndex(address => address.id === addressId)
    if (index !== -1) {
      state.addresses.splice(index, 1)
    }
  },
  
  // UI 狀態
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async login({ commit }, { email, password }) {
    try {
      // 這裡應該調用 API 進行登入
      // const response = await api.login(email, password)
      
      // Mock 登入邏輯
      const mockUser = {
        id: 1,
        email: email,
        name: '測試用戶',
        avatar: 'https://via.placeholder.com/100x100/FFA101/FFFFFF?text=User'
      }
      
      const mockToken = 'mock-jwt-token'
      
      commit('SET_USER', mockUser)
      commit('SET_TOKEN', mockToken)
      
      // 儲存到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  async register({ commit }, { email, password, name }) {
    try {
      // 這裡應該調用 API 進行註冊
      // const response = await api.register(email, password, name)
      
      // Mock 註冊邏輯
      const mockUser = {
        id: Date.now(),
        email: email,
        name: name,
        avatar: 'https://via.placeholder.com/100x100/B3DEE5/31525B?text=User'
      }
      
      const mockToken = 'mock-jwt-token'
      
      commit('SET_USER', mockUser)
      commit('SET_TOKEN', mockToken)
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  async googleLogin({ commit }) {
    try {
      // 這裡應該整合 Google OAuth
      // const response = await googleAuth.signIn()
      
      // Mock Google 登入
      const mockUser = {
        id: Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/100x100/FFA101/FFFFFF?text=Google',
        provider: 'google'
      }
      
      const mockToken = 'mock-google-jwt-token'
      
      commit('SET_USER', mockUser)
      commit('SET_TOKEN', mockToken)
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  
  logout({ commit }) {
    commit('LOGOUT')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
  
  loadUser({ commit }) {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      commit('SET_USER', JSON.parse(savedUser))
      commit('SET_TOKEN', savedToken)
    }
  },

  // 使用者資料管理
  async fetchProfile({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const profile = await userService.getProfile()
      commit('SET_PROFILE', profile)
      return profile
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateProfile({ commit }, profileData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const updatedProfile = await userService.updateProfile(profileData)
      commit('SET_PROFILE', updatedProfile)
      return updatedProfile
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async changePassword({ commit }, passwordData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const result = await userService.changePassword(passwordData)
      return result
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrders({ commit }, params = {}) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const response = await userService.getOrders(params)
      commit('SET_ORDERS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrder({ commit }, orderId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const order = await userService.getOrder(orderId)
      return order
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchAddresses({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const addresses = await userService.getAddresses()
      commit('SET_ADDRESSES', addresses)
      return addresses
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addAddress({ commit }, addressData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const newAddress = await userService.addAddress(addressData)
      commit('ADD_ADDRESS', newAddress)
      return newAddress
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateAddress({ commit }, { addressId, addressData }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const updatedAddress = await userService.updateAddress(addressId, addressData)
      commit('UPDATE_ADDRESS', { addressId, addressData: updatedAddress })
      return updatedAddress
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteAddress({ commit }, addressId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      await userService.deleteAddress(addressId)
      commit('DELETE_ADDRESS', addressId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async uploadAvatar({ commit }, file) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      const { default: userService } = await import('../../services/user.js')
      const result = await userService.uploadAvatar(file)
      
      // 上傳成功後更新使用者資料中的頭像
      if (result.url) {
        commit('SET_PROFILE', { ...state.profile, avatar: result.url })
      }
      
      return result
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearError({ commit }) {
    commit('CLEAR_ERROR')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
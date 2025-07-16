const state = {
  user: null,
  isAuthenticated: false,
  token: null
}

const getters = {
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated,
  token: state => state.token
}

const mutations = {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
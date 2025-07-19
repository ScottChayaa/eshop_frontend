/**
 * 認證 Store 模組
 * @description 管理使用者認證狀態和相關操作
 */

import { storage } from '../../utils/helpers.js'
import { STORAGE_KEYS } from '../../utils/constants.js'

const state = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },

  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      storage.set(STORAGE_KEYS.TOKEN, token)
    } else {
      storage.remove(STORAGE_KEYS.TOKEN)
    }
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
    storage.remove(STORAGE_KEYS.TOKEN)
    storage.remove(STORAGE_KEYS.USER)
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const { default: authService } = await import('../../services/auth.js')
      const response = await authService.login(credentials)

      commit('SET_TOKEN', response.token)
      commit('SET_USER', response.user)
      
      storage.set(STORAGE_KEYS.USER, response.user)

      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const { default: authService } = await import('../../services/auth.js')
      const response = await authService.register(userData)

      commit('SET_TOKEN', response.token)
      commit('SET_USER', response.user)
      
      storage.set(STORAGE_KEYS.USER, response.user)

      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }) {
    try {
      const { default: authService } = await import('../../services/auth.js')
      await authService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      commit('LOGOUT')
    }
  },

  async refreshToken({ commit, state }) {
    try {
      if (!state.token) return false

      const { default: authService } = await import('../../services/auth.js')
      const response = await authService.refreshToken()

      commit('SET_TOKEN', response.token)
      commit('SET_USER', response.user)

      return true
    } catch (error) {
      commit('LOGOUT')
      return false
    }
  },

  async checkAuth({ commit }) {
    try {
      const token = storage.get(STORAGE_KEYS.TOKEN)
      const user = storage.get(STORAGE_KEYS.USER)

      if (token && user) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        return true
      }

      return false
    } catch (error) {
      commit('LOGOUT')
      return false
    }
  },

  clearError({ commit }) {
    commit('SET_ERROR', null)
  }
}

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  token: (state) => state.token,
  loading: (state) => state.loading,
  error: (state) => state.error,
  userId: (state) => state.user?.id || null,
  userName: (state) => state.user?.name || '',
  userEmail: (state) => state.user?.email || '',
  userAvatar: (state) => state.user?.avatar || null
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
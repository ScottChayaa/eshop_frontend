/**
 * 收藏 Store 模組
 * @description 管理使用者收藏商品
 */

import { storage } from '../../utils/helpers.js'

const state = {
  favoriteItems: [],
  loading: false,
  error: null
}

const mutations = {
  SET_FAVORITES(state, items) {
    state.favoriteItems = items
  },

  ADD_FAVORITE(state, productId) {
    if (!state.favoriteItems.includes(productId)) {
      state.favoriteItems.push(productId)
      storage.set('favorites', state.favoriteItems)
    }
  },

  REMOVE_FAVORITE(state, productId) {
    state.favoriteItems = state.favoriteItems.filter(id => id !== productId)
    storage.set('favorites', state.favoriteItems)
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  CLEAR_FAVORITES(state) {
    state.favoriteItems = []
    storage.remove('favorites')
  }
}

const actions = {
  async toggleFavorite({ commit, state, rootGetters }, productId) {
    try {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      
      if (!isAuthenticated) {
        throw new Error('請先登入才能使用收藏功能')
      }

      const isFavorited = state.favoriteItems.includes(productId)
      
      if (isFavorited) {
        commit('REMOVE_FAVORITE', productId)
      } else {
        commit('ADD_FAVORITE', productId)
      }

      return !isFavorited
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async addToFavorites({ commit, rootGetters }, productId) {
    try {
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      
      if (!isAuthenticated) {
        throw new Error('請先登入才能使用收藏功能')
      }

      commit('ADD_FAVORITE', productId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async removeFromFavorites({ commit }, productId) {
    try {
      commit('REMOVE_FAVORITE', productId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async loadFavorites({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true)
      
      const isAuthenticated = rootGetters['auth/isAuthenticated']
      
      if (isAuthenticated) {
        const favorites = storage.get('favorites', [])
        commit('SET_FAVORITES', favorites)
      } else {
        commit('SET_FAVORITES', [])
      }
    } catch (error) {
      commit('SET_ERROR', error.message)
      commit('SET_FAVORITES', [])
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getFavoriteProducts({ state, commit }) {
    try {
      commit('SET_LOADING', true)
      
      if (state.favoriteItems.length === 0) {
        return []
      }

      const { default: productService } = await import('../../services/product.js')
      const products = []
      
      for (const productId of state.favoriteItems) {
        try {
          const product = await productService.getProduct(productId)
          products.push(product)
        } catch (error) {
          console.warn(`Failed to load favorite product ${productId}:`, error)
        }
      }

      return products
    } catch (error) {
      commit('SET_ERROR', error.message)
      return []
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearFavorites({ commit }) {
    commit('CLEAR_FAVORITES')
  }
}

const getters = {
  favoriteItems: (state) => state.favoriteItems,
  favoriteIds: (state) => state.favoriteItems,
  favoriteCount: (state) => state.favoriteItems.length,
  loading: (state) => state.loading,
  error: (state) => state.error,
  isFavorite: (state) => (productId) => {
    return state.favoriteItems.includes(productId)
  },
  hasFavorites: (state) => state.favoriteItems.length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
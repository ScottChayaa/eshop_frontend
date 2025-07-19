/**
 * 搜尋 Store 模組
 * @description 管理搜尋狀態和歷史記錄
 */

import { storage } from '../../utils/helpers.js'

const state = {
  query: '',
  results: [],
  suggestions: [],
  recentSearches: [],
  popularKeywords: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: [0, 10000],
    rating: 0,
    sortBy: 'relevance'
  }
}

const mutations = {
  SET_QUERY(state, query) {
    state.query = query
  },

  SET_RESULTS(state, results) {
    state.results = results
  },

  SET_SUGGESTIONS(state, suggestions) {
    state.suggestions = suggestions
  },

  SET_RECENT_SEARCHES(state, searches) {
    state.recentSearches = searches
  },

  ADD_RECENT_SEARCH(state, query) {
    const searches = state.recentSearches.filter(item => item !== query)
    searches.unshift(query)
    state.recentSearches = searches.slice(0, 10)
    storage.set('recent_searches', state.recentSearches)
  },

  SET_POPULAR_KEYWORDS(state, keywords) {
    state.popularKeywords = keywords
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },

  CLEAR_RESULTS(state) {
    state.results = []
    state.query = ''
    state.error = null
  }
}

const actions = {
  async search({ commit, state }, { query, filters = {} }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      commit('SET_QUERY', query)
      commit('SET_FILTERS', filters)

      const { default: productService } = await import('../../services/product.js')
      const response = await productService.searchProducts(query, {
        ...state.filters,
        ...filters
      })

      commit('SET_RESULTS', response.data)
      
      if (query.trim()) {
        commit('ADD_RECENT_SEARCH', query.trim())
      }

      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async getSuggestions({ commit }, query) {
    try {
      if (!query || query.length < 2) {
        commit('SET_SUGGESTIONS', [])
        return []
      }

      const { default: productService } = await import('../../services/product.js')
      const suggestions = await productService.searchProducts(query)
      
      const formattedSuggestions = suggestions.data.slice(0, 8).map(product => ({
        text: product.name,
        type: 'product',
        id: product.id
      }))

      commit('SET_SUGGESTIONS', formattedSuggestions)
      return formattedSuggestions
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      commit('SET_SUGGESTIONS', [])
      return []
    }
  },

  addRecentSearch({ commit }, query) {
    if (query && query.trim()) {
      commit('ADD_RECENT_SEARCH', query.trim())
    }
  },

  loadRecentSearches({ commit }) {
    const searches = storage.get('recent_searches', [])
    commit('SET_RECENT_SEARCHES', searches)
  },

  clearRecentSearches({ commit }) {
    commit('SET_RECENT_SEARCHES', [])
    storage.remove('recent_searches')
  },

  async loadPopularKeywords({ commit }) {
    try {
      const keywords = [
        'iPhone', 'iPad', '筆電', '耳機', '滑鼠',
        '鍵盤', '螢幕', '相機', '手機殼', '充電器'
      ]
      commit('SET_POPULAR_KEYWORDS', keywords)
    } catch (error) {
      console.error('Failed to load popular keywords:', error)
    }
  },

  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },

  clearSearch({ commit }) {
    commit('CLEAR_RESULTS')
  }
}

const getters = {
  query: (state) => state.query,
  results: (state) => state.results,
  suggestions: (state) => state.suggestions,
  recentSearches: (state) => state.recentSearches,
  popularKeywords: (state) => state.popularKeywords,
  loading: (state) => state.loading,
  error: (state) => state.error,
  filters: (state) => state.filters,
  hasResults: (state) => state.results.length > 0,
  resultCount: (state) => state.results.length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
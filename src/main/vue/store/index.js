import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import products from './modules/products'

export default createStore({
  state: {
    loading: false,
    snackbar: {
      show: false,
      message: '',
      color: 'success'
    }
  },
  getters: {
    isLoading: state => state.loading,
    snackbar: state => state.snackbar
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status
    },
    SHOW_SNACKBAR(state, { message, color = 'success' }) {
      state.snackbar = {
        show: true,
        message,
        color
      }
    },
    HIDE_SNACKBAR(state) {
      state.snackbar.show = false
    }
  },
  actions: {
    setLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    showMessage({ commit }, { message, color = 'success' }) {
      commit('SHOW_SNACKBAR', { message, color })
    },
    hideMessage({ commit }) {
      commit('HIDE_SNACKBAR')
    }
  },
  modules: {
    cart,
    user,
    products
  }
})
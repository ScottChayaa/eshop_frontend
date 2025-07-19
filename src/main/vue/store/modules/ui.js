/**
 * UI Store 模組
 * @description 管理應用程式 UI 狀態
 */

const state = {
  loading: false,
  theme: 'customLight',
  snackbar: {
    show: false,
    message: '',
    color: 'info',
    timeout: 3000
  },
  breadcrumbs: [],
  pageTitle: '',
  sidebarOpen: false
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },

  SET_THEME(state, theme) {
    state.theme = theme
    localStorage.setItem('theme', theme)
  },

  SHOW_SNACKBAR(state, { message, color = 'info', timeout = 3000 }) {
    state.snackbar = {
      show: true,
      message,
      color,
      timeout
    }
  },

  HIDE_SNACKBAR(state) {
    state.snackbar.show = false
  },

  SET_BREADCRUMBS(state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  },

  SET_PAGE_TITLE(state, title) {
    state.pageTitle = title
    document.title = title ? `${title} - eshop` : 'eshop'
  },

  SET_SIDEBAR_OPEN(state, open) {
    state.sidebarOpen = open
  }
}

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },

  setTheme({ commit }, theme) {
    commit('SET_THEME', theme)
  },

  showSnackbar({ commit }, payload) {
    if (typeof payload === 'string') {
      commit('SHOW_SNACKBAR', { message: payload })
    } else {
      commit('SHOW_SNACKBAR', payload)
    }
  },

  hideSnackbar({ commit }) {
    commit('HIDE_SNACKBAR')
  },

  showSuccess({ commit }, message) {
    commit('SHOW_SNACKBAR', { message, color: 'success' })
  },

  showError({ commit }, message) {
    commit('SHOW_SNACKBAR', { message, color: 'error', timeout: 5000 })
  },

  showWarning({ commit }, message) {
    commit('SHOW_SNACKBAR', { message, color: 'warning' })
  },

  showInfo({ commit }, message) {
    commit('SHOW_SNACKBAR', { message, color: 'info' })
  },

  setBreadcrumbs({ commit }, breadcrumbs) {
    commit('SET_BREADCRUMBS', breadcrumbs)
  },

  setPageTitle({ commit }, title) {
    commit('SET_PAGE_TITLE', title)
  },

  toggleSidebar({ commit, state }) {
    commit('SET_SIDEBAR_OPEN', !state.sidebarOpen)
  },

  setSidebarOpen({ commit }, open) {
    commit('SET_SIDEBAR_OPEN', open)
  }
}

const getters = {
  loading: (state) => state.loading,
  theme: (state) => state.theme,
  isDarkTheme: (state) => state.theme === 'customDark',
  snackbar: (state) => state.snackbar,
  breadcrumbs: (state) => state.breadcrumbs,
  pageTitle: (state) => state.pageTitle,
  sidebarOpen: (state) => state.sidebarOpen
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
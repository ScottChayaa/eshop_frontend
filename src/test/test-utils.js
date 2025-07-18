/**
 * 測試工具函數
 * @description 提供測試中常用的工具函數和配置
 */

import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import { vi } from 'vitest'

// 建立測試用的 Vuetify 實例 (簡化版，避免 CSS 匯入問題)
export function createTestVuetify() {
  // 返回一個簡化的 Vuetify 實例 mock
  return {
    install: vi.fn(),
    global: {
      name: 'VuetifyPlugin'
    }
  }
}

// 建立測試用的 Vuex Store
export function createTestStore(initialState = {}) {
  return createStore({
    state: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false
      },
      ui: {
        loading: false,
        notifications: []
      },
      ...initialState
    },
    mutations: {
      SET_USER(state, user) {
        state.auth.user = user
      },
      SET_TOKEN(state, token) {
        state.auth.token = token
      },
      SET_AUTHENTICATED(state, isAuthenticated) {
        state.auth.isAuthenticated = isAuthenticated
      },
      SET_LOADING(state, loading) {
        state.ui.loading = loading
      },
      ADD_NOTIFICATION(state, notification) {
        state.ui.notifications.push(notification)
      }
    },
    actions: {
      async login({ commit }, credentials) {
        // 模擬登入
        const user = { id: 1, email: credentials.email, name: '測試用戶' }
        const token = 'test-token'
        
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        commit('SET_AUTHENTICATED', true)
        
        return { user, token }
      },
      async logout({ commit }) {
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
        commit('SET_AUTHENTICATED', false)
      }
    },
    getters: {
      isAuthenticated: state => state.auth.isAuthenticated,
      currentUser: state => state.auth.user,
      isLoading: state => state.ui.loading
    }
  })
}

// 建立測試用的 Router
export function createTestRouter(routes = []) {
  const defaultRoutes = [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/user/login', component: { template: '<div>Login</div>' } },
    { path: '/user/profile', component: { template: '<div>Profile</div>' } },
    { path: '/products', component: { template: '<div>Products</div>' } },
    ...routes
  ]

  return createRouter({
    history: createWebHistory(),
    routes: defaultRoutes
  })
}

// 建立測試用的組件包裝器
export function createWrapper(component, options = {}) {
  const defaultOptions = {
    global: {
      plugins: [
        createTestStore(options.storeState),
        createTestRouter(options.routes)
      ],
      stubs: {
        'router-link': true,
        'router-view': true,
        'v-app': true,
        'v-main': true,
        'v-container': true,
        'v-row': true,
        'v-col': true,
        'v-card': true,
        'v-btn': true,
        'v-text-field': true,
        'v-form': true,
      }
    }
  }

  return mount(component, {
    ...defaultOptions,
    ...options
  })
}

// 等待 Vue 組件更新
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// 模擬 localStorage
export function mockLocalStorage() {
  const store = {}
  
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn(key => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// 建立測試用的 API 回應
export function createMockResponse(data, status = 200) {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {}
  }
}

// 建立測試用的錯誤回應
export function createMockError(message, status = 400) {
  const error = new Error(message)
  error.response = {
    data: { message },
    status,
    statusText: 'Error'
  }
  return error
}

// 測試中等待特定時間
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
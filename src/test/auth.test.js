/**
 * 認證系統測試
 * @description 測試認證相關功能，包含登入、登出、Token 管理等
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestStore, mockLocalStorage, createMockResponse, createMockError } from './test-utils.js'

// 模擬 AuthService (這個會在 Phase 3-1 實作)
class MockAuthService {
  constructor() {
    this.api = {
      post: vi.fn()
    }
  }

  async login(email, password) {
    // 模擬不同的登入情境
    if (email === 'test@example.com' && password === 'Test123456') {
      return {
        token: 'mock-jwt-token',
        user: { id: 1, email, name: '測試用戶' }
      }
    }
    
    if (email === 'blocked@example.com') {
      throw new Error('帳號已被封鎖')
    }
    
    throw new Error('帳號或密碼錯誤')
  }

  async logout() {
    return { message: '登出成功' }
  }

  getCurrentUser() {
    const token = localStorage.getItem('auth_token')
    if (!token) return null
    
    return { id: 1, email: 'test@example.com', name: '測試用戶' }
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  }

  async refreshToken() {
    const currentToken = localStorage.getItem('auth_token')
    if (!currentToken) {
      throw new Error('無效的 Token')
    }
    
    return { token: 'new-mock-jwt-token' }
  }
}

describe('AuthService', () => {
  let authService
  let mockStorage

  beforeEach(() => {
    authService = new MockAuthService()
    mockStorage = mockLocalStorage()
    global.localStorage = mockStorage
  })

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const result = await authService.login('test@example.com', 'Test123456')
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com', name: '測試用戶' }
      })
    })

    it('should throw error with invalid credentials', async () => {
      await expect(authService.login('wrong@email.com', 'wrongpassword'))
        .rejects.toThrow('帳號或密碼錯誤')
    })

    it('should throw error for blocked account', async () => {
      await expect(authService.login('blocked@example.com', 'password'))
        .rejects.toThrow('帳號已被封鎖')
    })

    it('should handle empty credentials', async () => {
      await expect(authService.login('', ''))
        .rejects.toThrow('帳號或密碼錯誤')
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await authService.logout()
      expect(result).toEqual({ message: '登出成功' })
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when token exists', () => {
      mockStorage.getItem.mockReturnValue('mock-token')
      
      const user = authService.getCurrentUser()
      expect(user).toEqual({ id: 1, email: 'test@example.com', name: '測試用戶' })
    })

    it('should return null when no token', () => {
      mockStorage.getItem.mockReturnValue(null)
      
      const user = authService.getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      mockStorage.getItem.mockReturnValue('mock-token')
      
      const isAuth = authService.isAuthenticated()
      expect(isAuth).toBe(true)
    })

    it('should return false when no token', () => {
      mockStorage.getItem.mockReturnValue(null)
      
      const isAuth = authService.isAuthenticated()
      expect(isAuth).toBe(false)
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockStorage.getItem.mockReturnValue('old-token')
      
      const result = await authService.refreshToken()
      expect(result).toEqual({ token: 'new-mock-jwt-token' })
    })

    it('should throw error when no current token', async () => {
      mockStorage.getItem.mockReturnValue(null)
      
      await expect(authService.refreshToken())
        .rejects.toThrow('無效的 Token')
    })
  })
})

describe('Auth Store Module', () => {
  let store

  beforeEach(() => {
    store = createTestStore()
  })

  describe('mutations', () => {
    it('should set user correctly', () => {
      const user = { id: 1, email: 'test@example.com', name: '測試用戶' }
      
      store.commit('SET_USER', user)
      expect(store.state.auth.user).toEqual(user)
    })

    it('should set token correctly', () => {
      const token = 'test-token'
      
      store.commit('SET_TOKEN', token)
      expect(store.state.auth.token).toBe(token)
    })

    it('should set authenticated status correctly', () => {
      store.commit('SET_AUTHENTICATED', true)
      expect(store.state.auth.isAuthenticated).toBe(true)
      
      store.commit('SET_AUTHENTICATED', false)
      expect(store.state.auth.isAuthenticated).toBe(false)
    })
  })

  describe('actions', () => {
    it('should login successfully', async () => {
      const credentials = { email: 'test@example.com', password: 'Test123456' }
      
      const result = await store.dispatch('login', credentials)
      
      expect(result.user.email).toBe(credentials.email)
      expect(result.token).toBe('test-token')
      expect(store.state.auth.isAuthenticated).toBe(true)
    })

    it('should logout successfully', async () => {
      // 先設定為已登入狀態
      store.commit('SET_USER', { id: 1, email: 'test@example.com' })
      store.commit('SET_TOKEN', 'test-token')
      store.commit('SET_AUTHENTICATED', true)
      
      await store.dispatch('logout')
      
      expect(store.state.auth.user).toBeNull()
      expect(store.state.auth.token).toBeNull()
      expect(store.state.auth.isAuthenticated).toBe(false)
    })
  })

  describe('getters', () => {
    it('should return correct authentication status', () => {
      expect(store.getters.isAuthenticated).toBe(false)
      
      store.commit('SET_AUTHENTICATED', true)
      expect(store.getters.isAuthenticated).toBe(true)
    })

    it('should return current user', () => {
      const user = { id: 1, email: 'test@example.com', name: '測試用戶' }
      
      store.commit('SET_USER', user)
      expect(store.getters.currentUser).toEqual(user)
    })

    it('should return loading status', () => {
      expect(store.getters.isLoading).toBe(false)
      
      store.commit('SET_LOADING', true)
      expect(store.getters.isLoading).toBe(true)
    })
  })
})

describe('Route Guards', () => {
  // 路由守衛測試 (簡化版)
  const mockAuthGuard = (to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth_token')
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/user/login')
    } else {
      next()
    }
  }

  const mockGuestGuard = (to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth_token')
    
    if (to.meta.requiresGuest && isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }

  beforeEach(() => {
    global.localStorage = mockLocalStorage()
  })

  describe('authGuard', () => {
    it('should redirect to login when not authenticated', () => {
      const next = vi.fn()
      const to = { meta: { requiresAuth: true } }
      
      mockAuthGuard(to, {}, next)
      
      expect(next).toHaveBeenCalledWith('/user/login')
    })

    it('should allow access when authenticated', () => {
      localStorage.setItem('auth_token', 'mock-token')
      
      const next = vi.fn()
      const to = { meta: { requiresAuth: true } }
      
      mockAuthGuard(to, {}, next)
      
      expect(next).toHaveBeenCalledWith()
    })

    it('should allow access to public routes', () => {
      const next = vi.fn()
      const to = { meta: {} }
      
      mockAuthGuard(to, {}, next)
      
      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('guestGuard', () => {
    it('should redirect to home when authenticated', () => {
      localStorage.setItem('auth_token', 'mock-token')
      
      const next = vi.fn()
      const to = { meta: { requiresGuest: true } }
      
      mockGuestGuard(to, {}, next)
      
      expect(next).toHaveBeenCalledWith('/')
    })

    it('should allow access when not authenticated', () => {
      const next = vi.fn()
      const to = { meta: { requiresGuest: true } }
      
      mockGuestGuard(to, {}, next)
      
      expect(next).toHaveBeenCalledWith()
    })
  })
})
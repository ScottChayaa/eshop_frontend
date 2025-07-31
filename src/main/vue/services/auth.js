/**
 * Authentication Service Module
 * @description Handles user login, register, logout and other auth operations
 */

import { authAPI } from './api.js'

class AuthService {
  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} Login response
   */
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials)
      
      // Store token if login successful
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || 'Login failed, please try again'
      throw new Error(errorMessage)
    }
  }

  /**
   * User registration
   * @param {Object} userData - Registration data
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @param {string} userData.name - Name
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      const response = await authAPI.register(userData)
      
      // Store token if registration successful
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed, please try again'
      throw new Error(errorMessage)
    }
  }

  /**
   * User logout
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await authAPI.logout()
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
    }
  }

  /**
   * Refresh token
   * @returns {Promise<Object>} New token info
   */
  async refreshToken() {
    try {
      const response = await authAPI.refreshToken()
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }
      
      return response
    } catch (error) {
      // Clear local storage if token refresh failed
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      
      const errorMessage = error.response?.data?.message || 'Token refresh failed'
      throw new Error(errorMessage)
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  }

  /**
   * Get current user info
   * @returns {Object|null} User info
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Failed to parse user info:', error)
      return null
    }
  }

  /**
   * Get current token
   * @returns {string|null} Token
   */
  getToken() {
    return localStorage.getItem('token')
  }

  /**
   * Clear authentication info
   */
  clearAuth() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }
}

// Export singleton instance
export default new AuthService()
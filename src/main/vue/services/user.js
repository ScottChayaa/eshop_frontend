/**
 * User Service Layer
 * @description Handle all user-related API calls
 */

import { userAPI, orderAPI } from './api.js'

export class UserService {
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await userAPI.getProfile()
      return response.data || response
    } catch (error) {
      console.error('Failed to get user profile:', error)
      throw this.handleError(error, 'Failed to get user profile')
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - User data
   * @param {string} userData.name - Name
   * @param {string} userData.email - Email
   * @param {string} userData.phone - Phone number
   * @param {string} userData.address - Address
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userData) {
    try {
      // Validate required fields
      this.validateProfileData(userData)
      
      const response = await userAPI.updateProfile(userData)
      return response.data || response
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw this.handleError(error, 'Failed to update user profile')
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Update result
   */
  async changePassword(passwordData) {
    try {
      // Validate password data
      this.validatePasswordData(passwordData)
      
      const response = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      return response.data || response
    } catch (error) {
      console.error('Failed to change password:', error)
      throw this.handleError(error, 'Failed to change password')
    }
  }

  /**
   * Get user orders
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Order status filter
   * @returns {Promise<Object>} Orders list and pagination info
   */
  async getOrders(params = {}) {
    try {
      const response = await orderAPI.getOrders()
      let orders = response.data || response

      // Filter by status if provided
      if (params.status) {
        orders = orders.filter(order => order.status === params.status)
      }

      // Handle pagination
      const page = params.page || 1
      const limit = params.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedOrders = orders.slice(startIndex, endIndex)

      return {
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total: orders.length,
          pages: Math.ceil(orders.length / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get orders:', error)
      throw this.handleError(error, 'Failed to get orders')
    }
  }

  /**
   * Get single order details
   * @param {number|string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrder(orderId) {
    try {
      const response = await orderAPI.getOrder(orderId)
      return response.data || response
    } catch (error) {
      console.error('Failed to get order details:', error)
      throw this.handleError(error, 'Failed to get order details')
    }
  }

  /**
   * Get user addresses
   * @returns {Promise<Array>} Address list
   */
  async getAddresses() {
    try {
      const response = await userAPI.getAddresses()
      return response.data || response
    } catch (error) {
      console.error('Failed to get addresses:', error)
      throw this.handleError(error, 'Failed to get addresses')
    }
  }

  /**
   * Add user address
   * @param {Object} addressData - Address data
   * @param {string} addressData.name - Recipient name
   * @param {string} addressData.phone - Recipient phone
   * @param {string} addressData.address - Detailed address
   * @param {boolean} addressData.isDefault - Is default address
   * @returns {Promise<Object>} Added address
   */
  async addAddress(addressData) {
    try {
      this.validateAddressData(addressData)
      
      const response = await userAPI.addAddress(addressData)
      return response.data || response
    } catch (error) {
      console.error('Failed to add address:', error)
      throw this.handleError(error, 'Failed to add address')
    }
  }

  /**
   * Update user address
   * @param {number|string} addressId - Address ID
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} Updated address
   */
  async updateAddress(addressId, addressData) {
    try {
      this.validateAddressData(addressData)
      
      const response = await userAPI.updateAddress(addressId, addressData)
      return response.data || response
    } catch (error) {
      console.error('Failed to update address:', error)
      throw this.handleError(error, 'Failed to update address')
    }
  }

  /**
   * Delete user address
   * @param {number|string} addressId - Address ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteAddress(addressId) {
    try {
      const response = await userAPI.deleteAddress(addressId)
      return response.data || response
    } catch (error) {
      console.error('Failed to delete address:', error)
      throw this.handleError(error, 'Failed to delete address')
    }
  }

  /**
   * Upload user avatar
   * @param {File} file - Avatar file
   * @returns {Promise<Object>} Upload result
   */
  async uploadAvatar(file) {
    try {
      // Validate file
      this.validateAvatarFile(file)
      
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await userAPI.uploadAvatar(formData)
      return response.data || response
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      throw this.handleError(error, 'Failed to upload avatar')
    }
  }

  /**
   * Validate profile data
   * @param {Object} userData - User data
   */
  validateProfileData(userData) {
    if (!userData.name || userData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new Error('Please enter a valid email address')
    }

    if (userData.phone && !this.isValidPhone(userData.phone)) {
      throw new Error('Please enter a valid phone number')
    }
  }

  /**
   * Validate password data
   * @param {Object} passwordData - Password data
   */
  validatePasswordData(passwordData) {
    if (!passwordData.currentPassword) {
      throw new Error('Please enter current password')
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters')
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('New password and confirm password do not match')
    }

    // Password strength check
    if (!this.isStrongPassword(passwordData.newPassword)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter and one number')
    }
  }

  /**
   * Validate address data
   * @param {Object} addressData - Address data
   */
  validateAddressData(addressData) {
    if (!addressData.name || addressData.name.trim().length < 2) {
      throw new Error('Recipient name must be at least 2 characters')
    }

    if (!addressData.phone || !this.isValidPhone(addressData.phone)) {
      throw new Error('Please enter a valid phone number')
    }

    if (!addressData.address || addressData.address.trim().length < 5) {
      throw new Error('Detailed address must be at least 5 characters')
    }
  }

  /**
   * Validate avatar file
   * @param {File} file - File
   */
  validateAvatarFile(file) {
    if (!file) {
      throw new Error('Please select a file to upload')
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG or WebP images are allowed')
    }

    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size cannot exceed 5MB')
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email
   * @returns {boolean} Is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate phone number format (Taiwan mobile number)
   * @param {string} phone - Phone number
   * @returns {boolean} Is valid
   */
  isValidPhone(phone) {
    const phoneRegex = /^09\d{8}$/
    return phoneRegex.test(phone)
  }

  /**
   * Check password strength
   * @param {string} password - Password
   * @returns {boolean} Is strong password
   */
  isStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    return hasUpperCase && hasLowerCase && hasNumbers
  }

  /**
   * Error handling method
   * @param {Error} error - Original error
   * @param {string} message - User-friendly error message
   * @returns {Error} Processed error
   */
  handleError(error, message) {
    const errorInfo = {
      message,
      originalError: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    }

    // Provide more specific messages based on error status codes
    switch (error.response?.status) {
      case 401:
        errorInfo.message = 'Please login first'
        break
      case 403:
        errorInfo.message = 'No permission to perform this operation'
        break
      case 404:
        errorInfo.message = 'Data not found'
        break
      case 400:
        errorInfo.message = error.response?.data?.message || 'Invalid request parameters'
        break
      case 422:
        errorInfo.message = 'Invalid data format'
        break
      case 500:
        errorInfo.message = 'Server error, please try again later'
        break
      default:
        if (!navigator.onLine) {
          errorInfo.message = 'Network connection error, please check your network'
        }
    }

    const customError = new Error(errorInfo.message)
    customError.details = errorInfo
    return customError
  }
}

// Create singleton instance
const userService = new UserService()

export default userService

// Export common methods for backward compatibility
export const {
  getProfile,
  updateProfile,
  changePassword,
  getOrders,
  getOrder,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  uploadAvatar
} = userService
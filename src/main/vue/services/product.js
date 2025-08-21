/**
 * Product Service Layer
 * @description Handle all product-related API calls
 */

import { productAPI } from './api.js'

export class ProductService {
  /**
   * Get product list
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Category filter
   * @param {string} params.search - Search keyword
   * @param {string} params.sortBy - Sort method
   * @returns {Promise<Object>} Product list and pagination info
   */
  async getProducts(params = {}) {
    try {
      const response = await productAPI.getProducts(params)
      return {
        data: response.data || response,
        pagination: response.pagination || {
          page: params.page || 1,
          limit: params.limit || 12,
          total: (response.data || response).length,
          pages: 1
        }
      }
    } catch (error) {
      console.error('Failed to get products:', error)
      throw this.handleError(error, 'Failed to get products')
    }
  }

  /**
   * Get single product details
   * @param {number|string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProduct(id) {
    try {
      const response = await productAPI.getProduct(id)
      return response.data || response
    } catch (error) {
      console.error('Failed to get product details:', error)
      throw this.handleError(error, 'Failed to get product details')
    }
  }

  /**
   * Search products
   * @param {string} query - Search keyword
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchProducts(query, filters = {}) {
    try {
      const response = await productAPI.searchProducts(query)
      return {
        data: response.data || response,
        total: response.total || (response.data || response).length,
        query
      }
    } catch (error) {
      console.error('Failed to search products:', error)
      throw this.handleError(error, 'Failed to search products')
    }
  }

  /**
   * Get product categories
   * @returns {Promise<Array>} Category list
   */
  async getCategories() {
    try {
      const response = await productAPI.getCategories()
      return response.data || response
    } catch (error) {
      console.error('Failed to get categories:', error)
      throw this.handleError(error, 'Failed to get categories')
    }
  }

  /**
   * Get products by category
   * @param {number|string} categoryId - Category ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} Products in this category
   */
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const categoryParams = { ...params, category: categoryId }
      return await this.getProducts(categoryParams)
    } catch (error) {
      console.error('Failed to get products by category:', error)
      throw this.handleError(error, 'Failed to get products by category')
    }
  }

  /**
   * Get popular products
   * @param {number} limit - Limit count
   * @returns {Promise<Array>} Popular products list
   */
  async getPopularProducts(limit = 10) {
    try {
      const response = await this.getProducts({ 
        sortBy: 'popular', 
        limit 
      })
      return response.data
    } catch (error) {
      console.error('Failed to get popular products:', error)
      throw this.handleError(error, 'Failed to get popular products')
    }
  }

  /**
   * Get recommended products
   * @param {number|string} productId - Base product for recommendations
   * @param {number} limit - Limit count
   * @returns {Promise<Array>} Recommended products list
   */
  async getRecommendedProducts(productId, limit = 6) {
    try {
      // If there's a recommendation API, use specific recommendation endpoint
      // Otherwise return other products from same category
      const product = await this.getProduct(productId)
      if (product.categoryId) {
        const response = await this.getProductsByCategory(product.categoryId, { limit: limit + 1 })
        // Exclude current product
        return response.data.filter(p => p.id !== parseInt(productId)).slice(0, limit)
      }
      return []
    } catch (error) {
      console.error('Failed to get recommended products:', error)
      throw this.handleError(error, 'Failed to get recommended products')
    }
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
      case 404:
        errorInfo.message = 'Product not found'
        break
      case 400:
        errorInfo.message = 'Invalid request parameters'
        break
      case 500:
        errorInfo.message = 'Server error, please try again later'
        break
      case 503:
        errorInfo.message = 'Service temporarily unavailable'
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
const productService = new ProductService()

export default productService

// Export common methods for backward compatibility
export const {
  getProducts,
  getProduct,
  searchProducts,
  getCategories,
  getProductsByCategory,
  getPopularProducts,
  getRecommendedProducts
} = productService
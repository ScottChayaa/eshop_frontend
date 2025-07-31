/**
 * Order Service
 * @description 訂單相關API服務
 */

import api from './api.js'

const orderService = {
  /**
   * 獲取用戶訂單列表
   * @param {Object} params - 查詢參數
   * @param {number} params.page - 頁碼
   * @param {number} params.limit - 每頁數量
   * @param {string} params.status - 訂單狀態篩選
   * @param {string} params.dateRange - 日期範圍篩選
   * @param {string} params.keyword - 關鍵字搜尋
   * @returns {Promise<Object>} 訂單列表數據
   */
  async getOrders(params = {}) {
    try {
      console.log('📋 OrderService.getOrders called with params:', params)
      const response = await api.get('/user/orders', { params })
      console.log('📋 Raw API response:', response)
      
      const result = {
        success: true,
        data: response.data,
        pagination: response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data?.length || 0,
          itemsPerPage: params.limit || 10
        }
      }
      
      console.log('📋 OrderService result:', result)
      return result
    } catch (error) {
      console.error('獲取訂單列表失敗:', error)
      throw new Error(error.response?.data?.message || '獲取訂單列表失敗')
    }
  },

  /**
   * 獲取訂單詳情
   * @param {number} orderId - 訂單ID
   * @returns {Promise<Object>} 訂單詳情
   */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('獲取訂單詳情失敗:', error)
      throw new Error(error.response?.data?.message || '獲取訂單詳情失敗')
    }
  },

  /**
   * 取消訂單
   * @param {number} orderId - 訂單ID
   * @param {string} reason - 取消原因
   * @returns {Promise<Object>} 取消結果
   */
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, { reason })
      return {
        success: true,
        data: response.data,
        message: '訂單已成功取消'
      }
    } catch (error) {
      console.error('取消訂單失敗:', error)
      throw new Error(error.response?.data?.message || '取消訂單失敗')
    }
  },

  /**
   * 申請退貨
   * @param {number} orderId - 訂單ID
   * @param {Object} returnData - 退貨申請數據
   * @param {Array} returnData.items - 退貨商品列表
   * @param {string} returnData.reason - 退貨原因
   * @param {string} returnData.description - 詳細說明
   * @returns {Promise<Object>} 申請結果
   */
  async requestReturn(orderId, returnData) {
    try {
      const response = await api.post(`/orders/${orderId}/return`, returnData)
      return {
        success: true,
        data: response.data,
        message: '退貨申請已提交'
      }
    } catch (error) {
      console.error('申請退貨失敗:', error)
      throw new Error(error.response?.data?.message || '申請退貨失敗')
    }
  },

  /**
   * 確認收貨
   * @param {number} orderId - 訂單ID
   * @returns {Promise<Object>} 確認結果
   */
  async confirmDelivery(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/confirm-delivery`)
      return {
        success: true,
        data: response.data,
        message: '已確認收貨'
      }
    } catch (error) {
      console.error('確認收貨失敗:', error)
      throw new Error(error.response?.data?.message || '確認收貨失敗')
    }
  },

  /**
   * 追蹤訂單物流
   * @param {number} orderId - 訂單ID
   * @returns {Promise<Object>} 物流信息
   */
  async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('獲取物流信息失敗:', error)
      throw new Error(error.response?.data?.message || '獲取物流信息失敗')
    }
  },

  /**
   * 重新下單
   * @param {number} orderId - 原訂單ID
   * @returns {Promise<Object>} 重新下單結果
   */
  async reorder(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`)
      return {
        success: true,
        data: response.data,
        message: '商品已添加到購物車'
      }
    } catch (error) {
      console.error('重新下單失敗:', error)
      throw new Error(error.response?.data?.message || '重新下單失敗')
    }
  },

  /**
   * 獲取訂單統計信息
   * @returns {Promise<Object>} 統計信息
   */
  async getOrderStats() {
    try {
      console.log('📊 OrderService.getOrderStats called')
      const response = await api.get('/user/orders/stats')
      console.log('📊 OrderStats API response:', response)
      return {
        success: true,
        data: response
      }
    } catch (error) {
      console.error('獲取訂單統計失敗:', error)
      throw new Error(error.response?.data?.message || '獲取訂單統計失敗')
    }
  }
}

// 訂單狀態常數
export const ORDER_STATUS = {
  PENDING: 'pending',          // 待付款
  PAID: 'paid',               // 已付款
  PROCESSING: 'processing',    // 處理中
  SHIPPED: 'shipped',         // 已出貨
  DELIVERED: 'delivered',     // 已送達
  CANCELLED: 'cancelled',     // 已取消
  RETURNED: 'returned'        // 已退貨
}

// 訂單狀態顯示文字
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待付款',
  [ORDER_STATUS.PAID]: '已付款',
  [ORDER_STATUS.PROCESSING]: '處理中',
  [ORDER_STATUS.SHIPPED]: '已出貨',
  [ORDER_STATUS.DELIVERED]: '已送達',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.RETURNED]: '已退貨'
}

// 訂單狀態顏色
export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PAID]: 'info',
  [ORDER_STATUS.PROCESSING]: 'primary',
  [ORDER_STATUS.SHIPPED]: 'secondary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
  [ORDER_STATUS.RETURNED]: 'grey'
}

// 付款方式顯示文字
export const PAYMENT_METHOD_TEXT = {
  credit_card: '信用卡',
  atm_transfer: 'ATM轉帳',
  line_pay: 'LINE Pay',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  cash_on_delivery: '貨到付款'
}

export default orderService
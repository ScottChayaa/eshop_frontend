/**
 * Order Store Module
 * @description 訂單狀態管理模組
 */

import orderService from '../../services/order.js'

const state = {
  // 訂單列表
  orders: [],
  
  // 當前訂單詳情
  currentOrder: null,
  
  // 訂單統計數據
  stats: {
    total: 0,
    pending: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    totalAmount: 0
  },
  
  // 分頁信息
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  
  // 載入狀態
  loading: {
    orders: false,
    stats: false,
    detail: false,
    action: false // 訂單操作（取消、確認收貨等）
  },
  
  // 篩選條件
  filters: {
    status: 'all',
    dateRange: 'all',
    keyword: ''
  },
  
  // 錯誤信息
  error: null
}

const mutations = {
  // 設置訂單列表
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  // 設置分頁信息
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  
  // 設置當前訂單詳情
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  // 設置訂單統計
  SET_STATS(state, stats) {
    state.stats = { ...state.stats, ...stats }
  },
  
  // 設置篩選條件
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  
  // 設置載入狀態
  SET_LOADING(state, { type, value }) {
    state.loading[type] = value
  },
  
  // 設置錯誤信息
  SET_ERROR(state, error) {
    state.error = error
  },
  
  // 清除錯誤信息
  CLEAR_ERROR(state) {
    state.error = null
  },
  
  // 更新單個訂單
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(order => order.id === updatedOrder.id)
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder)
    }
    
    // 如果是當前查看的訂單，也更新它
    if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
      state.currentOrder = updatedOrder
    }
  },
  
  // 從列表中移除訂單
  REMOVE_ORDER(state, orderId) {
    state.orders = state.orders.filter(order => order.id !== orderId)
    
    // 如果是當前查看的訂單，清除它
    if (state.currentOrder && state.currentOrder.id === orderId) {
      state.currentOrder = null
    }
  },
  
  // 重置狀態
  RESET_STATE(state) {
    state.orders = []
    state.currentOrder = null
    state.pagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    }
    state.error = null
  }
}

const actions = {
  // 獲取訂單列表
  async fetchOrders({ commit, state }, params = {}) {
    try {
      commit('SET_LOADING', { type: 'orders', value: true })
      commit('CLEAR_ERROR')
      
      const queryParams = {
        page: params.page || state.pagination.currentPage,
        limit: params.limit || state.pagination.itemsPerPage,
        status: state.filters.status === 'all' ? undefined : state.filters.status,
        dateRange: state.filters.dateRange === 'all' ? undefined : state.filters.dateRange,
        keyword: state.filters.keyword || undefined,
        ...params
      }
      
      const response = await orderService.getOrders(queryParams)
      
      if (response.success) {
        commit('SET_ORDERS', response.data)
        commit('SET_PAGINATION', response.pagination)
      }
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'orders', value: false })
    }
  },
  
  // 獲取訂單詳情
  async fetchOrderDetail({ commit }, orderId) {
    try {
      commit('SET_LOADING', { type: 'detail', value: true })
      commit('CLEAR_ERROR')
      
      const response = await orderService.getOrderById(orderId)
      
      if (response.success) {
        commit('SET_CURRENT_ORDER', response.data)
      }
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'detail', value: false })
    }
  },
  
  // 獲取訂單統計
  async fetchOrderStats({ commit }) {
    try {
      commit('SET_LOADING', { type: 'stats', value: true })
      
      const response = await orderService.getOrderStats()
      
      if (response.success) {
        commit('SET_STATS', response.data)
      }
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'stats', value: false })
    }
  },
  
  // 取消訂單
  async cancelOrder({ commit, dispatch }, { orderId, reason }) {
    try {
      commit('SET_LOADING', { type: 'action', value: true })
      commit('CLEAR_ERROR')
      
      const response = await orderService.cancelOrder(orderId, reason)
      
      if (response.success) {
        // 更新訂單狀態
        commit('UPDATE_ORDER', response.data.order)
        
        // 重新獲取統計數據
        dispatch('fetchOrderStats')
      }
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'action', value: false })
    }
  },
  
  // 確認收貨
  async confirmDelivery({ commit, dispatch }, orderId) {
    try {
      commit('SET_LOADING', { type: 'action', value: true })
      commit('CLEAR_ERROR')
      
      const response = await orderService.confirmDelivery(orderId)
      
      if (response.success) {
        // 更新訂單狀態
        commit('UPDATE_ORDER', response.data.order)
        
        // 重新獲取統計數據
        dispatch('fetchOrderStats')
      }
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'action', value: false })
    }
  },
  
  // 重新下單
  async reorder({ commit }, orderId) {
    try {
      commit('SET_LOADING', { type: 'action', value: true })
      commit('CLEAR_ERROR')
      
      const response = await orderService.reorder(orderId)
      
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', { type: 'action', value: false })
    }
  },
  
  // 設置篩選條件
  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },
  
  // 清除當前訂單
  clearCurrentOrder({ commit }) {
    commit('SET_CURRENT_ORDER', null)
  },
  
  // 重置狀態
  resetState({ commit }) {
    commit('RESET_STATE')
  }
}

const getters = {
  // 訂單列表
  orders: state => state.orders,
  
  // 當前訂單
  currentOrder: state => state.currentOrder,
  
  // 訂單統計
  orderStats: state => state.stats,
  
  // 分頁信息
  pagination: state => state.pagination,
  
  // 載入狀態
  isLoading: state => type => state.loading[type] || false,
  
  // 是否有任何載入狀態
  isAnyLoading: state => Object.values(state.loading).some(loading => loading),
  
  // 篩選條件
  filters: state => state.filters,
  
  // 錯誤信息
  error: state => state.error,
  
  // 是否有錯誤
  hasError: state => !!state.error,
  
  // 根據狀態篩選訂單
  ordersByStatus: state => status => {
    if (status === 'all') return state.orders
    return state.orders.filter(order => order.status === status)
  },
  
  // 待處理訂單（待付款 + 處理中）
  pendingOrders: state => {
    return state.orders.filter(order => 
      ['pending', 'paid', 'processing'].includes(order.status)
    )
  },
  
  // 進行中訂單（已出貨）
  activeOrders: state => {
    return state.orders.filter(order => order.status === 'shipped')
  },
  
  // 已完成訂單
  completedOrders: state => {
    return state.orders.filter(order => order.status === 'delivered')
  },
  
  // 總訂單金額
  totalOrderAmount: state => {
    return state.orders.reduce((total, order) => total + order.total, 0)
  },
  
  // 是否為空列表
  isEmpty: state => state.orders.length === 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
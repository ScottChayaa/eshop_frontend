/**
 * 通知管理 Store 模組
 * @description 管理系統通知、未讀數量和通知相關狀態
 */

const state = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
}

const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  
  ADD_NOTIFICATION(state, notification) {
    state.notifications.unshift({
      ...notification,
      id: notification.id || Date.now(),
      isRead: false,
      createdAt: notification.createdAt || new Date().toISOString()
    })
    state.unreadCount++
  },
  
  MARK_AS_READ(state, notificationId) {
    const notification = state.notifications.find(n => n.id === notificationId)
    if (notification && !notification.isRead) {
      notification.isRead = true
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    }
  },
  
  MARK_ALL_AS_READ(state) {
    state.notifications.forEach(notification => {
      notification.isRead = true
    })
    state.unreadCount = 0
  },
  
  DELETE_NOTIFICATION(state, notificationId) {
    const index = state.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = state.notifications[index]
      if (!notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.notifications.splice(index, 1)
    }
  },
  
  CLEAR_ALL_NOTIFICATIONS(state) {
    state.notifications = []
    state.unreadCount = 0
  },
  
  SET_UNREAD_COUNT(state, count) {
    state.unreadCount = count
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  // 獲取所有通知
  async fetchNotifications({ commit, rootState }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const token = rootState.auth.token
      if (!token) {
        commit('SET_NOTIFICATIONS', [])
        commit('SET_UNREAD_COUNT', 0)
        return
      }

      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token 過期，清空通知
          commit('SET_NOTIFICATIONS', [])
          commit('SET_UNREAD_COUNT', 0)
          return
        }
        throw new Error('獲取通知失敗')
      }

      const notifications = await response.json()
      
      // 轉換資料格式，確保相容性
      const formattedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: notification.read // 將 read 轉為 isRead
      }))
      
      commit('SET_NOTIFICATIONS', formattedNotifications)
      
      // 計算未讀數量
      const unreadCount = formattedNotifications.filter(n => !n.isRead).length
      commit('SET_UNREAD_COUNT', unreadCount)
      
    } catch (error) {
      console.error('獲取通知失敗:', error)
      commit('SET_ERROR', error.message || '獲取通知失敗')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // 標記通知為已讀
  async markAsRead({ commit, rootState }, notificationId) {
    try {
      const token = rootState.auth.token
      if (!token) {
        throw new Error('請先登入')
      }

      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('標記已讀失敗')
      }

      commit('MARK_AS_READ', notificationId)
    } catch (error) {
      console.error('標記已讀失敗:', error)
      commit('SET_ERROR', error.message || '標記已讀失敗')
    }
  },
  
  // 標記所有通知為已讀
  async markAllAsRead({ commit, rootState, state }) {
    try {
      const token = rootState.auth.token
      if (!token) {
        throw new Error('請先登入')
      }

      // 批量標記所有未讀通知為已讀
      const unreadNotifications = state.notifications.filter(n => !n.isRead)
      
      for (const notification of unreadNotifications) {
        const response = await fetch(`/api/notifications/${notification.id}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          console.warn(`標記通知 ${notification.id} 已讀失敗`)
        }
      }

      commit('MARK_ALL_AS_READ')
    } catch (error) {
      console.error('標記全部已讀失敗:', error)
      commit('SET_ERROR', error.message || '標記全部已讀失敗')
    }
  },
  
  // 刪除通知
  async deleteNotification({ commit, rootState }, notificationId) {
    try {
      const token = rootState.auth.token
      if (!token) {
        throw new Error('請先登入')
      }

      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('刪除通知失敗')
      }

      commit('DELETE_NOTIFICATION', notificationId)
    } catch (error) {
      console.error('刪除通知失敗:', error)
      commit('SET_ERROR', error.message || '刪除通知失敗')
    }
  },
  
  // 添加新通知
  addNotification({ commit }, notification) {
    commit('ADD_NOTIFICATION', notification)
  },
  
  // 清除所有通知
  clearAllNotifications({ commit }) {
    commit('CLEAR_ALL_NOTIFICATIONS')
  }
}

const getters = {
  // 所有通知
  allNotifications: (state) => state.notifications,
  
  // 未讀通知
  unreadNotifications: (state) => state.notifications.filter(n => !n.isRead),
  
  // 已讀通知
  readNotifications: (state) => state.notifications.filter(n => n.isRead),
  
  // 未讀數量
  unreadCount: (state) => state.unreadCount,
  
  // 按類型分組的通知
  notificationsByType: (state) => {
    return state.notifications.reduce((acc, notification) => {
      const type = notification.type || 'general'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(notification)
      return acc
    }, {})
  },
  
  // 最近的通知（前5條）
  recentNotifications: (state) => {
    return state.notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  },
  
  // 是否有未讀通知
  hasUnreadNotifications: (state) => state.unreadCount > 0,
  
  // 載入狀態
  isLoading: (state) => state.loading,
  
  // 錯誤信息
  error: (state) => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
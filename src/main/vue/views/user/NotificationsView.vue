<template>
  <v-container class="notifications-container">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <h1 class="text-h4" style="color: #31525B">
            <v-icon start size="large">mdi-bell</v-icon>
            通知中心
          </h1>
          <div class="d-flex align-center gap-2">
            <v-chip
              v-if="unreadCount > 0"
              color="error"
              size="small"
              label
            >
              {{ unreadCount }} 則未讀
            </v-chip>
            <v-btn
              v-if="hasUnreadNotifications"
              variant="text"
              color="primary"
              size="small"
              @click="markAllAsRead"
            >
              全部標為已讀
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 載入狀態 -->
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">載入通知中...</p>
      </v-col>
    </v-row>

    <!-- 錯誤狀態 -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" variant="tonal">
          <v-icon start>mdi-alert</v-icon>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- 空狀態 -->
    <v-row v-else-if="!hasNotifications">
      <v-col cols="12" class="text-center py-8">
        <v-icon size="120" color="grey-lighten-1" class="mb-4">
          mdi-bell-outline
        </v-icon>
        <h2 class="text-h5 mb-4" style="color: #31525B">暫無通知</h2>
        <p class="text-body-1 text-grey-darken-1">
          您目前沒有任何通知訊息
        </p>
      </v-col>
    </v-row>

    <!-- 通知列表 -->
    <v-row v-else>
      <v-col cols="12">
        <!-- 篩選標籤 -->
        <div class="mb-4">
          <v-chip-group
            v-model="selectedFilter"
            color="primary"
            mandatory
          >
            <v-chip value="all">全部</v-chip>
            <v-chip value="unread">未讀</v-chip>
            <v-chip value="read">已讀</v-chip>
          </v-chip-group>
        </div>

        <!-- 通知卡片 -->
        <v-card flat>
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.isRead }"
          >
            <v-row no-gutters align="start" class="pa-4">
              <v-col cols="auto" class="mr-3">
                <v-avatar
                  :color="getNotificationColor(notification.type)"
                  size="40"
                >
                  <v-icon color="white">
                    {{ getNotificationIcon(notification.type) }}
                  </v-icon>
                </v-avatar>
              </v-col>
              
              <v-col>
                <div class="d-flex align-start justify-space-between">
                  <div class="flex-grow-1">
                    <h3 class="text-subtitle-1 font-weight-medium mb-1">
                      {{ notification.title }}
                    </h3>
                    <p class="text-body-2 text-grey-darken-1 mb-2">
                      {{ notification.message }}
                    </p>
                    <div class="d-flex align-center">
                      <v-chip
                        :color="getNotificationColor(notification.type)"
                        size="x-small"
                        variant="tonal"
                        class="mr-2"
                      >
                        {{ getNotificationTypeLabel(notification.type) }}
                      </v-chip>
                      <span class="text-caption text-grey">
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="ml-3">
                    <v-menu location="bottom end">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon="mdi-dots-vertical"
                          variant="text"
                          size="small"
                          v-bind="props"
                        ></v-btn>
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-if="!notification.isRead"
                          @click="markAsRead(notification.id)"
                        >
                          <template v-slot:prepend>
                            <v-icon>mdi-check</v-icon>
                          </template>
                          <v-list-item-title>標為已讀</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="deleteNotification(notification.id)"
                        >
                          <template v-slot:prepend>
                            <v-icon color="error">mdi-delete</v-icon>
                          </template>
                          <v-list-item-title>刪除</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
        </v-card>

        <!-- 清空所有通知按鈕 -->
        <div v-if="hasNotifications" class="text-center mt-6">
          <v-btn
            variant="outlined"
            color="error"
            @click="showClearDialog = true"
          >
            <v-icon start>mdi-delete-sweep</v-icon>
            清空所有通知
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 清空確認對話框 -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon start color="warning">mdi-alert</v-icon>
          確認清空所有通知
        </v-card-title>
        <v-card-text>
          確定要清空所有通知嗎？此操作無法復原。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showClearDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            @click="clearAllNotifications"
          >
            確定清空
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NotificationsView',
  setup() {
    const store = useStore()
    const selectedFilter = ref('all')
    const showClearDialog = ref(false)

    // 通知相關計算屬性
    const allNotifications = computed(() => store.getters['notifications/allNotifications'])
    const unreadCount = computed(() => store.getters['notifications/unreadCount'])
    const hasUnreadNotifications = computed(() => store.getters['notifications/hasUnreadNotifications'])
    const hasNotifications = computed(() => allNotifications.value.length > 0)
    const isLoading = computed(() => store.getters['notifications/isLoading'])
    const error = computed(() => store.getters['notifications/error'])

    // 篩選後的通知
    const filteredNotifications = computed(() => {
      switch (selectedFilter.value) {
        case 'unread':
          return store.getters['notifications/unreadNotifications']
        case 'read':
          return store.getters['notifications/readNotifications']
        default:
          return allNotifications.value
      }
    })

    // 獲取通知類型圖標
    const getNotificationIcon = (type) => {
      const iconMap = {
        order: 'mdi-package-variant',
        promotion: 'mdi-tag',
        system: 'mdi-cog',
        message: 'mdi-message',
        general: 'mdi-information'
      }
      return iconMap[type] || iconMap.general
    }

    // 獲取通知類型顏色
    const getNotificationColor = (type) => {
      const colorMap = {
        order: 'success',
        promotion: 'warning',
        system: 'info',
        message: 'primary',
        general: 'grey'
      }
      return colorMap[type] || colorMap.general
    }

    // 獲取通知類型標籤
    const getNotificationTypeLabel = (type) => {
      const labelMap = {
        order: '訂單',
        promotion: '優惠',
        system: '系統',
        message: '訊息',
        general: '一般'
      }
      return labelMap[type] || labelMap.general
    }

    // 格式化時間
    const formatTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        return '剛剛'
      } else if (diffInHours < 24) {
        return `${diffInHours} 小時前`
      } else if (diffInHours < 24 * 7) {
        return `${Math.floor(diffInHours / 24)} 天前`
      } else {
        return date.toLocaleDateString('zh-TW')
      }
    }

    // 標記為已讀
    const markAsRead = async (notificationId) => {
      await store.dispatch('notifications/markAsRead', notificationId)
    }

    // 標記全部為已讀
    const markAllAsRead = async () => {
      await store.dispatch('notifications/markAllAsRead')
    }

    // 刪除通知
    const deleteNotification = async (notificationId) => {
      await store.dispatch('notifications/deleteNotification', notificationId)
    }

    // 清空所有通知
    const clearAllNotifications = async () => {
      await store.dispatch('notifications/clearAllNotifications')
      showClearDialog.value = false
    }

    // 組件掛載時載入通知
    onMounted(() => {
      store.dispatch('notifications/fetchNotifications')
    })

    return {
      selectedFilter,
      showClearDialog,
      allNotifications,
      unreadCount,
      hasUnreadNotifications,
      hasNotifications,
      isLoading,
      error,
      filteredNotifications,
      getNotificationIcon,
      getNotificationColor,
      getNotificationTypeLabel,
      formatTime,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }
  }
}
</script>

<style scoped>
.notifications-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.notification-item {
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(250, 230, 177, 0.05);
}

.notification-item.unread {
  background-color: rgba(250, 230, 177, 0.1);
  border-left: 4px solid #FFA101;
}

.notification-item.unread:hover {
  background-color: rgba(250, 230, 177, 0.15);
}

/* 響應式調整 */
@media (max-width: 600px) {
  .notifications-container {
    padding: 16px 8px;
  }
  
  .notification-item .v-row {
    padding: 16px 12px;
  }
}
</style>

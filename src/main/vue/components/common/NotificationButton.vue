<template>
  <v-btn
    icon
    :color="hasUnreadNotifications ? 'secondary' : 'default'"
    @click="toggleNotificationDropdown"
    class="notification-button"
  >
    <v-badge
      :content="unreadCount > 99 ? '99+' : unreadCount.toString()"
      :model-value="hasUnreadNotifications"
      color="error"
      overlap
    >
      <v-icon>{{ notificationIcon }}</v-icon>
    </v-badge>

    <!-- 通知下拉選單 -->
    <v-menu
      v-model="showDropdown"
      :close-on-content-click="false"
      location="bottom end"
      width="380"
      max-height="500"
    >
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between py-3">
          <div class="d-flex align-center">
            <v-icon start>mdi-bell</v-icon>
            <span>通知</span>
            <v-chip
              v-if="hasUnreadNotifications"
              color="error"
              size="x-small"
              class="ml-2"
            >
              {{ unreadCount }}
            </v-chip>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn
              v-if="hasUnreadNotifications"
              variant="elevated"
              size="small"
              color="secondary"
              prepend-icon="mdi-check-all"
              @click="markAllAsRead"
              class="notification-mark-read-btn"
              elevation="1"
            >
              全部已讀
            </v-btn>
            <v-btn
              icon="mdi-cog"
              variant="text"
              size="small"
              color="grey-darken-1"
              :to="{ name: 'Notifications' }"
              @click="showDropdown = false"
              class="notification-settings-btn"
            ></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <!-- 載入狀態 -->
        <div v-if="isLoading" class="text-center py-6">
          <v-progress-circular indeterminate size="40"></v-progress-circular>
          <p class="mt-2 text-body-2 text-grey">載入中...</p>
        </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="error" class="pa-4">
          <v-alert type="error" density="compact">
            {{ error }}
          </v-alert>
        </div>

        <!-- 無通知 -->
        <div v-else-if="!hasRecentNotifications" class="text-center py-6">
          <v-icon size="60" color="grey-lighten-1" class="mb-2">
            mdi-bell-outline
          </v-icon>
          <p class="text-body-2 text-grey">暫無通知</p>
        </div>

        <!-- 通知列表 -->
        <v-list v-else density="compact" class="notification-dropdown-list">
          <template
            v-for="notification in recentNotifications"
            :key="notification.id"
          >
            <v-list-item
              class="notification-dropdown-item"
              :class="{ 'unread': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="getNotificationColor(notification.type)"
                  size="32"
                >
                  <v-icon color="white" size="small">
                    {{ getNotificationIcon(notification.type) }}
                  </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="text-wrap">
                {{ notification.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="text-wrap">
                {{ notification.message }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="text-caption text-grey">
                  {{ formatTime(notification.createdAt) }}
                </div>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>

        <!-- 查看全部按鈕 -->
        <v-card-actions v-if="hasRecentNotifications" class="pa-3">
          <v-btn
            block
            variant="elevated"
            color="primary"
            prepend-icon="mdi-bell-outline"
            :to="{ name: 'Notifications' }"
            @click="showDropdown = false"
            class="notification-view-all-btn"
            size="default"
            elevation="2"
          >
            查看全部通知
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NotificationButton',
  setup() {
    const store = useStore()
    const showDropdown = ref(false)

    // 通知相關計算屬性
    const unreadCount = computed(() => store.getters['notifications/unreadCount'])
    const hasUnreadNotifications = computed(() => store.getters['notifications/hasUnreadNotifications'])
    const recentNotifications = computed(() => store.getters['notifications/recentNotifications'])
    const hasRecentNotifications = computed(() => recentNotifications.value.length > 0)
    const isLoading = computed(() => store.getters['notifications/isLoading'])
    const error = computed(() => store.getters['notifications/error'])

    // 通知圖標
    const notificationIcon = computed(() => 
      hasUnreadNotifications.value ? 'mdi-bell' : 'mdi-bell-outline'
    )

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

    // 格式化時間
    const formatTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        return '剛剛'
      } else if (diffInHours < 24) {
        return `${diffInHours}h`
      } else if (diffInHours < 24 * 7) {
        return `${Math.floor(diffInHours / 24)}d`
      } else {
        return date.toLocaleDateString('zh-TW').slice(5) // 只顯示月/日
      }
    }

    // 切換通知下拉選單
    const toggleNotificationDropdown = () => {
      if (!showDropdown.value) {
        // 只有在未載入或通知為空時才重新載入
        const notifications = store.getters['notifications/allNotifications']
        if (!notifications || notifications.length === 0) {
          store.dispatch('notifications/fetchNotifications')
        }
      }
      showDropdown.value = !showDropdown.value
    }

    // 處理通知點擊
    const handleNotificationClick = async (notification) => {
      // 標記為已讀
      if (!notification.isRead) {
        await store.dispatch('notifications/markAsRead', notification.id)
      }
      
      // 根據通知類型進行相應處理
      // 這裡可以添加跳轉邏輯
      showDropdown.value = false
    }

    // 標記全部為已讀
    const markAllAsRead = async () => {
      await store.dispatch('notifications/markAllAsRead')
    }

    return {
      showDropdown,
      unreadCount,
      hasUnreadNotifications,
      recentNotifications,
      hasRecentNotifications,
      isLoading,
      error,
      notificationIcon,
      getNotificationIcon,
      getNotificationColor,
      formatTime,
      toggleNotificationDropdown,
      handleNotificationClick,
      markAllAsRead
    }
  }
}
</script>

<style scoped>
.notification-button {
  position: relative;
}

.notification-button :deep(.v-badge__badge) {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
}

.notification-dropdown-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-dropdown-item {
  min-height: 64px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-dropdown-item:hover {
  background-color: rgba(250, 230, 177, 0.05);
}

.notification-dropdown-item.unread {
  background-color: rgba(250, 230, 177, 0.1);
  border-left: 3px solid #FFA101;
}

.notification-dropdown-item.unread:hover {
  background-color: rgba(250, 230, 177, 0.15);
}

/* 按鈕樣式增強 */
.notification-mark-read-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 161, 1, 0.2);
}

.notification-mark-read-btn:hover {
  box-shadow: 0 4px 8px rgba(255, 161, 1, 0.3);
  transform: translateY(-1px);
}

.notification-view-all-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(49, 82, 91, 0.2);
}

.notification-view-all-btn:hover {
  box-shadow: 0 4px 12px rgba(49, 82, 91, 0.3);
  transform: translateY(-1px);
}

.notification-settings-btn {
  transition: all 0.2s ease;
}

.notification-settings-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 自定義滾動條 */
.notification-dropdown-list::-webkit-scrollbar {
  width: 4px;
}

.notification-dropdown-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-dropdown-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notification-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
<template>
  <v-bottom-navigation 
    v-model="activeTab" 
    color="secondary"
    bg-color="surface"
    elevation="8"
    height="65"
    class="mobile-bottom-nav"
    grow
  >
    <v-btn 
      :value="0"
      @click="navigateTo('/')"
      class="nav-btn"
    >
      <v-icon>mdi-home</v-icon>
      <span class="nav-label">首頁</span>
    </v-btn>

    <v-btn 
      :value="1"
      @click="navigateTo('/categories')"
      class="nav-btn"
    >
      <v-icon>mdi-format-list-bulleted</v-icon>
      <span class="nav-label">分類</span>
    </v-btn>

    <v-btn 
      :value="2"
      @click="navigateTo('/promotions')"
      class="nav-btn"
    >
      <v-icon>mdi-percent</v-icon>
      <span class="nav-label">活動</span>
    </v-btn>

    <v-btn 
      :value="3"
      @click="navigateTo('/notifications')"
      class="nav-btn"
      :class="{ 'has-badge': hasUnreadNotifications }"
    >
      <v-badge 
        v-if="unreadCount > 0"
        :content="unreadCount > 99 ? '99+' : unreadCount"
        color="error"
        floating
        offset-x="10"
        offset-y="10"
      >
        <v-icon>mdi-bell</v-icon>
      </v-badge>
      <v-icon v-else>mdi-bell</v-icon>
      <span class="nav-label">通知</span>
    </v-btn>

    <v-btn 
      :value="4"
      @click="navigateTo('/profile')"
      class="nav-btn"
    >
      <v-icon>mdi-account</v-icon>
      <span class="nav-label">會員</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'MobileBottomNav',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    const activeTab = ref(0)

    // 未讀通知數量
    const unreadCount = computed(() => {
      return store.getters['notifications/unreadCount'] || 0
    })

    const hasUnreadNotifications = computed(() => {
      return unreadCount.value > 0
    })

    // 根據當前路由設置活動標籤
    const setActiveTabFromRoute = (routePath) => {
      const routeToTabMap = {
        '/': 0,
        '/categories': 1,
        '/promotions': 2,
        '/notifications': 3,
        '/profile': 4
      }
      
      // 精確匹配
      if (routeToTabMap[routePath] !== undefined) {
        activeTab.value = routeToTabMap[routePath]
        return
      }
      
      // 模糊匹配
      if (routePath.startsWith('/category/')) {
        activeTab.value = 1
      } else if (routePath.startsWith('/user/') || routePath.startsWith('/profile')) {
        activeTab.value = 4
      } else if (routePath.startsWith('/promotion')) {
        activeTab.value = 2
      } else {
        activeTab.value = 0 // 默認首頁
      }
    }

    // 導航函數
    const navigateTo = (path) => {
      if (route.path !== path) {
        router.push(path)
      }
    }

    // 監聽路由變化
    watch(() => route.path, (newPath) => {
      setActiveTabFromRoute(newPath)
    }, { immediate: true })

    return {
      activeTab,
      unreadCount,
      hasUnreadNotifications,
      navigateTo
    }
  }
}
</script>

<style scoped>
.mobile-bottom-nav {
  /* 確保在手機版顯示 */
  display: block !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  /* 確保背景完全不透明 */
  background-color: var(--v-theme-surface) !important;
  background: var(--v-theme-surface) !important;
  backdrop-filter: none !important;
  opacity: 1 !important;
}

/* PC版隱藏 */
@media (min-width: 768px) {
  .mobile-bottom-nav {
    display: none !important;
  }
}

.nav-btn {
  min-width: 0 !important;
  flex-direction: column !important;
  height: 65px !important;
  padding: 6px 4px 8px 4px !important;
  min-height: 65px !important;
}

.nav-btn :deep(.v-btn__content) {
  flex-direction: column !important;
  height: 100% !important;
  gap: 2px !important;
  padding: 0 !important;
}

.nav-btn .v-icon {
  font-size: 24px !important;
  margin-bottom: 0 !important;
}

.nav-label {
  font-size: 11px !important;
  line-height: 1.1 !important;
  text-transform: none !important;
  font-weight: 500 !important;
  margin-top: 1px !important;
}

/* 活動狀態樣式 */
.mobile-bottom-nav :deep(.v-btn--active) {
  color: var(--v-theme-secondary) !important;
}

.mobile-bottom-nav :deep(.v-btn--active .nav-label) {
  font-weight: 600 !important;
}

/* 通知徽章樣式 */
.has-badge .v-icon {
  position: relative;
}

/* 確保在所有主題下都有正確的對比度和不透明背景 */
.mobile-bottom-nav {
  background: var(--v-theme-surface) !important;
  color: var(--v-theme-on-surface) !important;
}

/* 強制確保背景不透明 - 針對 Vuetify 組件內部 */
.mobile-bottom-nav :deep(.v-bottom-navigation) {
  background-color: var(--v-theme-surface) !important;
  background: var(--v-theme-surface) !important;
  backdrop-filter: none !important;
  opacity: 1 !important;
}

/* 確保父容器也不透明 */
.mobile-bottom-nav :deep(.v-bottom-navigation__content) {
  background-color: var(--v-theme-surface) !important;
  background: var(--v-theme-surface) !important;
  opacity: 1 !important;
}

/* 深色模式適配 */
.v-theme--customDark .mobile-bottom-nav {
  border-top-color: rgba(255, 255, 255, 0.1);
  background: var(--v-theme-surface) !important;
}

/* 確保按鈕垂直居中 */
.nav-btn :deep(.v-btn__overlay) {
  opacity: 0.1 !important;
}

.nav-btn:hover :deep(.v-btn__overlay) {
  opacity: 0.08 !important;
}
</style>
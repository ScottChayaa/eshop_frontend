<template>
  <v-app>
    <v-app-bar 
      color="primary" 
      dark 
      app
    >
      <v-toolbar-title>
        <router-link to="/" class="text-decoration-none text-white">
          <v-icon class="mr-2">mdi-storefront</v-icon>
          購物模板
        </router-link>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn 
        icon 
        @click="toggleCart"
      >
        <v-badge 
          :content="cartItemCount" 
          :value="cartItemCount"
          color="error"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
      
      <v-btn 
        icon 
        @click="goToProfile"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <!-- 手機版底部導航 -->
    <v-bottom-navigation 
      v-if="$vuetify.display.mobile"
      v-model="activeTab"
      color="primary"
      bg-color="surface"
      grow
      height="70"
      class="border-t"
    >
      <v-btn 
        :value="0"
        @click="navigateToPage('/')"
        :class="{ 'v-btn--active': isCurrentPage('/') }"
      >
        <v-icon size="24">mdi-home</v-icon>
        <span class="text-caption">首頁</span>
      </v-btn>
      
      <v-btn 
        :value="1"
        @click="navigateToPage('/categories')"
        :class="{ 'v-btn--active': isCurrentPage('/categories') }"
      >
        <v-icon size="24">mdi-view-grid</v-icon>
        <span class="text-caption">分類</span>
      </v-btn>
      
      <v-btn 
        :value="2"
        @click="navigateToPage('/promotions')"
        :class="{ 'v-btn--active': isCurrentPage('/promotions') }"
      >
        <v-icon size="24">mdi-tag</v-icon>
        <span class="text-caption">活動</span>
      </v-btn>
      
      <v-btn 
        :value="3"
        @click="navigateToPage('/notifications')"
        :class="{ 'v-btn--active': isCurrentPage('/notifications') }"
      >
        <v-badge 
          :content="notificationCount" 
          :value="notificationCount > 0"
          color="error"
          offset-x="10"
          offset-y="10"
        >
          <v-icon size="24">mdi-bell</v-icon>
        </v-badge>
        <span class="text-caption">通知</span>
      </v-btn>
      
      <v-btn 
        :value="4"
        @click="navigateToPage('/profile')"
        :class="{ 'v-btn--active': isCurrentPage('/profile') }"
      >
        <v-icon size="24">mdi-account-circle</v-icon>
        <span class="text-caption">會員管理</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const activeTab = ref(0)

    const cartItemCount = computed(() => {
      return store.getters['cart/itemCount']
    })

    const notificationCount = computed(() => {
      // Mock 通知數量，之後可以從 store 獲取
      return 3
    })

    const toggleCart = () => {
      router.push('/cart')
    }

    const goToProfile = () => {
      router.push('/profile')
    }

    const navigateToPage = (path) => {
      router.push(path)
    }

    const isCurrentPage = (path) => {
      return route.path === path
    }

    // 監聽路由變化，更新活躍標籤
    watch(() => route.path, (newPath) => {
      switch (newPath) {
        case '/':
          activeTab.value = 0
          break
        case '/categories':
          activeTab.value = 1
          break
        case '/promotions':
          activeTab.value = 2
          break
        case '/notifications':
          activeTab.value = 3
          break
        case '/profile':
          activeTab.value = 4
          break
        default:
          activeTab.value = 0
      }
    }, { immediate: true })

    return {
      activeTab,
      cartItemCount,
      notificationCount,
      toggleCart,
      goToProfile,
      navigateToPage,
      isCurrentPage
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
}

.v-application {
  background-color: #FAE6B1 !important;
}

/* 底部導航樣式優化 */
.v-bottom-navigation {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1) !important;
}

.v-bottom-navigation .v-btn {
  flex-direction: column !important;
  height: 100% !important;
  min-width: 0 !important;
  padding: 8px 4px !important;
}

.v-bottom-navigation .v-btn .v-icon {
  margin-bottom: 2px !important;
}

.v-bottom-navigation .v-btn--active {
  color: #FFA101 !important;
}

.v-bottom-navigation .v-btn--active .v-icon {
  color: #FFA101 !important;
}

.v-bottom-navigation .v-btn span {
  font-size: 11px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* 通知徽章樣式 */
.v-badge--dot .v-badge__badge {
  height: 8px !important;
  width: 8px !important;
  min-width: 8px !important;
}

/* 活躍狀態動畫 */
.v-bottom-navigation .v-btn {
  transition: color 0.2s ease-in-out !important;
}

.v-bottom-navigation .v-btn:hover {
  color: #FFA101 !important;
}

.v-bottom-navigation .v-btn:hover .v-icon {
  color: #FFA101 !important;
}
</style>

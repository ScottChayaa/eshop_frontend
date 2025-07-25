<template>
  <v-menu
    v-model="menuOpen"
    offset-y
    min-width="200"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
        class="user-menu-activator"
      >
        <v-avatar size="32">
          <v-img 
            v-if="user.avatar" 
            :src="user.avatar"
            :alt="user.name"
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="user-menu-card" elevation="8">
      <div class="pa-4 text-center border-bottom">
        <v-avatar size="48" class="mb-2">
          <v-img 
            v-if="user.avatar" 
            :src="user.avatar"
            :alt="user.name"
          ></v-img>
          <v-icon v-else size="24">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="text-subtitle-2 font-weight-medium custom-dark">
          {{ user.name || '會員' }}
        </div>
        <div class="text-caption text--secondary">
          {{ user.email }}
        </div>
      </div>

      <v-list nav density="compact" class="py-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="handleMenuItemClick(item)"
        >
          <template v-slot:append v-if="item.badge">
            <v-badge
              :content="item.badge"
              :model-value="item.badge > 0"
              color="error"
              inline
            ></v-badge>
          </template>
        </v-list-item>

        <v-divider class="my-1"></v-divider>

        <v-list-item
          prepend-icon="mdi-theme-light-dark"
          title="深色模式"
          @click="toggleTheme"
        >
          <template v-slot:append>
            <v-switch
              :model-value="isDarkTheme"
              hide-details
              inset
              color="secondary"
              @update:model-value="toggleTheme"
            ></v-switch>
          </template>
        </v-list-item>

        <v-divider class="my-1"></v-divider>

        <v-list-item
          prepend-icon="mdi-logout"
          title="登出"
          @click="handleLogout"
          class="text-error"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

export default {
  name: 'UserMenu',
  setup() {
    const store = useStore()
    const router = useRouter()
    const theme = useTheme()
    const menuOpen = ref(false)

    const user = computed(() => 
      store.getters['auth/user'] || {}
    )

    const unreadNotifications = computed(() => 
      store.getters['notifications/unreadCount'] || 0
    )

    const pendingOrders = computed(() => 
      store.getters['orders/pendingCount'] || 0
    )

    const isDarkTheme = computed(() => 
      theme.global.name.value === 'customDark'
    )

    const menuItems = computed(() => [
      {
        title: '個人資料',
        icon: 'mdi-account',
        to: '/profile'
      },
      {
        title: '訂單查詢',
        icon: 'mdi-package-variant',
        to: '/orders',
        badge: pendingOrders.value
      },
      {
        title: '通知中心',
        icon: 'mdi-bell',
        to: '/notifications',
        badge: unreadNotifications.value
      },
      {
        title: '收藏清單',
        icon: 'mdi-heart',
        to: '/favorites'
      },
      {
        title: '地址管理',
        icon: 'mdi-map-marker',
        to: '/addresses'
      },
      {
        title: '帳戶設定',
        icon: 'mdi-cog',
        to: '/settings'
      }
    ])

    const handleMenuItemClick = (item) => {
      menuOpen.value = false
      if (item.to) {
        router.push(item.to)
      }
    }

    const toggleTheme = () => {
      const newTheme = theme.global.name.value === 'customLight' ? 'customDark' : 'customLight'
      theme.global.name.value = newTheme
      localStorage.setItem('theme', newTheme)
    }

    const handleLogout = async () => {
      try {
        menuOpen.value = false
        await store.dispatch('auth/logout')
        store.dispatch('ui/showSuccess', '已成功登出！')
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
        store.dispatch('ui/showError', '登出失敗，請稍後再試')
      }
    }

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && ['customLight', 'customDark'].includes(savedTheme)) {
        theme.global.name.value = savedTheme
      }
    })

    return {
      menuOpen,
      user,
      menuItems,
      isDarkTheme,
      handleMenuItemClick,
      toggleTheme,
      handleLogout
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.user-menu-card {
  border-radius: 12px;
  overflow: hidden;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.theme--dark .border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.user-menu-activator {
  transition: transform 0.2s ease;
}

.user-menu-activator:hover {
  transform: scale(1.05);
}

.v-list-item {
  min-height: 40px;
}

.v-list-item.text-error :deep(.v-list-item__prepend) .v-icon {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
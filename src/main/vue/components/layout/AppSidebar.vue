<template>
  <v-navigation-drawer
    v-model="localOpen"
    app
    temporary
    width="280"
    color="surface"
  >
    <div class="pa-4">
      <div class="d-flex align-center mb-6">
        <v-icon 
          size="28" 
          color="secondary" 
          class="mr-2"
        >
          mdi-shopping
        </v-icon>
        <span class="text-h6 font-weight-bold custom-dark">
          eshop
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          size="small"
          @click="closeSidebar"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div v-if="isAuthenticated" class="user-section mb-6">
        <div class="d-flex align-center pa-3 rounded" style="background: rgba(250, 230, 177, 0.1);">
          <v-avatar size="40" class="mr-3">
            <v-img 
              v-if="user.avatar" 
              :src="user.avatar"
            ></v-img>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-2 font-weight-medium custom-dark">
              {{ user.name || '會員' }}
            </div>
            <div class="text-caption">
              {{ user.email }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 d-md-none">
        <SearchInput 
          @search="handleSearch"
          width="100%"
          density="compact"
        />
      </div>
    </div>

    <v-list nav>
      <v-list-item
        v-for="item in mainNavItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="xl"
        class="ma-2"
        @click="handleNavigation"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader>商品分類</v-list-subheader>
      <v-list-item
        v-for="category in categories"
        :key="category.id"
        :to="{ name: 'Category', params: { id: category.id } }"
        :prepend-icon="category.icon"
        :title="category.name"
        rounded="xl"
        class="ma-2"
        @click="handleNavigation"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader v-if="isAuthenticated">會員專區</v-list-subheader>
      <v-list-item
        v-if="isAuthenticated"
        v-for="item in userNavItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="xl"
        class="ma-2"
        @click="handleNavigation"
      ></v-list-item>

      <v-list-subheader v-if="!isAuthenticated">會員服務</v-list-subheader>
      <v-list-item
        v-if="!isAuthenticated"
        v-for="item in guestNavItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="xl"
        class="ma-2"
        @click="handleNavigation"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn
          v-if="isAuthenticated"
          block
          variant="outlined"
          color="error"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          登出
        </v-btn>
        <div v-else class="d-flex flex-column">
          <v-btn
            block
            color="primary"
            class="mb-2"
            prepend-icon="mdi-login"
            :to="{ name: 'Login' }"
            @click="handleNavigation"
          >
            登入
          </v-btn>
          <v-btn
            block
            variant="outlined"
            color="secondary"
            prepend-icon="mdi-account-plus"
            :to="{ name: 'Register' }"
            @click="handleNavigation"
          >
            註冊
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SearchInput from '../common/SearchInput.vue'

export default {
  name: 'AppSidebar',
  components: {
    SearchInput
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    
    const localOpen = ref(props.open)

    const isAuthenticated = computed(() => 
      store.getters['auth/isAuthenticated']
    )
    
    const user = computed(() => 
      store.getters['auth/user'] || {}
    )

    const mainNavItems = [
      { title: '首頁', icon: 'mdi-home', to: '/' },
      { title: '所有商品', icon: 'mdi-shopping', to: '/products' },
      { title: '促銷活動', icon: 'mdi-tag-heart', to: '/promotions' },
      { title: '購物車', icon: 'mdi-cart', to: '/cart' }
    ]

    const categories = [
      { id: 'electronics', name: '電子產品', icon: 'mdi-laptop' },
      { id: 'clothing', name: '服飾配件', icon: 'mdi-tshirt-crew' },
      { id: 'books', name: '書籍雜誌', icon: 'mdi-book-open' },
      { id: 'home', name: '居家生活', icon: 'mdi-home-variant' },
      { id: 'sports', name: '運動戶外', icon: 'mdi-basketball' }
    ]

    const userNavItems = [
      { title: '個人資料', icon: 'mdi-account', to: '/user/profile' },
      { title: '訂單查詢', icon: 'mdi-package-variant', to: '/user/orders' },
      { title: '通知中心', icon: 'mdi-bell', to: '/user/notifications' }
    ]

    const guestNavItems = [
      { title: '會員登入', icon: 'mdi-login', to: '/user/login' },
      { title: '會員註冊', icon: 'mdi-account-plus', to: '/user/register' }
    ]

    watch(() => props.open, (newVal) => {
      localOpen.value = newVal
    })

    watch(localOpen, (newVal) => {
      emit('update:open', newVal)
    })

    const closeSidebar = () => {
      localOpen.value = false
    }

    const handleNavigation = () => {
      closeSidebar()
    }

    const handleSearch = (query) => {
      if (query.trim()) {
        router.push({ name: 'Search', query: { q: query } })
        closeSidebar()
      }
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/')
        closeSidebar()
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return {
      localOpen,
      isAuthenticated,
      user,
      mainNavItems,
      categories,
      userNavItems,
      guestNavItems,
      closeSidebar,
      handleNavigation,
      handleSearch,
      handleLogout
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.user-section {
  border-radius: 8px;
}

.v-list-item {
  margin: 4px 8px;
}

.v-list-item--active {
  background: rgba(250, 230, 177, 0.2) !important;
  color: #31525B !important;
}

.v-list-item--active .v-icon {
  color: #FFA101 !important;
}
</style>
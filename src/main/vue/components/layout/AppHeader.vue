<template>
  <v-app-bar app height="64" color="surface" elevation="1">
    <v-container class="d-flex align-center">
      <div class="d-flex align-center">
        <v-btn
          icon
          @click="toggleSidebar"
          class="mr-2 d-lg-none"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <router-link 
          to="/" 
          class="text-decoration-none"
          @click="$emit('navigate')"
        >
          <div class="d-flex align-center">
            <v-icon 
              size="32" 
              color="secondary" 
              class="mr-2"
            >
              mdi-shopping
            </v-icon>
            <span class="text-h6 font-weight-bold custom-dark">
              eshop
            </span>
          </div>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center mr-4">
        <SearchInput 
          @search="handleSearch"
          class="mr-4"
        />
      </div>

      <div class="d-flex align-center">
        <!-- PC版顯示所有按鈕 -->
        <template v-if="$vuetify.display.mdAndUp">
          <v-btn
            icon
            @click="toggleTheme"
            class="mr-2"
          >
            <v-icon>{{ themeIcon }}</v-icon>
          </v-btn>

          <CartButton class="mr-2" />

          <UserMenu v-if="isAuthenticated" />
          <LoginButton v-else />
        </template>
        
        <!-- 手機版只顯示購物車 -->
        <template v-else>
          <CartButton />
        </template>
      </div>
    </v-container>

    <template v-slot:extension v-if="showSearchOnMobile">
      <v-container class="d-md-none py-2">
        <SearchInput 
          @search="handleSearch"
          width="100%"
        />
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import SearchInput from '../common/SearchInput.vue'
import CartButton from '../common/CartButton.vue'
import UserMenu from '../common/UserMenu.vue'
import LoginButton from '../common/LoginButton.vue'

export default {
  name: 'AppHeader',
  components: {
    SearchInput,
    CartButton,
    UserMenu,
    LoginButton
  },
  emits: ['toggle-sidebar', 'navigate'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    const theme = useTheme()
    
    const showSearchOnMobile = ref(false)

    const isAuthenticated = computed(() => 
      store.getters['auth/isAuthenticated']
    )

    const themeIcon = computed(() => 
      theme.global.name.value === 'customLight' ? 'mdi-weather-night' : 'mdi-weather-sunny'
    )

    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }

    const toggleTheme = () => {
      const newTheme = theme.global.name.value === 'customLight' ? 'customDark' : 'customLight'
      theme.global.name.value = newTheme
      localStorage.setItem('theme', newTheme)
    }

    const handleSearch = (query) => {
      if (query.trim()) {
        router.push({ name: 'Search', query: { q: query } })
        emit('navigate')
      }
    }

    return {
      isAuthenticated,
      themeIcon,
      showSearchOnMobile,
      toggleSidebar,
      toggleTheme,
      handleSearch
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.theme--dark .v-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
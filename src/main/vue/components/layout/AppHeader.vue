<template>
  <v-app-bar app height="64" color="surface" elevation="4">
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
          density="compact"
          class="mr-4"
        />
      </div>

      <div class="d-flex align-center">
        <!-- PC版顯示所有按鈕 -->
        <template v-if="$vuetify.display.mdAndUp">
          <CartButton class="mr-2" />
          <UserMenu v-if="isAuthenticated" />
          <UserButton v-else />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SearchInput from '../common/SearchInput.vue'
import CartButton from '../common/CartButton.vue'
import UserButton from '../common/UserButton.vue'
import UserMenu from '../common/UserMenu.vue'

export default {
  name: 'AppHeader',
  components: {
    SearchInput,
    CartButton,
    UserButton,
    UserMenu
  },
  emits: ['toggle-sidebar', 'navigate'],
  setup(props, { emit }) {
    const router = useRouter()
    const store = useStore()
    
    const showSearchOnMobile = ref(false)
    
    const isAuthenticated = computed(() => 
      store.getters['auth/isAuthenticated']
    )


    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }


    const handleSearch = (query) => {
      if (query.trim()) {
        router.push({ name: 'Search', query: { q: query } })
        emit('navigate')
      }
    }

    return {
      showSearchOnMobile,
      isAuthenticated,
      toggleSidebar,
      handleSearch
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

/* 移除底線，使用 elevation 陰影效果 */
</style>
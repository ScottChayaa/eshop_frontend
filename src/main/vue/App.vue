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
          eshop_frontend
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
      grow
    >
      <v-btn @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
        <span>首頁</span>
      </v-btn>
      
      <v-btn @click="$router.push('/categories')">
        <v-icon>mdi-view-grid</v-icon>
        <span>分類</span>
      </v-btn>
      
      <v-btn @click="$router.push('/promotions')">
        <v-icon>mdi-tag</v-icon>
        <span>活動</span>
      </v-btn>
      
      <v-btn @click="$router.push('/notifications')">
        <v-icon>mdi-bell</v-icon>
        <span>通知</span>
      </v-btn>
      
      <v-btn @click="$router.push('/profile')">
        <v-icon>mdi-account</v-icon>
        <span>會員</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    const activeTab = ref(0)

    const cartItemCount = computed(() => {
      return store.getters['cart/itemCount']
    })

    const toggleCart = () => {
      router.push('/cart')
    }

    const goToProfile = () => {
      router.push('/profile')
    }

    return {
      activeTab,
      cartItemCount,
      toggleCart,
      goToProfile
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
</style>
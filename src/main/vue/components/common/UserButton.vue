<template>
  <v-btn
    icon
    color="secondary"
    @click="handleUserAction"
    class="user-button"
  >
    <v-icon>mdi-account</v-icon>
  </v-btn>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'UserButton',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => 
      store.getters['auth/isAuthenticated']
    )

    const handleUserAction = () => {
      if (isAuthenticated.value) {
        // 已登入，導向會員管理頁
        router.push('/profile')
      } else {
        // 未登入，導向登入頁
        router.push('/login')
      }
    }

    return {
      handleUserAction
    }
  }
}
</script>

<style scoped>
.user-button {
  transition: transform 0.2s ease;
}

.user-button:hover {
  transform: scale(1.05);
}
</style>
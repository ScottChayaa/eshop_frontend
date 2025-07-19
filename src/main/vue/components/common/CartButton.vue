<template>
  <v-btn
    icon
    :color="cartItemCount > 0 ? 'secondary' : 'default'"
    @click="goToCart"
    class="cart-button"
  >
    <v-badge
      :content="cartItemCount"
      :model-value="cartItemCount > 0"
      color="error"
      overlap
    >
      <v-icon>{{ cartIcon }}</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CartButton',
  setup() {
    const store = useStore()
    const router = useRouter()

    const cartItemCount = computed(() => 
      store.getters['cart/itemCount'] || 0
    )

    const cartIcon = computed(() => 
      cartItemCount.value > 0 ? 'mdi-cart' : 'mdi-cart-outline'
    )

    const goToCart = () => {
      router.push('/cart')
    }

    return {
      cartItemCount,
      cartIcon,
      goToCart
    }
  }
}
</script>

<style scoped>
.cart-button {
  position: relative;
}

.cart-button :deep(.v-badge__badge) {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
}
</style>
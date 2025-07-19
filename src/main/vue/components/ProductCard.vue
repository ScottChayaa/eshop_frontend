<template>
  <v-card 
    class="product-card" 
    @click="goToProduct"
    hover
  >
    <v-img 
      :src="product.image" 
      height="200"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    
    <v-card-text class="pb-2">
      <div class="text-subtitle1 font-weight-medium text-truncate" style="color: #31525B">
        {{ product.name }}
      </div>
    </v-card-text>
    
    <v-card-actions class="pt-0">
      <div class="w-100">
        <div class="text-h6 font-weight-bold" style="color: #FFA101">
          NT$ {{ formatPrice(product.price) }}
        </div>
        <div 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-caption text-decoration-line-through"
          style="color: #999"
        >
          NT$ {{ formatPrice(product.originalPrice) }}
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const goToProduct = () => {
      router.push(`/product/${props.product.id}`)
    }

    return {
      formatPrice,
      goToProduct
    }
  }
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
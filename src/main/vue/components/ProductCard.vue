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
      <div class="text-h6 font-weight-medium text-truncate" style="color: #31525B">
        {{ product.name }}
      </div>
    </v-card-text>
    
    <v-card-text class="pt-0">
      <!-- 商品價格 -->
      <div class="text-h6 font-weight-bold mb-2" style="color: #FFA101">
        NT$ {{ formatPrice(product.price) }}
      </div>

      <!-- 商品評價 -->
      <div class="d-flex align-center" v-if="product.rating">
        <v-icon size="16" color="orange">mdi-star</v-icon>
        <span class="text-caption ml-1" style="color: #666">
          {{ formatRating(product.rating) }}
        </span>
      </div>
      
    </v-card-text>
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

    const formatRating = (rating) => {
      return parseFloat(rating).toFixed(1)
    }

    const goToProduct = () => {
      router.push(`/product/${props.product.id}`)
    }

    return {
      formatPrice,
      formatRating,
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
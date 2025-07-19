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
    
    <v-card-text class="pb-0">
      <div class="text-subtitle1 font-weight-medium text-truncate" style="color: #31525B">
        {{ product.name }}
      </div>
      
      <div class="d-flex align-center mt-2">
        <v-rating 
          :model-value="product.rating" 
          color="amber"
          density="compact"
          readonly
          size="small"
        ></v-rating>
        <span class="text-caption ml-2" style="color: #31525B">
          ({{ product.reviews }})
        </span>
      </div>
    </v-card-text>
    
    <v-card-actions class="pt-0">
      <div class="d-flex align-center justify-space-between w-100">
        <div>
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
        
        <div class="d-flex">
          <v-btn 
            icon 
            size="small" 
            color="grey-lighten-1"
            @click.stop="addToFavorites"
            class="mr-1"
          >
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>
          <v-btn 
            icon 
            size="small" 
            color="primary"
            @click.stop="addToCart"
          >
            <v-icon>mdi-cart-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['add-to-cart', 'add-to-favorites'],
  setup(props, { emit }) {
    const router = useRouter()
    const store = useStore()

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const goToProduct = () => {
      router.push(`/product/${props.product.id}`)
    }

    const addToCart = () => {
      emit('add-to-cart', props.product)
    }

    const addToFavorites = () => {
      emit('add-to-favorites', props.product)
    }

    return {
      formatPrice,
      goToProduct,
      addToCart,
      addToFavorites
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
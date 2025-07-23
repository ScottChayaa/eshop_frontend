<template>
  <v-card 
    class="product-list-item" 
    @click="goToProduct"
    hover
    flat
    outlined
  >
    <v-row no-gutters>
      <!-- 商品圖片 -->
      <v-col cols="3" sm="2" md="2">
        <v-img 
          :src="product.image" 
          height="120"
          cover
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
      
      <!-- 商品資訊 -->
      <v-col cols="9" sm="10" md="10">
        <v-card-text class="py-3">
          <v-row>
            <!-- 商品名稱與描述 -->
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-medium mb-2" style="color: #31525B">
                {{ product.name }}
              </h3>
              <p class="text-body2 text--secondary mb-2" v-if="product.description">
                {{ truncateDescription(product.description) }}
              </p>
              <div class="d-flex align-center mb-2" v-if="product.rating">
                <v-rating
                  :model-value="product.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                ></v-rating>
                <span class="text-caption ml-2 text--secondary">
                  ({{ product.reviews || 0 }})
                </span>
              </div>
            </v-col>
            
            <!-- 價格與操作 -->
            <v-col cols="12" md="6" class="text-right">
              <div class="price-section mb-3">
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
              
              <!-- 操作按鈕 -->
              <div class="action-buttons">
                <v-btn
                  color="primary"
                  size="small"
                  variant="outlined"
                  class="mr-2"
                  @click.stop="addToCart"
                >
                  <v-icon start>mdi-cart-plus</v-icon>
                  加入購物車
                </v-btn>
                <v-btn
                  color="secondary"
                  size="small"
                  variant="text"
                  icon
                  @click.stop="toggleFavorite"
                >
                  <v-icon>{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'ProductListItem',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    
    const isFavorite = computed(() => {
      const favorites = store.getters['favorites/favoriteIds']
      return favorites.includes(props.product.id)
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const truncateDescription = (description, maxLength = 100) => {
      if (!description) return ''
      return description.length > maxLength 
        ? description.substring(0, maxLength) + '...'
        : description
    }

    const goToProduct = () => {
      router.push(`/product/${props.product.id}`)
    }

    const addToCart = () => {
      store.dispatch('cart/addToCart', {
        productId: props.product.id,
        quantity: 1
      })
      
      // 顯示成功提示
      store.dispatch('ui/showSuccess', `${props.product.name} 已加入購物車`)
    }

    const toggleFavorite = () => {
      if (isFavorite.value) {
        store.dispatch('favorites/removeFromFavorites', props.product.id)
        store.dispatch('ui/showInfo', '已從收藏中移除')
      } else {
        store.dispatch('favorites/addToFavorites', props.product.id)
        store.dispatch('ui/showSuccess', '已加入收藏')
      }
    }

    return {
      isFavorite,
      formatPrice,
      truncateDescription,
      goToProduct,
      addToCart,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.product-list-item {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 16px;
}

.product-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.price-section {
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 響應式設計 */
@media (max-width: 960px) {
  .action-buttons {
    justify-content: flex-start;
    margin-top: 12px;
  }
  
  .price-section {
    text-align: left;
    margin-bottom: 8px;
  }
}

@media (max-width: 600px) {
  .product-list-item .v-card-text {
    padding: 12px !important;
  }
  
  .action-buttons .v-btn {
    min-width: auto !important;
  }
  
  .action-buttons .v-btn:not(.v-btn--icon) {
    font-size: 0.75rem;
    padding: 0 8px;
  }
}
</style>
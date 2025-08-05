<template>
  <div class="product-details">
    <!-- 商品基本資訊 -->
    <div class="product-info-section">
      <h1 class="product-title">{{ product.name }}</h1>
      
      <!-- 評分與評價 -->
      <div class="rating-section" v-if="product.rating">
        <v-rating
          :model-value="product.rating"
          color="warning"
          density="compact"
          readonly
          half-increments
        ></v-rating>
        <span class="rating-text">
          {{ product.rating }} ({{ product.reviews || 0 }} 則評價)
        </span>
      </div>

      <!-- 價格區域 -->
      <div class="price-section">
        <div class="current-price">
          NT$ {{ formatPrice(product.price) }}
        </div>
        <div 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="original-price"
        >
          NT$ {{ formatPrice(product.originalPrice) }}
        </div>
        <div 
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="discount-badge"
        >
          省 NT$ {{ formatPrice(product.originalPrice - product.price) }}
        </div>
      </div>
    </div>


    <!-- 數量選擇 -->
    <div class="quantity-section">
      <label class="quantity-label">數量</label>
      <div class="quantity-controls">
        <v-btn
          icon="mdi-minus"
          variant="outlined"
          size="small"
          :disabled="quantity <= 1"
          @click="decreaseQuantity"
        ></v-btn>
        <v-text-field
          v-model.number="quantity"
          type="number"
          min="1"
          :max="maxQuantity"
          variant="outlined"
          density="compact"
          hide-details
          class="quantity-input"
          @blur="validateQuantity"
        ></v-text-field>
        <v-btn
          icon="mdi-plus"
          variant="outlined"
          size="small"
          :disabled="quantity >= maxQuantity"
          @click="increaseQuantity"
        ></v-btn>
      </div>
      <div class="stock-info">
        <span class="stock-text">
          庫存：{{ currentStock }} 件
        </span>
      </div>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="action-section">
      <v-btn
        :disabled="!canAddToCart"
        :loading="addingToCart"
        color="secondary"
        size="large"
        block
        class="add-to-cart-btn"
        @click="addToCart"
      >
        <v-icon start>mdi-cart-plus</v-icon>
        加入購物車
      </v-btn>
      

      <!-- 收藏按鈕 -->
      <v-btn
        :color="isFavorite ? 'error' : 'grey'"
        variant="outlined"
        size="large"
        block
        class="favorite-btn"
        @click="toggleFavorite"
      >
        <v-icon start>{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        {{ isFavorite ? '已收藏' : '加入收藏' }}
      </v-btn>
    </div>

    <!-- 運送資訊 -->
    <div class="shipping-info">
      <v-card variant="outlined" class="shipping-card">
        <v-card-text class="py-3">
          <div class="shipping-item">
            <v-icon start color="success">mdi-truck-delivery</v-icon>
            <span>免運費：訂單滿 NT$ 990</span>
          </div>
          <div class="shipping-item">
            <v-icon start color="info">mdi-clock-outline</v-icon>
            <span>預計送達：3-5 個工作天</span>
          </div>
          <div class="shipping-item">
            <v-icon start color="warning">mdi-shield-check</v-icon>
            <span>7 天鑑賞期，不滿意可退貨</span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ProductDetails',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['spec-change', 'add-to-cart'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()

    const quantity = ref(1)
    const addingToCart = ref(false)


    // 當前庫存
    const currentStock = computed(() => {
      return props.product?.stock || 999
    })

    // 最大可購買數量
    const maxQuantity = computed(() => {
      return Math.min(currentStock.value, 99)
    })

    // 是否可以加入購物車
    const canAddToCart = computed(() => {
      // 確保商品存在
      if (!props.product) return false
      
      return quantity.value > 0 && quantity.value <= maxQuantity.value && currentStock.value > 0
    })

    // 是否收藏
    const isFavorite = computed(() => {
      if (!props.product?.id) return false
      try {
        return store.getters['favorites/isFavorite'](props.product.id)
      } catch (error) {
        console.warn('Favorites getter error:', error)
        return false
      }
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }


    const increaseQuantity = () => {
      if (quantity.value < maxQuantity.value) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const validateQuantity = () => {
      if (quantity.value < 1) quantity.value = 1
      if (quantity.value > maxQuantity.value) quantity.value = maxQuantity.value
    }

    const addToCart = async () => {
      addingToCart.value = true
      
      try {
        const cartItem = {
          ...props.product,
          quantity: quantity.value
        }

        await store.dispatch('cart/addItem', cartItem)
        
        // 顯示成功訊息
        store.dispatch('ui/showSnackbar', {
          message: '商品已加入購物車',
          color: 'success'
        })

        emit('add-to-cart', cartItem)
      } catch (error) {
        store.dispatch('ui/showSnackbar', {
          message: '加入購物車失敗，請稍後再試',
          color: 'error'
        })
      } finally {
        addingToCart.value = false
      }
    }


    const toggleFavorite = async () => {
      if (!props.product?.id) return
      
      try {
        const wasFavorite = isFavorite.value
        await store.dispatch('favorites/toggleFavorite', props.product.id)
        
        // 顯示成功訊息
        const message = wasFavorite ? '已從收藏中移除' : '已加入收藏'
        store.dispatch('ui/showSnackbar', {
          message,
          color: 'success'
        })
      } catch (error) {
        // 如果是認證錯誤，提示用戶登入
        const message = error.message || '操作失敗，請稍後再試'
        store.dispatch('ui/showSnackbar', {
          message,
          color: 'error'
        })
      }
    }


    return {
      quantity,
      addingToCart,
      currentStock,
      maxQuantity,
      canAddToCart,
      isFavorite,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      validateQuantity,
      addToCart,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.product-details {
  padding: 24px;
}

.product-info-section {
  margin-bottom: 32px;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #31525B;
  margin-bottom: 16px;
  line-height: 1.3;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #FFA101;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}


.quantity-section {
  margin-bottom: 24px;
}

.quantity-label {
  display: block;
  font-weight: 600;
  color: #31525B;
  margin-bottom: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.quantity-input {
  width: 80px;
  text-align: center;
}

:deep(.quantity-input input) {
  text-align: center;
}

.stock-info {
  color: #666;
  font-size: 0.9rem;
}

.stock-text {
  color: #28a745;
}

.action-section {
  margin-bottom: 24px;
}

.add-to-cart-btn,
.favorite-btn {
  margin-bottom: 12px !important;
}

.shipping-info .shipping-card {
  background: rgba(250, 230, 177, 0.1);
  border-color: #FAE6B1;
}

.shipping-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.shipping-item:last-child {
  margin-bottom: 0;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .product-details {
    padding: 16px;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.75rem;
  }
  
  .price-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .quantity-controls {
    width: 100%;
    justify-content: center;
  }
}

</style>
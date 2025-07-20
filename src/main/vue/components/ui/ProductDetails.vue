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

    <!-- 規格選擇區域 -->
    <div class="specifications-section" v-if="product.variants && product.variants.length > 0">
      <div 
        v-for="spec in availableSpecs" 
        :key="spec.name"
        class="spec-group"
      >
        <label class="spec-label">{{ spec.label }}</label>
        
        <!-- 顏色選擇器 -->
        <div v-if="spec.type === 'color'" class="color-options">
          <div 
            v-for="option in spec.options"
            :key="option.value"
            :class="['color-option', { 'selected': selectedSpecs[spec.name] === option.value }]"
            @click="selectSpec(spec.name, option.value)"
            :style="{ backgroundColor: option.color }"
            :title="option.label"
          >
            <v-icon v-if="selectedSpecs[spec.name] === option.value" size="small" color="white">
              mdi-check
            </v-icon>
          </div>
        </div>
        
        <!-- 下拉選單選擇器 -->
        <v-select
          v-else
          v-model="selectedSpecs[spec.name]"
          :items="spec.options"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          :placeholder="`請選擇${spec.label}`"
          class="spec-select"
        ></v-select>
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
      
      <v-btn
        :disabled="!canAddToCart"
        color="primary"
        variant="outlined"
        size="large"
        block
        class="buy-now-btn"
        @click="buyNow"
      >
        <v-icon start>mdi-lightning-bolt</v-icon>
        立即購買
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
    const selectedSpecs = ref({})
    const addingToCart = ref(false)

    // 可用規格選項
    const availableSpecs = computed(() => {
      if (!props.product.variants) return []
      
      const specs = []
      const variants = props.product.variants

      // 提取所有可能的規格類型
      variants.forEach(variant => {
        Object.keys(variant.specs || {}).forEach(specKey => {
          if (!specs.find(s => s.name === specKey)) {
            const specConfig = getSpecConfig(specKey)
            specs.push({
              name: specKey,
              label: specConfig.label,
              type: specConfig.type,
              options: []
            })
          }
        })
      })

      // 填充選項
      specs.forEach(spec => {
        const options = new Set()
        variants.forEach(variant => {
          if (variant.specs && variant.specs[spec.name]) {
            options.add(JSON.stringify({
              value: variant.specs[spec.name],
              label: variant.specs[spec.name],
              color: getColorValue(variant.specs[spec.name])
            }))
          }
        })
        spec.options = Array.from(options).map(option => JSON.parse(option))
      })

      return specs
    })

    // 當前選中的變體
    const currentVariant = computed(() => {
      if (!props.product.variants) return null
      
      return props.product.variants.find(variant => {
        if (!variant.specs) return false
        return Object.keys(selectedSpecs.value).every(key => 
          variant.specs[key] === selectedSpecs.value[key]
        )
      })
    })

    // 當前庫存
    const currentStock = computed(() => {
      return currentVariant.value?.stock || props.product.stock || 0
    })

    // 最大可購買數量
    const maxQuantity = computed(() => {
      return Math.min(currentStock.value, 99)
    })

    // 是否可以加入購物車
    const canAddToCart = computed(() => {
      // 檢查是否有必要的規格選擇
      const requiredSpecs = availableSpecs.value.length > 0
      const hasAllSpecs = requiredSpecs ? 
        availableSpecs.value.every(spec => selectedSpecs.value[spec.name]) : true
      
      return hasAllSpecs && quantity.value > 0 && quantity.value <= maxQuantity.value
    })

    // 是否收藏
    const isFavorite = computed(() => {
      return store.getters['favorites/isFavorite'](props.product.id)
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const getSpecConfig = (specKey) => {
      const configs = {
        color: { label: '顏色', type: 'color' },
        size: { label: '尺寸', type: 'select' },
        storage: { label: '容量', type: 'select' },
        material: { label: '材質', type: 'select' }
      }
      return configs[specKey] || { label: specKey, type: 'select' }
    }

    const getColorValue = (colorName) => {
      const colorMap = {
        '黑色': '#000000',
        '白色': '#ffffff',
        '紅色': '#ff0000',
        '藍色': '#0000ff',
        '綠色': '#00ff00',
        '黃色': '#ffff00',
        '粉色': '#ffc0cb',
        '灰色': '#808080',
        '銀色': '#c0c0c0',
        '金色': '#ffd700'
      }
      return colorMap[colorName] || '#cccccc'
    }

    const selectSpec = (specName, value) => {
      selectedSpecs.value[specName] = value
      emit('spec-change', { ...selectedSpecs.value })
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
          quantity: quantity.value,
          selectedSpecs: { ...selectedSpecs.value },
          variant: currentVariant.value
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

    const buyNow = async () => {
      await addToCart()
      if (canAddToCart.value) {
        router.push('/checkout')
      }
    }

    const toggleFavorite = () => {
      if (isFavorite.value) {
        store.dispatch('favorites/removeFavorite', props.product.id)
      } else {
        store.dispatch('favorites/addFavorite', props.product)
      }
    }

    // 監聽規格變化，重置數量
    watch(currentVariant, () => {
      if (quantity.value > maxQuantity.value) {
        quantity.value = Math.min(maxQuantity.value, 1)
      }
    })

    return {
      quantity,
      selectedSpecs,
      addingToCart,
      availableSpecs,
      currentStock,
      maxQuantity,
      canAddToCart,
      isFavorite,
      formatPrice,
      selectSpec,
      increaseQuantity,
      decreaseQuantity,
      validateQuantity,
      addToCart,
      buyNow,
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

.specifications-section {
  margin-bottom: 24px;
}

.spec-group {
  margin-bottom: 20px;
}

.spec-label {
  display: block;
  font-weight: 600;
  color: #31525B;
  margin-bottom: 8px;
}

.color-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #FFA101;
  box-shadow: 0 0 0 2px rgba(255, 161, 1, 0.3);
}

.spec-select {
  max-width: 200px;
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
.buy-now-btn,
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

@media (min-width: 1200px) {
  .spec-select {
    max-width: 250px;
  }
}
</style>
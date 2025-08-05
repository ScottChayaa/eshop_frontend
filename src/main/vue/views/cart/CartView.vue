<template>
  <v-container class="cart-container">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6" style="color: #31525B">
          <v-icon start size="large">mdi-cart</v-icon>
          購物車
        </h1>
      </v-col>
    </v-row>

    <!-- 空購物車狀態 -->
    <v-row v-if="!hasItems" justify="center">
      <v-col cols="12" md="8" class="text-center">
        <v-card flat class="empty-cart-card">
          <v-card-text class="py-8">
            <v-icon size="120" color="grey-lighten-1" class="mb-4">
              mdi-cart-outline
            </v-icon>
            <h2 class="text-h5 mb-4" style="color: #31525B">您的購物車是空的</h2>
            <p class="text-body-1 mb-6 text-grey-darken-1">
              快去逛逛，將喜歡的商品加入購物車吧！
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              @click="goShopping"
            >
              <v-icon start>mdi-shopping</v-icon>
              開始購物
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 有商品時的購物車 -->
    <v-row v-else>
      <!-- 購物車商品列表 -->
      <v-col cols="12" lg="8">
        <v-card flat>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>購物清單 ({{ itemCount }} 件商品)</span>
            <v-btn
              variant="text"
              color="error"
              size="small"
              @click="showClearDialog = true"
            >
              <v-icon start>mdi-trash-can-outline</v-icon>
              清空購物車
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="px-0">
            <div
              v-for="item in formattedItems"
              :key="item.key"
              class="cart-item"
            >
              <v-row no-gutters align="center" class="pa-4">
                <!-- 商品圖片 -->
                <v-col cols="3" sm="2">
                  <v-img
                    :src="item.image"
                    height="80"
                    width="80"
                    cover
                    class="rounded"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate size="20"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
                
                <!-- 商品資訊 -->
                <v-col cols="9" sm="10">
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" class="pr-sm-4">
                      <h3 class="text-subtitle-1 font-weight-medium mb-1">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.specsDisplay" class="text-caption text-grey-darken-1 mb-2">
                        {{ item.specsDisplay }}
                      </p>
                      <div class="text-h6 font-weight-bold" style="color: #FFA101">
                        NT$ {{ formatPrice(item.variant?.price || item.price) }}
                      </div>
                    </v-col>
                    
                    <!-- 數量控制與小計 -->
                    <v-col cols="12" sm="6" class="mt-3 mt-sm-0">
                      <v-row no-gutters align="center" justify="space-between">
                        <v-col cols="auto">
                          <div class="quantity-controls d-flex align-center">
                            <v-btn
                              icon="mdi-minus"
                              variant="outlined"
                              size="small"
                              :disabled="item.quantity <= 1"
                              @click="updateQuantity(item.key, item.quantity - 1)"
                            ></v-btn>
                            <v-text-field
                              :model-value="item.quantity"
                              type="number"
                              min="1"
                              max="99"
                              variant="outlined"
                              density="compact"
                              hide-details
                              class="quantity-input mx-2"
                              style="max-width: 80px"
                              @update:model-value="updateQuantity(item.key, $event)"
                            ></v-text-field>
                            <v-btn
                              icon="mdi-plus"
                              variant="outlined"
                              size="small"
                              :disabled="item.quantity >= 99"
                              @click="updateQuantity(item.key, item.quantity + 1)"
                            ></v-btn>
                          </div>
                        </v-col>
                        
                        <v-col cols="auto" class="text-right">
                          <div class="text-subtitle-1 font-weight-bold mb-1">
                            NT$ {{ formatPrice(item.itemTotal) }}
                          </div>
                          <v-btn
                            icon="mdi-delete-outline"
                            variant="text"
                            size="small"
                            color="error"
                            @click="removeItem(item.key)"
                          ></v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- 訂單摘要 -->
      <v-col cols="12" lg="4">
        <v-card class="order-summary-card" flat>
          <v-card-title>
            <v-icon start>mdi-calculator</v-icon>
            訂單摘要
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="summary-row d-flex justify-space-between mb-3">
              <span>商品小計 ({{ itemCount }} 件)</span>
              <span>NT$ {{ formatPrice(totalPrice) }}</span>
            </div>
            
            <div class="summary-row d-flex justify-space-between mb-3">
              <span>運費</span>
              <span v-if="shippingFee === 0" class="text-success">
                免運費
              </span>
              <span v-else>NT$ {{ formatPrice(shippingFee) }}</span>
            </div>
            
            <v-divider class="my-3"></v-divider>
            
            <div class="summary-row d-flex justify-space-between mb-4">
              <span class="text-h6 font-weight-bold">總計</span>
              <span class="text-h6 font-weight-bold" style="color: #FFA101">
                NT$ {{ formatPrice(finalTotal) }}
              </span>
            </div>
            
            <!-- 免運費提示 -->
            <v-alert
              v-if="amountToFreeShipping > 0"
              type="info"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              <template v-slot:prepend>
                <v-icon>mdi-truck-delivery</v-icon>
              </template>
              再購買 NT$ {{ formatPrice(amountToFreeShipping) }} 即可享免運費
            </v-alert>
            
            <v-btn
              color="secondary"
              size="large"
              block
              rounded="pill"
              class="mb-3"
              @click="goToCheckout"
            >
              <v-icon start>mdi-credit-card</v-icon>
              前往結帳
            </v-btn>
            
            <v-btn
              color="primary"
              size="large"
              block
              rounded="pill"
              elevation="2"
              @click="goShopping"
            >
              <v-icon start>mdi-shopping</v-icon>
              繼續購物
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 清空購物車確認對話框 -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon start color="warning">mdi-alert</v-icon>
          確認清空購物車
        </v-card-title>
        <v-card-text>
          確定要清空購物車中的所有商品嗎？此操作無法復原。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showClearDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            @click="clearCart"
          >
            確定清空
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CartView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const showClearDialog = ref(false)

    // 購物車相關計算屬性
    const items = computed(() => store.getters['cart/items'])
    const formattedItems = computed(() => store.getters['cart/formattedItems'])
    const itemCount = computed(() => store.getters['cart/itemCount'])
    const totalPrice = computed(() => store.getters['cart/totalPrice'])
    const shippingFee = computed(() => store.getters['cart/shippingFee'])
    const finalTotal = computed(() => store.getters['cart/finalTotal'])
    const amountToFreeShipping = computed(() => store.getters['cart/amountToFreeShipping'])
    const hasItems = computed(() => store.getters['cart/hasItems'])

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const updateQuantity = async (itemKey, newQuantity) => {
      try {
        const quantity = parseInt(newQuantity)
        if (quantity < 1) return
        
        await store.dispatch('cart/updateQuantity', {
          itemKey,
          quantity
        })
      } catch (error) {
        store.dispatch('ui/showSnackbar', {
          message: '更新數量失敗，請稍後再試',
          color: 'error'
        })
      }
    }

    const removeItem = async (itemKey) => {
      try {
        await store.dispatch('cart/removeItem', itemKey)
        store.dispatch('ui/showSnackbar', {
          message: '商品已從購物車移除',
          color: 'success'
        })
      } catch (error) {
        store.dispatch('ui/showSnackbar', {
          message: '移除商品失敗，請稍後再試',
          color: 'error'
        })
      }
    }

    const clearCart = async () => {
      try {
        await store.dispatch('cart/clearCart')
        showClearDialog.value = false
        store.dispatch('ui/showSnackbar', {
          message: '購物車已清空',
          color: 'success'
        })
      } catch (error) {
        store.dispatch('ui/showSnackbar', {
          message: '清空購物車失敗，請稍後再試',
          color: 'error'
        })
      }
    }

    const goToCheckout = () => {
      router.push('/checkout')
    }

    const goShopping = () => {
      router.push('/')
    }

    return {
      showClearDialog,
      items,
      formattedItems,
      itemCount,
      totalPrice,
      shippingFee,
      finalTotal,
      amountToFreeShipping,
      hasItems,
      formatPrice,
      updateQuantity,
      removeItem,
      clearCart,
      goToCheckout,
      goShopping
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.empty-cart-card {
  background: rgba(250, 230, 177, 0.1);
  border: 1px solid #FAE6B1;
  border-radius: 16px;
}

.cart-item {
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background-color: rgba(250, 230, 177, 0.05);
}

.quantity-controls {
  gap: 8px;
}

.quantity-input :deep(input) {
  text-align: center;
}

.order-summary-card {
  background: rgba(250, 230, 177, 0.1);
  border: 1px solid #FAE6B1;
  position: sticky;
  top: 24px;
}

.summary-row {
  font-size: 1rem;
}

/* 響應式調整 */
@media (max-width: 960px) {
  .cart-container {
    padding: 16px 8px;
  }
  
  .order-summary-card {
    position: static;
    margin-top: 24px;
  }
}

@media (max-width: 600px) {
  .quantity-controls {
    flex-direction: column;
    gap: 4px;
  }
  
  .quantity-input {
    order: 1;
    margin: 8px 0 !important;
  }
  
  .cart-item .v-row {
    flex-direction: column;
    text-align: center;
  }
  
  .cart-item .v-col:first-child {
    margin-bottom: 16px;
  }
}
</style>
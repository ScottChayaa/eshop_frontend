<template>
  <div class="product-view">
    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-container">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
            <v-skeleton-loader type="list-item-two-line" class="mt-4"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="6">
            <v-skeleton-loader type="heading"></v-skeleton-loader>
            <v-skeleton-loader type="paragraph"></v-skeleton-loader>
            <v-skeleton-loader type="actions"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- 商品不存在 -->
    <div v-else-if="!product" class="product-not-found">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <v-icon size="120" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
            <h2 class="text-h4 mt-4 mb-4" style="color: #31525B">找不到商品</h2>
            <p class="text-subtitle1 mb-6">抱歉，您要查看的商品不存在或已下架。</p>
            <v-btn
              color="secondary"
              size="large"
              @click="goToHome"
            >
              <v-icon start>mdi-home</v-icon>
              回到首頁
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- 商品詳情內容 -->
    <div v-else class="product-content">
      <!-- 手機版布局 -->
      <div v-if="$vuetify.display.smAndDown" class="mobile-layout">
        <v-container fluid class="pa-0">
          <!-- 商品圖片 (手機版全寬) -->
          <div class="mobile-image-section">
            <ProductImageGallery
              :images="productImages"
              @image-change="handleImageChange"
            />
          </div>

          <!-- 商品資訊區域 -->
          <div class="mobile-details-section">
            <ProductDetails
              :product="product"
              @spec-change="handleSpecChange"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <!-- 商品內容區域 -->
          <div class="mobile-content-section">
            <ProductContent :product="product" />
          </div>
        </v-container>
      </div>

      <!-- PC版布局 -->
      <div v-else class="desktop-layout">
        <v-container>
          <v-row>
            <!-- 左側：商品圖片 -->
            <v-col cols="12" md="6" lg="7">
              <div class="sticky-image-section">
                <ProductImageGallery
                  :images="productImages"
                  @image-change="handleImageChange"
                />
              </div>
            </v-col>

            <!-- 右側：商品資訊 -->
            <v-col cols="12" md="6" lg="5">
              <div class="sticky-details-section">
                <ProductDetails
                  :product="product"
                  @spec-change="handleSpecChange"
                  @add-to-cart="handleAddToCart"
                />
              </div>
            </v-col>
          </v-row>

          <!-- 商品內容 (PC版全寬) -->
          <v-row>
            <v-col cols="12">
              <ProductContent :product="product" />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- 返回頂部按鈕 (手機版) -->
    <v-fab
      v-if="$vuetify.display.smAndDown"
      v-model="showBackToTop"
      location="bottom end"
      size="small"
      color="secondary"
      icon="mdi-chevron-up"
      @click="scrollToTop"
      app
      appear
      class="back-to-top-fab"
    ></v-fab>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { useHead } from '@vueuse/head'
import ProductImageGallery from '../../components/ui/ProductImageGallery.vue'
import ProductDetails from '../../components/ui/ProductDetails.vue'
import ProductContent from '../../components/ui/ProductContent.vue'

export default {
  name: 'ProductView',
  components: {
    ProductImageGallery,
    ProductDetails,
    ProductContent
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const showBackToTop = ref(false)
    const selectedSpecs = ref({})

    // 從 store 獲取資料
    const product = computed(() => store.getters['products/currentProduct'])
    const loading = computed(() => store.getters['products/loading'])

    // 商品圖片處理
    const productImages = computed(() => {
      if (!product.value) return []
      
      // 如果有多張圖片
      if (product.value.images && Array.isArray(product.value.images)) {
        return product.value.images.map((img, index) => ({
          url: typeof img === 'string' ? img : img.url,
          alt: typeof img === 'string' ? `商品圖片 ${index + 1}` : img.alt
        }))
      }
      
      // 如果只有單張圖片
      if (product.value.image) {
        return [{
          url: product.value.image,
          alt: product.value.name || '商品圖片'
        }]
      }

      // 預設圖片
      return [{
        url: 'https://via.placeholder.com/400x400/FFA101/FFFFFF?text=商品圖片',
        alt: '商品圖片'
      }]
    })

    // SEO 設定 (可以在未來加入 @vueuse/head 時啟用)
    // const head = computed(() => ({
    //   title: product.value ? `${product.value.name} - eshop` : '商品詳情 - eshop',
    //   meta: [...]
    // }))
    // useHead(head)

    const loadProduct = async () => {
      const productId = route.params.id
      if (productId) {
        await store.dispatch('products/loadProduct', productId)
      }
    }

    const handleImageChange = (imageData) => {
      // 處理圖片切換事件
      console.log('Image changed:', imageData)
    }

    const handleSpecChange = (specs) => {
      selectedSpecs.value = specs
      console.log('Specs changed:', specs)
    }

    const handleAddToCart = (cartItem) => {
      console.log('Added to cart:', cartItem)
      // 可以在這裡加入追蹤代碼或其他邏輯
    }

    const goToHome = () => {
      router.push('/')
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleScroll = () => {
      showBackToTop.value = window.pageYOffset > 300
    }

    // 監聽路由變化
    watch(() => route.params.id, () => {
      loadProduct()
    })

    onMounted(() => {
      loadProduct()
      window.addEventListener('scroll', handleScroll, { passive: true })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      product,
      loading,
      productImages,
      selectedSpecs,
      showBackToTop,
      handleImageChange,
      handleSpecChange,
      handleAddToCart,
      goToHome,
      scrollToTop
    }
  }
}
</script>

<style scoped>
.product-view {
  min-height: 100vh;
}

.loading-container {
  padding: 24px 0;
}

.product-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

/* 手機版布局 */
.mobile-layout {
  width: 100%;
}

.mobile-image-section {
  background: white;
}

.mobile-details-section {
  background: white;
  margin-top: 16px;
}

.mobile-content-section {
  background: white;
  margin-top: 16px;
}

/* PC版布局 */
.desktop-layout {
  padding-top: 24px;
}

.sticky-image-section {
  position: sticky;
  top: 88px; /* Header height + margin */
  z-index: 1;
}

.sticky-details-section {
  position: sticky;
  top: 88px;
  z-index: 1;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .mobile-image-section,
  .mobile-details-section,
  .mobile-content-section {
    margin-top: 0;
    border-radius: 0;
  }
  
  .mobile-details-section,
  .mobile-content-section {
    border-top: 8px solid #f5f5f5;
  }
}

@media (min-width: 960px) {
  .sticky-image-section,
  .sticky-details-section {
    top: 96px; /* 調整 PC 版的 sticky 位置 */
  }
}

@media (min-width: 1264px) {
  .desktop-layout .v-container {
    max-width: 1200px;
  }
}

/* 確保圖片和詳情區域有適當的間距 */
@media (min-width: 768px) and (max-width: 959px) {
  .sticky-image-section {
    margin-bottom: 24px;
  }
}

/* 平板版本的特殊處理 */
@media (min-width: 768px) and (max-width: 1023px) {
  .sticky-image-section,
  .sticky-details-section {
    position: static;
  }
}

/* 隱藏手機版返回頂部按鈕在特定情況下 */
.back-to-top-fab {
  bottom: 80px !important; /* 避免與底部導航重疊 */
}

/* 優化 sticky 元素的滾動條樣式 */
.sticky-details-section::-webkit-scrollbar {
  width: 6px;
}

.sticky-details-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.sticky-details-section::-webkit-scrollbar-thumb {
  background: #FFA101;
  border-radius: 3px;
}

.sticky-details-section::-webkit-scrollbar-thumb:hover {
  background: #e8910a;
}
</style>
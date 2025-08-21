<template>
  <v-container class="pa-4 content-container">

    <!-- 輪播圖 -->
    <div class="carousel-wrapper mb-6">
      <v-carousel 
        height="400"
        class="rounded-lg"
        cycle
        interval="5000"
        show-arrows
        hide-delimiter-background
      >
      <v-carousel-item
        v-for="(banner, i) in banners"
        :key="i"
        :src="banner.image"
        cover
      >
        <div class="carousel-overlay"></div>
        <div class="carousel-content">
          <h2 class="text-h3 text-white mb-2 font-weight-bold">{{ banner.title }}</h2>
          <p class="text-h6 text-white mb-4">{{ banner.subtitle }}</p>
          <v-btn 
            color="primary" 
            size="large" 
            class="text-none"
            rounded
          >
            立即購買
          </v-btn>
        </div>
      </v-carousel-item>
      </v-carousel>
    </div>

    <!-- 商品分類 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h5 mb-3" style="color: #31525B">商品分類</h2>
      </v-col>
      <v-col 
        v-for="category in categories" 
        :key="category.id"
        cols="6" 
        sm="4" 
        md="3"
        lg="3"
        xl="2"
        class="pa-2"
      >
        <v-card 
          class="category-card" 
          @click="goToCategory(category.id)"
          hover
        >
          <v-card-text class="text-center pa-4">
            <v-icon size="48" :color="category.color" class="mb-2">
              {{ category.icon }}
            </v-icon>
            <div class="text-subtitle1" style="color: #31525B">
              {{ category.name }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 熱門商品 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h5 mb-3" style="color: #31525B">熱門商品</h2>
      </v-col>
      
      <!-- Loading 狀態 -->
      <template v-if="isLoading">
        <v-col 
          v-for="n in 10" 
          :key="`loading-popular-${n}`"
          cols="6" 
          sm="4" 
          md="3"
          lg="3"
          xl="2.4"
          class="pa-2"
        >
          <v-card class="product-card-skeleton" height="350">
            <v-skeleton-loader
              type="image, article, button"
              class="fill-height"
            ></v-skeleton-loader>
          </v-card>
        </v-col>
      </template>
      
      <!-- 商品資料 -->
      <template v-else>
        <v-col 
          v-for="product in popularProducts" 
          :key="product.id"
          cols="6" 
          sm="4" 
          md="3"
          lg="3"
          xl="2.4"
          class="pa-2"
        >
          <ProductCard :product="product" />
        </v-col>
      </template>
    </v-row>

    <!-- 最新商品 -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-3" style="color: #31525B">最新商品</h2>
      </v-col>
      
      <!-- Loading 狀態 -->
      <template v-if="isLoading">
        <v-col 
          v-for="n in 8" 
          :key="`loading-new-${n}`"
          cols="6" 
          sm="4" 
          md="3"
          lg="3"
          xl="3"
          class="pa-2"
        >
          <v-card class="product-card-skeleton" height="350">
            <v-skeleton-loader
              type="image, article, button"
              class="fill-height"
            ></v-skeleton-loader>
          </v-card>
        </v-col>
      </template>
      
      <!-- 商品資料 -->
      <template v-else>
        <v-col 
          v-for="product in newProducts" 
          :key="product.id"
          cols="6" 
          sm="4" 
          md="3"
          lg="3"
          xl="3"
          class="pa-2"
        >
          <ProductCard :product="product" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ProductCard from '../../components/ProductCard.vue'

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const isLoading = ref(true)
    
    const banners = ref([
      {
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
        title: '夏季特賣',
        subtitle: '全館商品 8 折起'
      },
      {
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
        title: '新品上市',
        subtitle: '搶先體驗最新商品'
      },
      {
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
        title: '會員專屬',
        subtitle: '註冊即享專屬優惠'
      },
      {
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
        title: '3C數位',
        subtitle: '最新科技產品熱賣中'
      },
      {
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
        title: '生活精品',
        subtitle: '提升生活品質的好選擇'
      }
    ])

    const categories = ref([
      { id: 1, name: '服飾', icon: 'mdi-tshirt-crew', color: '#FFA101' },
      { id: 2, name: '3C產品', icon: 'mdi-laptop', color: '#B3DEE5' },
      { id: 3, name: '居家生活', icon: 'mdi-home', color: '#FFA101' },
      { id: 4, name: '美妝保養', icon: 'mdi-face-woman', color: '#B3DEE5' },
      { id: 5, name: '運動戶外', icon: 'mdi-run', color: '#FFA101' },
      { id: 6, name: '書籍文具', icon: 'mdi-book', color: '#B3DEE5' },
      { id: 7, name: '食品飲料', icon: 'mdi-food', color: '#FFA101' },
      { id: 8, name: '其他', icon: 'mdi-dots-horizontal', color: '#B3DEE5' }
    ])

    // 從 store 獲取商品資料
    const allProducts = computed(() => store.getters['products/products'])
    const loading = computed(() => store.getters['products/loading'])
    
    // 計算熱門商品和最新商品
    const popularProducts = computed(() => {
      if (!allProducts.value.length) return []
      return [...allProducts.value]
        .filter(product => product.rating >= 4.5)
        .slice(0, 10)
    })
    
    const newProducts = computed(() => {
      if (!allProducts.value.length) return []
      return [...allProducts.value]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8)
    })

    const goToCategory = (categoryId) => {
      router.push(`/category/${categoryId}`)
    }

    const loadProducts = async () => {
      try {
        // 載入 store 中的商品資料
        await store.dispatch('products/loadProducts')
        // 載入分類資料
        await store.dispatch('products/loadCategories')
      } catch (error) {
        console.error('載入商品資料失敗:', error)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      banners,
      categories,
      popularProducts,
      newProducts,
      isLoading: computed(() => isLoading.value || loading.value),
      goToCategory
    }
  }
}
</script>

<style scoped>
.carousel-content {
  position: absolute;
  bottom: 60px;
  left: 60px;
  z-index: 3;
  max-width: 500px;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(49, 82, 91, 0.7), rgba(255, 161, 1, 0.3));
  z-index: 2;
}

.category-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.category-card:hover {
  transform: translateY(-5px);
}

/* Loading Skeleton 樣式 */
.product-card-skeleton {
  border-radius: 8px;
  overflow: hidden;
}

.v-skeleton-loader {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 容器寬度限制 */
.content-container {
  max-width: 1400px !important;
  margin: 0 auto !important;
}

/* 輪播圖容器 */
.carousel-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

/* 優化商品卡片布局 */
@media (min-width: 1280px) {
  .v-col-xl-2-4 {
    flex: 0 0 20% !important;
    max-width: 20% !important;
  }
}

/* 大螢幕優化 */
@media (min-width: 1920px) {
  .content-container {
    max-width: 1600px !important;
  }
  
  .carousel-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* 響應式設計 */
@media (max-width: 600px) {
  .carousel-content {
    bottom: 30px;
    left: 20px;
    right: 20px;
    max-width: none;
  }
  
  .carousel-content h2 {
    font-size: 1.5rem !important;
  }
  
  .carousel-content p {
    font-size: 1rem !important;
  }
}

/* 輪播圖圓角效果 */
.v-carousel {
  border-radius: 12px !important;
  overflow: hidden;
}

.v-carousel-item {
  border-radius: 12px !important;
}
</style>
<template>
  <v-container class="pa-4 content-container">
    <!-- 測試內容 - 確保頁面載入 -->
    <div class="test-content mb-6">
      <h1 class="text-h3 mb-4">🛍️ 歡迎來到 eshop_frontend</h1>
      <p class="text-h6 mb-4">Vue3 購物網站首頁測試</p>
      <v-alert color="success" variant="tonal">
        ✅ 頁面成功載入！HomeView 組件正常運作
      </v-alert>
    </div>

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
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4" style="color: #31525B">商品分類</h2>
      </v-col>
      <v-col 
        v-for="category in categories" 
        :key="category.id"
        cols="6" 
        sm="4" 
        md="3"
        lg="3"
        xl="2"
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
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4" style="color: #31525B">熱門商品</h2>
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
        >
          <ProductCard :product="product" />
        </v-col>
      </template>
    </v-row>

    <!-- 最新商品 -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4" style="color: #31525B">最新商品</h2>
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
        >
          <ProductCard :product="product" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup() {
    const router = useRouter()
    const isLoading = ref(true) // 添加 loading 狀態
    
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

    const popularProducts = ref([])
    const newProducts = ref([])

    const goToCategory = (categoryId) => {
      router.push(`/category/${categoryId}`)
    }

    const loadProducts = () => {
        // Mock 商品資料 - 使用 Unsplash 真實圖片
        const mockProducts = [
            {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 36900,
            originalPrice: 39900,
            image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.5,
            reviews: 128
            },
            {
            id: 2,
            name: 'MacBook Pro 14"',
            price: 59900,
            originalPrice: 65900,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.8,
            reviews: 95
            },
            {
            id: 3,
            name: 'AirPods Pro',
            price: 7490,
            originalPrice: 8490,
            image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.6,
            reviews: 203
            },
            {
            id: 4,
            name: 'iPad Air',
            price: 19900,
            originalPrice: 22900,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.4,
            reviews: 87
            },
            {
            id: 5,
            name: 'Apple Watch Series 9',
            price: 12900,
            originalPrice: 14900,
            image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.3,
            reviews: 156
            },
            {
            id: 6,
            name: 'Samsung Galaxy S24',
            price: 28900,
            originalPrice: 32900,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.2,
            reviews: 89
            },
            {
            id: 7,
            name: 'Sony WH-1000XM5',
            price: 9990,
            originalPrice: 11990,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.7,
            reviews: 234
            },
            {
            id: 8,
            name: 'Nintendo Switch OLED',
            price: 10780,
            originalPrice: 11980,
            image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.6,
            reviews: 167
            },
            {
            id: 9,
            name: 'Dyson V15 Detect',
            price: 18900,
            originalPrice: 21900,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.4,
            reviews: 92
            },
            {
            id: 10,
            name: 'Canon EOS R5',
            price: 89900,
            originalPrice: 99900,
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.9,
            reviews: 78
            },
            {
            id: 11,
            name: 'Tesla Model Y 輪胎',
            price: 8500,
            originalPrice: 9500,
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.1,
            reviews: 45
            },
            {
            id: 12,
            name: 'IKEA 北歐風沙發',
            price: 15900,
            originalPrice: 18900,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.0,
            reviews: 124
            },
            {
            id: 13,
            name: 'Adidas Ultra Boost 22',
            price: 4990,
            originalPrice: 5990,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.3,
            reviews: 198
            },
            {
            id: 14,
            name: 'Yeti 保溫瓶',
            price: 1290,
            originalPrice: 1590,
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.5,
            reviews: 267
            },
            {
            id: 15,
            name: 'Lego 建築系列',
            price: 3990,
            originalPrice: 4590,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.8,
            reviews: 89
            },
            {
            id: 16,
            name: 'Beats Studio Buds',
            price: 3990,
            originalPrice: 4990,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.2,
            reviews: 145
            },
            {
            id: 17,
            name: 'Kindle Paperwhite',
            price: 4290,
            originalPrice: 4990,
            image: 'https://images.unsplash.com/photo-1555631545-9dc21031669b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.7,
            reviews: 312
            },
            {
            id: 18,
            name: 'Philips 智能燈泡',
            price: 890,
            originalPrice: 1190,
            image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            rating: 4.1,
            reviews: 87
            }
        ]
        
        // 熱門商品顯示 10 筆
        popularProducts.value = mockProducts.slice(0, 10)
        // 最新商品顯示 8 筆 (從後面取)
        newProducts.value = mockProducts.slice(-8).reverse()
        
        // 清除 loading 狀態
        isLoading.value = false
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      banners,
      categories,
      popularProducts,
      newProducts,
      isLoading,
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
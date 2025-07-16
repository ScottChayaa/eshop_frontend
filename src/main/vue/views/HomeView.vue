<template>
  <v-container fluid class="pa-4">
    <!-- 輪播圖 -->
    <v-carousel 
      height="400"
      class="mb-6 rounded-lg"
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
      <v-col 
        v-for="product in popularProducts" 
        :key="product.id"
        cols="6" 
        sm="4" 
        md="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <!-- 最新商品 -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4" style="color: #31525B">最新商品</h2>
      </v-col>
      <v-col 
        v-for="product in newProducts" 
        :key="product.id"
        cols="6" 
        sm="4" 
        md="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  setup() {
    const router = useRouter()
    
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
      // Mock 商品資料
      const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          price: 36900,
          originalPrice: 39900,
          image: 'https://via.placeholder.com/200x200/FFA101/FFFFFF?text=iPhone+15',
          rating: 4.5,
          reviews: 128
        },
        {
          id: 2,
          name: 'MacBook Pro 14"',
          price: 59900,
          originalPrice: 65900,
          image: 'https://via.placeholder.com/200x200/B3DEE5/31525B?text=MacBook',
          rating: 4.8,
          reviews: 95
        },
        {
          id: 3,
          name: 'AirPods Pro',
          price: 7490,
          originalPrice: 8490,
          image: 'https://via.placeholder.com/200x200/FAE6B1/31525B?text=AirPods',
          rating: 4.6,
          reviews: 203
        },
        {
          id: 4,
          name: 'iPad Air',
          price: 19900,
          originalPrice: 22900,
          image: 'https://via.placeholder.com/200x200/FFA101/FFFFFF?text=iPad+Air',
          rating: 4.4,
          reviews: 87
        }
      ]
      
      popularProducts.value = mockProducts
      newProducts.value = [...mockProducts].reverse()
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      banners,
      categories,
      popularProducts,
      newProducts,
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
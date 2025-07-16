<template>
  <v-container fluid class="pa-4">
    <!-- 輪播圖 -->
    <v-carousel 
      height="300"
      class="mb-6"
      cycle
      interval="4000"
    >
      <v-carousel-item
        v-for="(banner, i) in banners"
        :key="i"
        :src="banner.image"
        cover
      >
        <div class="carousel-content">
          <h2 class="text-h4 text-white mb-2">{{ banner.title }}</h2>
          <p class="text-h6 text-white">{{ banner.subtitle }}</p>
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
        image: 'https://via.placeholder.com/800x300/FFA101/FFFFFF?text=熱銷商品',
        title: '夏季特賣',
        subtitle: '全館商品 8 折起'
      },
      {
        image: 'https://via.placeholder.com/800x300/B3DEE5/31525B?text=新品上市',
        title: '新品上市',
        subtitle: '搶先體驗最新商品'
      },
      {
        image: 'https://via.placeholder.com/800x300/FAE6B1/31525B?text=會員優惠',
        title: '會員專屬',
        subtitle: '註冊即享專屬優惠'
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
  bottom: 50px;
  left: 50px;
  z-index: 1;
}

.category-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.category-card:hover {
  transform: translateY(-5px);
}
</style>
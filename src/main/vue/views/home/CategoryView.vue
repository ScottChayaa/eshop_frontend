<template>
  <v-container class="pa-4 content-container">
    <!-- 麵包屑導航 -->
    <v-breadcrumbs class="pa-0 mb-4" :items="breadcrumbItems">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
          class="text-decoration-none"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    
    <!-- 分類標題與描述 -->
    <div class="category-header mb-6">
      <h1 class="text-h4 mb-2" style="color: #31525B">{{ categoryName }}</h1>
      <p class="text-subtitle1 mb-4" style="color: #666">{{ categoryDescription }}</p>
    </div>

    <!-- 篩選工具列 -->
    <v-row class="filter-toolbar mb-4" align="center">
      <v-col cols="12" md="8">
        <v-row align="center">
          <v-col cols="auto">
            <span class="text-subtitle2 mr-3" style="color: #31525B">價格範圍：</span>
          </v-col>
          <v-col>
            <v-chip-group v-model="selectedPriceRange" column>
              <v-chip 
                v-for="range in priceRanges" 
                :key="range.value"
                :value="range.value"
                filter 
                outlined
                color="primary"
              >
                {{ range.text }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4" class="text-right">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="text"
          item-value="value"
          label="排序方式"
          outlined
          dense
          hide-details
          style="max-width: 200px; margin-left: auto;"
        ></v-select>
      </v-col>
    </v-row>

    <!-- 商品計數與視圖切換 -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <span class="text-subtitle2" style="color: #666">
          共 {{ filteredProducts.length }} 件商品
        </span>
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn small icon>
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn small icon>
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- 商品列表區域 -->
    <template v-if="isLoading">
      <!-- Loading 狀態 -->
      <v-row>
        <v-col 
          v-for="n in 12" 
          :key="`loading-${n}`"
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
      </v-row>
    </template>

    <template v-else>
      <!-- 網格視圖 -->
      <v-row v-if="viewMode === 0">
        <v-col
          v-for="product in paginatedProducts"
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
      </v-row>
      
      <!-- 列表視圖 -->
      <v-row v-else>
        <v-col cols="12" v-for="product in paginatedProducts" :key="`list-${product.id}`">
          <ProductListItem :product="product" />
        </v-col>
      </v-row>
    </template>

    <!-- 空狀態 -->
    <v-row v-if="!isLoading && filteredProducts.length === 0">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey" class="mb-4">mdi-package-variant</v-icon>
        <h3 class="text-h6 mb-2" style="color: #666">此分類暫無商品</h3>
        <p class="text-body2" style="color: #999">請嘗試其他分類或稍後再來看看</p>
        <v-btn color="primary" @click="$router.push('/')">返回首頁</v-btn>
      </v-col>
    </v-row>

    <!-- 分頁控制 -->
    <v-row class="mt-6" v-if="totalPages > 1">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          color="primary"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ProductCard from '../../components/ProductCard.vue'
import ProductListItem from '../../components/category/ProductListItem.vue'

export default {
  name: 'CategoryView',
  components: {
    ProductCard,
    ProductListItem
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    // 響應式數據
    const viewMode = ref(0) // 0: 網格, 1: 列表
    const currentPage = ref(1)
    const itemsPerPage = ref(24)
    const selectedPriceRange = ref(null)
    const sortBy = ref('newest')
    
    // 計算屬性
    const categoryId = computed(() => parseInt(route.params.id))
    const isLoading = computed(() => store.getters['products/loading'])
    const allProducts = computed(() => store.getters['products/products'])
    const categories = computed(() => store.getters['products/categories'])
    
    const currentCategory = computed(() => {
      return categories.value.find(cat => cat.id === categoryId.value)
    })
    
    const categoryName = computed(() => {
      return currentCategory.value?.name || '商品分類'
    })
    
    const categoryDescription = computed(() => {
      const descriptions = {
        1: '時尚服飾，展現個人風格',
        2: '最新科技產品，提升生活品質',
        3: '居家好物，打造溫馨空間',
        4: '美妝保養，呵護每一天',
        5: '運動戶外，享受健康生活',
        6: '書籍文具，豐富知識世界',
        7: '食品飲料，品味生活美好',
        8: '其他精選商品'
      }
      return descriptions[categoryId.value] || '精選商品分類'
    })
    
    const breadcrumbItems = computed(() => [
      {
        text: '首頁',
        disabled: false,
        href: '/'
      },
      {
        text: categoryName.value,
        disabled: true,
        href: '#'
      }
    ])
    
    // 篩選選項
    const priceRanges = ref([
      { text: '全部價格', value: null },
      { text: 'NT$ 0-1,000', value: [0, 1000] },
      { text: 'NT$ 1,000-5,000', value: [1000, 5000] },
      { text: 'NT$ 5,000-20,000', value: [5000, 20000] },
      { text: 'NT$ 20,000+', value: [20000, 999999] }
    ])
    
    const sortOptions = ref([
      { text: '最新上架', value: 'newest' },
      { text: '價格：低到高', value: 'price-low' },
      { text: '價格：高到低', value: 'price-high' },
      { text: '評分最高', value: 'rating' }
    ])
    
    // 商品篩選邏輯
    const filteredProducts = computed(() => {
      let filtered = allProducts.value.filter(product => 
        product.categoryId === categoryId.value
      )
      
      // 價格篩選
      if (selectedPriceRange.value) {
        const [min, max] = selectedPriceRange.value
        filtered = filtered.filter(product => 
          product.price >= min && product.price <= max
        )
      }
      
      // 排序
      switch (sortBy.value) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'newest':
        default:
          filtered.sort((a, b) => b.id - a.id)
          break
      }
      
      return filtered
    })
    
    // 分頁邏輯
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    })
    
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProducts.value.slice(start, end)
    })
    
    // 載入數據
    const loadData = async () => {
      try {
        await Promise.all([
          store.dispatch('products/loadProducts'),
          store.dispatch('products/loadCategories')
        ])
      } catch (error) {
        console.error('載入分類資料失敗:', error)
      }
    }
    
    // 監聽路由變化
    watch(() => route.params.id, () => {
      currentPage.value = 1
      selectedPriceRange.value = null
      sortBy.value = 'newest'
    })
    
    // 監聽篩選條件變化，重置頁碼
    watch([selectedPriceRange, sortBy], () => {
      currentPage.value = 1
    })
    
    onMounted(() => {
      loadData()
    })
    
    return {
      viewMode,
      currentPage,
      selectedPriceRange,
      sortBy,
      categoryName,
      categoryDescription,
      breadcrumbItems,
      priceRanges,
      sortOptions,
      filteredProducts,
      paginatedProducts,
      totalPages,
      isLoading
    }
  }
}
</script>

<style scoped>
/* 復用首頁樣式 */
.content-container {
  max-width: 1400px !important;
  margin: 0 auto !important;
}

.filter-toolbar {
  background-color: rgba(250, 230, 177, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.category-header h1 {
  font-weight: 600;
}

/* Loading Skeleton 樣式 */
.product-card-skeleton {
  border-radius: 8px;
  overflow: hidden;
}

.v-skeleton-loader {
  background-color: rgba(255, 255, 255, 0.8);
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
}

/* 響應式設計 */
@media (max-width: 960px) {
  .filter-toolbar {
    padding: 12px;
  }
  
  .category-header h1 {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .category-header {
    text-align: center;
  }
  
  .filter-toolbar .v-col {
    margin-bottom: 8px;
  }
}
</style>
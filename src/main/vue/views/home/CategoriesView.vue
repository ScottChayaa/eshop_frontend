<template>
  <v-container class="categories-page">
    <!-- 頁面標題 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold custom-dark">
            商品分類
          </h1>
          <v-chip 
            variant="flat" 
            color="secondary" 
            size="small"
          >
            {{ categories.length }} 個分類
          </v-chip>
        </div>
        <p class="text-body-2 mt-2 text-medium-emphasis">
          探索各種商品類別，找到您需要的商品
        </p>
      </v-col>
    </v-row>

    <!-- 載入狀態 -->
    <div v-if="loading" class="d-flex justify-center py-8">
      <v-progress-circular 
        indeterminate 
        color="secondary"
        size="40"
      ></v-progress-circular>
    </div>

    <!-- 分類網格 -->
    <v-row v-else>
      <v-col 
        v-for="category in categories" 
        :key="category.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card
          :to="{ name: 'Category', params: { id: category.id } }"
          class="category-card h-100"
          hover
          variant="outlined"
          @click="trackCategoryClick(category)"
        >
          <v-card-text class="d-flex flex-column align-center text-center pa-4">
            <!-- 分類圖示 -->
            <div class="category-icon-wrapper mb-3">
              <v-icon 
                :icon="category.icon" 
                size="40"
                color="secondary"
              ></v-icon>
            </div>
            
            <!-- 分類名稱 -->
            <h3 class="text-subtitle-1 font-weight-medium custom-dark mb-2">
              {{ category.name }}
            </h3>
            
            <!-- 商品數量 (如果有的話) -->
            <v-chip 
              v-if="getCategoryProductCount(category.id)"
              size="x-small"
              variant="flat"
              color="primary"
              class="opacity-70"
            >
              {{ getCategoryProductCount(category.id) }} 商品
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 空狀態 -->
    <div v-if="!loading && categories.length === 0" class="text-center py-12">
      <v-icon 
        icon="mdi-package-variant-closed" 
        size="64" 
        color="grey-lighten-1"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h6 text-medium-emphasis mb-2">目前沒有商品分類</h3>
      <p class="text-body-2 text-medium-emphasis">
        請稍後再來查看
      </p>
    </div>

    <!-- 快速連結區域 -->
    <v-row v-if="!loading && categories.length > 0" class="mt-8">
      <v-col cols="12">
        <v-divider class="mb-4"></v-divider>
        <h2 class="text-h6 font-weight-bold custom-dark mb-4">
          快速連結
        </h2>
        <div class="d-flex flex-wrap gap-2">
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-fire"
            :to="{ name: 'News' }"
          >
            最新消息
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-star"
            :to="{ name: 'Home' }"
          >
            熱門商品
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-magnify"
            :to="{ name: 'Search' }"
          >
            搜尋商品
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CategoriesView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(true)
    
    // 計算屬性
    const categories = computed(() => {
      return store.getters['products/categories'] || []
    })
    
    const products = computed(() => {
      return store.getters['products/allProducts'] || []
    })
    
    // 方法
    const getCategoryProductCount = (categoryId) => {
      return products.value.filter(product => 
        product.categoryId === categoryId
      ).length
    }
    
    const trackCategoryClick = (category) => {
      // 分析追蹤 (如果需要)
      console.log('Category clicked:', category.name)
    }
    
    const loadData = async () => {
      try {
        loading.value = true
        
        // 載入分類資料
        if (categories.value.length === 0) {
          await store.dispatch('products/fetchCategories')
        }
        
        // 載入商品資料來計算數量
        if (products.value.length === 0) {
          await store.dispatch('products/fetchProducts')
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 生命週期
    onMounted(() => {
      loadData()
    })
    
    return {
      loading,
      categories,
      getCategoryProductCount,
      trackCategoryClick
    }
  }
}
</script>

<style scoped>
.categories-page {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.custom-dark {
  color: #31525B !important;
}

.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(250, 230, 177, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.category-card:hover .category-icon-wrapper {
  background: rgba(250, 230, 177, 0.3);
}

/* 手機版優化 */
@media (max-width: 599px) {
  .categories-page {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .category-card {
    min-height: 140px;
  }
  
  .category-icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .category-icon-wrapper .v-icon {
    font-size: 32px !important;
  }
}

/* 深色模式適配 */
.v-theme--customDark .category-icon-wrapper {
  background: rgba(179, 222, 229, 0.1);
}

.v-theme--customDark .category-card:hover .category-icon-wrapper {
  background: rgba(179, 222, 229, 0.2);
}
</style>

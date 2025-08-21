<template>
  <v-container class="news-page">
    <!-- 頁面標題區 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-2">
          <h1 class="text-h4 font-weight-bold custom-dark">
            <v-icon icon="mdi-newspaper" color="info" class="mr-2"></v-icon>
            最新消息
          </h1>
          <v-chip 
            variant="flat" 
            color="info" 
            size="small"
            class="news-count-chip"
          >
            {{ displayedNews.length }} 篇文章
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis">
          精選最新消息、公司動態與產品資訊，隨時掌握最新動態！
        </p>
      </v-col>
    </v-row>

    <!-- 載入狀態 -->
    <div v-if="loading" class="d-flex justify-center py-8">
      <v-progress-circular 
        indeterminate 
        color="info"
        size="40"
      ></v-progress-circular>
    </div>

    <template v-else>
      <!-- 消息類型篩選區 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="filter-section">
            <h3 class="text-subtitle-1 font-weight-bold custom-dark mb-3">
              消息類型
            </h3>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                v-for="filter in newsFilters"
                :key="filter.value"
                :variant="selectedFilter === filter.value ? 'flat' : 'outlined'"
                :color="selectedFilter === filter.value ? 'info' : 'default'"
                size="small"
                @click="setNewsFilter(filter.value)"
                class="filter-btn"
              >
                <v-icon :icon="filter.icon" start size="16"></v-icon>
                {{ filter.label }}
                <v-chip
                  v-if="filter.count > 0"
                  size="x-small"
                  :color="selectedFilter === filter.value ? 'white' : 'info'"
                  :variant="selectedFilter === filter.value ? 'flat' : 'outlined'"
                  class="ml-2"
                >
                  {{ filter.count }}
                </v-chip>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 排序與篩選工具欄 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap gap-3">
            <!-- 排序選項 -->
            <div class="d-flex align-center">
              <span class="text-body-2 text-medium-emphasis mr-3">排序：</span>
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                hide-details
                class="sort-select"
                style="min-width: 150px;"
              ></v-select>
            </div>
            
            <!-- 显示模式切換 -->
            <div class="d-flex align-center">
              <span class="text-body-2 text-medium-emphasis mr-3">显示：</span>
              <v-btn-toggle
                v-model="viewMode"
                mandatory
                variant="outlined"
                density="compact"
              >
                <v-btn value="grid" icon size="small">
                  <v-icon>mdi-view-grid</v-icon>
                </v-btn>
                <v-btn value="list" icon size="small">
                  <v-icon>mdi-view-list</v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- 最新消息網格 -->
      <v-row v-if="displayedNews.length > 0">
        <v-col 
          v-for="news in displayedNews" 
          :key="news.id"
          :cols="viewMode === 'list' ? 12 : 6"
          :sm="viewMode === 'list' ? 12 : 4"
          :md="viewMode === 'list' ? 12 : 4"
          :lg="viewMode === 'list' ? 12 : 3"
          :xl="viewMode === 'list' ? 12 : 3"
        >
          <NewsCard 
            :news="news"
          />
        </v-col>
      </v-row>

      <!-- 空狀態 -->
      <div v-else class="text-center py-12">
        <v-icon 
          icon="mdi-newspaper-variant-outline" 
          size="64" 
          color="grey-lighten-1"
          class="mb-4"
        ></v-icon>
        <h3 class="text-h6 text-medium-emphasis mb-2">
          目前沒有符合條件的最新消息
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          試試調整篩選條件或稍後再來查看
        </p>
        <v-btn
          color="primary"
          variant="outlined"
          :to="{ name: 'Home' }"
          prepend-icon="mdi-home"
        >
          回到首頁
        </v-btn>
      </div>

      <!-- 最新消息資訊區域 -->
      <v-row v-if="displayedNews.length > 0" class="mt-8">
        <v-col cols="12">
          <v-divider class="mb-6"></v-divider>
          <div class="news-info">
            <h2 class="text-h6 font-weight-bold custom-dark mb-4">
              <v-icon icon="mdi-information" color="info" class="mr-2"></v-icon>
              最新消息說明
            </h2>
            <v-row>
              <v-col cols="12" md="6">
                <div class="info-card pa-4 rounded-lg" style="background: rgba(179, 222, 229, 0.1);">
                  <h4 class="text-subtitle-1 font-weight-bold custom-dark mb-2">
                    <v-icon icon="mdi-clock-outline" color="info" class="mr-2"></v-icon>
                    即時更新
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    我們的最新消息每日更新，確保您第一時間接收到最新資訊。
                  </p>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-card pa-4 rounded-lg" style="background: rgba(250, 230, 177, 0.1);">
                  <h4 class="text-subtitle-1 font-weight-bold custom-dark mb-2">
                    <v-icon icon="mdi-bell-outline" color="warning" class="mr-2"></v-icon>
                    消息推送
                  </h4>
                  <p class="text-body-2 text-medium-emphasis">
                    訂閱我們的最新消息，第一時間接收重要公告與優惠資訊。
                  </p>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import NewsCard from '../../components/news/NewsCard.vue'

export default {
  name: 'NewsView',
  components: {
    NewsCard
  },
  setup() {
    const store = useStore()
    
    // 響應式資料
    const loading = ref(true)
    const selectedFilter = ref('all')
    const sortBy = ref('newest')
    const viewMode = ref('grid')
    
    // 計算屬性
    const allNews = computed(() => {
      return store.getters['news/allNews'] || []
    })
    
    const companyNews = computed(() => {
      return store.getters['news/companyNews'] || []
    })
    
    const productNews = computed(() => {
      return store.getters['news/productNews'] || []
    })
    
    const promotionNews = computed(() => {
      return store.getters['news/promotionNews'] || []
    })
    
    const systemNews = computed(() => {
      return store.getters['news/systemNews'] || []
    })
    
    const pinnedNews = computed(() => {
      return store.getters['news/pinnedNews'] || []
    })
    
    // 消息篩選選項
    const newsFilters = computed(() => [
      { 
        value: 'all', 
        label: '全部消息', 
        icon: 'mdi-newspaper',
        count: allNews.value.length
      },
      { 
        value: 'pinned', 
        label: '置頂消息', 
        icon: 'mdi-pin',
        count: pinnedNews.value.length
      },
      { 
        value: 'company', 
        label: '公司動態', 
        icon: 'mdi-office-building',
        count: companyNews.value.length
      },
      { 
        value: 'product', 
        label: '產品資訊', 
        icon: 'mdi-package-variant',
        count: productNews.value.length
      },
      { 
        value: 'promotion', 
        label: '優惠活動', 
        icon: 'mdi-sale',
        count: promotionNews.value.length
      },
      { 
        value: 'system', 
        label: '系統公告', 
        icon: 'mdi-bullhorn',
        count: systemNews.value.length
      }
    ])
    
    // 排序選項
    const sortOptions = [
      { label: '最新發布', value: 'newest' },
      { label: '最多閱讀', value: 'views' },
      { label: '最多為讚', value: 'likes' },
      { label: '按標題排序', value: 'title' }
    ]
    
    // 篩選後的消息
    const filteredNews = computed(() => {
      let news = []
      
      // 根據消息類型篩選
      switch (selectedFilter.value) {
        case 'pinned':
          news = pinnedNews.value
          break
        case 'company':
          news = companyNews.value
          break
        case 'product':
          news = productNews.value
          break
        case 'promotion':
          news = promotionNews.value
          break
        case 'system':
          news = systemNews.value
          break
        case 'all':
        default:
          news = allNews.value
          break
      }
      
      return news
    })
    
    // 排序後的消息
    const displayedNews = computed(() => {
      const news = [...filteredNews.value]
      
      switch (sortBy.value) {
        case 'views':
          news.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        case 'likes':
          news.sort((a, b) => (b.likes || 0) - (a.likes || 0))
          break
        case 'title':
          news.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'))
          break
        case 'newest':
        default:
          news.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
          break
      }
      
      return news
    })
    
    // 方法
    const setNewsFilter = (filterValue) => {
      selectedFilter.value = filterValue
    }
    
    const loadData = async () => {
      try {
        loading.value = true
        
        // 載入最新消息資料
        if (store.getters['news/allNews'].length === 0) {
          await store.dispatch('news/loadNews')
        }
      } catch (error) {
        console.error('Failed to load news data:', error)
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
      selectedFilter,
      sortBy,
      viewMode,
      newsFilters,
      sortOptions,
      displayedNews,
      setNewsFilter
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.news-page {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.news-count-chip {
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.filter-section {
  background: rgba(179, 222, 229, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(179, 222, 229, 0.2);
}

.filter-btn {
  text-transform: none !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  transform: translateY(-1px);
}

.sort-select :deep(.v-field__input) {
  font-size: 0.875rem;
}

.info-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 手機版優化 */
@media (max-width: 599px) {
  .news-page {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .filter-section {
    padding: 0.75rem;
  }
  
  .filter-btn {
    font-size: 0.75rem;
    padding: 0 8px;
  }
  
  .sort-select {
    min-width: 100px !important;
  }
}

/* 平板版優化 */
@media (min-width: 600px) and (max-width: 959px) {
  .filter-btn {
    font-size: 0.8rem;
  }
}

/* 深色模式適配 */
.v-theme--customDark .filter-section {
  background: rgba(30, 30, 30, 0.3);
  border-color: rgba(179, 222, 229, 0.2);
}

.v-theme--customDark .info-card {
  background: rgba(30, 30, 30, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
<template>
  <v-container class="news-detail-page">
    <!-- 載入狀態 -->
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular 
        indeterminate 
        color="info"
        size="60"
      ></v-progress-circular>
    </div>

    <!-- 新聞內容 -->
    <template v-else-if="news">
      <!-- 面包屑 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-breadcrumbs
            :items="breadcrumbs"
            divider=">"
            class="pa-0"
          >
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :to="item.to"
                :disabled="item.disabled"
                class="text-decoration-none"
              >
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>

      <!-- 新聞頭部 -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card variant="flat" class="news-header pa-6">
            <!-- 分類與時間 -->
            <div class="d-flex align-center justify-space-between mb-4">
              <v-chip
                :color="getCategoryColor(news.category)"
                variant="flat"
                class="category-chip"
              >
                <v-icon start>{{ getCategoryIcon(news.category) }}</v-icon>
                {{ news.category }}
              </v-chip>
              
              <div class="d-flex align-center text-medium-emphasis">
                <v-icon icon="mdi-clock-outline" size="16" class="mr-1"></v-icon>
                <span class="text-caption">{{ formatDate(news.publishDate) }}</span>
              </div>
            </div>
            
            <!-- 標題 -->
            <h1 class="text-h4 font-weight-bold custom-dark mb-4">
              {{ news.title }}
            </h1>
            
            <!-- 摘要 -->
            <p class="text-h6 text-medium-emphasis font-weight-regular mb-4">
              {{ news.summary }}
            </p>
            
            <!-- 新聞資訊 -->
            <div class="d-flex align-center justify-space-between flex-wrap gap-3">
              <div class="d-flex align-center gap-4">
                <!-- 作者 -->
                <div class="d-flex align-center">
                  <v-icon icon="mdi-account-circle" size="20" class="mr-2"></v-icon>
                  <span class="text-body-2">{{ news.author }}</span>
                </div>
                
                <!-- 閱讀數 -->
                <div class="d-flex align-center">
                  <v-icon icon="mdi-eye" size="20" class="mr-2"></v-icon>
                  <span class="text-body-2">{{ formatViewCount(news.views) }} 次閱讀</span>
                </div>
                
                <!-- 按讚數 -->
                <div class="d-flex align-center">
                  <v-icon icon="mdi-heart" size="20" class="mr-2" color="error"></v-icon>
                  <span class="text-body-2">{{ news.likes }} 次按讚</span>
                </div>
              </div>
              
              <!-- 分享按鈕 -->
              <div class="d-flex align-center gap-2">
                <v-btn
                  @click="likeNews"
                  :variant="isLiked ? 'flat' : 'outlined'"
                  :color="isLiked ? 'error' : 'default'"
                  size="small"
                >
                  <v-icon :icon="isLiked ? 'mdi-heart' : 'mdi-heart-outline'" start></v-icon>
                  {{ isLiked ? '已按讚' : '按讚' }}
                </v-btn>
                
                <v-btn
                  @click="shareNews"
                  variant="outlined"
                  size="small"
                >
                  <v-icon icon="mdi-share" start></v-icon>
                  分享
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- 新聞內容區域 -->
      <v-row class="mb-6">
        <v-col cols="12" md="8">
          <!-- 主圖 -->
          <v-card class="mb-6" variant="flat">
            <v-img
              :src="news.image"
              :alt="news.title"
              height="400"
              cover
              class="rounded-lg"
            ></v-img>
          </v-card>
          
          <!-- 文章內容 -->
          <v-card variant="flat" class="news-content pa-6">
            <div 
              class="news-text"
              v-html="news.content"
            ></div>
            
            <!-- 標籤 -->
            <div v-if="news.tags && news.tags.length > 0" class="mt-6">
              <h4 class="text-subtitle-1 font-weight-bold custom-dark mb-3">相關標籤</h4>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="tag in news.tags"
                  :key="tag"
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <!-- 右側邊欄 -->
        <v-col cols="12" md="4">
          <!-- 相關新聞 -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-newspaper-variant" class="mr-2" color="info"></v-icon>
              相關新聞
            </v-card-title>
            <v-card-text class="pa-3">
              <div 
                v-for="relatedNews in relatedNewsList" 
                :key="relatedNews.id"
                class="related-news-item"
              >
                <v-card
                  :to="{ name: 'NewsDetail', params: { id: relatedNews.id } }"
                  variant="flat"
                  class="mb-3 pa-3 related-news-card"
                  hover
                >
                  <div class="d-flex gap-3">
                    <v-img
                      :src="relatedNews.image"
                      :alt="relatedNews.title"
                      width="80"
                      height="60"
                      cover
                      class="rounded"
                    ></v-img>
                    <div class="flex-grow-1">
                      <h5 class="text-body-2 font-weight-medium custom-dark mb-1 related-title">
                        {{ relatedNews.title }}
                      </h5>
                      <div class="d-flex align-center text-caption text-medium-emphasis">
                        <v-icon icon="mdi-clock-outline" size="12" class="mr-1"></v-icon>
                        {{ formatDate(relatedNews.publishDate) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
              
              <v-btn
                :to="{ name: 'News' }"
                variant="outlined"
                size="small"
                block
                class="mt-3"
              >
                更多新聞
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- 熱門新聞 -->
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-fire" class="mr-2" color="error"></v-icon>
              熱門新聞
            </v-card-title>
            <v-card-text class="pa-3">
              <div 
                v-for="(hotNews, index) in hotNewsList" 
                :key="hotNews.id"
                class="hot-news-item"
              >
                <v-card
                  :to="{ name: 'NewsDetail', params: { id: hotNews.id } }"
                  variant="flat"
                  class="mb-3 pa-3 hot-news-card"
                  hover
                >
                  <div class="d-flex align-center gap-3">
                    <v-chip
                      :color="index < 3 ? 'error' : 'grey'"
                      size="small"
                      variant="flat"
                      class="rank-chip"
                    >
                      {{ index + 1 }}
                    </v-chip>
                    <div class="flex-grow-1">
                      <h5 class="text-body-2 font-weight-medium custom-dark mb-1 hot-title">
                        {{ hotNews.title }}
                      </h5>
                      <div class="d-flex align-center text-caption text-medium-emphasis">
                        <v-icon icon="mdi-eye" size="12" class="mr-1"></v-icon>
                        {{ formatViewCount(hotNews.views) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- 底部操作區 -->
      <v-row>
        <v-col cols="12">
          <v-card variant="flat" class="pa-4 text-center">
            <div class="d-flex justify-center align-center gap-4">
              <v-btn
                :to="{ name: 'News' }"
                variant="outlined"
                prepend-icon="mdi-arrow-left"
              >
                返回新聞列表
              </v-btn>
              
              <v-btn
                @click="shareNews"
                variant="flat"
                color="primary"
                prepend-icon="mdi-share"
              >
                分享新聞
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
    
    <!-- 找不到新聞 -->
    <template v-else>
      <v-row class="justify-center">
        <v-col cols="12" md="8" class="text-center py-12">
          <v-icon 
            icon="mdi-newspaper-remove" 
            size="120" 
            color="grey-lighten-1"
            class="mb-6"
          ></v-icon>
          <h2 class="text-h4 font-weight-bold custom-dark mb-4">
            找不到指定新聞
          </h2>
          <p class="text-h6 text-medium-emphasis mb-6">
            該新聞可能已被刪除或不存在，請查看其他新聞內容。
          </p>
          <div class="d-flex justify-center gap-3">
            <v-btn
              :to="{ name: 'News' }"
              color="primary"
              variant="flat"
              prepend-icon="mdi-newspaper"
            >
              瀏覽所有新聞
            </v-btn>
            <v-btn
              :to="{ name: 'Home' }"
              variant="outlined"
              prepend-icon="mdi-home"
            >
              回到首頁
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'NewsDetailView',
  setup() {
    const store = useStore()
    const route = useRoute()
    
    // 響應式資料
    const loading = ref(true)
    const isLiked = ref(false)
    
    // 計算屬性
    const news = computed(() => {
      return store.getters['news/currentNews']
    })
    
    const relatedNewsList = computed(() => {
      if (!news.value) return []
      return store.getters['news/getNewsByCategory'](news.value.category)
        .filter(n => n.id !== news.value.id)
        .slice(0, 4)
    })
    
    const hotNewsList = computed(() => {
      return store.getters['news/hotNews'].slice(0, 5)
    })
    
    const breadcrumbs = computed(() => [
      {
        title: '首頁',
        to: { name: 'Home' },
        disabled: false
      },
      {
        title: '最新消息',
        to: { name: 'News' },
        disabled: false
      },
      {
        title: news.value?.title || '新聞詳情',
        disabled: true
      }
    ])
    
    // 方法
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const formatViewCount = (count) => {
      if (count >= 10000) {
        return (count / 10000).toFixed(1) + '萬'
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k'
      }
      return count?.toString() || '0'
    }
    
    const getCategoryColor = (category) => {
      const categoryColors = {
        '公司動態': 'primary',
        '產品資訊': 'info',
        '優惠活動': 'error',
        '系統公告': 'warning',
        '技術分享': 'success',
        '行業動態': 'purple'
      }
      return categoryColors[category] || 'secondary'
    }
    
    const getCategoryIcon = (category) => {
      const categoryIcons = {
        '公司動態': 'mdi-office-building',
        '產品資訊': 'mdi-package-variant',
        '優惠活動': 'mdi-sale',
        '系統公告': 'mdi-bullhorn',
        '技術分享': 'mdi-code-tags',
        '行業動態': 'mdi-trending-up'
      }
      return categoryIcons[category] || 'mdi-information'
    }
    
    const likeNews = () => {
      if (news.value) {
        isLiked.value = !isLiked.value
        if (isLiked.value) {
          store.dispatch('news/incrementLikes', news.value.id)
        }
      }
    }
    
    const shareNews = () => {
      if (news.value) {
        if (navigator.share) {
          navigator.share({
            title: news.value.title,
            text: news.value.summary,
            url: window.location.href
          })
        } else {
          // 備用分享方式
          navigator.clipboard.writeText(window.location.href)
          // 這裡可以顯示一個提示訊息
          console.log('鏈接已複製到剪貼板')
        }
      }
    }
    
    const loadData = async () => {
      try {
        loading.value = true
        const newsId = route.params.id
        
        // 載入新聞詳情
        await store.dispatch('news/loadNewsDetail', newsId)
        
        // 確保新聞列表已載入（為了相關新聞）
        if (store.getters['news/allNews'].length === 0) {
          await store.dispatch('news/loadNews')
        }
      } catch (error) {
        console.error('Failed to load news detail:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 監聽路由變化
    watch(() => route.params.id, () => {
      loadData()
    })
    
    // 生命週期
    onMounted(() => {
      loadData()
    })
    
    return {
      loading,
      news,
      isLiked,
      relatedNewsList,
      hotNewsList,
      breadcrumbs,
      formatDate,
      formatViewCount,
      getCategoryColor,
      getCategoryIcon,
      likeNews,
      shareNews
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.news-detail-page {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.news-header {
  background: linear-gradient(135deg, rgba(179, 222, 229, 0.1) 0%, rgba(250, 230, 177, 0.1) 100%);
  border: 1px solid rgba(179, 222, 229, 0.2);
}

.category-chip {
  font-weight: 600;
}

.news-content {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.news-text {
  line-height: 1.8;
  font-size: 1.1rem;
}

.news-text :deep(h2) {
  color: #31525B;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  font-size: 1.5rem;
}

.news-text :deep(h3) {
  color: #31525B;
  font-weight: 600;
  margin: 1.5rem 0 0.8rem 0;
  font-size: 1.3rem;
}

.news-text :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
}

.news-text :deep(ul) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.news-text :deep(li) {
  margin-bottom: 0.5rem;
}

.related-news-card,
.hot-news-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.related-news-card:hover,
.hot-news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.related-title,
.hot-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.rank-chip {
  font-weight: 700;
  min-width: 28px;
}

/* 手機版優化 */
@media (max-width: 959px) {
  .news-header {
    padding: 1rem !important;
  }
  
  .news-content {
    padding: 1rem !important;
  }
  
  .news-text {
    font-size: 1rem;
  }
  
  .news-text :deep(h2) {
    font-size: 1.3rem;
  }
  
  .news-text :deep(h3) {
    font-size: 1.2rem;
  }
}

/* 深色模式適配 */
.v-theme--customDark .news-header {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(49, 82, 91, 0.3) 100%);
  border-color: rgba(179, 222, 229, 0.2);
}

.v-theme--customDark .news-content {
  background: rgba(30, 30, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--customDark .related-news-card,
.v-theme--customDark .hot-news-card {
  background: rgba(30, 30, 30, 0.6);
}
</style>
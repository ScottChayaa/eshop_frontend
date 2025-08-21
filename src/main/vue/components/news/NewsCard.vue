<template>
  <v-card
    :to="{ name: 'NewsDetail', params: { id: news.id } }"
    class="news-card h-100"
    hover
    variant="outlined"
    @click="trackNewsClick"
  >
    <!-- 新聞圖片區域 -->
    <div class="image-container">
      <v-img
        :src="news.image"
        :alt="news.title"
        height="200"
        cover
        class="news-image"
      >
        <!-- 新聞分類標籤 -->
        <div v-if="news.category" class="category-badge">
          <v-chip
            :color="getCategoryColor(news.category)"
            size="small"
            variant="flat"
            class="category-chip"
          >
            <v-icon start size="16">{{ getCategoryIcon(news.category) }}</v-icon>
            {{ news.category }}
          </v-chip>
        </div>
        
        <!-- 置頂標籤 -->
        <div v-if="news.isPinned" class="pinned-badge">
          <v-chip
            color="warning"
            size="small"
            variant="flat"
            class="pinned-chip"
          >
            <v-icon start size="16">mdi-pin</v-icon>
            置頂
          </v-chip>
        </div>
        
        <!-- 發布時間 -->
        <div class="publish-time">
          <v-chip
            color="rgba(0,0,0,0.6)"
            size="small"
            variant="flat"
            class="time-chip"
          >
            <v-icon start size="16">mdi-clock-outline</v-icon>
            {{ formatDate(news.publishDate) }}
          </v-chip>
        </div>
      </v-img>
    </div>

    <!-- 新聞內容 -->
    <v-card-text class="pa-3">
      <!-- 新聞標題 -->
      <h3 class="text-subtitle-1 font-weight-medium custom-dark mb-2 news-title">
        {{ news.title }}
      </h3>
      
      <!-- 新聞摘要 -->
      <p class="text-body-2 text-medium-emphasis mb-3 news-summary">
        {{ news.summary }}
      </p>
      
      <!-- 新聞標籤 -->
      <div v-if="news.tags && news.tags.length > 0" class="news-tags mb-2">
        <v-chip
          v-for="tag in news.tags.slice(0, 3)"
          :key="tag"
          size="x-small"
          variant="outlined"
          color="primary"
          class="mr-1 mb-1"
        >
          {{ tag }}
        </v-chip>
      </div>
      
      <!-- 新聞統計 -->
      <div class="d-flex align-center justify-space-between mt-2">
        <div class="d-flex align-center">
          <!-- 閱讀次數 -->
          <div class="d-flex align-center mr-3">
            <v-icon size="16" color="medium-emphasis" class="mr-1">mdi-eye</v-icon>
            <span class="text-caption text-medium-emphasis">{{ formatViewCount(news.views) }}</span>
          </div>
          
          <!-- 讚數 -->
          <div v-if="news.likes" class="d-flex align-center">
            <v-icon size="16" color="error" class="mr-1">mdi-heart</v-icon>
            <span class="text-caption text-medium-emphasis">{{ news.likes }}</span>
          </div>
        </div>
        
        <!-- 來源 -->
        <div v-if="news.author" class="text-caption text-medium-emphasis">
          <v-icon size="16" class="mr-1">mdi-account-circle</v-icon>
          {{ news.author }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'NewsCard',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // 方法
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        return '今天'
      } else if (diffDays === 2) {
        return '昨天'
      } else if (diffDays <= 7) {
        return `${diffDays - 1} 天前`
      } else {
        return date.toLocaleDateString('zh-TW', {
          month: 'short',
          day: 'numeric'
        })
      }
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
    
    const trackNewsClick = () => {
      // 新聞點擊追蹤
      console.log(`News clicked: ${props.news.title}`)
    }
    
    return {
      formatDate,
      formatViewCount,
      getCategoryColor,
      getCategoryIcon,
      trackNewsClick
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.news-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.news-image {
  transition: transform 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.05);
}

/* 分類徽章 */
.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.category-chip {
  font-weight: 600;
}

/* 置頂徽章 */
.pinned-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.pinned-chip {
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

/* 發布時間 */
.publish-time {
  position: absolute;
  bottom: 8px;
  left: 8px;
  z-index: 2;
}

.time-chip {
  font-weight: 500;
  color: white !important;
}

/* 新聞標題 */
.news-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  min-height: 2.6em;
}

/* 新聞摘要 */
.news-summary {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 2.8em;
}

/* 新聞標籤 */
.news-tags {
  margin-top: 8px;
}

/* 手機版優化 */
@media (max-width: 599px) {
  .news-image {
    height: 160px !important;
  }
  
  .category-badge,
  .pinned-badge,
  .publish-time {
    transform: scale(0.9);
  }
  
  .news-title {
    font-size: 0.875rem;
  }
  
  .news-summary {
    font-size: 0.8rem;
  }
}

/* 深色模式適配 */
.v-theme--customDark .news-card {
  background: rgba(30, 30, 30, 0.8);
}

.v-theme--customDark .news-card:hover {
  background: rgba(30, 30, 30, 0.9);
}
</style>
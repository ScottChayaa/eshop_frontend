<template>
  <v-container class="not-found-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <div class="error-content">
          <!-- 404 圖示區域 -->
          <div class="error-icon mb-6">
            <v-icon
              size="120"
              color="secondary"
              class="mb-4"
            >
              mdi-emoticon-sad-outline
            </v-icon>
            <div class="error-number">
              <span class="text-h1 font-weight-bold custom-dark">4</span>
              <span class="text-h1 font-weight-bold secondary--text">0</span>
              <span class="text-h1 font-weight-bold custom-dark">4</span>
            </div>
          </div>

          <!-- 錯誤訊息區域 -->
          <div class="error-message mb-6">
            <h1 class="text-h4 font-weight-bold custom-dark mb-3">
              頁面不存在
            </h1>
            <p class="text-h6 text--secondary mb-4">
              抱歉，您所尋找的頁面不存在或已被移動
            </p>
            <p class="text-body-1 text--secondary">
              請檢查網址是否正確，或嘗試以下操作：
            </p>
          </div>

          <!-- 建議操作區域 -->
          <div class="suggested-actions mb-6">
            <v-list class="transparent">
              <v-list-item
                v-for="suggestion in suggestions"
                :key="suggestion.text"
                class="suggestion-item"
              >
                <template v-slot:prepend>
                  <v-icon :color="suggestion.color" size="20">
                    {{ suggestion.icon }}
                  </v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  {{ suggestion.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <!-- 導航按鈕區域 -->
          <div class="navigation-buttons">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-home"
              @click="goHome"
              class="mr-4 mb-2"
            >
              返回首頁
            </v-btn>
            
            <v-btn
              variant="outlined"
              color="secondary"
              size="large"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
              class="mb-2"
            >
              返回上頁
            </v-btn>
          </div>

          <!-- 搜尋區域 -->
          <div class="search-section mt-8">
            <v-divider class="mb-6"></v-divider>
            <h3 class="text-h6 custom-dark mb-4">
              或者嘗試搜尋您需要的商品：
            </h3>
            <v-form @submit.prevent="handleSearch" class="search-form">
              <v-text-field
                v-model="searchQuery"
                label="搜尋商品..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                class="search-input"
                @keyup.enter="handleSearch"
              >
                <template v-slot:append>
                  <v-btn
                    color="primary"
                    :disabled="!searchQuery.trim()"
                    @click="handleSearch"
                  >
                    搜尋
                  </v-btn>
                </template>
              </v-text-field>
            </v-form>
          </div>

          <!-- 熱門商品推薦 -->
          <div class="popular-links mt-8">
            <h3 class="text-h6 custom-dark mb-4">
              熱門分類：
            </h3>
            <div class="category-chips">
              <v-chip
                v-for="category in popularCategories"
                :key="category.id"
                :to="category.to"
                color="secondary"
                variant="outlined"
                class="ma-1"
                size="small"
                @click="navigateToCategory(category)"
              >
                <v-icon start>{{ category.icon }}</v-icon>
                {{ category.name }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundView',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')

    const suggestions = [
      {
        icon: 'mdi-check-circle',
        color: 'success',
        text: '檢查網址拼寫是否正確'
      },
      {
        icon: 'mdi-refresh',
        color: 'info',
        text: '重新整理頁面'
      },
      {
        icon: 'mdi-home',
        color: 'primary',
        text: '回到首頁重新開始'
      },
      {
        icon: 'mdi-magnify',
        color: 'secondary',
        text: '使用搜尋功能找到您需要的商品'
      }
    ]

    const popularCategories = [
      {
        id: 2,
        name: '3C產品',
        icon: 'mdi-laptop',
        to: '/category/2'
      },
      {
        id: 1,
        name: '服飾',
        icon: 'mdi-tshirt-crew',
        to: '/category/1'
      },
      {
        id: 3,
        name: '居家生活',
        icon: 'mdi-home',
        to: '/category/3'
      },
      {
        id: 5,
        name: '運動戶外',
        icon: 'mdi-run',
        to: '/category/5'
      }
    ]

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          name: 'Search',
          query: { q: searchQuery.value.trim() }
        })
      }
    }

    const navigateToCategory = (category) => {
      router.push(category.to)
    }

    return {
      searchQuery,
      suggestions,
      popularCategories,
      goHome,
      goBack,
      handleSearch,
      navigateToCategory
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.not-found-container {
  min-height: calc(100vh - 200px);
}

.fill-height {
  min-height: 70vh;
}

.error-content {
  max-width: 600px;
  margin: 0 auto;
}

.error-icon {
  position: relative;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  line-height: 1;
}

.error-number .text-h1 {
  font-size: 6rem !important;
  font-weight: 900 !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: rgba(250, 230, 177, 0.1);
}

.navigation-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.search-form {
  max-width: 400px;
  margin: 0 auto;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.v-chip {
  transition: all 0.2s ease;
}

.v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

@media (max-width: 960px) {
  .error-number .text-h1 {
    font-size: 4rem !important;
  }
  
  .navigation-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .navigation-buttons .v-btn {
    width: 100%;
    max-width: 250px;
  }
  
  .category-chips {
    gap: 4px;
  }
}

@media (max-width: 600px) {
  .error-number .text-h1 {
    font-size: 3rem !important;
  }
  
  .error-content {
    padding: 0 16px;
  }
}
</style>
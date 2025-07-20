<template>
  <div class="product-content">
    <!-- 內容切換標籤 -->
    <v-tabs
      v-model="activeTab"
      color="secondary"
      class="content-tabs"
    >
      <v-tab value="description">
        <v-icon start>mdi-text-box-outline</v-icon>
        商品描述
      </v-tab>
      <v-tab value="specifications" v-if="hasSpecifications">
        <v-icon start>mdi-format-list-bulleted</v-icon>
        規格表
      </v-tab>
      <v-tab value="reviews" v-if="hasReviews">
        <v-icon start>mdi-star-outline</v-icon>
        評價 ({{ product.reviews || 0 }})
      </v-tab>
      <v-tab value="shipping">
        <v-icon start>mdi-truck-delivery-outline</v-icon>
        運送說明
      </v-tab>
    </v-tabs>

    <!-- 內容區域 -->
    <v-window v-model="activeTab" class="content-window">
      <!-- 商品描述 -->
      <v-window-item value="description">
        <v-card flat class="content-card">
          <v-card-text class="pa-6">
            <div class="description-content">
              <!-- 如果有富文本內容 -->
              <div 
                v-if="product.description" 
                v-html="sanitizedDescription"
                class="description-html"
              ></div>
              
              <!-- 如果有結構化描述 -->
              <div v-else-if="product.features" class="features-list">
                <h3 class="features-title">產品特色</h3>
                <ul class="features-items">
                  <li 
                    v-for="(feature, index) in product.features"
                    :key="index"
                    class="feature-item"
                  >
                    <v-icon color="success" size="small" class="feature-icon">
                      mdi-check-circle
                    </v-icon>
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <!-- 預設描述 -->
              <div v-else class="default-description">
                <p>{{ product.description || '暫無商品描述' }}</p>
              </div>

              <!-- 商品圖片展示 -->
              <div v-if="product.contentImages" class="content-images">
                <v-img
                  v-for="(image, index) in product.contentImages"
                  :key="index"
                  :src="image.url"
                  :alt="image.alt || `商品圖片 ${index + 1}`"
                  class="content-image"
                  cover
                >
                  <template v-slot:placeholder>
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </template>
                </v-img>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- 規格表 -->
      <v-window-item value="specifications" v-if="hasSpecifications">
        <v-card flat class="content-card">
          <v-card-text class="pa-6">
            <v-table class="specifications-table">
              <thead>
                <tr>
                  <th class="spec-header">規格項目</th>
                  <th class="spec-header">詳細資訊</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(value, key) in product.specifications"
                  :key="key"
                  class="spec-row"
                >
                  <td class="spec-label">{{ key }}</td>
                  <td class="spec-value">{{ value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- 評價區域 -->
      <v-window-item value="reviews" v-if="hasReviews">
        <v-card flat class="content-card">
          <v-card-text class="pa-6">
            <!-- 評價統計 -->
            <div class="reviews-summary">
              <div class="rating-overview">
                <div class="overall-rating">
                  <span class="rating-number">{{ product.rating || 0 }}</span>
                  <v-rating
                    :model-value="product.rating || 0"
                    color="warning"
                    density="compact"
                    readonly
                    half-increments
                  ></v-rating>
                </div>
                <div class="rating-stats">
                  <span class="total-reviews">
                    共 {{ product.reviews || 0 }} 則評價
                  </span>
                </div>
              </div>
            </div>

            <!-- 評價列表 -->
            <div v-if="product.reviewsList" class="reviews-list">
              <div 
                v-for="review in product.reviewsList"
                :key="review.id"
                class="review-item"
              >
                <div class="review-header">
                  <div class="reviewer-info">
                    <span class="reviewer-name">{{ review.userName }}</span>
                    <v-rating
                      :model-value="review.rating"
                      color="warning"
                      density="compact"
                      readonly
                      size="small"
                    ></v-rating>
                  </div>
                  <span class="review-date">{{ formatDate(review.date) }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
              </div>
            </div>

            <!-- 如果沒有評價 -->
            <div v-else class="no-reviews">
              <v-icon size="48" color="grey-lighten-2">mdi-comment-outline</v-icon>
              <p class="no-reviews-text">目前還沒有評價</p>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- 運送說明 -->
      <v-window-item value="shipping">
        <v-card flat class="content-card">
          <v-card-text class="pa-6">
            <div class="shipping-content">
              <div class="shipping-section">
                <h3 class="shipping-title">
                  <v-icon color="success" class="mr-2">mdi-truck-delivery</v-icon>
                  運送方式
                </h3>
                <div class="shipping-methods">
                  <div class="shipping-method">
                    <strong>宅配到府</strong>
                    <p>透過宅配服務送達指定地址，需要有人簽收</p>
                    <span class="shipping-fee">運費：NT$ 100 (滿 NT$ 990 免運費)</span>
                  </div>
                  <div class="shipping-method">
                    <strong>超商取貨</strong>
                    <p>可選擇 7-11、全家、萊爾富等超商取貨</p>
                    <span class="shipping-fee">運費：NT$ 60</span>
                  </div>
                </div>
              </div>

              <v-divider class="my-6"></v-divider>

              <div class="shipping-section">
                <h3 class="shipping-title">
                  <v-icon color="info" class="mr-2">mdi-clock-outline</v-icon>
                  配送時間
                </h3>
                <div class="delivery-times">
                  <div class="delivery-time">
                    <strong>宅配到府：</strong>3-5 個工作天
                  </div>
                  <div class="delivery-time">
                    <strong>超商取貨：</strong>2-4 個工作天
                  </div>
                </div>
              </div>

              <v-divider class="my-6"></v-divider>

              <div class="shipping-section">
                <h3 class="shipping-title">
                  <v-icon color="warning" class="mr-2">mdi-shield-check</v-icon>
                  退換貨政策
                </h3>
                <div class="return-policy">
                  <ul class="policy-list">
                    <li>商品享有 7 天鑑賞期（不包含例假日）</li>
                    <li>退貨商品必須保持原狀，包裝完整</li>
                    <li>退貨運費由買方負擔，商品瑕疵除外</li>
                    <li>退款將於確認商品無誤後 3-5 個工作天處理</li>
                  </ul>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
// import DOMPurify from 'dompurify'

export default {
  name: 'ProductContent',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const activeTab = ref('description')

    // 檢查是否有規格表
    const hasSpecifications = computed(() => {
      return props.product.specifications && 
             Object.keys(props.product.specifications).length > 0
    })

    // 檢查是否有評價
    const hasReviews = computed(() => {
      return props.product.reviews && props.product.reviews > 0
    })

    // 清理描述內容（防止 XSS）
    const sanitizedDescription = computed(() => {
      if (!props.product.description) return ''
      // 簡單的 HTML 清理，移除潛在危險的標籤
      return props.product.description
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="/gi, 'data-')
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      activeTab,
      hasSpecifications,
      hasReviews,
      sanitizedDescription,
      formatDate
    }
  }
}
</script>

<style scoped>
.product-content {
  margin-top: 32px;
}

.content-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 0;
}

.content-window {
  min-height: 400px;
}

.content-card {
  background: transparent;
}

/* 商品描述樣式 */
.description-content {
  line-height: 1.8;
  color: #333;
}

.description-html {
  font-size: 1rem;
}

.description-html :deep(h1),
.description-html :deep(h2),
.description-html :deep(h3) {
  color: #31525B;
  margin: 1.5em 0 1em 0;
}

.description-html :deep(p) {
  margin-bottom: 1em;
}

.description-html :deep(ul),
.description-html :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.features-title {
  color: #31525B;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
}

.features-items {
  list-style: none;
  padding: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.feature-icon {
  margin-right: 12px;
}

.content-images {
  margin-top: 32px;
}

.content-image {
  margin-bottom: 16px;
  border-radius: 8px;
  max-width: 100%;
}

/* 規格表樣式 */
.specifications-table {
  background: white;
  border-radius: 8px;
}

.spec-header {
  background: #FAE6B1;
  color: #31525B;
  font-weight: 600;
  padding: 16px;
}

.spec-row:nth-child(even) {
  background: rgba(250, 230, 177, 0.1);
}

.spec-label {
  font-weight: 600;
  color: #31525B;
  padding: 16px;
  width: 30%;
}

.spec-value {
  padding: 16px;
  color: #333;
}

/* 評價樣式 */
.reviews-summary {
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(250, 230, 177, 0.1);
  border-radius: 8px;
}

.rating-overview {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFA101;
}

.total-reviews {
  color: #666;
  font-size: 0.9rem;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-name {
  font-weight: 600;
  color: #31525B;
}

.review-date {
  color: #999;
  font-size: 0.9rem;
}

.review-content {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.no-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-reviews-text {
  margin-top: 16px;
  font-size: 1.1rem;
}

/* 運送說明樣式 */
.shipping-content {
  color: #333;
}

.shipping-section {
  margin-bottom: 24px;
}

.shipping-title {
  color: #31525B;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.shipping-methods,
.delivery-times {
  margin-left: 24px;
}

.shipping-method {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.shipping-method strong {
  color: #31525B;
  display: block;
  margin-bottom: 8px;
}

.shipping-method p {
  margin: 8px 0;
  color: #666;
}

.shipping-fee {
  color: #FFA101;
  font-weight: 600;
  font-size: 0.9rem;
}

.delivery-time {
  margin-bottom: 8px;
  color: #333;
}

.policy-list {
  margin-left: 24px;
  color: #333;
}

.policy-list li {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .content-card {
    padding: 0;
  }
  
  .spec-label {
    width: 40%;
    padding: 12px;
  }
  
  .spec-value {
    padding: 12px;
  }
  
  .rating-overview {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .shipping-methods,
  .delivery-times,
  .policy-list {
    margin-left: 12px;
  }
}

@media (min-width: 1200px) {
  .content-images .content-image {
    max-width: 800px;
  }
}
</style>
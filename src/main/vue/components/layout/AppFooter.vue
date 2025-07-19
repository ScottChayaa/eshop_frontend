<template>
  <v-footer 
    color="surface" 
    class="pa-8 desktop-footer"
    elevation="4"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="mb-4">
          <div class="d-flex align-center mb-4">
            <v-icon 
              size="28" 
              color="secondary" 
              class="mr-2"
            >
              mdi-shopping
            </v-icon>
            <span class="text-h6 font-weight-bold custom-dark">
              eshop
            </span>
          </div>
          <p class="text-body-2 mb-2">
            現代化的購物體驗，精選商品，優質服務
          </p>
          <div class="d-flex">
            <v-btn
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              icon
              size="small"
              variant="text"
              class="mr-2"
              target="_blank"
            >
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="2" class="mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 custom-dark">
            商品分類
          </h3>
          <div class="d-flex flex-column">
            <router-link
              v-for="category in productCategories"
              :key="category.id"
              :to="{ name: 'Category', params: { id: category.id } }"
              class="text-decoration-none text-body-2 mb-2 footer-link"
            >
              {{ category.name }}
            </router-link>
          </div>
        </v-col>

        <v-col cols="6" md="2" class="mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 custom-dark">
            客戶服務
          </h3>
          <div class="d-flex flex-column">
            <router-link
              v-for="service in customerServices"
              :key="service.name"
              :to="service.path"
              class="text-decoration-none text-body-2 mb-2 footer-link"
            >
              {{ service.name }}
            </router-link>
          </div>
        </v-col>

        <v-col cols="12" md="2" class="mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 custom-dark">
            會員專區
          </h3>
          <div class="d-flex flex-column">
            <router-link
              v-for="member in memberServices"
              :key="member.name"
              :to="member.path"
              class="text-decoration-none text-body-2 mb-2 footer-link"
            >
              {{ member.name }}
            </router-link>
          </div>
        </v-col>

        <v-col cols="12" md="2" class="mb-4">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 custom-dark">
            聯絡我們
          </h3>
          <div class="d-flex flex-column">
            <div class="d-flex align-center mb-2">
              <v-icon size="16" class="mr-2">mdi-phone</v-icon>
              <span class="text-body-2">02-1234-5678</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon size="16" class="mr-2">mdi-email</v-icon>
              <span class="text-body-2">service@eshop.com</span>
            </div>
            <div class="d-flex align-start mb-2">
              <v-icon size="16" class="mr-2 mt-1">mdi-map-marker</v-icon>
              <span class="text-body-2">台北市信義區信義路五段7號</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row align="center">
        <v-col cols="12" md="6">
          <p class="text-caption mb-0">
            © {{ currentYear }} eshop. All rights reserved.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <div class="d-flex flex-wrap justify-md-end">
            <router-link
              v-for="legal in legalLinks"
              :key="legal.name"
              :to="legal.path"
              class="text-decoration-none text-caption mr-4 mb-1 footer-link"
            >
              {{ legal.name }}
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    const socialLinks = [
      { name: 'Facebook', icon: 'mdi-facebook', url: '#' },
      { name: 'Instagram', icon: 'mdi-instagram', url: '#' },
      { name: 'Twitter', icon: 'mdi-twitter', url: '#' },
      { name: 'Line', icon: 'mdi-chat', url: '#' }
    ]

    const productCategories = [
      { id: 'electronics', name: '電子產品' },
      { id: 'clothing', name: '服飾配件' },
      { id: 'books', name: '書籍雜誌' },
      { id: 'home', name: '居家生活' },
      { id: 'sports', name: '運動戶外' }
    ]

    const customerServices = [
      { name: '購物說明', path: '/help/shopping' },
      { name: '運送方式', path: '/help/shipping' },
      { name: '退換貨政策', path: '/help/returns' },
      { name: '常見問題', path: '/help/faq' }
    ]

    const memberServices = [
      { name: '會員登入', path: '/login' },
      { name: '會員註冊', path: '/register' },
      { name: '個人資料', path: '/profile' },
      { name: '訂單查詢', path: '/orders' }
    ]

    const legalLinks = [
      { name: '隱私權政策', path: '/legal/privacy' },
      { name: '服務條款', path: '/legal/terms' },
      { name: 'Cookie 政策', path: '/legal/cookies' }
    ]

    return {
      currentYear,
      socialLinks,
      productCategories,
      customerServices,
      memberServices,
      legalLinks
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.footer-link {
  color: rgba(0, 0, 0, 0.7);
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #FFA101 !important;
}

.theme--dark .footer-link {
  color: rgba(255, 255, 255, 0.7);
}

.theme--dark .footer-link:hover {
  color: #FFA101 !important;
}

/* PC版正常顯示，手機版隱藏 */
.desktop-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

/* 手機版隱藏 footer */
@media (max-width: 767px) {
  .desktop-footer {
    display: none !important;
  }
}

.theme--dark .desktop-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
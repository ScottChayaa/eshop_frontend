<template>
  <div class="product-list">
    <v-row v-if="!loading && products.length > 0">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <ProductCard 
          :product="product"
          @add-to-cart="handleAddToCart"
          @add-to-favorites="handleAddToFavorites"
        />
      </v-col>
    </v-row>

    <div v-else-if="loading" class="loading-container">
      <v-row>
        <v-col
          v-for="i in skeletonCount"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <ProductCardSkeleton />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="!loading && products.length === 0" class="empty-state">
      <v-container class="text-center py-12">
        <v-icon 
          size="64" 
          color="grey-lighten-1" 
          class="mb-4"
        >
          {{ emptyIcon }}
        </v-icon>
        <h3 class="text-h6 mb-2">{{ emptyTitle }}</h3>
        <p class="text-body-2 text--secondary mb-4">{{ emptyMessage }}</p>
        <v-btn
          v-if="showRetryButton"
          color="primary"
          @click="$emit('retry')"
        >
          重新載入
        </v-btn>
      </v-container>
    </div>

    <div v-if="showPagination && pagination.pages > 1" class="pagination-container mt-6">
      <v-pagination
        v-model="currentPage"
        :length="pagination.pages"
        :total-visible="7"
        @update:model-value="handlePageChange"
        color="secondary"
      ></v-pagination>
    </div>

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
      location="bottom"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '../ProductCard.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard,
    ProductCardSkeleton
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => ({
        page: 1,
        pages: 1,
        total: 0,
        limit: 12
      })
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    emptyTitle: {
      type: String,
      default: '沒有找到商品'
    },
    emptyMessage: {
      type: String,
      default: '試試調整搜尋條件或瀏覽其他分類'
    },
    emptyIcon: {
      type: String,
      default: 'mdi-package-variant-remove'
    },
    showRetryButton: {
      type: Boolean,
      default: false
    },
    skeletonCount: {
      type: Number,
      default: 12
    }
  },
  emits: ['page-change', 'add-to-cart', 'add-to-favorites', 'retry'],
  setup(props, { emit }) {
    const store = useStore()
    const currentPage = ref(props.pagination.page)
    const showSnackbar = ref(false)
    const snackbarMessage = ref('')

    const isAuthenticated = computed(() => 
      store.getters['auth/isAuthenticated']
    )

    watch(() => props.pagination.page, (newPage) => {
      currentPage.value = newPage
    })

    const handlePageChange = (page) => {
      emit('page-change', page)
    }

    const handleAddToCart = async (product) => {
      try {
        await store.dispatch('cart/addItem', {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
        
        snackbarMessage.value = `已將 ${product.name} 加入購物車`
        showSnackbar.value = true
        
        emit('add-to-cart', product)
      } catch (error) {
        console.error('Failed to add product to cart:', error)
        snackbarMessage.value = '加入購物車失敗，請稍後再試'
        showSnackbar.value = true
      }
    }

    const handleAddToFavorites = async (product) => {
      if (!isAuthenticated.value) {
        snackbarMessage.value = '請先登入才能加入收藏'
        showSnackbar.value = true
        return
      }

      try {
        await store.dispatch('favorites/toggleFavorite', product.id)
        
        const isFavorited = store.getters['favorites/isFavorited'](product.id)
        snackbarMessage.value = isFavorited 
          ? `已將 ${product.name} 加入收藏` 
          : `已將 ${product.name} 從收藏中移除`
        showSnackbar.value = true
        
        emit('add-to-favorites', product)
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
        snackbarMessage.value = '操作失敗，請稍後再試'
        showSnackbar.value = true
      }
    }

    return {
      currentPage,
      showSnackbar,
      snackbarMessage,
      handlePageChange,
      handleAddToCart,
      handleAddToFavorites
    }
  }
}
</script>

<style scoped>
.product-list {
  min-height: 400px;
}

.loading-container {
  width: 100%;
}

.empty-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.v-pagination :deep(.v-pagination__item) {
  font-weight: 500;
}

.v-pagination :deep(.v-pagination__item--is-active) {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}
</style>
<template>
  <v-container class="orders-container">
    <v-row>
      <v-col cols="12">
        <!-- 頁面標題 -->
        <div class="d-flex align-center mb-6">
          <v-icon size="32" color="secondary" class="mr-3">
            mdi-clipboard-list-outline
          </v-icon>
          <div>
            <h1 class="text-h4 custom-dark mb-1">訂單查詢</h1>
            <p class="text-body-2 text--secondary mb-0">
              查看您的購買記錄和訂單狀態
            </p>
          </div>
        </div>

        <!-- 訂單統計卡片 -->
        <v-row class="mb-6">
          <v-col cols="6" sm="3">
            <v-card class="stat-card text-center" elevation="2">
              <v-card-text class="pa-4">
                <v-icon size="32" color="primary" class="mb-2">mdi-clipboard-text</v-icon>
                <div class="text-h6 font-weight-bold custom-dark">{{ orderStats?.total || 0 }}</div>
                <div class="text-caption text--secondary">總訂單</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-card text-center" elevation="2">
              <v-card-text class="pa-4">
                <v-icon size="32" color="warning" class="mb-2">mdi-clock-outline</v-icon>
                <div class="text-h6 font-weight-bold custom-dark">{{ orderStats?.pending || 0 }}</div>
                <div class="text-caption text--secondary">待付款</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-card text-center" elevation="2">
              <v-card-text class="pa-4">
                <v-icon size="32" color="info" class="mb-2">mdi-truck-delivery</v-icon>
                <div class="text-h6 font-weight-bold custom-dark">{{ orderStats?.shipped || 0 }}</div>
                <div class="text-caption text--secondary">配送中</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stat-card text-center" elevation="2">
              <v-card-text class="pa-4">
                <v-icon size="32" color="success" class="mb-2">mdi-check-circle</v-icon>
                <div class="text-h6 font-weight-bold custom-dark">{{ orderStats?.delivered || 0 }}</div>
                <div class="text-caption text--secondary">已完成</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 篩選和搜尋工具列 -->
        <v-card class="filter-card mb-6" elevation="2">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="訂單狀態"
                  density="compact"
                  variant="outlined"
                  hide-details
                  @update:model-value="applyFilters"
                >
                  <template #prepend-inner>
                    <v-icon size="20">mdi-filter-variant</v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.dateRange"
                  :items="dateRangeOptions"
                  label="時間範圍"
                  density="compact"
                  variant="outlined"
                  hide-details
                  @update:model-value="applyFilters"
                >
                  <template #prepend-inner>
                    <v-icon size="20">mdi-calendar-range</v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.keyword"
                  label="搜尋訂單號或商品名稱"
                  density="compact"
                  variant="outlined"
                  hide-details
                  clearable
                  @keyup.enter="applyFilters"
                  @click:clear="clearSearch"
                >
                  <template #prepend-inner>
                    <v-icon size="20">mdi-magnify</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  variant="flat"
                  block
                  @click="applyFilters"
                  :loading="loading"
                >
                  搜尋
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 訂單列表 -->
        <div v-if="loading && orders.length === 0" class="text-center pa-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          />
          <div class="text-body-1 mt-4">載入訂單中...</div>
        </div>

        <div v-else-if="orders.length === 0" class="empty-state text-center pa-8">
          <v-icon size="80" color="grey-lighten-2" class="mb-4">
            mdi-clipboard-text-off-outline
          </v-icon>
          <h3 class="text-h6 custom-dark mb-2">尚無訂單記錄</h3>
          <p class="text-body-2 text--secondary mb-4">
            您還沒有任何訂單，快去選購喜歡的商品吧！
          </p>
          <v-btn
            color="primary"
            variant="flat"
            to="/"
            prepend-icon="mdi-shopping"
          >
            開始購物
          </v-btn>
        </div>

        <div v-else>
          <!-- 訂單卡片列表 -->
          <v-card
            v-for="order in orders"
            :key="order.id"
            class="order-card mb-4"
            elevation="2"
          >
            <v-card-title class="d-flex align-center justify-space-between pa-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-receipt</v-icon>
                <div>
                  <div class="text-body-1 font-weight-bold">{{ order.orderNumber }}</div>
                  <div class="text-caption text--secondary">
                    {{ formatDate(order.createdAt) }}
                  </div>
                </div>
              </div>
              <v-chip
                :color="getStatusColor(order.status)"
                variant="flat"
                size="small"
              >
                {{ getStatusText(order.status) }}
              </v-chip>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-0">
              <!-- 商品列表 -->
              <div class="product-list">
                <div
                  v-for="item in order.items"
                  :key="item.productId"
                  class="product-item d-flex align-center pa-4"
                >
                  <v-avatar size="60" rounded class="mr-4">
                    <v-img
                      :src="item.image"
                      :alt="item.name"
                      cover
                    />
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium custom-dark">
                      {{ item.name }}
                    </div>
                    <div class="text-caption text--secondary">
                      數量：{{ item.quantity }}
                    </div>
                  </div>
                  <div class="text-body-2 font-weight-bold custom-dark">
                    ${{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="d-flex align-center justify-space-between pa-4">
              <div class="order-total">
                <span class="text-body-2 text--secondary mr-2">訂單總額：</span>
                <span class="text-h6 font-weight-bold custom-dark">
                  ${{ formatPrice(order.total) }}
                </span>
              </div>

              <div class="order-actions">
                <v-btn
                  variant="outlined"
                  size="small"
                  @click="viewOrderDetail(order)"
                  class="mr-2"
                >
                  查看詳情
                </v-btn>

                <v-btn
                  v-if="canCancel(order.status)"
                  variant="outlined"
                  color="error"
                  size="small"
                  @click="showCancelDialog(order)"
                  class="mr-2"
                >
                  取消訂單
                </v-btn>

                <v-btn
                  v-if="canConfirmDelivery(order.status)"
                  variant="flat"
                  color="success"
                  size="small"
                  @click="confirmDelivery(order)"
                  class="mr-2"
                >
                  確認收貨
                </v-btn>

                <v-btn
                  v-if="canReorder(order.status)"
                  variant="flat"
                  color="primary"
                  size="small"
                  @click="reorder(order)"
                >
                  重新下單
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <!-- 分頁控制 -->
          <div v-if="pagination.totalPages > 1" class="text-center mt-6">
            <v-pagination
              v-model="currentPage"
              :length="pagination.totalPages"
              :total-visible="5"
              @update:model-value="loadOrders"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 取消訂單對話框 -->
    <v-dialog v-model="cancelDialog.show" max-width="500">
      <v-card>
        <v-card-title class="text-h6">取消訂單</v-card-title>
        <v-card-text>
          <p class="mb-4">確定要取消訂單 {{ cancelDialog.order?.orderNumber }} 嗎？</p>
          <v-textarea
            v-model="cancelDialog.reason"
            label="取消原因（選填）"
            rows="3"
            variant="outlined"
            placeholder="請說明取消訂單的原因..."
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="cancelDialog.show = false">取消</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmCancel"
            :loading="cancelDialog.loading"
          >
            確認取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 訂單詳情對話框 -->
    <v-dialog v-model="detailDialog.show" max-width="800" scrollable>
      <v-card v-if="detailDialog.order">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>訂單詳情</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="detailDialog.show = false"
          />
        </v-card-title>

        <v-card-text class="pa-0">
          <v-list>
            <!-- 基本信息 -->
            <v-list-subheader>基本信息</v-list-subheader>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-receipt</v-icon>
              </template>
              <v-list-item-title>訂單編號</v-list-item-title>
              <v-list-item-subtitle>{{ detailDialog.order.orderNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-calendar</v-icon>
              </template>
              <v-list-item-title>下單時間</v-list-item-title>
              <v-list-item-subtitle>{{ formatDateTime(detailDialog.order.createdAt) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              <v-list-item-title>訂單狀態</v-list-item-title>
              <template #append>
                <v-chip
                  :color="getStatusColor(detailDialog.order.status)"
                  variant="flat"
                  size="small"
                >
                  {{ getStatusText(detailDialog.order.status) }}
                </v-chip>
              </template>
            </v-list-item>

            <v-divider class="my-4" />

            <!-- 收貨信息 -->
            <v-list-subheader>收貨信息</v-list-subheader>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title>收貨人</v-list-item-title>
              <v-list-item-subtitle>{{ detailDialog.order.shippingAddress.name }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-phone</v-icon>
              </template>
              <v-list-item-title>聯絡電話</v-list-item-title>
              <v-list-item-subtitle>{{ detailDialog.order.shippingAddress.phone }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend>
                <v-icon>mdi-map-marker</v-icon>
              </template>
              <v-list-item-title>收貨地址</v-list-item-title>
              <v-list-item-subtitle>
                {{ detailDialog.order.shippingAddress.address }}
                <span v-if="detailDialog.order.shippingAddress.postalCode">
                  ({{ detailDialog.order.shippingAddress.postalCode }})
                </span>
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-4" />

            <!-- 商品清單 -->
            <v-list-subheader>商品清單</v-list-subheader>
            <v-list-item
              v-for="item in detailDialog.order.items"
              :key="item.productId"
            >
              <template #prepend>
                <v-avatar size="48" rounded>
                  <v-img :src="item.image" :alt="item.name" />
                </v-avatar>
              </template>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                單價：${{ formatPrice(item.price) }} × {{ item.quantity }}
              </v-list-item-subtitle>
              <template #append>
                <div class="font-weight-bold">
                  ${{ formatPrice(item.price * item.quantity) }}
                </div>
              </template>
            </v-list-item>

            <v-divider class="my-4" />

            <!-- 費用明細 -->
            <v-list-subheader>費用明細</v-list-subheader>
            <v-list-item>
              <v-list-item-title>商品小計</v-list-item-title>
              <template #append>
                ${{ formatPrice(detailDialog.order.subtotal) }}
              </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>運費</v-list-item-title>
              <template #append>
                ${{ formatPrice(detailDialog.order.shippingFee) }}
              </template>
            </v-list-item>
            <v-list-item v-if="detailDialog.order.discount > 0">
              <v-list-item-title>優惠折扣</v-list-item-title>
              <template #append>
                <span class="text-success">-${{ formatPrice(detailDialog.order.discount) }}</span>
              </template>
            </v-list-item>
            <v-list-item class="font-weight-bold">
              <v-list-item-title class="text-h6">訂單總額</v-list-item-title>
              <template #append>
                <span class="text-h6 custom-dark">
                  ${{ formatPrice(detailDialog.order.total) }}
                </span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import orderService, { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, PAYMENT_METHOD_TEXT } from '../../services/order.js'

export default {
  name: 'OrdersView',
  setup() {
    const store = useStore()
    
    // 響應式數據
    const loading = ref(false)
    const orders = ref([])
    const orderStats = ref({
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0
    })
    const currentPage = ref(1)
    const pagination = ref({
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    })

    // 篩選條件
    const filters = reactive({
      status: 'all',
      dateRange: 'all',
      keyword: ''
    })

    // 對話框狀態
    const cancelDialog = reactive({
      show: false,
      order: null,
      reason: '',
      loading: false
    })

    const detailDialog = reactive({
      show: false,
      order: null
    })

    // 篩選選項
    const statusOptions = [
      { title: '全部狀態', value: 'all' },
      { title: '待付款', value: 'pending' },
      { title: '已付款', value: 'paid' },
      { title: '處理中', value: 'processing' },
      { title: '已出貨', value: 'shipped' },
      { title: '已送達', value: 'delivered' },
      { title: '已取消', value: 'cancelled' },
      { title: '已退貨', value: 'returned' }
    ]

    const dateRangeOptions = [
      { title: '全部時間', value: 'all' },
      { title: '最近7天', value: '7days' },
      { title: '最近30天', value: '30days' },
      { title: '最近90天', value: '90days' }
    ]

    // 計算屬性
    const isLoggedIn = computed(() => store.getters['auth/isAuthenticated'])

    // 方法
    const loadOrders = async (page = 1) => {
      if (!isLoggedIn.value) {
        store.dispatch('ui/showError', '請先登入')
        return
      }

      try {
        loading.value = true
        
        const params = {
          page,
          limit: 10,
          status: filters.status === 'all' ? undefined : filters.status,
          dateRange: filters.dateRange === 'all' ? undefined : filters.dateRange,
          keyword: filters.keyword || undefined
        }

        const response = await orderService.getOrders(params)
        
        if (response.success) {
          orders.value = response.data
          pagination.value = response.pagination
          currentPage.value = page
        }
      } catch (error) {
        store.dispatch('ui/showError', error.message)
        console.error('載入訂單失敗:', error)
      } finally {
        loading.value = false
      }
    }

    const loadOrderStats = async () => {
      if (!isLoggedIn.value) return

      try {
        const response = await orderService.getOrderStats()
        if (response.success) {
          orderStats.value = response.data
        }
      } catch (error) {
        console.error('載入訂單統計失敗:', error)
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      loadOrders(1)
    }

    const clearSearch = () => {
      filters.keyword = ''
      applyFilters()
    }

    const viewOrderDetail = (order) => {
      detailDialog.order = order
      detailDialog.show = true
    }

    const showCancelDialog = (order) => {
      cancelDialog.order = order
      cancelDialog.reason = ''
      cancelDialog.show = true
    }

    const confirmCancel = async () => {
      try {
        cancelDialog.loading = true
        
        const response = await orderService.cancelOrder(
          cancelDialog.order.id,
          cancelDialog.reason
        )
        
        if (response.success) {
          store.dispatch('ui/showSuccess', '訂單已成功取消')
          cancelDialog.show = false
          loadOrders(currentPage.value)
          loadOrderStats()
        }
      } catch (error) {
        store.dispatch('ui/showError', error.message)
      } finally {
        cancelDialog.loading = false
      }
    }

    const confirmDelivery = async (order) => {
      try {
        const response = await orderService.confirmDelivery(order.id)
        
        if (response.success) {
          store.dispatch('ui/showSuccess', '已確認收貨')
          loadOrders(currentPage.value)
          loadOrderStats()
        }
      } catch (error) {
        store.dispatch('ui/showError', error.message)
      }
    }

    const reorder = async (order) => {
      try {
        const response = await orderService.reorder(order.id)
        
        if (response.success) {
          store.dispatch('ui/showSuccess', '商品已添加到購物車')
          // 可以導航到購物車頁面
          // router.push('/cart')
        }
      } catch (error) {
        store.dispatch('ui/showError', error.message)
      }
    }

    // 輔助方法
    const canCancel = (status) => ['pending', 'paid'].includes(status)
    const canConfirmDelivery = (status) => status === 'shipped'
    const canReorder = (status) => ['delivered', 'cancelled'].includes(status)

    const getStatusText = (status) => ORDER_STATUS_TEXT[status] || status
    const getStatusColor = (status) => ORDER_STATUS_COLOR[status] || 'grey'

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 監聽認證狀態變化
    watch(isLoggedIn, (newValue) => {
      console.log('📋 OrdersView - 認證狀態變化:', newValue)
      if (newValue) {
        console.log('📋 OrdersView - 用戶已登入，載入訂單資料')
        loadOrders()
        loadOrderStats()
      }
    }, { immediate: true })

    // 生命周期
    onMounted(() => {
      console.log('📋 OrdersView onMounted - isLoggedIn:', isLoggedIn.value)
      if (isLoggedIn.value) {
        console.log('📋 OrdersView - 開始載入訂單資料')
        loadOrders()
        loadOrderStats()
      } else {
        console.warn('📋 OrdersView - 用戶未登入，跳過載入訂單')
      }
    })

    return {
      // 數據
      loading,
      orders,
      orderStats,
      currentPage,
      pagination,
      filters,
      cancelDialog,
      detailDialog,
      statusOptions,
      dateRangeOptions,
      
      // 方法
      loadOrders,
      applyFilters,
      clearSearch,
      viewOrderDetail,
      showCancelDialog,
      confirmCancel,
      confirmDelivery,
      reorder,
      canCancel,
      canConfirmDelivery,
      canReorder,
      getStatusText,
      getStatusColor,
      formatPrice,
      formatDate,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.filter-card {
  border-radius: 12px;
}

.order-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.order-card:hover {
  transform: translateY(-1px);
}

.product-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.product-item:last-child {
  border-bottom: none;
}

.order-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .order-actions .v-btn {
    flex: 1;
    min-width: auto;
  }
  
  .order-total {
    width: 100%;
    margin-bottom: 12px;
  }
  
  .v-card-actions {
    flex-direction: column;
    align-items: stretch !important;
  }
}
</style>
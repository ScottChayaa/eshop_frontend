<template>
  <v-container class="checkout-container">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6" style="color: #31525B">
          <v-icon start size="large">mdi-credit-card</v-icon>
          結帳
        </h1>
        
        <!-- 進度指示器 -->
        <v-stepper
          v-model="currentStep"
          alt-labels
          flat
          class="mb-6 checkout-stepper"
        >
          <v-stepper-header>
            <v-stepper-item
              :complete="currentStep > 1"
              :value="1"
              title="確認訂單"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :complete="currentStep > 2"
              :value="2"
              title="填寫資料"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :complete="currentStep > 3"
              :value="3"
              title="付款方式"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :value="4"
              title="完成訂單"
            ></v-stepper-item>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>

    <v-row v-if="!hasItems">
      <v-col cols="12" class="text-center">
        <v-card flat class="empty-cart-card">
          <v-card-text class="py-8">
            <v-icon size="120" color="grey-lighten-1" class="mb-4">
              mdi-cart-remove
            </v-icon>
            <h2 class="text-h5 mb-4" style="color: #31525B">購物車是空的</h2>
            <p class="text-body-1 mb-6 text-grey-darken-1">
              請先將商品加入購物車再進行結帳
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              @click="goShopping"
            >
              <v-icon start>mdi-shopping</v-icon>
              開始購物
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <!-- 主要內容區域 -->
      <v-col cols="12" lg="8">
        <v-form ref="checkoutForm" v-model="formValid">
          <!-- 步驟1: 確認訂單 -->
          <v-card v-show="currentStep === 1" class="mb-4" flat>
            <v-card-title>
              <v-icon start>mdi-package-variant</v-icon>
              確認訂單商品
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div
                v-for="item in formattedItems"
                :key="item.key"
                class="order-item d-flex align-center py-3"
              >
                <v-img
                  :src="item.image"
                  height="60"
                  width="60"
                  cover
                  class="rounded mr-4"
                ></v-img>
                <div class="flex-grow-1">
                  <h4 class="text-subtitle-1 font-weight-medium">{{ item.name }}</h4>
                  <p v-if="item.specsDisplay" class="text-caption text-grey-darken-1">
                    {{ item.specsDisplay }}
                  </p>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-body-2">數量: {{ item.quantity }}</span>
                    <span class="text-h6 font-weight-bold" style="color: #FFA101">
                      NT$ {{ formatPrice(item.itemTotal) }}
                    </span>
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                size="large"
                @click="nextStep"
              >
                下一步
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- 步驟2: 填寫資料 -->
          <v-card v-show="currentStep === 2" class="mb-4" flat>
            <v-card-title>
              <v-icon start>mdi-account-circle</v-icon>
              收件人資料
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="orderData.customerName"
                    label="收件人姓名"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="orderData.customerPhone"
                    label="聯絡電話"
                    variant="outlined"
                    :rules="[rules.required, rules.phone]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="orderData.customerEmail"
                    label="電子信箱"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <h3 class="text-h6 mb-4 mt-6" style="color: #31525B">配送資料</h3>
              
              <v-radio-group v-model="orderData.shippingMethod" inline>
                <v-radio
                  label="宅配到府"
                  value="home"
                  color="primary"
                ></v-radio>
                <v-radio
                  label="超商取貨"
                  value="convenience"
                  color="primary"
                ></v-radio>
              </v-radio-group>

              <v-row v-if="orderData.shippingMethod === 'home'">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="orderData.shippingAddress.city"
                    :items="cities"
                    label="縣市"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="orderData.shippingAddress.district"
                    :items="districts"
                    label="區域"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="orderData.shippingAddress.zipCode"
                    label="郵遞區號"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="orderData.shippingAddress.address"
                    label="詳細地址"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row v-else>
                <v-col cols="12">
                  <v-select
                    v-model="orderData.convenienceStore"
                    :items="convenienceStores"
                    label="選擇取貨門市"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>
              </v-row>

              <v-textarea
                v-model="orderData.note"
                label="訂單備註 (選填)"
                variant="outlined"
                rows="3"
                counter="200"
                maxlength="200"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                @click="prevStep"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                上一步
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                size="large"
                :disabled="!formValid"
                @click="nextStep"
              >
                下一步
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- 步驟3: 付款方式 -->
          <v-card v-show="currentStep === 3" class="mb-4" flat>
            <v-card-title>
              <v-icon start>mdi-credit-card</v-icon>
              選擇付款方式
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-radio-group v-model="orderData.paymentMethod">
                <v-radio
                  value="credit_card"
                  color="primary"
                >
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-credit-card</v-icon>
                      信用卡付款
                      <v-chip class="ml-2" color="success" size="small">推薦</v-chip>
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  value="bank_transfer"
                  color="primary"
                >
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-bank</v-icon>
                      銀行轉帳
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  value="cash_on_delivery"
                  color="primary"
                >
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-cash</v-icon>
                      貨到付款
                      <v-chip class="ml-2" color="warning" size="small">+NT$30</v-chip>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>

              <!-- 信用卡付款表單 -->
              <v-expand-transition>
                <div v-if="orderData.paymentMethod === 'credit_card'" class="mt-4">
                  <v-alert type="info" variant="tonal" class="mb-4">
                    <template v-slot:prepend>
                      <v-icon>mdi-shield-check</v-icon>
                    </template>
                    我們使用SSL加密技術保護您的付款資訊
                  </v-alert>
                  
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="orderData.creditCard.number"
                        label="信用卡號"
                        variant="outlined"
                        placeholder="1234 5678 9012 3456"
                        :rules="[rules.required]"
                        maxlength="19"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="orderData.creditCard.expiry"
                        label="有效期限"
                        variant="outlined"
                        placeholder="MM/YY"
                        :rules="[rules.required]"
                        maxlength="5"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="orderData.creditCard.cvv"
                        label="安全碼"
                        variant="outlined"
                        placeholder="123"
                        :rules="[rules.required]"
                        maxlength="4"
                        type="password"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="orderData.creditCard.name"
                        label="持卡人姓名"
                        variant="outlined"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>

              <!-- 銀行轉帳資訊 -->
              <v-expand-transition>
                <div v-if="orderData.paymentMethod === 'bank_transfer'" class="mt-4">
                  <v-alert type="warning" variant="tonal" class="mb-4">
                    <template v-slot:prepend>
                      <v-icon>mdi-information</v-icon>
                    </template>
                    請於訂單成立後3天內完成轉帳，逾期將取消訂單
                  </v-alert>
                  
                  <v-card variant="outlined">
                    <v-card-text>
                      <h4 class="mb-3">轉帳資訊</h4>
                      <div class="bank-info">
                        <p><strong>銀行名稱:</strong> 台灣銀行</p>
                        <p><strong>帳號:</strong> 123-456-789-000</p>
                        <p><strong>戶名:</strong> eshop_frontend股份有限公司</p>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                @click="prevStep"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                上一步
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                size="large"
                @click="nextStep"
              >
                確認訂單
                <v-icon end>mdi-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- 步驟4: 確認提交 -->
          <v-card v-show="currentStep === 4" class="mb-4" flat>
            <v-card-title>
              <v-icon start>mdi-check-circle</v-icon>
              確認提交訂單
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-alert type="success" variant="tonal" class="mb-4">
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                請確認以下資訊無誤後提交訂單
              </v-alert>

              <h4 class="mb-3">收件人資料</h4>
              <div class="order-summary mb-4">
                <p><strong>姓名:</strong> {{ orderData.customerName }}</p>
                <p><strong>電話:</strong> {{ orderData.customerPhone }}</p>
                <p><strong>信箱:</strong> {{ orderData.customerEmail }}</p>
                <p><strong>配送方式:</strong> {{ shippingMethodText }}</p>
                <p v-if="orderData.shippingMethod === 'home'">
                  <strong>配送地址:</strong> 
                  {{ orderData.shippingAddress.city }}{{ orderData.shippingAddress.district }}{{ orderData.shippingAddress.address }}
                </p>
                <p v-else>
                  <strong>取貨門市:</strong> {{ orderData.convenienceStore }}
                </p>
                <p><strong>付款方式:</strong> {{ paymentMethodText }}</p>
                <p v-if="orderData.note">
                  <strong>備註:</strong> {{ orderData.note }}
                </p>
              </div>

              <v-checkbox
                v-model="agreeTerms"
                color="primary"
                :rules="[rules.required]"
                required
              >
                <template v-slot:label>
                  <span>我已閱讀並同意 
                    <a href="#" class="text-primary">服務條款</a> 與 
                    <a href="#" class="text-primary">隱私政策</a>
                  </span>
                </template>
              </v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                @click="prevStep"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                上一步
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                size="large"
                :disabled="!agreeTerms"
                :loading="submitting"
                @click="submitOrder"
              >
                <v-icon start>mdi-send</v-icon>
                提交訂單
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
      
      <!-- 訂單摘要 (右側) -->
      <v-col cols="12" lg="4">
        <v-card class="order-summary-card" flat>
          <v-card-title>
            <v-icon start>mdi-receipt</v-icon>
            訂單摘要
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text>
            <div class="summary-row d-flex justify-space-between mb-3">
              <span>商品小計 ({{ itemCount }} 件)</span>
              <span>NT$ {{ formatPrice(totalPrice) }}</span>
            </div>
            
            <div class="summary-row d-flex justify-space-between mb-3">
              <span>運費</span>
              <span v-if="calculatedShippingFee === 0" class="text-success">
                免運費
              </span>
              <span v-else>NT$ {{ formatPrice(calculatedShippingFee) }}</span>
            </div>

            <div v-if="orderData.paymentMethod === 'cash_on_delivery'" class="summary-row d-flex justify-space-between mb-3">
              <span>貨到付款手續費</span>
              <span>NT$ 30</span>
            </div>
            
            <v-divider class="my-3"></v-divider>
            
            <div class="summary-row d-flex justify-space-between mb-4">
              <span class="text-h6 font-weight-bold">總計</span>
              <span class="text-h6 font-weight-bold" style="color: #FFA101">
                NT$ {{ formatPrice(calculatedFinalTotal) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CheckoutView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const currentStep = ref(1)
    const formValid = ref(false)
    const agreeTerms = ref(false)
    const submitting = ref(false)
    const checkoutForm = ref(null)

    // 購物車相關計算屬性
    const formattedItems = computed(() => store.getters['cart/formattedItems'])
    const itemCount = computed(() => store.getters['cart/itemCount'])
    const totalPrice = computed(() => store.getters['cart/totalPrice'])
    const shippingFee = computed(() => store.getters['cart/shippingFee'])
    const finalTotal = computed(() => store.getters['cart/finalTotal'])
    const hasItems = computed(() => store.getters['cart/hasItems'])

    // 訂單資料
    const orderData = ref({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      shippingMethod: 'home', // 'home' | 'convenience'
      shippingAddress: {
        city: '',
        district: '',
        zipCode: '',
        address: ''
      },
      convenienceStore: '',
      paymentMethod: 'credit_card', // 'credit_card' | 'bank_transfer' | 'cash_on_delivery'
      creditCard: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      note: ''
    })

    // 表單驗證規則
    const rules = {
      required: value => !!value || '此欄位為必填',
      email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || '請輸入有效的電子信箱'
      },
      phone: value => {
        const pattern = /^09\d{8}$/
        return pattern.test(value) || '請輸入有效的手機號碼'
      }
    }

    // 選項資料
    const cities = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
    const districts = ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區']
    const convenienceStores = [
      '7-ELEVEN 信義門市',
      'FamilyMart 忠孝門市', 
      'OK便利商店 仁愛門市',
      '萊爾富 和平門市'
    ]

    // 計算屬性
    const shippingMethodText = computed(() => {
      return orderData.value.shippingMethod === 'home' ? '宅配到府' : '超商取貨'
    })

    const paymentMethodText = computed(() => {
      const methods = {
        credit_card: '信用卡付款',
        bank_transfer: '銀行轉帳',
        cash_on_delivery: '貨到付款'
      }
      return methods[orderData.value.paymentMethod]
    })

    const calculatedShippingFee = computed(() => {
      let fee = shippingFee.value
      return fee
    })

    const calculatedFinalTotal = computed(() => {
      let total = totalPrice.value + calculatedShippingFee.value
      if (orderData.value.paymentMethod === 'cash_on_delivery') {
        total += 30 // 貨到付款手續費
      }
      return total
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('zh-TW').format(price)
    }

    const nextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const submitOrder = async () => {
      submitting.value = true
      
      try {
        // 準備訂單資料
        const order = {
          ...orderData.value,
          items: formattedItems.value,
          totalPrice: totalPrice.value,
          shippingFee: calculatedShippingFee.value,
          finalTotal: calculatedFinalTotal.value,
          orderDate: new Date().toISOString()
        }

        // 這裡應該調用 API 提交訂單
        // await store.dispatch('orders/createOrder', order)
        
        // 模擬 API 調用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 清空購物車
        await store.dispatch('cart/clearCart')
        
        // 顯示成功訊息
        store.dispatch('ui/showSnackbar', {
          message: '訂單提交成功！',
          color: 'success'
        })
        
        // 跳轉到訂單頁面或成功頁面
        router.push('/orders')
        
      } catch (error) {
        store.dispatch('ui/showSnackbar', {
          message: '訂單提交失敗，請稍後再試',
          color: 'error'
        })
      } finally {
        submitting.value = false
      }
    }

    const goShopping = () => {
      router.push('/')
    }

    // 監聽配送方式變化，重置地址資料
    watch(() => orderData.value.shippingMethod, (newMethod) => {
      if (newMethod === 'convenience') {
        orderData.value.shippingAddress = {
          city: '',
          district: '',
          zipCode: '',
          address: ''
        }
      } else {
        orderData.value.convenienceStore = ''
      }
    })

    return {
      currentStep,
      formValid,
      agreeTerms,
      submitting,
      checkoutForm,
      orderData,
      rules,
      cities,
      districts,
      convenienceStores,
      formattedItems,
      itemCount,
      totalPrice,
      calculatedShippingFee,
      calculatedFinalTotal,
      hasItems,
      shippingMethodText,
      paymentMethodText,
      formatPrice,
      nextStep,
      prevStep,
      submitOrder,
      goShopping
    }
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.checkout-stepper {
  background: rgba(250, 230, 177, 0.1);
  border: 1px solid #FAE6B1;
  border-radius: 12px;
}

.empty-cart-card {
  background: rgba(250, 230, 177, 0.1);
  border: 1px solid #FAE6B1;
  border-radius: 16px;
}

.order-item {
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-summary {
  background: rgba(250, 230, 177, 0.05);
  border-radius: 8px;
  padding: 16px;
}

.order-summary-card {
  background: rgba(250, 230, 177, 0.1);
  border: 1px solid #FAE6B1;
  position: sticky;
  top: 24px;
}

.summary-row {
  font-size: 1rem;
}

.bank-info p {
  margin-bottom: 8px;
}

/* 響應式調整 */
@media (max-width: 960px) {
  .checkout-container {
    padding: 16px 8px;
  }
  
  .order-summary-card {
    position: static;
    margin-top: 24px;
  }
}

@media (max-width: 600px) {
  .checkout-stepper :deep(.v-stepper-header) {
    flex-direction: column;
    gap: 8px;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .order-item .v-img {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
}
</style>

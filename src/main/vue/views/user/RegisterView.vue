<template>
  <v-container class="register-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card class="register-card" elevation="8">
          <v-card-title class="text-center pa-6">
            <div class="register-header">
              <v-icon size="48" color="secondary" class="mb-2">
                mdi-account-plus
              </v-icon>
              <h1 class="text-h5 custom-dark">會員註冊</h1>
              <p class="text-body-2 text--secondary mb-0">
                建立新帳號，享受購物樂趣
              </p>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form
              ref="formRef"
              @submit.prevent="handleSubmit"
              class="register-form"
            >
              <FormInput
                v-model="formData.name"
                label="姓名"
                :rules="[rules.required('姓名'), rules.minLength(2, '姓名')]"
                :error-messages="getFieldError('name')"
                :validation-state="getFieldValidationState('name')"
                prepend-inner-icon="mdi-account"
                autocomplete="name"
                @blur="handleFieldBlur('name')"
                class="mb-4"
              />

              <FormInput
                v-model="formData.email"
                label="電子郵件"
                type="email"
                :rules="[rules.required('電子郵件'), rules.email()]"
                :error-messages="getFieldError('email')"
                :validation-state="getFieldValidationState('email')"
                prepend-inner-icon="mdi-email"
                autocomplete="email"
                @blur="handleFieldBlur('email')"
                class="mb-4"
              />

              <FormInput
                v-model="formData.phone"
                label="手機號碼"
                type="tel"
                :rules="[rules.required('手機號碼'), rules.phone()]"
                :error-messages="getFieldError('phone')"
                :validation-state="getFieldValidationState('phone')"
                prepend-inner-icon="mdi-phone"
                autocomplete="tel"
                placeholder="例如：0912345678"
                @blur="handleFieldBlur('phone')"
                class="mb-4"
              />

              <FormInput
                v-model="formData.password"
                label="密碼"
                type="password"
                :rules="[rules.required('密碼'), rules.password()]"
                :error-messages="getFieldError('password')"
                :validation-state="getFieldValidationState('password')"
                prepend-inner-icon="mdi-lock"
                autocomplete="new-password"
                password-toggle
                hint="密碼需包含大小寫字母和數字，至少8個字元"
                persistent-hint
                @blur="handleFieldBlur('password')"
                class="mb-4"
              />

              <FormInput
                v-model="formData.confirmPassword"
                label="確認密碼"
                type="password"
                :rules="[rules.required('確認密碼'), rules.custom(validatePasswordConfirm)]"
                :error-messages="getFieldError('confirmPassword')"
                :validation-state="getFieldValidationState('confirmPassword')"
                prepend-inner-icon="mdi-lock-check"
                autocomplete="new-password"
                password-toggle
                @blur="handleFieldBlur('confirmPassword')"
                class="mb-4"
              />

              <div class="form-agreements mb-6">
                <v-checkbox
                  v-model="formData.agreeTerms"
                  :rules="[rules.custom(validateAgreeTerms)]"
                  :error-messages="getFieldError('agreeTerms')"
                  color="secondary"
                  hide-details="auto"
                  class="mb-2"
                >
                  <template v-slot:label>
                    <span class="text-body-2">
                      我同意
                      <a href="#" @click.prevent="showTerms" class="text-secondary">
                        服務條款
                      </a>
                      和
                      <a href="#" @click.prevent="showPrivacy" class="text-secondary">
                        隱私權政策
                      </a>
                    </span>
                  </template>
                </v-checkbox>

                <v-checkbox
                  v-model="formData.subscribeNewsletter"
                  label="訂閱電子報，接收最新優惠資訊"
                  color="secondary"
                  hide-details
                  class="text-body-2"
                />
              </div>

              <v-alert
                v-if="hasFormError"
                type="error"
                variant="tonal"
                class="mb-4"
                :text="getFormError"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isSubmitting"
                :disabled="!isFormValid"
                class="mb-4 register-btn"
              >
                註冊帳號
              </v-btn>

              <v-divider class="my-4">
                <span class="text-caption px-2">或</span>
              </v-divider>

              <v-btn
                variant="outlined"
                color="secondary"
                size="large"
                block
                prepend-icon="mdi-google"
                @click="handleGoogleRegister"
                :disabled="isSubmitting"
                class="mb-4"
              >
                Google 註冊
              </v-btn>

              <div class="text-center">
                <span class="text-body-2">已經有帳號了？</span>
                <router-link
                  to="/login"
                  class="text-decoration-none text-secondary ml-1 font-weight-medium"
                >
                  立即登入
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 服務條款對話框 -->
    <v-dialog v-model="showTermsDialog" max-width="600">
      <v-card>
        <v-card-title>服務條款</v-card-title>
        <v-card-text>
          <p>這裡是服務條款的內容...</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showTermsDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 隱私權政策對話框 -->
    <v-dialog v-model="showPrivacyDialog" max-width="600">
      <v-card>
        <v-card-title>隱私權政策</v-card-title>
        <v-card-text>
          <p>這裡是隱私權政策的內容...</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showPrivacyDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useForm, createValidationRules } from '../../composables/useForm.js'
import FormInput from '../../components/common/FormInput.vue'
import { validatePasswordConfirm } from '../../utils/validators.js'

export default {
  name: 'RegisterView',
  components: {
    FormInput
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const rules = createValidationRules()
    
    const showTermsDialog = ref(false)
    const showPrivacyDialog = ref(false)

    const initialData = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      subscribeNewsletter: false
    }

    const validationRules = {
      name: [rules.required('姓名'), rules.minLength(2, '姓名')],
      email: [rules.required('電子郵件'), rules.email()],
      phone: [rules.required('手機號碼'), rules.phone()],
      password: [rules.required('密碼'), rules.password()],
      confirmPassword: [rules.required('確認密碼')],
      agreeTerms: []
    }

    const {
      formData,
      errors,
      isSubmitting,
      isValid: isFormValid,
      getFieldError,
      hasFieldError,
      validateField,
      handleSubmit: submitForm
    } = useForm(initialData, validationRules)

    const hasFormError = computed(() => {
      return !!errors.value.submit
    })

    const getFormError = computed(() => {
      return errors.value.submit || ''
    })

    const getFieldValidationState = (fieldName) => {
      if (!formData[fieldName]) return 'pristine'
      if (hasFieldError(fieldName)) return 'invalid'
      if (formData[fieldName] && !hasFieldError(fieldName)) return 'valid'
      return 'pristine'
    }

    const validatePasswordConfirmField = (value) => {
      return validatePasswordConfirm(formData.password, value)
    }

    const validateAgreeTerms = (value) => {
      if (!value) {
        return '請同意服務條款和隱私權政策'
      }
      return true
    }

    const handleFieldBlur = (fieldName) => {
      validateField(fieldName)
      
      // 當密碼變更時，重新驗證確認密碼
      if (fieldName === 'password' && formData.confirmPassword) {
        validateField('confirmPassword')
      }
    }

    const handleSubmit = async () => {
      const result = await submitForm(async (data) => {
        try {
          const registerResult = await store.dispatch('auth/register', {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            subscribeNewsletter: data.subscribeNewsletter
          })

          store.dispatch('ui/showSuccess', '註冊成功！歡迎加入我們')
          router.push('/')
          
          return registerResult
        } catch (error) {
          throw error
        }
      })

      if (!result.success) {
        console.error('Registration failed:', result.error)
      }
    }

    const handleGoogleRegister = async () => {
      try {
        store.dispatch('ui/showInfo', 'Google 註冊功能開發中...')
      } catch (error) {
        store.dispatch('ui/showError', 'Google 註冊失敗')
      }
    }

    const showTerms = () => {
      showTermsDialog.value = true
    }

    const showPrivacy = () => {
      showPrivacyDialog.value = true
    }

    return {
      formData,
      rules,
      isSubmitting,
      isFormValid,
      hasFormError,
      getFormError,
      getFieldError,
      getFieldValidationState,
      validatePasswordConfirm: validatePasswordConfirmField,
      validateAgreeTerms,
      handleFieldBlur,
      handleSubmit,
      handleGoogleRegister,
      showTermsDialog,
      showPrivacyDialog,
      showTerms,
      showPrivacy
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  padding: 2rem 1rem;
}

.register-card {
  border-radius: 16px;
  overflow: hidden;
}

.register-header {
  text-align: center;
}

.custom-dark {
  color: #31525B !important;
}

.register-form {
  width: 100%;
}

.register-btn {
  font-weight: 600;
  text-transform: none;
}

.form-agreements {
  padding: 0;
}

.form-agreements :deep(.v-input__control) {
  margin-bottom: 8px;
}

.form-agreements :deep(.v-selection-control__wrapper) {
  margin-right: 8px;
}

@media (max-width: 600px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    margin: 0;
  }
  
  .v-card-title,
  .v-card-text {
    padding: 1.5rem !important;
  }
}
</style>

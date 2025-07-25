<template>
  <v-container class="login-container" style="background: #FAE6B1">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card" elevation="12">
          <v-card-title class="text-center pa-8" style="background: linear-gradient(135deg, #FAE6B1 0%, #FFA101 100%)">
            <div class="login-header">
              <v-icon size="64" color="white" class="mb-3">
                mdi-storefront
              </v-icon>
              <h1 class="text-h4 font-weight-bold mb-2" style="color: white">會員登入</h1>
              <p class="text-body-1 mb-0" style="color: rgba(255,255,255,0.9)">
                歡迎回來！請輸入您的帳號密碼
              </p>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form
              ref="formRef"
              @submit.prevent="handleSubmit"
              class="login-form"
            >
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
                v-model="formData.password"
                label="密碼"
                type="password"
                :rules="[rules.required('密碼')]"
                :error-messages="getFieldError('password')"
                :validation-state="getFieldValidationState('password')"
                prepend-inner-icon="mdi-lock"
                autocomplete="current-password"
                password-toggle
                @blur="handleFieldBlur('password')"
                @enter="handleSubmit"
                class="mb-4"
              />

              <div class="form-options d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="formData.rememberMe"
                  label="記住我"
                  density="compact"
                  hide-details
                  color="secondary"
                />
                
                <router-link
                  to="/forgot-password"
                  class="text-decoration-none text-secondary"
                >
                  忘記密碼？
                </router-link>
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
                size="large"
                block
                :loading="isSubmitting"
                :disabled="!isFormValid"
                class="mb-4 login-btn"
                style="background: #FFA101; color: white; font-weight: bold; text-transform: none; border-radius: 8px"
              >
                <v-icon left>mdi-login</v-icon>
                立即登入
              </v-btn>

              <v-divider class="my-6">
                <span class="text-body-2 px-3" style="background: white; color: #666">或</span>
              </v-divider>

              <v-btn
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-google"
                @click="handleGoogleLogin"
                :disabled="isSubmitting"
                class="mb-4 google-btn"
                style="border: 2px solid #DB4437; color: #DB4437; font-weight: 600; text-transform: none; border-radius: 8px"
              >
                Google 快速登入
              </v-btn>

              <div class="text-center">
                <span class="text-body-2">還沒有帳號？</span>
                <router-link
                  to="/register"
                  class="text-decoration-none text-secondary ml-1 font-weight-medium"
                >
                  立即註冊
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useForm, createValidationRules } from '../../composables/useForm.js'
import FormInput from '../../components/common/FormInput.vue'

export default {
  name: 'LoginView',
  components: {
    FormInput
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const rules = createValidationRules()

    const initialData = {
      email: '',
      password: '',
      rememberMe: false
    }

    const validationRules = {
      email: [rules.required('電子郵件'), rules.email()],
      password: [rules.required('密碼')]
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

    const handleFieldBlur = (fieldName) => {
      validateField(fieldName)
    }

    const handleSubmit = async () => {
      const result = await submitForm(async (data) => {
        try {
          const loginResult = await store.dispatch('auth/login', {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe
          })

          store.dispatch('ui/showSuccess', '登入成功！歡迎回來')
          
          const redirect = router.currentRoute.value.query.redirect || '/'
          router.push(redirect)
          
          return loginResult
        } catch (error) {
          throw error
        }
      })

      if (!result.success) {
        console.error('Login failed:', result.error)
      }
    }

    const handleGoogleLogin = async () => {
      try {
        store.dispatch('ui/showInfo', 'Google 登入功能開發中...')
      } catch (error) {
        store.dispatch('ui/showError', 'Google 登入失敗')
      }
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
      handleFieldBlur,
      handleSubmit,
      handleGoogleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #FAE6B1 0%, #B3DEE5 100%) !important;
}

.login-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
}

.custom-dark {
  color: #31525B !important;
}

.login-form {
  width: 100%;
}

.login-btn {
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  border-radius: 12px;
  height: 48px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(255, 161, 1, 0.4);
  background: linear-gradient(135deg, #FFA101 0%, #FF8F00 100%) !important;
}

.google-btn {
  transition: all 0.3s ease;
  border-radius: 12px;
  height: 48px;
  border-color: #DB4437 !important;
}

.google-btn:hover {
  transform: translateY(-2px);
  background-color: rgba(219, 68, 55, 0.08) !important;
  box-shadow: 0 12px 24px rgba(219, 68, 55, 0.25);
  border-color: #C23321 !important;
}

.form-options {
  margin: 0 -4px;
}

.form-options .v-checkbox {
  margin-left: -4px;
}

.form-options a {
  font-size: 0.9rem;
  font-weight: 500;
  color: #31525B;
  transition: color 0.3s ease;
}

.form-options a:hover {
  color: #FFA101;
}

/* Enhanced input styling */
:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(255, 161, 1, 0.2);
}

/* Divider styling */
.v-divider {
  opacity: 0.3;
}

/* Register link styling */
.text-center a {
  color: #31525B;
  font-weight: 600;
  transition: color 0.3s ease;
}

.text-center a:hover {
  color: #FFA101;
}

/* Loading and disabled states */
.login-btn:disabled {
  opacity: 0.6;
  transform: none !important;
}

.v-btn--loading {
  pointer-events: none;
}

@media (max-width: 600px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    margin: 0;
    border-radius: 16px;
  }
  
  .v-card-title,
  .v-card-text {
    padding: 1.5rem !important;
  }
  
  .login-btn,
  .google-btn {
    height: 44px;
    font-size: 0.95rem;
  }
}

/* Animation for form alerts */
.v-alert {
  border-radius: 12px;
  border: none;
}
</style>

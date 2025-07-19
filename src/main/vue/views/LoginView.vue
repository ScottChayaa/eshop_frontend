<template>
  <v-container class="login-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card" elevation="8">
          <v-card-title class="text-center pa-6">
            <div class="login-header">
              <v-icon size="48" color="secondary" class="mb-2">
                mdi-shopping
              </v-icon>
              <h1 class="text-h5 custom-dark">會員登入</h1>
              <p class="text-body-2 text--secondary mb-0">
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
                  to="/user/forgot-password"
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
                color="primary"
                size="large"
                block
                :loading="isSubmitting"
                :disabled="!isFormValid"
                class="mb-4 login-btn"
              >
                登入
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
                @click="handleGoogleLogin"
                :disabled="isSubmitting"
                class="mb-4"
              >
                Google 登入
              </v-btn>

              <div class="text-center">
                <span class="text-body-2">還沒有帳號？</span>
                <router-link
                  to="/user/register"
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
import { useForm, createValidationRules } from '../composables/useForm.js'
import FormInput from '../components/common/FormInput.vue'

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
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  padding: 2rem 1rem;
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
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
}

.form-options {
  margin: 0 -4px;
}

.form-options .v-checkbox {
  margin-left: -4px;
}

@media (max-width: 600px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    margin: 0;
  }
  
  .v-card-title,
  .v-card-text {
    padding: 1.5rem !important;
  }
}
</style>

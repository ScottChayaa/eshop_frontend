<template>
  <v-container class="forgot-password-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="forgot-password-card" elevation="8">
          <v-card-title class="text-center pa-6">
            <div class="forgot-password-header">
              <v-icon size="48" color="secondary" class="mb-2">
                mdi-lock-reset
              </v-icon>
              <h1 class="text-h5 custom-dark">忘記密碼</h1>
              <p class="text-body-2 text--secondary mb-0">
                輸入您的電子郵件，我們將發送重設連結
              </p>
            </div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="電子郵件"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                required
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                class="mb-4"
              >
                發送重設連結
              </v-btn>

              <div class="text-center">
                <router-link
                  to="/login"
                  class="text-decoration-none text-secondary font-weight-medium"
                >
                  返回登入
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ForgotPasswordView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const isLoading = ref(false)

    const handleSubmit = async () => {
      isLoading.value = true
      
      // 模擬 API 請求
      setTimeout(() => {
        alert('重設密碼連結已發送到您的郵箱')
        isLoading.value = false
        router.push('/login')
      }, 2000)
    }

    return {
      email,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  padding: 2rem 1rem;
}

.forgot-password-card {
  border-radius: 16px;
  overflow: hidden;
}

.custom-dark {
  color: #31525B !important;
}
</style>
<template>
  <v-container class="profile-container">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-icon size="32" color="secondary" class="mr-3">
            mdi-account-circle
          </v-icon>
          <div>
            <h1 class="text-h4 custom-dark mb-1">個人資料</h1>
            <p class="text-body-2 text--secondary mb-0">
              管理您的個人資訊和帳戶設定
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="profile-avatar-card" elevation="2">
          <v-card-text class="text-center pa-6">
            <div class="avatar-section">
              <v-avatar
                size="120"
                class="mb-4 avatar-upload"
                @click="triggerFileUpload"
              >
                <v-img
                  v-if="userProfile.avatar"
                  :src="userProfile.avatar"
                  :alt="userProfile.name"
                />
                <v-icon v-else size="60" color="grey-lighten-1">
                  mdi-account-circle
                </v-icon>
                <div class="avatar-overlay">
                  <v-icon color="white">mdi-camera</v-icon>
                </div>
              </v-avatar>
              
              <h3 class="text-h6 custom-dark mb-2">
                {{ userProfile.name || '使用者' }}
              </h3>
              <p class="text-body-2 text--secondary mb-4">
                {{ userProfile.email }}
              </p>
              
              <v-btn
                variant="outlined"
                color="secondary"
                size="small"
                prepend-icon="mdi-camera"
                @click="triggerFileUpload"
                :loading="uploadingAvatar"
              >
                更換頭像
              </v-btn>
              
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarUpload"
              >
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-4" elevation="2">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-shield-check</v-icon>
            帳戶安全
          </v-card-title>
          <v-card-text>
            <div class="security-item d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-body-2 font-weight-medium">密碼</div>
                <div class="text-caption text--secondary">上次更新：2024年1月</div>
              </div>
              <v-btn
                variant="text"
                size="small"
                color="secondary"
                @click="showChangePasswordDialog = true"
              >
                修改
              </v-btn>
            </div>
            
            <div class="security-item d-flex align-center justify-space-between">
              <div>
                <div class="text-body-2 font-weight-medium">兩步驟驗證</div>
                <div class="text-caption text--secondary">增強帳戶安全性</div>
              </div>
              <v-switch
                v-model="twoFactorEnabled"
                color="secondary"
                density="compact"
                hide-details
                @change="handleTwoFactorToggle"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="profile-form-card" :class="{ 'editing-mode': editMode }" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>基本資料</span>
            <div v-if="editMode" class="edit-indicator d-flex align-center">
              <v-icon color="warning" size="small" class="mr-1">mdi-pencil</v-icon>
              <span class="text-body-2 text-warning font-weight-medium">編輯中</span>
            </div>
          </v-card-title>

          <v-card-text class="pa-6" :class="{ 'editing-content': editMode }">
            <v-form
              ref="formRef"
              @submit.prevent="handleSubmit"
              class="profile-form"
            >
              <v-row>
                <v-col cols="12" sm="6">
                  <FormInput
                    v-model="formData.name"
                    label="姓名"
                    :rules="[rules.required('姓名'), rules.minLength(2, '姓名')]"
                    :error-messages="getFieldError('name')"
                    :validation-state="getFieldValidationState('name')"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-account"
                    @blur="handleFieldBlur('name')"
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <FormInput
                    v-model="formData.email"
                    label="電子郵件"
                    type="email"
                    :rules="[rules.required('電子郵件'), rules.email()]"
                    :error-messages="getFieldError('email')"
                    :validation-state="getFieldValidationState('email')"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-email"
                    @blur="handleFieldBlur('email')"
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <FormInput
                    v-model="formData.phone"
                    label="手機號碼"
                    type="tel"
                    :rules="[rules.phone()]"
                    :error-messages="getFieldError('phone')"
                    :validation-state="getFieldValidationState('phone')"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-phone"
                    placeholder="例如：0912345678"
                    @blur="handleFieldBlur('phone')"
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <FormInput
                    v-model="formData.birthday"
                    label="生日"
                    type="date"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-calendar"
                  />
                </v-col>
                
                <v-col cols="12" sm="6">
                  <FormSelect
                    v-model="formData.gender"
                    label="性別"
                    :items="genderOptions"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-human-male-female"
                  />
                </v-col>
                
                <v-col cols="12">
                  <FormInput
                    v-model="formData.address"
                    label="住址"
                    :readonly="!editMode"
                    prepend-inner-icon="mdi-map-marker"
                    placeholder="請輸入完整地址"
                  />
                </v-col>
                
                <v-col cols="12">
                  <FormTextarea
                    v-model="formData.bio"
                    label="個人簡介"
                    :readonly="!editMode"
                    maxlength="200"
                    counter
                    show-character-count
                    prepend-inner-icon="mdi-text"
                    hint="分享一些關於您的資訊"
                    persistent-hint
                  />
                </v-col>
              </v-row>

              <v-alert
                v-if="hasFormError"
                type="error"
                variant="tonal"
                class="mt-4"
                :text="getFormError"
              />

              <div class="form-actions mt-6">
                <v-btn
                  v-if="!editMode"
                  variant="outlined"
                  color="secondary"
                  prepend-icon="mdi-pencil"
                  @click="enterEditMode"
                  class="mr-3"
                >
                  編輯
                </v-btn>
                
                <template v-if="editMode">
                  <v-btn
                    type="submit"
                    color="primary"
                    :loading="isSubmitting"
                    :disabled="!isFormValid"
                    class="mr-3"
                  >
                    儲存變更
                  </v-btn>
                  
                  <v-btn
                    variant="outlined"
                    @click="cancelEdit"
                    :disabled="isSubmitting"
                  >
                    取消
                  </v-btn>
                </template>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 修改密碼對話框 -->
    <v-dialog v-model="showChangePasswordDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">修改密碼</v-card-title>
        <v-card-text>
          <v-form ref="passwordFormRef" @submit.prevent="handlePasswordChange">
            <FormInput
              v-model="passwordForm.currentPassword"
              label="目前密碼"
              type="password"
              :rules="[rules.required('目前密碼')]"
              password-toggle
              class="mb-4"
            />
            
            <FormInput
              v-model="passwordForm.newPassword"
              label="新密碼"
              type="password"
              :rules="[rules.required('新密碼'), rules.password()]"
              password-toggle
              hint="密碼需包含大小寫字母和數字，至少8個字元"
              persistent-hint
              class="mb-4"
            />
            
            <FormInput
              v-model="passwordForm.confirmPassword"
              label="確認新密碼"
              type="password"
              :rules="[rules.required('確認密碼'), rules.custom(validatePasswordConfirm)]"
              password-toggle
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showChangePasswordDialog = false">取消</v-btn>
          <v-btn
            color="primary"
            @click="handlePasswordChange"
            :loading="changingPassword"
          >
            確認修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useForm, createValidationRules } from '../../composables/useForm.js'
import FormInput from '../../components/common/FormInput.vue'
import FormSelect from '../../components/common/FormSelect.vue'
import FormTextarea from '../../components/common/FormTextarea.vue'
import { validatePasswordConfirm } from '../../utils/validators.js'

export default {
  name: 'ProfileView',
  components: {
    FormInput,
    FormSelect,
    FormTextarea
  },
  setup() {
    const store = useStore()
    const rules = createValidationRules()
    
    const editMode = ref(false)
    const uploadingAvatar = ref(false)
    const changingPassword = ref(false)
    const twoFactorEnabled = ref(false)
    const showChangePasswordDialog = ref(false)
    const fileInput = ref(null)

    const userProfile = computed(() => 
      store.getters['auth/user'] || {}
    )

    const initialData = computed(() => ({
      name: userProfile.value.name || '',
      email: userProfile.value.email || '',
      phone: userProfile.value.phone || '',
      birthday: userProfile.value.birthday || '',
      gender: userProfile.value.gender || '',
      address: userProfile.value.address || '',
      bio: userProfile.value.bio || ''
    }))

    const validationRules = {
      name: [rules.required('姓名'), rules.minLength(2, '姓名')],
      email: [rules.required('電子郵件'), rules.email()],
      phone: [rules.phone()]
    }

    const {
      formData,
      errors,
      isSubmitting,
      isValid: isFormValid,
      getFieldError,
      hasFieldError,
      validateField,
      setFormData,
      resetForm,
      handleSubmit: submitForm
    } = useForm(initialData.value, validationRules)

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const genderOptions = [
      { title: '男性', value: 'male' },
      { title: '女性', value: 'female' },
      { title: '其他', value: 'other' },
      { title: '不願透露', value: 'prefer_not_to_say' }
    ]


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
      return validatePasswordConfirm(passwordForm.value.newPassword, value)
    }

    const handleFieldBlur = (fieldName) => {
      if (editMode.value) {
        validateField(fieldName)
      }
    }

    const enterEditMode = () => {
      editMode.value = true
      setFormData(initialData.value)
    }

    const cancelEdit = () => {
      editMode.value = false
      setFormData(initialData.value)
    }

    const handleSubmit = async () => {
      const result = await submitForm(async (data) => {
        try {
          const { default: userService } = await import('../../services/user.js')
          const updateResult = await userService.updateProfile(data)
          
          store.dispatch('auth/SET_USER', updateResult)
          store.dispatch('ui/showSuccess', '個人資料更新成功')
          
          editMode.value = false
          return updateResult
        } catch (error) {
          throw error
        }
      })

      if (!result.success) {
        console.error('Profile update failed:', result.error)
      }
    }

    const triggerFileUpload = () => {
      fileInput.value?.click()
    }

    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      try {
        uploadingAvatar.value = true
        const { default: userService } = await import('../../services/user.js')
        const result = await userService.uploadAvatar(file)
        
        store.dispatch('auth/SET_USER', { 
          ...userProfile.value, 
          avatar: result.avatarUrl 
        })
        store.dispatch('ui/showSuccess', '頭像更新成功')
      } catch (error) {
        store.dispatch('ui/showError', error.message || '頭像上傳失敗')
      } finally {
        uploadingAvatar.value = false
        event.target.value = ''
      }
    }

    const handlePasswordChange = async () => {
      try {
        changingPassword.value = true
        const { default: userService } = await import('../../services/user.js')
        
        await userService.changePassword({
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword,
          confirmPassword: passwordForm.value.confirmPassword
        })
        
        store.dispatch('ui/showSuccess', '密碼修改成功')
        showChangePasswordDialog.value = false
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        store.dispatch('ui/showError', error.message || '密碼修改失敗')
      } finally {
        changingPassword.value = false
      }
    }

    const handleTwoFactorToggle = async (enabled) => {
      try {
        if (enabled) {
          store.dispatch('ui/showInfo', '兩步驟驗證功能開發中...')
        } else {
          store.dispatch('ui/showInfo', '已關閉兩步驟驗證')
        }
      } catch (error) {
        store.dispatch('ui/showError', '設定更新失敗')
        twoFactorEnabled.value = !enabled
      }
    }

    watch(userProfile, (newProfile) => {
      if (newProfile && !editMode.value) {
        setFormData({
          name: newProfile.name || '',
          email: newProfile.email || '',
          phone: newProfile.phone || '',
          birthday: newProfile.birthday || '',
          gender: newProfile.gender || '',
          address: newProfile.address || '',
          bio: newProfile.bio || ''
        })
      }
    }, { deep: true })

    onMounted(async () => {
      // Load complete user profile data when entering the page
      if (userProfile.value.id) {
        try {
          const { default: userService } = await import('../../services/user.js')
          const completeProfile = await userService.getProfile()
          
          // Update Vuex store with complete profile data
          store.dispatch('auth/SET_USER', completeProfile)
          
          // Set form data with complete profile
          setFormData({
            name: completeProfile.name || '',
            email: completeProfile.email || '',
            phone: completeProfile.phone || '',
            birthday: completeProfile.birthday || '',
            gender: completeProfile.gender || '',
            address: completeProfile.address || '',
            bio: completeProfile.bio || ''
          })
        } catch (error) {
          console.error('Failed to load complete profile:', error)
          // Fallback to existing profile data
          setFormData(initialData.value)
        }
      }
    })

    return {
      editMode,
      uploadingAvatar,
      changingPassword,
      twoFactorEnabled,
      showChangePasswordDialog,
      fileInput,
      userProfile,
      formData,
      passwordForm,
      genderOptions,
      rules,
      isSubmitting,
      isFormValid,
      hasFormError,
      getFormError,
      getFieldError,
      getFieldValidationState,
      validatePasswordConfirm: validatePasswordConfirmField,
      handleFieldBlur,
      enterEditMode,
      cancelEdit,
      handleSubmit,
      triggerFileUpload,
      handleAvatarUpload,
      handlePasswordChange,
      handleTwoFactorToggle
    }
  }
}
</script>

<style scoped>
.custom-dark {
  color: #31525B !important;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-avatar-card,
.profile-form-card {
  border-radius: 12px;
}

.avatar-section {
  position: relative;
}

.avatar-upload {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-upload:hover .avatar-overlay {
  opacity: 1;
}

.security-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.security-item:last-child {
  border-bottom: none;
}

.form-actions {
  display: flex;
  gap: 12px;
}

/* 編輯模式樣式 */
.editing-mode {
  border: 2px solid #FFA101 !important;
  box-shadow: 0 0 20px rgba(255, 161, 1, 0.2) !important;
  transition: all 0.3s ease;
}

.editing-content {
  background: linear-gradient(135deg, rgba(255, 161, 1, 0.05), rgba(250, 230, 177, 0.05));
  position: relative;
}

.editing-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #FFA101, #FAE6B1);
  border-radius: 0 2px 2px 0;
}

.edit-indicator {
  background: rgba(255, 161, 1, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 161, 1, 0.3);
  animation: pulse-edit 2s infinite;
}

@keyframes pulse-edit {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 161, 1, 0.3);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 161, 1, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 161, 1, 0);
  }
}

/* 表單欄位編輯狀態樣式 */
.editing-mode :deep(.v-input:not(.v-input--readonly)) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.editing-mode :deep(.v-input:not(.v-input--readonly):hover) {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.editing-mode :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(255, 161, 1, 0.3);
}

/* 唯讀狀態樣式 */
.profile-form-card:not(.editing-mode) :deep(.v-input--readonly .v-field) {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .v-btn {
    width: 100%;
  }
  
  .edit-indicator {
    padding: 2px 8px;
    font-size: 0.75rem;
  }
}
</style>

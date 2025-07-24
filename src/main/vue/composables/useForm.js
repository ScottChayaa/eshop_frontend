/**
 * 表單管理 Composable
 * @description 提供統一的表單狀態管理和驗證邏輯
 */

import { ref, reactive, computed, watch } from 'vue'
import { validateForm } from '../utils/validators.js'

export function useForm(initialData = {}, validationRules = {}) {
  // 表單數據
  const formData = reactive({ ...initialData })
  
  // 表單狀態
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)
  const isValidating = ref(false)
  
  // 計算屬性
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })
  
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })
  
  const touchedFields = computed(() => {
    return Object.keys(touched.value).filter(key => touched.value[key])
  })

  // 驗證單個欄位
  const validateField = (fieldName) => {
    const fieldRules = validationRules[fieldName]
    if (!fieldRules || !Array.isArray(fieldRules)) {
      return true
    }

    const value = formData[fieldName]
    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        errors.value[fieldName] = result
        return false
      }
    }

    // 驗證通過，清除錯誤
    delete errors.value[fieldName]
    return true
  }

  // 驗證所有欄位
  const validateAll = () => {
    isValidating.value = true
    const result = validateForm(formData, validationRules)
    errors.value = result.errors
    isValidating.value = false
    return result.isValid
  }

  // 標記欄位為已觸碰
  const touchField = (fieldName) => {
    touched.value[fieldName] = true
  }

  // 清除欄位錯誤
  const clearFieldError = (fieldName) => {
    delete errors.value[fieldName]
  }

  // 清除所有錯誤
  const clearErrors = () => {
    errors.value = {}
  }

  // 重置表單
  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = initialData[key] || ''
    })
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }

  // 設置表單數據
  const setFormData = (data) => {
    Object.assign(formData, data)
  }

  // 設置欄位值
  const setFieldValue = (fieldName, value) => {
    formData[fieldName] = value
  }

  // 設置表單錯誤
  const setErrors = (errorObj) => {
    errors.value = { ...errors.value, ...errorObj }
  }

  // 設置提交狀態
  const setSubmitting = (status) => {
    isSubmitting.value = status
  }

  // 獲取欄位錯誤訊息
  const getFieldError = (fieldName) => {
    return errors.value[fieldName] || null
  }

  // 檢查欄位是否有錯誤
  const hasFieldError = (fieldName) => {
    return !!errors.value[fieldName]
  }

  // 檢查欄位是否已觸碰
  const isFieldTouched = (fieldName) => {
    return !!touched.value[fieldName]
  }

  // 處理欄位變更
  const handleFieldChange = (fieldName, value) => {
    setFieldValue(fieldName, value)
    touchField(fieldName)
    
    // 即時驗證（如果欄位已經被觸碰或有錯誤）
    if (isFieldTouched(fieldName) || hasFieldError(fieldName)) {
      validateField(fieldName)
    }
  }

  // 處理欄位失去焦點
  const handleFieldBlur = (fieldName) => {
    touchField(fieldName)
    validateField(fieldName)
  }

  // 表單提交處理
  const handleSubmit = async (submitFn) => {
    if (isSubmitting.value) return

    // 標記所有欄位為已觸碰
    Object.keys(validationRules).forEach(field => {
      touchField(field)
    })

    // 驗證表單
    const isFormValid = validateAll()
    if (!isFormValid) {
      return { success: false, errors: errors.value }
    }

    try {
      setSubmitting(true)
      const result = await submitFn(formData)
      return { success: true, data: result }
    } catch (error) {
      // 處理伺服器錯誤
      if (error.details && error.details.fieldErrors) {
        setErrors(error.details.fieldErrors)
      } else {
        setErrors({ submit: error.message || '提交失敗，請稍後再試' })
      }
      return { success: false, error }
    } finally {
      setSubmitting(false)
    }
  }

  // 監聽表單數據變更
  watch(
    () => formData,
    () => {
      // 如果有全域錯誤，清除它
      if (errors.value.submit) {
        delete errors.value.submit
      }
    },
    { deep: true }
  )

  return {
    // 狀態
    formData,
    errors: computed(() => errors.value),
    touched: computed(() => touched.value),
    isSubmitting: computed(() => isSubmitting.value),
    isValidating: computed(() => isValidating.value),
    isValid,
    hasErrors,
    touchedFields,

    // 方法
    validateField,
    validateAll,
    touchField,
    clearFieldError,
    clearErrors,
    resetForm,
    setFormData,
    setFieldValue,
    setErrors,
    setSubmitting,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit
  }
}

// 表單驗證狀態枚舉
export const ValidationState = {
  PRISTINE: 'pristine',
  VALIDATING: 'validating',
  VALID: 'valid',
  INVALID: 'invalid'
}

// 常用驗證規則快速創建函數
export function createValidationRules() {
  return {
    required: (fieldName = '此欄位') => (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName}不能為空`
      }
      return true
    },
    email: () => (value) => {
      if (!value) {
        return 'Email 不能為空'
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Email 格式不正確'
      }
      return true
    },
    password: () => (value) => {
      if (!value) {
        return '密碼不能為空'
      }
      if (value.length < 6) {
        return '密碼長度至少需要 6 個字元'
      }
      return true
    },
    phone: () => (value) => {
      if (!value) {
        return '手機號碼不能為空'
      }
      const phoneRegex = /^09\d{8}$/
      if (!phoneRegex.test(value)) {
        return '手機號碼格式不正確 (請輸入09開頭的10位數字)'
      }
      return true
    },
    minLength: (min, fieldName = '內容') => (value) => {
      if (!value || value.length < min) {
        return `${fieldName}長度至少需要 ${min} 個字元`
      }
      return true
    },
    maxLength: (max, fieldName = '內容') => (value) => {
      if (value && value.length > max) {
        return `${fieldName}長度不能超過 ${max} 個字元`
      }
      return true
    },
    custom: (validatorFn) => validatorFn
  }
}
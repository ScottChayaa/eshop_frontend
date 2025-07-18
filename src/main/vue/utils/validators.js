/**
 * 表單驗證函數庫
 * @description 提供統一的表單驗證邏輯
 */

import { VALIDATION_RULES } from './constants.js'

/**
 * 驗證 Email 格式
 * @param {string} email - Email 地址
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Email 不能為空'
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return 'Email 格式不正確'
  }
  return true
}

/**
 * 驗證密碼強度
 * @param {string} password - 密碼
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validatePassword = (password) => {
  if (!password) {
    return '密碼不能為空'
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `密碼長度至少需要 ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} 個字元`
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return '密碼需包含至少一個小寫字母'
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return '密碼需包含至少一個大寫字母'
  }
  if (!/(?=.*\d)/.test(password)) {
    return '密碼需包含至少一個數字'
  }
  return true
}

/**
 * 驗證確認密碼
 * @param {string} password - 原密碼
 * @param {string} confirmPassword - 確認密碼
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return '請確認密碼'
  }
  if (password !== confirmPassword) {
    return '兩次輸入的密碼不一致'
  }
  return true
}

/**
 * 驗證使用者名稱
 * @param {string} username - 使用者名稱
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateUsername = (username) => {
  if (!username) {
    return '使用者名稱不能為空'
  }
  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return `使用者名稱至少需要 ${VALIDATION_RULES.USERNAME_MIN_LENGTH} 個字元`
  }
  if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return `使用者名稱不能超過 ${VALIDATION_RULES.USERNAME_MAX_LENGTH} 個字元`
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return '使用者名稱只能包含英文字母、數字和底線'
  }
  return true
}

/**
 * 驗證手機號碼 (台灣格式)
 * @param {string} phone - 手機號碼
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return '手機號碼不能為空'
  }
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return '手機號碼格式不正確 (請輸入09開頭的10位數字)'
  }
  return true
}

/**
 * 驗證必填欄位
 * @param {any} value - 待驗證的值
 * @param {string} fieldName - 欄位名稱
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateRequired = (value, fieldName = '此欄位') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}不能為空`
  }
  return true
}

/**
 * 驗證數字範圍
 * @param {number} value - 數值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} fieldName - 欄位名稱
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateNumberRange = (value, min, max, fieldName = '數值') => {
  if (isNaN(value)) {
    return `${fieldName}必須是數字`
  }
  if (value < min || value > max) {
    return `${fieldName}必須在 ${min} 到 ${max} 之間`
  }
  return true
}

/**
 * 驗證字串長度
 * @param {string} value - 字串值
 * @param {number} min - 最小長度
 * @param {number} max - 最大長度
 * @param {string} fieldName - 欄位名稱
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateStringLength = (value, min, max, fieldName = '內容') => {
  if (!value) {
    return `${fieldName}不能為空`
  }
  if (value.length < min) {
    return `${fieldName}長度至少需要 ${min} 個字元`
  }
  if (value.length > max) {
    return `${fieldName}長度不能超過 ${max} 個字元`
  }
  return true
}

/**
 * 驗證檔案大小
 * @param {File} file - 檔案物件
 * @param {number} maxSize - 最大檔案大小 (bytes)
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return '請選擇檔案'
  }
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return `檔案大小不能超過 ${maxSizeMB}MB`
  }
  return true
}

/**
 * 驗證檔案類型
 * @param {File} file - 檔案物件
 * @param {string[]} allowedTypes - 允許的檔案類型
 * @returns {boolean|string} true 或錯誤訊息
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return '請選擇檔案'
  }
  if (!allowedTypes.includes(file.type)) {
    return `檔案類型不支援，請選擇: ${allowedTypes.join(', ')}`
  }
  return true
}

/**
 * 組合驗證器 - 執行多個驗證規則
 * @param {any} value - 待驗證的值
 * @param {Function[]} validators - 驗證函數陣列
 * @returns {boolean|string} true 或第一個錯誤訊息
 */
export const combineValidators = (value, validators) => {
  for (const validator of validators) {
    const result = validator(value)
    if (result !== true) {
      return result
    }
  }
  return true
}

/**
 * 表單驗證輔助函數
 * @param {Object} formData - 表單資料
 * @param {Object} rules - 驗證規則對象
 * @returns {Object} 驗證結果 { isValid, errors }
 */
export const validateForm = (formData, rules) => {
  const errors = {}
  let isValid = true

  for (const [field, validators] of Object.entries(rules)) {
    const value = formData[field]
    const result = combineValidators(value, validators)
    
    if (result !== true) {
      errors[field] = result
      isValid = false
    }
  }

  return { isValid, errors }
}
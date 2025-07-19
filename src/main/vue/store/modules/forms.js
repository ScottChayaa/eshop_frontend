/**
 * 表單 Store 模組
 * @description 管理全域表單狀態和驗證
 */

const state = {
  submittingForms: new Set(),
  formErrors: {},
  formData: {},
  validationResults: {}
}

const mutations = {
  SET_FORM_SUBMITTING(state, { formId, isSubmitting }) {
    if (isSubmitting) {
      state.submittingForms.add(formId)
    } else {
      state.submittingForms.delete(formId)
    }
  },

  SET_FORM_ERRORS(state, { formId, errors }) {
    if (errors && Object.keys(errors).length > 0) {
      state.formErrors[formId] = errors
    } else {
      delete state.formErrors[formId]
    }
  },

  CLEAR_FORM_ERRORS(state, formId) {
    delete state.formErrors[formId]
  },

  SET_FORM_DATA(state, { formId, data }) {
    state.formData[formId] = data
  },

  CLEAR_FORM_DATA(state, formId) {
    delete state.formData[formId]
  },

  SET_VALIDATION_RESULT(state, { formId, fieldName, result }) {
    if (!state.validationResults[formId]) {
      state.validationResults[formId] = {}
    }
    state.validationResults[formId][fieldName] = result
  },

  CLEAR_VALIDATION_RESULTS(state, formId) {
    delete state.validationResults[formId]
  }
}

const actions = {
  async submitForm({ commit, dispatch }, { formId, formData, submitFn, options = {} }) {
    try {
      commit('SET_FORM_SUBMITTING', { formId, isSubmitting: true })
      commit('CLEAR_FORM_ERRORS', formId)

      const result = await submitFn(formData)

      if (options.clearDataOnSuccess) {
        commit('CLEAR_FORM_DATA', formId)
      }

      if (options.showSuccessMessage) {
        dispatch('ui/showSuccess', options.successMessage || '操作成功', { root: true })
      }

      return { success: true, data: result }
    } catch (error) {
      const errorMessage = error.message || '操作失敗，請稍後再試'
      
      if (error.details && error.details.fieldErrors) {
        commit('SET_FORM_ERRORS', { formId, errors: error.details.fieldErrors })
      } else {
        commit('SET_FORM_ERRORS', { formId, errors: { submit: errorMessage } })
      }

      if (options.showErrorMessage) {
        dispatch('ui/showError', errorMessage, { root: true })
      }

      return { success: false, error }
    } finally {
      commit('SET_FORM_SUBMITTING', { formId, isSubmitting: false })
    }
  },

  validateField({ commit }, { formId, fieldName, value, validators }) {
    let result = { isValid: true, error: null }

    for (const validator of validators) {
      const validationResult = validator(value)
      if (validationResult !== true) {
        result = { isValid: false, error: validationResult }
        break
      }
    }

    commit('SET_VALIDATION_RESULT', { formId, fieldName, result })
    return result
  },

  setFormData({ commit }, { formId, data }) {
    commit('SET_FORM_DATA', { formId, data })
  },

  clearFormData({ commit }, formId) {
    commit('CLEAR_FORM_DATA', formId)
    commit('CLEAR_FORM_ERRORS', formId)
    commit('CLEAR_VALIDATION_RESULTS', formId)
  },

  setFormErrors({ commit }, { formId, errors }) {
    commit('SET_FORM_ERRORS', { formId, errors })
  },

  clearFormErrors({ commit }, formId) {
    commit('CLEAR_FORM_ERRORS', formId)
  }
}

const getters = {
  isFormSubmitting: (state) => (formId) => {
    return state.submittingForms.has(formId)
  },

  getFormErrors: (state) => (formId) => {
    return state.formErrors[formId] || {}
  },

  hasFormErrors: (state) => (formId) => {
    const errors = state.formErrors[formId]
    return errors && Object.keys(errors).length > 0
  },

  getFieldError: (state) => (formId, fieldName) => {
    const formErrors = state.formErrors[formId]
    return formErrors ? formErrors[fieldName] : null
  },

  hasFieldError: (state) => (formId, fieldName) => {
    const formErrors = state.formErrors[formId]
    return formErrors && !!formErrors[fieldName]
  },

  getFormData: (state) => (formId) => {
    return state.formData[formId] || {}
  },

  getValidationResult: (state) => (formId, fieldName) => {
    const formResults = state.validationResults[formId]
    return formResults ? formResults[fieldName] : null
  },

  isFieldValid: (state) => (formId, fieldName) => {
    const result = state.validationResults[formId]?.[fieldName]
    return result ? result.isValid : true
  },

  getSubmittingForms: (state) => {
    return Array.from(state.submittingForms)
  },

  hasAnySubmittingForm: (state) => {
    return state.submittingForms.size > 0
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
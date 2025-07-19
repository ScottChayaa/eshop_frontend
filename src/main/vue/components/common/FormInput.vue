<template>
  <div class="form-input-wrapper">
    <v-text-field
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder"
      :type="computedType"
      :variant="variant"
      :density="density"
      :color="color"
      :rules="computedRules"
      :error-messages="errorMessages"
      :error="hasError"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :clearable="clearable"
      :counter="counter"
      :maxlength="maxlength"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :prepend-icon="prependIcon"
      :append-icon="computedAppendIcon"
      :prepend-inner-icon="prependInnerIcon"
      :append-inner-icon="appendInnerIcon"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @click:append="handleAppendClick"
      @click:prepend="handlePrependClick"
      @keydown.enter="handleEnter"
      class="form-input"
    >
      <template v-if="$slots.prepend" v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      
      <template v-if="$slots.append" v-slot:append>
        <slot name="append"></slot>
      </template>
      
      <template v-if="$slots['prepend-inner']" v-slot:prepend-inner>
        <slot name="prepend-inner"></slot>
      </template>
      
      <template v-if="$slots['append-inner']" v-slot:append-inner>
        <slot name="append-inner"></slot>
      </template>
    </v-text-field>

    <div v-if="showValidationState" class="validation-indicator mt-1">
      <v-chip
        :color="validationColor"
        size="x-small"
        variant="flat"
        class="validation-chip"
      >
        <v-icon start size="12">{{ validationIcon }}</v-icon>
        {{ validationText }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url', 'search'].includes(value)
    },
    variant: {
      type: String,
      default: 'outlined'
    },
    density: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      default: 'primary'
    },
    rules: {
      type: Array,
      default: () => []
    },
    errorMessages: {
      type: [String, Array],
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    counter: {
      type: [Boolean, Number, String],
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: undefined
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: undefined
    },
    prependIcon: {
      type: String,
      default: undefined
    },
    appendIcon: {
      type: String,
      default: undefined
    },
    prependInnerIcon: {
      type: String,
      default: undefined
    },
    appendInnerIcon: {
      type: String,
      default: undefined
    },
    hideDetails: {
      type: [Boolean, String],
      default: false
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: undefined
    },
    validationState: {
      type: String,
      default: 'pristine',
      validator: (value) => ['pristine', 'validating', 'valid', 'invalid'].includes(value)
    },
    showValidationState: {
      type: Boolean,
      default: false
    },
    passwordToggle: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:modelValue',
    'blur',
    'focus',
    'click:append',
    'click:prepend',
    'enter'
  ],
  setup(props, { emit }) {
    const showPassword = ref(false)
    const isFocused = ref(false)

    const computedType = computed(() => {
      if (props.type === 'password' && props.passwordToggle) {
        return showPassword.value ? 'text' : 'password'
      }
      return props.type
    })

    const computedAppendIcon = computed(() => {
      if (props.type === 'password' && props.passwordToggle) {
        return showPassword.value ? 'mdi-eye-off' : 'mdi-eye'
      }
      return props.appendIcon
    })

    const computedRules = computed(() => {
      return props.rules.map(rule => {
        if (typeof rule === 'function') {
          return (value) => {
            const result = rule(value)
            return result === true ? true : String(result)
          }
        }
        return rule
      })
    })

    const hasError = computed(() => {
      return props.validationState === 'invalid' || 
             (Array.isArray(props.errorMessages) ? props.errorMessages.length > 0 : !!props.errorMessages)
    })

    const validationColor = computed(() => {
      switch (props.validationState) {
        case 'valid': return 'success'
        case 'invalid': return 'error'
        case 'validating': return 'warning'
        default: return 'grey'
      }
    })

    const validationIcon = computed(() => {
      switch (props.validationState) {
        case 'valid': return 'mdi-check-circle'
        case 'invalid': return 'mdi-alert-circle'
        case 'validating': return 'mdi-loading'
        default: return 'mdi-help-circle'
      }
    })

    const validationText = computed(() => {
      switch (props.validationState) {
        case 'valid': return '驗證通過'
        case 'invalid': return '驗證失敗'
        case 'validating': return '驗證中...'
        default: return '待驗證'
      }
    })

    const handleInput = (value) => {
      emit('update:modelValue', value)
    }

    const handleBlur = (event) => {
      isFocused.value = false
      emit('blur', event)
    }

    const handleFocus = (event) => {
      isFocused.value = true
      emit('focus', event)
    }

    const handleAppendClick = (event) => {
      if (props.type === 'password' && props.passwordToggle) {
        showPassword.value = !showPassword.value
      }
      emit('click:append', event)
    }

    const handlePrependClick = (event) => {
      emit('click:prepend', event)
    }

    const handleEnter = (event) => {
      emit('enter', event)
    }

    return {
      showPassword,
      isFocused,
      computedType,
      computedAppendIcon,
      computedRules,
      hasError,
      validationColor,
      validationIcon,
      validationText,
      handleInput,
      handleBlur,
      handleFocus,
      handleAppendClick,
      handlePrependClick,
      handleEnter
    }
  }
}
</script>

<style scoped>
.form-input-wrapper {
  position: relative;
}

.form-input :deep(.v-field__outline) {
  border-radius: 8px;
}

.form-input :deep(.v-field--error .v-field__outline) {
  border-color: rgb(var(--v-theme-error)) !important;
}

.form-input :deep(.v-field--focused .v-field__outline) {
  border-width: 2px;
}

.validation-indicator {
  display: flex;
  justify-content: flex-end;
}

.validation-chip {
  opacity: 0.8;
}

.validation-chip :deep(.v-icon) {
  animation: none;
}

.validation-chip :deep(.mdi-loading) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-input :deep(.v-input__details) {
  margin-top: 4px;
}

.form-input :deep(.v-messages) {
  font-size: 0.75rem;
  min-height: 16px;
}
</style>
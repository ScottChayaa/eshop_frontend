<template>
  <div class="form-select-wrapper">
    <v-select
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder"
      :items="items"
      :item-title="itemTitle"
      :item-value="itemValue"
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
      :multiple="multiple"
      :chips="chips && multiple"
      :closable-chips="closableChips && multiple"
      :small-chips="smallChips && multiple"
      :return-object="returnObject"
      :autofocus="autofocus"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :prepend-inner-icon="prependInnerIcon"
      :append-inner-icon="appendInnerIcon"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :loading="loading"
      :menu-props="menuProps"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @update:menu="handleMenuUpdate"
      class="form-select"
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

      <template v-if="$slots.selection" v-slot:selection="{ item, index }">
        <slot name="selection" :item="item" :index="index"></slot>
      </template>

      <template v-if="$slots.item" v-slot:item="{ item, props: itemProps }">
        <slot name="item" :item="item" :props="itemProps"></slot>
      </template>

      <template v-if="$slots['no-data']" v-slot:no-data>
        <slot name="no-data"></slot>
      </template>
    </v-select>

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
  name: 'FormSelect',
  props: {
    modelValue: {
      type: [String, Number, Array, Object],
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '請選擇...'
    },
    items: {
      type: Array,
      required: true
    },
    itemTitle: {
      type: [String, Function],
      default: 'title'
    },
    itemValue: {
      type: [String, Function],
      default: 'value'
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
    multiple: {
      type: Boolean,
      default: false
    },
    chips: {
      type: Boolean,
      default: true
    },
    closableChips: {
      type: Boolean,
      default: true
    },
    smallChips: {
      type: Boolean,
      default: false
    },
    returnObject: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
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
    loading: {
      type: Boolean,
      default: false
    },
    menuProps: {
      type: Object,
      default: () => ({})
    },
    validationState: {
      type: String,
      default: 'pristine',
      validator: (value) => ['pristine', 'validating', 'valid', 'invalid'].includes(value)
    },
    showValidationState: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:modelValue',
    'blur',
    'focus',
    'update:menu'
  ],
  setup(props, { emit }) {
    const isFocused = ref(false)

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

    const handleMenuUpdate = (isOpen) => {
      emit('update:menu', isOpen)
    }

    return {
      isFocused,
      computedRules,
      hasError,
      validationColor,
      validationIcon,
      validationText,
      handleInput,
      handleBlur,
      handleFocus,
      handleMenuUpdate
    }
  }
}
</script>

<style scoped>
.form-select-wrapper {
  position: relative;
}

.form-select :deep(.v-field__outline) {
  border-radius: 8px;
}

.form-select :deep(.v-field--error .v-field__outline) {
  border-color: rgb(var(--v-theme-error)) !important;
}

.form-select :deep(.v-field--focused .v-field__outline) {
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

.form-select :deep(.v-input__details) {
  margin-top: 4px;
}

.form-select :deep(.v-messages) {
  font-size: 0.75rem;
  min-height: 16px;
}

.form-select :deep(.v-chip) {
  margin: 2px;
}

.form-select :deep(.v-select__selections) {
  padding: 0 4px;
}
</style>
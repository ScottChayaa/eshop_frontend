<template>
  <div class="search-input-wrapper">
    <v-text-field
      v-model="searchQuery"
      :placeholder="placeholder"
      :density="density"
      :width="width"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      clearable
      @keyup.enter="handleSearch"
      @click:clear="handleClear"
      @input="handleInput"
      class="search-input"
    >
      <template v-slot:append-inner>
        <v-btn
          icon
          size="small"
          variant="text"
          @click="handleSearch"
          :disabled="!searchQuery?.trim()"
        >
          <v-icon size="20">mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <div 
      v-if="showSuggestions && suggestions.length > 0"
      class="search-suggestions"
    >
      <v-list density="compact">
        <v-list-item
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          class="suggestion-item"
        >
          <template v-slot:prepend>
            <v-icon size="16">{{ suggestion.icon || 'mdi-magnify' }}</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            {{ suggestion.text }}
          </v-list-item-title>
          <template v-slot:append v-if="suggestion.type">
            <v-chip size="x-small" variant="outlined">
              {{ suggestion.type }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { debounce } from '../../utils/helpers.js'

export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String,
      default: '搜尋商品、品牌或關鍵字...'
    },
    density: {
      type: String,
      default: 'default'
    },
    width: {
      type: [String, Number],
      default: 300
    },
    showSuggestions: {
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search', 'input', 'clear'],
  setup(props, { emit }) {
    const store = useStore()
    const searchQuery = ref('')
    const suggestions = ref([])
    const showSuggestionsList = ref(false)

    const recentSearches = computed(() => 
      store.getters['search/recentSearches'] || []
    )

    const popularKeywords = computed(() => 
      store.getters['search/popularKeywords'] || []
    )

    const displaySuggestions = computed(() => {
      if (!searchQuery.value?.trim()) {
        return [
          ...recentSearches.value.slice(0, 3).map(item => ({
            text: item,
            icon: 'mdi-history',
            type: '最近搜尋'
          })),
          ...popularKeywords.value.slice(0, 5).map(item => ({
            text: item,
            icon: 'mdi-trending-up',
            type: '熱門'
          }))
        ]
      }

      return suggestions.value.slice(0, 8)
    })

    const debouncedSearch = debounce(async (query) => {
      if (query?.trim()) {
        try {
          const response = await store.dispatch('search/getSuggestions', query)
          suggestions.value = response.map(item => ({
            text: item.name,
            icon: item.type === 'product' ? 'mdi-shopping' : 'mdi-tag',
            type: item.type === 'product' ? '商品' : '分類'
          }))
        } catch (error) {
          console.error('Failed to get search suggestions:', error)
          suggestions.value = []
        }
      } else {
        suggestions.value = []
      }
    }, 300)

    const handleInput = (value) => {
      emit('input', value)
      if (props.showSuggestions) {
        showSuggestionsList.value = true
        debouncedSearch(value)
      }
    }

    const handleSearch = () => {
      const query = searchQuery.value?.trim()
      if (query) {
        emit('search', query)
        store.dispatch('search/addRecentSearch', query)
        hideSuggestions()
      }
    }

    const handleClear = () => {
      searchQuery.value = ''
      suggestions.value = []
      showSuggestionsList.value = false
      emit('clear')
    }

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.text
      emit('search', suggestion.text)
      store.dispatch('search/addRecentSearch', suggestion.text)
      hideSuggestions()
    }

    const hideSuggestions = () => {
      showSuggestionsList.value = false
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input-wrapper')) {
        hideSuggestions()
      }
    }

    watch(() => props.showSuggestions, (newVal) => {
      if (!newVal) {
        hideSuggestions()
      }
    })

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      if (recentSearches.value.length === 0) {
        store.dispatch('search/loadRecentSearches')
      }
      if (popularKeywords.value.length === 0) {
        store.dispatch('search/loadPopularKeywords')
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      searchQuery,
      suggestions: displaySuggestions,
      showSuggestions: computed(() => 
        props.showSuggestions && showSuggestionsList.value && displaySuggestions.value.length > 0
      ),
      handleInput,
      handleSearch,
      handleClear,
      selectSuggestion
    }
  }
}
</script>

<style scoped>
.search-input-wrapper {
  position: relative;
}

.search-input :deep(.v-field__outline) {
  border-radius: 24px;
}

.search-input :deep(.v-field__input) {
  padding-left: 16px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.theme--dark .search-suggestions {
  background: #1E1E1E;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.suggestion-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: rgba(250, 230, 177, 0.1);
}

.theme--dark .suggestion-item:hover {
  background-color: rgba(250, 230, 177, 0.05);
}

.search-input :deep(.v-input__control) {
  min-height: auto;
}

.search-input :deep(.v-field__input) {
  font-size: 14px;
}
</style>
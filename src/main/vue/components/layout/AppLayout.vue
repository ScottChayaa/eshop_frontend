<template>
  <v-app>
    <AppHeader 
      @toggle-sidebar="toggleSidebar"
      @navigate="closeSidebar"
    />
    
    <AppSidebar 
      v-model:open="sidebarOpen"
    />
    
    <v-main class="main-content">
      <v-container 
        :fluid="fluidContainer"
        :class="containerClass"
        class="main-container"
      >
        <router-view v-slot="{ Component, route }">
          <transition
            :name="transitionName"
            mode="out-in"
            @before-enter="beforeEnter"
            @after-enter="afterEnter"
          >
            <component 
              :is="Component" 
              :key="route.path"
              class="page-content"
            />
          </transition>
        </router-view>
      </v-container>
    </v-main>
    
    <AppFooter />
    
    <!-- 手機版底部導航 -->
    <MobileBottomNav />

    <v-fab
      v-model="showFab"
      location="bottom end"
      size="small"
      color="secondary"
      icon="mdi-chevron-up"
      @click="scrollToTop"
      app
      appear
    ></v-fab>

    <v-snackbar
      v-model="showGlobalSnackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      location="top"
      multi-line
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="closeSnackbar"
        >
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useDisplay } from 'vuetify'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
import MobileBottomNav from './MobileBottomNav.vue'
import { scrollToTop as scrollToTopUtil } from '../../utils/helpers.js'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    MobileBottomNav
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const display = useDisplay()
    
    const sidebarOpen = ref(false)
    const showFab = ref(false)
    const isPageLoading = ref(false)

    const fluidContainer = computed(() => {
      const fluidPages = ['home', 'category', 'search']
      return fluidPages.includes(route.name)
    })

    const containerClass = computed(() => {
      return {
        'pa-0': fluidContainer.value,
        'py-4': !fluidContainer.value
      }
    })

    const transitionName = computed(() => {
      if (isPageLoading.value) return 'fade'
      
      const routeDepth = route.path.split('/').length
      const isGoingDeeper = routeDepth > 2
      
      return isGoingDeeper ? 'slide-left' : 'slide-right'
    })

    const showGlobalSnackbar = computed({
      get: () => store.getters['ui/snackbar'].show,
      set: (value) => {
        if (!value) {
          store.dispatch('ui/hideSnackbar')
        }
      }
    })

    const snackbarMessage = computed(() => 
      store.getters['ui/snackbar'].message
    )

    const snackbarColor = computed(() => 
      store.getters['ui/snackbar'].color
    )

    const snackbarTimeout = computed(() => 
      store.getters['ui/snackbar'].timeout
    )

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const handleScroll = () => {
      showFab.value = window.pageYOffset > 300
    }

    const scrollToTop = () => {
      scrollToTopUtil()
    }

    const beforeEnter = () => {
      isPageLoading.value = true
    }

    const afterEnter = () => {
      isPageLoading.value = false
    }

    const closeSnackbar = () => {
      store.dispatch('ui/hideSnackbar')
    }

    watch(() => route.path, () => {
      if (display.smAndDown.value) {
        closeSidebar()
      }
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        store.dispatch('ui/setTheme', savedTheme)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      sidebarOpen,
      showFab,
      fluidContainer,
      containerClass,
      transitionName,
      showGlobalSnackbar,
      snackbarMessage,
      snackbarColor,
      snackbarTimeout,
      toggleSidebar,
      closeSidebar,
      scrollToTop,
      beforeEnter,
      afterEnter,
      closeSnackbar
    }
  }
}
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 64px);
}

.main-container {
  min-height: inherit;
  /* 手機版底部留空間給導航列 */
  padding-bottom: 0;
}

/* 手機版主內容區域底部間距 */
@media (max-width: 767px) {
  .main-container {
    padding-bottom: 75px !important; /* 為底部導航列留出空間 */
  }
}

.page-content {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

:deep(.v-application--wrap) {
  min-height: 100vh;
}

@media (max-width: 600px) {
  .main-container {
    padding: 8px !important;
  }
}
</style>
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#FFA101',     // 橘黃
          secondary: '#B3DEE5',   // 淺藍
          accent: '#FAE6B1',      // 淺黃
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FAE6B1',  // 淺黃背景
          surface: '#FFFFFF',
          'on-primary': '#FFFFFF',
          'on-secondary': '#31525B',
          'on-accent': '#31525B',
          'on-background': '#31525B',
          'on-surface': '#31525B'
        }
      }
    }
  }
})

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)

app.mount('#app')
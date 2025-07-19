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
    defaultTheme: 'customLight',
    themes: {
      customLight: {
        dark: false,
        colors: {
          primary: '#FAE6B1',     // 淺黃
          secondary: '#FFA101',   // 橘黃
          accent: '#B3DEE5',      // 淺藍
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'on-primary': '#31525B',
          'on-secondary': '#FFFFFF',
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
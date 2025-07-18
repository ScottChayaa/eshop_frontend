/**
 * Vuetify 插件配置
 * @description 配置 Vuetify UI 框架，包含主題、色彩、圖示等設定
 */

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { zhHant } from 'vuetify/locale'

// 引入 Vuetify 樣式
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// 引入專案色彩常數
import { COLORS } from '../utils/constants.js'

// Vuetify 組件
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 自定義主題配置
const customTheme = {
  dark: false,
  colors: {
    // 主要品牌色彩 (對應 CLAUDE.md 規範)
    primary: COLORS.PRIMARY,      // #FAE6B1 淺黃
    secondary: COLORS.SECONDARY,  // #FFA101 橘黃
    accent: COLORS.ACCENT,        // #B3DEE5 淺藍
    error: COLORS.ERROR,          // #F44336 錯誤
    info: COLORS.INFO,            // #2196F3 資訊
    success: COLORS.SUCCESS,      // #4CAF50 成功
    warning: COLORS.WARNING,      // #FF9800 警告
    
    // 背景和表面色彩
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#F5F5F5',
    'on-surface-variant': '#424242',
    
    // 文字色彩
    'on-primary': COLORS.DARK,    // 主色上的文字
    'on-secondary': '#FFFFFF',    // 次要色上的文字
    'on-background': '#212121',   // 背景上的文字
    'on-surface': '#212121',      // 表面上的文字
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#FFFFFF',
    
    // 自定義語意色彩
    'custom-dark': COLORS.DARK,   // #31525B 深藍灰
  }
}

// 深色主題配置
const darkTheme = {
  dark: true,
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    accent: COLORS.ACCENT,
    error: COLORS.ERROR,
    info: COLORS.INFO,
    success: COLORS.SUCCESS,
    warning: COLORS.WARNING,
    
    // 深色模式背景
    background: '#121212',
    surface: '#1E1E1E',
    'surface-variant': '#2E2E2E',
    'on-surface-variant': '#E0E0E0',
    
    // 深色模式文字
    'on-primary': COLORS.DARK,
    'on-secondary': '#FFFFFF',
    'on-background': '#FFFFFF',
    'on-surface': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#000000',
    
    'custom-dark': COLORS.DARK,
  }
}

// 建立 Vuetify 實例
const vuetify = createVuetify({
  // 載入所有組件和指令
  components,
  directives,
  
  // 主題配置
  theme: {
    defaultTheme: 'customLight',
    themes: {
      customLight: customTheme,
      customDark: darkTheme,
    },
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 3,
      darken: 3,
    },
  },
  
  // 圖示配置
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  
  // 多語系配置
  locale: {
    locale: 'zhHant',
    fallback: 'en',
    messages: { zhHant },
  },
  
  // 全域配置
  defaults: {
    global: {
      // 全域 ripple 效果
      ripple: true,
    },
    
    // 按鈕預設配置
    VBtn: {
      variant: 'elevated',
      color: 'primary',
      style: 'text-transform: none;', // 移除大寫轉換
    },
    
    // 卡片預設配置
    VCard: {
      elevation: 2,
      variant: 'elevated',
    },
    
    // 輸入框預設配置
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'secondary',
    },
    
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'secondary',
    },
    
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'secondary',
    },
    
    // 對話框預設配置
    VDialog: {
      width: 'auto',
      maxWidth: '500px',
    },
    
    // 工具列預設配置
    VToolbar: {
      color: 'surface',
      elevation: 1,
    },
    
    // 導航抽屜預設配置
    VNavigationDrawer: {
      color: 'surface',
      elevation: 1,
    },
    
    // 資料表格預設配置
    VDataTable: {
      itemsPerPage: 10,
      showCurrentPage: true,
    },
  },
  
  // 顯示配置
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
})

// 主題切換函數
export const toggleTheme = () => {
  const currentTheme = vuetify.theme.global.name.value
  vuetify.theme.global.name.value = currentTheme === 'customLight' ? 'customDark' : 'customLight'
}

// 取得當前主題
export const getCurrentTheme = () => {
  return vuetify.theme.global.name.value
}

// 設定主題
export const setTheme = (themeName) => {
  if (['customLight', 'customDark'].includes(themeName)) {
    vuetify.theme.global.name.value = themeName
  }
}

// 取得主題色彩
export const getThemeColors = () => {
  return vuetify.theme.current.value.colors
}

export default vuetify

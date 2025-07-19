<template>
  <AppLayout />
</template>

<script>
import AppLayout from './components/layout/AppLayout.vue'

export default {
  name: 'App',
  components: {
    AppLayout
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', 'Noto Sans TC', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

.v-application {
  font-family: 'Roboto', 'Noto Sans TC', sans-serif !important;
}

/* 全域動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全域響應式工具類 */
@media (max-width: 600px) {
  .text-mobile-sm {
    font-size: 0.875rem !important;
  }
}

/* 滾動條美化 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色模式滾動條 */
.v-theme--customDark ::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.v-theme--customDark ::-webkit-scrollbar-thumb {
  background: #555;
}

.v-theme--customDark ::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>

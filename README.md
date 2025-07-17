# eshop_frontend

Vue3 前端購物網站開發專案 - 基於Vue3的現代化電商前端應用，包含完整的購物流程、會員系統和響應式設計

## 🚀 Quick Start

1. **Read CLAUDE.md first** - Contains essential rules for Claude Code
2. Follow the pre-task compliance checklist before starting any work
3. Use proper module structure under `src/main/vue/`
4. Commit after every completed task

## 🎯 專案概述

本專案為基於 Vue3 的前端購物網站開發，將通過多次討論逐步完善設計與功能規劃。

### 技術架構
- **前端框架**：Vue 3 + Composition API
- **UI組件庫**：Vuetify 3
- **狀態管理**：Vuex 4
- **路由管理**：Vue Router 4
- **HTTP客戶端**：Axios
- **建構工具**：Vite

### 主要頁面結構
- 首頁 (商品展示)
- 商品分類頁
- 商品詳情頁
- 購物車頁
- 結帳頁
- 會員中心
- 訂單查詢

### 設計風格
- **整體風格**：現代簡約
- **主色調**：#FAE6B1 (淺黃)
- **輔助色**：#FFA101 (橘黃), #B3DEE5 (淺藍)
- **深色**：#31525B (深藍灰)
- **響應式設計**：手機優先

## 📁 Project Structure

```
src/main/vue/
├── components/     # 可重用組件
├── views/         # 頁面組件  
├── store/         # Vuex 狀態管理
├── router/        # Vue Router 路由配置
├── services/      # API 服務層
└── utils/         # 工具函數
```

## 🎯 核心功能
1. **商品管理**：商品瀏覽、搜尋、篩選、排序
2. **購物車**：加入商品、數量調整、移除商品
3. **會員系統**：註冊、登入（Google OAuth）、個人資料管理
4. **訂單管理**：訂單建立、查詢、狀態追蹤
5. **結帳系統**：收件地址、付款方式、訂單確認

## 🎨 SEO 優化策略
- Vue Meta 或 @vueuse/head 管理 meta 標籤
- 預渲染重要頁面 (Prerender SPA Plugin)
- 結構化資料標記
- Google Analytics 4 整合
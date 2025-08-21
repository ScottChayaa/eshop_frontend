# eshop_frontend

Vue3 前端購物網站開發專案 - 基於Vue3的現代化電商前端應用，包含完整的購物流程、會員系統和響應式設計

## 🎯 專案概述

本專案為基於 Vue3 的前端購物網站開發，採用 Mock Service Worker (MSW) 提供完整的電商 API 模擬環境。

### 基本架構方向
- 採用 SPA (Single Page Application)
- 前後端分離設計，透過非同步 API 刷新資料
- 狀態管理使用 Vuex
- 需要 SEO 相關優化，埋入 GA 追蹤

### 主要頁面結構
- 首頁 (商品展示)
- 商品分類頁
- 商品詳情頁
- 購物車頁
- 結帳頁
- 會員中心
- 訂單查詢

### 路由結構
```
/                    # 首頁
/category/:id        # 商品分類頁
/product/:id         # 商品詳情頁
/cart                # 購物車
/checkout            # 結帳
/user/profile        # 會員中心
/user/orders         # 訂單查詢
/user/login          # 登入
/user/register       # 註冊
```

## 🛠️ 技術架構

### 前端技術棧
- **框架**：Vue 3 + Composition API
- **UI庫**：Vuetify 3
- **狀態管理**：Vuex 4
- **路由**：Vue Router 4
- **HTTP客戶端**：Axios
- **構建工具**：Vite

### 第三方整合
- **Google OAuth**：@google-cloud/oauth2 或 vue-google-oauth2
- **Google Analytics**：vue-gtag 或 @gtag/vue
- **推送通知**：Firebase Cloud Messaging (FCM)
- **圖片優化**：vue-lazyload 或 vue-progressive-image

### 開發工具
- **代碼格式化**：ESLint + Prettier
- **CSS預處理**：Sass/SCSS
- **測試框架**：Vitest + Vue Test Utils
- **Mock API**：Mock Service Worker (MSW)
- **部署**：Vercel、Netlify 或 Firebase Hosting

### Mock API 系統
- **MSW (Mock Service Worker)**：完整的電商 API 模擬
  - 真實的網路攔截和響應模擬
  - 完整的認證、商品、購物車、訂單功能
  - 開發環境自動啟動，生產環境自動切換真實 API
- **假資料產生**：使用豐富的測試資料結構
- **API 結構預留**：預先設計 API 介面規格，方便後續整合真實後端

## 🎨 設計風格

### 設計風格方向
- **整體風格**：現代簡約
- **色彩主題**：
  - 主色調：#FAE6B1 (淺黃)
  - 輔助色：#FFA101 (橘黃)
  - 輔助色：#B3DEE5 (淺藍)
  - 深色：#31525B (深藍灰)
- **UI 組件庫**：Vuetify
- **RWD 響應式**：手機優先設計
- **版面配置**：寬版 (1200px+)

### 色彩運用策略
- 主背景：#FAE6B1 (溫暖親和)
- 按鈕/強調：#FFA101 (活潑醒目)
- 輔助區塊：#B3DEE5 (清爽平衡)
- 文字/邊框：#31525B (穩重易讀)

### 核心頁面設計重點

**首頁**：
- 商品展示方式：網格 + 瀑布流布局
- 手機版底部固定導航列 (5個按鈕)：
  - 首頁
  - 分類
  - 活動
  - 通知
  - 會員管理

**商品頁**：
- 圖片展示區
- 規格選擇區
- 購買按鈕區

**購物車**：
- 簡潔清晰的結帳流程

**會員中心**：
- 功能區塊化設計

## 📁 Project Structure

```
src/main/vue/
├── components/     # 可重用組件
├── views/         # 頁面組件  
├── store/         # Vuex 狀態管理
├── router/        # Vue Router 路由配置
├── services/      # API 服務層
├── utils/         # 工具函數
└── mocks/         # MSW Mock API
    ├── handlers.js    # API 處理器
    ├── browser.js     # 瀏覽器設定
    ├── server.js      # 測試環境設定
    ├── db.json        # 測試資料
    └── data/          # 資料載入器
```

## 🎯 功能需求

### 核心功能
1. **商品管理**：商品瀏覽、搜尋、篩選、排序
2. **購物車**：加入商品、數量調整、移除商品
3. **會員系統**：
   - 註冊、登入：使用 Google 第三方登入
   - 個人資料管理
4. **訂單管理**：訂單建立、查詢、狀態追蹤
5. **結帳系統**：收件地址、付款方式、訂單確認

### 進階功能
- 商品收藏/願望清單
- 商品評價與評論
- 商品比較功能
- 優惠券/折扣碼
- 推薦商品
- 分享功能

### 手機專屬功能
- 底部導航 (首頁、分類、活動、通知、會員)
- 通知推送
- 快速結帳

### 技術需求
- Google OAuth 2.0 整合
- 推送通知系統
- 響應式設計 (手機優先)
- 本地存儲 (購物車、偏好設定)
- API 串接 (商品、訂單、會員資料)

## 🔍 SEO 優化策略
- 使用 Vue Meta 或 @vueuse/head 管理 meta 標籤
- 預渲染重要頁面 (Prerender SPA Plugin)
- 結構化資料標記
- Google Analytics 4 整合

## 🚀 快速開始

### 一鍵啟動開發環境

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器 (MSW 自動啟動)
npm run dev
```

開發伺服器：http://localhost:3000

### ✨ MSW 特色
- **零配置**：MSW 會在開發環境自動啟動
- **真實模擬**：攔截瀏覽器請求，完全模擬真實 API 行為
- **豐富資料**：包含完整的商品、使用者、訂單資料
- **即時反饋**：所有 API 請求會在 Console 中顯示

### 測試頁面連結
開發伺服器啟動後，可以訪問以下頁面：

- **首頁**：http://localhost:3000/
- **商品詳情頁範例**：
  - iPhone 15 Pro：http://localhost:3000/product/1
  - MacBook Pro 14"：http://localhost:3000/product/2
  - AirPods Pro：http://localhost:3000/product/3
  - iPad Air：http://localhost:3000/product/4
- **登入頁面**：http://localhost:3000/login

### 🔐 測試帳號
| 角色 | Email | Password | 說明 |
|------|-------|----------|------|
| 管理員 | `admin@example.com` | `Admin123456` | 具有管理員權限 |
| 一般用戶 | `user@example.com` | `User123456` | 一般使用者 |
| 測試用戶 | `test@example.com` | `Test123456` | 測試專用帳號 |

### 功能測試項目
- ✅ 登入/註冊/登出功能
- ✅ 商品圖片輪播與切換
- ✅ 規格選擇（顏色、容量等）
- ✅ 數量選擇與庫存管理
- ✅ 加入購物車功能
- ✅ 購物車 CRUD 操作
- ✅ 商品描述與規格表
- ✅ 響應式設計（手機/PC版）
- ✅ 收藏功能
- ✅ 評價系統展示
- ✅ 訂單建立與查詢
- ✅ 通知系統

## 🧪 測試策略

### 測試工具組合
- **Vitest**：單元測試框架，用於測試邏輯函數和組件
- **Vue Test Utils**：Vue 組件測試工具
- **MSW (Mock Service Worker)**：完整 API 模擬，用於所有測試環境
- **Cypress**：端到端測試框架

### 測試分工策略
| 測試類型 | 工具 | 用途 |
|---------|------|------|
| **API 模擬** | MSW | 統一的 API 模擬，支援開發和測試 |
| **單元測試** | Vitest | 函數和邏輯測試 |
| **組件測試** | Vue Test Utils | Vue 組件功能和互動測試 |
| **端到端測試** | Cypress | 完整使用者操作流程測試 |

### 測試覆蓋範圍
- 認證系統 (登入/登出/權限控制)
- 狀態管理 (Vuex Store modules)
- API 服務層 (請求/響應/錯誤處理)
- UI 組件 (Layout/互動/響應式)
- 路由守衛 (權限控制/導航)
- 購物車功能 (CRUD 操作)
- 訂單管理 (建立/查詢)

## 📚 開發文件

- [🔐 登入功能測試指南](./LOGIN_TEST_GUIDE.md)
- [🚀 MSW API 完整指南](./MSW_API_GUIDE.md)
- [📋 開發者設定](./CLAUDE.md)

## 🔄 環境設定

### 開發環境
```bash
# .env.development (自動載入)
VITE_ENABLE_MSW=true
VITE_APP_API_URL=/api
VITE_APP_DEBUG=true
```

### 生產環境
```bash
# .env.production (自動載入)
VITE_ENABLE_MSW=false
VITE_APP_API_URL=https://your-api-domain.com/api
VITE_APP_DEBUG=false
```

## 📝 規劃總結

### 重點摘要
- SPA + Vue3 + Vuetify 架構
- 核心功能實作 (商品瀏覽、購物車、會員系統)
- 現代簡約風格，溫暖色調配置
- 手機優先設計，底部固定導航
- Google OAuth 登入整合
- MSW 統一 Mock API 策略
- 完整測試覆蓋和驗證機制

### 🎉 現在開始開發

```bash
npm install && npm run dev
```

一個指令，完整的電商開發環境就緒！🚀
# Vue3 前端購物網站開發討論紀錄

## 專案概述
本專案為基於 Vue3 的前端購物網站開發，將通過多次討論逐步完善設計與功能規劃。

## 討論內容摘要

### 1. 網站架構

**基本架構方向**：
- 採用 SPA (Single Page Application)
- 前後端分離設計，透過非同步 API 刷新資料
- 狀態管理使用 Vuex
- 需要 SEO 相關優化，埋入 GA 追蹤

**主要頁面結構**：
- 首頁 (商品展示)
- 商品分類頁
- 商品詳情頁
- 購物車頁
- 結帳頁
- 會員中心
- 訂單查詢

**技術架構**：
- Vue 3 + Composition API
- Vue Router 4
- Vuex 4
- UI 組件庫 (待選擇)

**路由結構範例**：
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

**SEO 優化策略**：
- 使用 Vue Meta 或 @vueuse/head 管理 meta 標籤
- 預渲染重要頁面 (Prerender SPA Plugin)
- 結構化資料標記
- Google Analytics 4 整合

### 2. 頁面風格

**設計風格方向**：
- 整體風格：現代簡約
- 色彩主題：
  - 主色調：#FAE6B1 (淺黃)
  - 輔助色：#FFA101 (橘黃)
  - 輔助色：#B3DEE5 (淺藍)
  - 深色：#31525B (深藍灰)
- UI 組件庫：Vuetify
- RWD 響應式：手機優先設計
- 版面配置：寬版 (1200px+)

**核心頁面設計重點**：

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

**色彩運用策略**：
- 主背景：#FAE6B1 (溫暖親和)
- 按鈕/強調：#FFA101 (活潑醒目)
- 輔助區塊：#B3DEE5 (清爽平衡)
- 文字/邊框：#31525B (穩重易讀)

### 3. 功能需求

**核心功能**：
1. **商品管理**：商品瀏覽、搜尋、篩選、排序
2. **購物車**：加入商品、數量調整、移除商品
3. **會員系統**：
   - 註冊、登入：使用 Google 第三方登入
   - 個人資料管理
4. **訂單管理**：訂單建立、查詢、狀態追蹤
5. **結帳系統**：收件地址、付款方式、訂單確認

**進階功能**：
- 商品收藏/願望清單
- 商品評價與評論
- 商品比較功能
- 優惠券/折扣碼
- 推薦商品
- 分享功能

**手機專屬功能**：
- 底部導航 (首頁、分類、活動、通知、會員)
- 通知推送
- 快速結帳

**技術需求**：
- Google OAuth 2.0 整合
- 推送通知系統
- 響應式設計 (手機優先)
- 本地存儲 (購物車、偏好設定)
- API 串接 (商品、訂單、會員資料)

### 4. 技術選型

**前端技術棧**：
- **框架**：Vue 3 + Composition API
- **UI庫**：Vuetify 3
- **狀態管理**：Vuex 4
- **路由**：Vue Router 4
- **HTTP客戶端**：Axios
- **構建工具**：Vite

**第三方整合**：
- **Google OAuth**：@google-cloud/oauth2 或 vue-google-oauth2
- **Google Analytics**：vue-gtag 或 @gtag/vue
- **推送通知**：Firebase Cloud Messaging (FCM)
- **圖片優化**：vue-lazyload 或 vue-progressive-image

**開發工具**：
- **代碼格式化**：ESLint + Prettier
- **CSS預處理**：Sass/SCSS
- **測試框架**：Jest + Vue Test Utils
- **部署**：Vercel、Netlify 或 Firebase Hosting

**後端資料處理**：
- **開發階段**：使用 Mock API 模擬後端資料
- **Mock 工具**：JSON Server 或 Mock Service Worker (MSW)
- **假資料產生**：Faker.js
- **API 結構預留**：預先設計 API 介面規格，方便後續整合真實後端

## 規劃討論總結

**重點摘要**：
- SPA + Vue3 + Vuetify 架構
- 現代簡約風格，溫暖色調配置
- 手機優先設計，底部固定導航
- Google OAuth 登入整合
- Mock API 開發階段資料模擬

**開發優先順序**：
1. 基礎架構建立 (Vue3 + Vuetify + Router + Vuex)
2. 主要頁面版型設計
3. Mock API 資料結構設計
4. 核心功能實作 (商品瀏覽、購物車、會員系統)
5. 進階功能與優化


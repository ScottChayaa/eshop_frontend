# 🚀 Development Guide - eshop_frontend

## 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```
應用程式將在 `http://localhost:3000` 上運行

### 建構專案
```bash
npm run build
```

### 預覽建構結果
```bash
npm run preview
```

## 📁 專案結構說明

```
src/main/vue/
├── components/          # 可重用組件
│   └── ProductCard.vue  # 商品卡片組件
├── views/              # 頁面組件
│   └── HomeView.vue    # 首頁
├── store/              # Vuex 狀態管理
│   ├── index.js        # Store 主檔案
│   └── modules/        # 模組化 store
│       ├── cart.js     # 購物車狀態
│       ├── user.js     # 用戶狀態
│       └── products.js # 商品狀態
├── router/             # Vue Router 路由
│   └── index.js        # 路由配置
├── services/           # API 服務層
│   └── api.js          # API 抽象層
├── utils/              # 工具函數
│   └── helpers.js      # 通用工具函數
├── App.vue            # 根組件
└── main.js            # 應用程式入口
```

## 🎨 設計系統

### 色彩主題
- **主色調**: #FAE6B1 (淺黃)
- **輔助色**: #FFA101 (橘黃)
- **輔助色**: #B3DEE5 (淺藍)
- **深色**: #31525B (深藍灰)

### 響應式設計
- 手機優先設計
- 使用 Vuetify 的響應式系統
- 手機版底部導航

## 🔧 開發要點

### 1. 組件開發
- 使用 Vue3 Composition API
- 遵循 Vue 最佳實踐
- 組件應該可重用且測試友好

### 2. 狀態管理
- 使用 Vuex 4 進行狀態管理
- 按功能模組化 (cart, user, products)
- 使用 localStorage 持久化重要狀態

### 3. API 整合
- 目前使用 Mock 資料
- API 服務層已準備好整合真實後端
- 支援認證 token 和錯誤處理

### 4. 路由管理
- 使用 Vue Router 4
- 路由守衛保護需要認證的頁面
- 自動設置頁面標題

## 📝 待完成的頁面

以下頁面已在路由中定義，但需要實作：

- `/category/:id` - 商品分類頁
- `/product/:id` - 商品詳情頁
- `/cart` - 購物車頁
- `/checkout` - 結帳頁
- `/login` - 登入頁
- `/register` - 註冊頁
- `/profile` - 會員中心
- `/orders` - 訂單查詢
- `/categories` - 所有分類
- `/promotions` - 促銷活動
- `/notifications` - 通知中心
- `/search` - 搜尋結果

## 🎯 下一步開發建議

1. **實作基礎頁面**: 從商品詳情頁和購物車頁開始
2. **完善用戶認證**: 整合 Google OAuth
3. **優化 UI/UX**: 加入載入動畫和錯誤處理
4. **SEO 優化**: 使用 Vue Meta 管理頁面 meta 資訊
5. **測試**: 加入單元測試和端到端測試

## 🚨 重要提醒

- 遵循 CLAUDE.md 中的開發規範
- 每完成一個功能就提交代碼
- 使用 Task agents 處理長時間操作
- 保持代碼整潔和可維護性
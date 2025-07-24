# 🚀 MSW API 完整指南

## 📋 概述

本專案已整合 Mock Service Worker (MSW)，提供完整的電商 API 模擬，包含登入、商品、購物車、訂單、通知等功能。

### ✅ 已整合功能
- **認證系統**：登入/註冊/登出/Token 刷新
- **商品管理**：商品列表/搜尋/分類/詳情
- **購物車系統**：加入/移除/更新/清空
- **訂單系統**：建立訂單/查看訂單
- **通知系統**：查看/標記已讀
- **使用者管理**：個人資料/更新資料

## 🎯 相較於 json-server 的優勢

| 特性 | MSW | json-server |
|------|-----|-------------|
| **整合度** | 完全整合前端 | 需要額外端口 |
| **網路模擬** | 真實 HTTP 攔截 | 真實伺服器 |
| **開發體驗** | 熱重載支援 | 需要重新啟動 |
| **錯誤模擬** | 完整錯誤情境 | 有限錯誤模擬 |
| **部署** | 隨前端打包 | 需要額外部署 |
| **資料持久化** | 記憶體 (可選檔案) | JSON 檔案 |

## 📊 資料結構

### 🔐 使用者資料
```javascript
{
  id: 1,
  email: "admin@example.com",
  name: "管理員",
  role: "admin",
  avatar: null,
  phone: "0912345678",
  address: "台北市大安區信義路四段1號"
}
```

### 🛍️ 商品資料 (完整結構)
```javascript
{
  id: 1,
  name: "iPhone 15 Pro",
  description: "詳細 HTML 描述",
  price: 36900,
  originalPrice: 39900,
  categoryId: 2,
  brand: "Apple",
  stock: 55,
  image: "主要圖片 URL",
  images: [/* 多張圖片 */],
  variants: [/* 商品變體 */],
  specifications: {/* 規格資訊 */},
  features: [/* 特色列表 */],
  reviewsList: [/* 評價列表 */],
  rating: 4.5,
  reviews: 128
}
```

### 🛒 購物車資料
```javascript
{
  id: 1,
  userId: 2,
  productId: 1,
  quantity: 1,
  product: {/* 完整商品資訊 */}
}
```

## 🔌 API 端點列表

### 🔐 認證相關
```
POST   /api/auth/login       # 使用者登入
POST   /api/auth/register    # 使用者註冊
POST   /api/auth/logout      # 使用者登出
POST   /api/auth/refresh     # Token 刷新
```

### 👤 使用者相關
```
GET    /api/user/profile     # 取得個人資料
PUT    /api/user/profile     # 更新個人資料
GET    /api/user/orders      # 取得使用者訂單
```

### 🛍️ 商品相關
```
GET    /api/products         # 取得商品列表 (支援分頁/篩選/排序)
GET    /api/products/:id     # 取得單一商品詳情
GET    /api/products/search  # 搜尋商品
```

### 📂 分類相關
```
GET    /api/categories       # 取得分類列表
GET    /api/categories/:slug # 取得單一分類
```

### 🛒 購物車相關
```
GET    /api/cart            # 取得購物車
POST   /api/cart            # 新增商品到購物車
PUT    /api/cart/:id        # 更新購物車項目
DELETE /api/cart/:id        # 移除購物車項目
DELETE /api/cart            # 清空購物車
```

### 📋 訂單相關
```
GET    /api/orders/:id      # 取得單一訂單
POST   /api/orders          # 建立訂單
```

### 🔔 通知相關
```
GET    /api/notifications           # 取得通知列表
PUT    /api/notifications/:id/read  # 標記通知為已讀
```

### 🚨 錯誤測試
```
GET    /api/error/500        # 模擬伺服器錯誤
GET    /api/error/timeout    # 模擬網路超時
GET    /api/error/unauthorized # 模擬未授權錯誤
```

## 🧪 測試用資料

### 測試帳號
| 角色 | Email | Password | 說明 |
|------|-------|----------|------|
| 管理員 | `admin@example.com` | `Admin123456` | 具有管理員權限 |
| 一般用戶 | `user@example.com` | `User123456` | 一般使用者 |
| 測試用戶 | `test@example.com` | `Test123456` | 測試專用帳號 |

### 測試商品
- **iPhone 15 Pro** (ID: 1) - 完整的商品資訊，包含變體、規格、評價
- **MacBook Pro 14"** (ID: 2) - 專業級筆電
- **AirPods Pro** (ID: 3) - 無線耳機
- **iPad Air** (ID: 4) - 平板電腦

## 🔄 CRUD 操作範例

### 登入流程
```javascript
// 1. 登入請求
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "Admin123456"
}

// 2. 成功響應
{
  "token": "mock-jwt-token-1-1234567890",
  "user": {...},
  "message": "登入成功"
}
```

### 購物車操作
```javascript
// 1. 加入商品
POST /api/cart
{
  "productId": 1,
  "quantity": 2
}

// 2. 查看購物車
GET /api/cart
// 回應包含商品詳細資訊

// 3. 更新數量
PUT /api/cart/1
{
  "quantity": 3
}

// 4. 移除商品
DELETE /api/cart/1
```

## 🛠️ 開發模式

### 啟動開發環境
```bash
npm run dev
```

### 檢查 MSW 狀態
在瀏覽器 Console 中應該看到：
```
🚀 Mock Service Worker started successfully
📡 API requests will be intercepted by MSW
```

### 除錯 API 請求
所有被 MSW 攔截的請求會顯示在 Console：
```
[MSW] POST /api/auth/login (200 OK)
[MSW] GET /api/products (200 OK)
```

## 🚀 生產環境

MSW 只在開發環境運行，生產環境會自動使用真實 API。

### 環境變數設定
```bash
# 開發環境 (.env.development)
VITE_ENABLE_MSW=true
VITE_APP_API_URL=/api

# 生產環境 (.env.production)
VITE_ENABLE_MSW=false
VITE_APP_API_URL=https://your-api-domain.com/api
```

## 📝 常見問題

### Q: 如何新增測試資料？
**A:** 直接修改 `src/mocks/db.json`，MSW 會自動載入。

### Q: 如何模擬網路錯誤？
**A:** 訪問 `/api/error/500` 等測試端點，或修改 handlers 中的延遲時間。

### Q: 資料變更會持久化嗎？
**A:** 目前資料存在記憶體中，重新整理會重置。如需持久化可擴展資料載入器。

### Q: 如何新增 API 端點？
**A:** 在 `src/mocks/handlers.js` 中新增對應的 `http.method()` handler。

## 🎯 下一步擴展

1. **資料持久化**：將變更寫回 JSON 檔案
2. **進階模擬**：隨機錯誤率、網路延遲變化
3. **管理介面**：動態管理測試資料
4. **測試工具**：自動化 API 測試

---

**🎉 現在您擁有完整的電商 API 模擬環境，無需依賴外部服務即可開發所有功能！**
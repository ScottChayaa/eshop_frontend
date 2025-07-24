# 無後端情況下的 Phase 3-1 測試策略分析

> **分析日期**: 2025-07-18  
> **問題**: 沒有後端 API 的情況下如何測試 Phase 3-1 功能？  
> **目標**: 制定完整的前端測試和驗證策略  
> 
> **✅ 更新**: 此策略已完整實施，MSW 已整合並取代 json-server，提供完整電商 API 模擬環境

## 🚨 **測試挑戰分析**

### ❌ **無法直接測試的項目**
1. **真實 API 調用** - 沒有後端伺服器
2. **Token 驗證** - 無法驗證 JWT 有效性
3. **資料持久化** - 無法測試真實資料儲存
4. **跨域請求** - 無法測試 CORS 配置
5. **伺服器錯誤處理** - 無法測試 5xx 錯誤情境

### ✅ **可以測試的項目**
1. **前端邏輯** - 狀態管理、組件行為
2. **UI 互動** - 使用者介面操作
3. **路由功能** - 頁面導航、守衛機制
4. **資料格式** - 請求/響應格式驗證
5. **錯誤處理** - 前端錯誤處理邏輯

## 🎯 **測試策略設計**

### 1️⃣ **Mock API 策略**

#### **使用 MSW (Mock Service Worker)**
```javascript
// src/mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  // 登入 API
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body
    
    if (email === 'test@example.com' && password === 'Test123456') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-jwt-token',
          user: { id: 1, email, name: 'Test User' }
        })
      )
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: '帳號或密碼錯誤' })
    )
  }),
  
  // 登出 API
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  
  // 使用者資料 API
  rest.get('/api/user/profile', (req, res, ctx) => {
    const token = req.headers.get('Authorization')
    
    if (!token) {
      return res(ctx.status(401))
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatar: null
      })
    )
  }),
  
  // 商品列表 API
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          { id: 1, name: '測試商品1', price: 100 },
          { id: 2, name: '測試商品2', price: 200 }
        ],
        total: 2,
        page: 1
      })
    )
  })
]
```

#### **靜態 JSON 檔案 Mock**
```javascript
// src/mocks/data/users.json
{
  "test@example.com": {
    "id": 1,
    "email": "test@example.com",
    "name": "測試使用者",
    "password": "Test123456"
  }
}

// src/mocks/data/products.json
{
  "products": [
    {
      "id": 1,
      "name": "iPhone 15",
      "price": 29900,
      "category": "electronics",
      "image": "/images/iphone15.jpg"
    }
  ]
}
```

### 2️⃣ **本地 Mock Server 策略**

#### **使用 JSON Server**
```bash
# 安裝 JSON Server
npm install -g json-server

# 建立 mock 資料檔案
# db.json
{
  "users": [
    {
      "id": 1,
      "email": "test@example.com",
      "name": "測試使用者",
      "password": "Test123456"
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "測試商品",
      "price": 100,
      "category": "electronics"
    }
  ],
  "orders": []
}

# 啟動 mock server
json-server --watch db.json --port 8080
```

## 📋 **Phase 3-1 測試項目清單**

### 🔐 **認證系統測試**

#### **AuthService 測試**
```javascript
// 測試項目
✅ login() - 正確帳密登入成功
✅ login() - 錯誤帳密登入失敗  
✅ logout() - 登出清除 token
✅ getCurrentUser() - 取得當前使用者
✅ refreshToken() - token 刷新機制
✅ isAuthenticated() - 驗證登入狀態

// 測試方法
describe('AuthService', () => {
  test('should login successfully with correct credentials', async () => {
    const result = await authService.login('test@example.com', 'Test123456')
    expect(result.token).toBeTruthy()
    expect(result.user.email).toBe('test@example.com')
  })
  
  test('should throw error with invalid credentials', async () => {
    await expect(authService.login('wrong@email.com', 'wrong'))
      .rejects.toThrow('帳號或密碼錯誤')
  })
})
```

#### **路由守衛測試**
```javascript
// 測試項目
✅ authGuard - 未登入重導向到登入頁
✅ authGuard - 已登入允許進入保護頁面
✅ guestGuard - 已登入重導向到首頁
✅ guestGuard - 未登入允許進入登入頁

// 測試方法
describe('Route Guards', () => {
  test('should redirect to login when not authenticated', () => {
    const next = jest.fn()
    authGuard({ meta: { requiresAuth: true } }, {}, next)
    expect(next).toHaveBeenCalledWith('/user/login')
  })
})
```

### 🏪 **Vuex Store 測試**

#### **Auth Module 測試**
```javascript
// 測試項目
✅ SET_USER mutation - 正確設定使用者資料
✅ SET_TOKEN mutation - 正確設定 token
✅ LOGOUT mutation - 清空認證狀態
✅ login action - 整合登入流程
✅ logout action - 整合登出流程
✅ isAuthenticated getter - 正確回傳認證狀態

// 測試方法
describe('Auth Store Module', () => {
  test('should set user data correctly', () => {
    const state = { user: null }
    mutations.SET_USER(state, { id: 1, email: 'test@example.com' })
    expect(state.user.email).toBe('test@example.com')
  })
})
```

#### **UI Module 測試**
```javascript
// 測試項目
✅ SET_LOADING mutation - 設定載入狀態
✅ ADD_NOTIFICATION mutation - 新增通知
✅ REMOVE_NOTIFICATION mutation - 移除通知
✅ showNotification action - 顯示通知
✅ clearNotifications action - 清空通知

// 測試方法
describe('UI Store Module', () => {
  test('should toggle loading state', () => {
    const state = { loading: false }
    mutations.SET_LOADING(state, true)
    expect(state.loading).toBe(true)
  })
})
```

### 🔌 **API 服務層測試**

#### **ProductService 測試**
```javascript
// 測試項目
✅ getProducts() - 取得商品列表
✅ getProduct(id) - 取得單一商品
✅ searchProducts(query) - 搜尋商品
✅ 錯誤處理 - API 失敗處理

// 測試方法
describe('ProductService', () => {
  test('should fetch products list', async () => {
    const products = await productService.getProducts()
    expect(products.data).toBeInstanceOf(Array)
    expect(products.data.length).toBeGreaterThan(0)
  })
})
```

#### **UserService 測試**
```javascript
// 測試項目
✅ getProfile() - 取得使用者資料
✅ updateProfile(data) - 更新使用者資料
✅ getOrders() - 取得訂單列表
✅ 認證錯誤處理 - 401 錯誤處理

// 測試方法
describe('UserService', () => {
  test('should fetch user profile', async () => {
    const profile = await userService.getProfile()
    expect(profile.email).toBeTruthy()
  })
})
```

### 🎨 **Layout 組件測試**

#### **AppHeader 測試**
```javascript
// 測試項目
✅ 未登入顯示登入按鈕
✅ 已登入顯示使用者選單
✅ 登出功能正常運作
✅ 響應式選單切換

// 測試方法
describe('AppHeader', () => {
  test('should show login button when not authenticated', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.find('[data-testid="login-button"]').exists()).toBe(true)
  })
})
```

#### **AppFooter 測試**
```javascript
// 測試項目
✅ 顯示版權資訊
✅ 連結導航正常
✅ 響應式顯示

// 測試方法
describe('AppFooter', () => {
  test('should display copyright information', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.text()).toContain('2025')
  })
})
```

## 🛠️ **測試工具和設定**

### **1. 單元測試 - Vitest**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js']
  }
})

// src/test/setup.js
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '../mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### **2. 組件測試 - Vue Test Utils**
```javascript
// src/test/test-utils.js
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import vuetify from '../plugins/vuetify'

export function createWrapper(component, options = {}) {
  return mount(component, {
    global: {
      plugins: [
        createTestingPinia(),
        vuetify
      ]
    },
    ...options
  })
}
```

### **3. E2E 測試 - Cypress**
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  it('should login successfully', () => {
    cy.visit('/user/login')
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('Test123456')
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/')
    cy.get('[data-testid="user-menu"]').should('be.visible')
  })
})
```

## 📝 **測試執行步驟**

### **Phase 1: 設定測試環境**
```bash
# 1. 安裝測試相關套件
npm install -D vitest @vue/test-utils jsdom msw

# 2. 設定 MSW
npx msw init public/ --save

# 3. 建立測試檔案結構
mkdir -p src/test src/mocks src/mocks/data

# 4. 設定測試指令
# package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### **Phase 2: 建立 Mock 資料**
```bash
# 1. 建立 MSW handlers
# 2. 準備測試資料
# 3. 設定 mock server
# 4. 測試 mock API 連線
```

### **Phase 3: 執行測試**
```bash
# 1. 單元測試
npm run test

# 2. 覆蓋率測試
npm run test:coverage

# 3. 互動式測試
npm run test:ui

# 4. E2E 測試
npm run cypress:run
```

## ✅ **驗證檢查清單**

### **🔐 認證功能驗證**
- [ ] 登入表單驗證正確
- [ ] 正確帳密登入成功
- [ ] 錯誤帳密顯示錯誤訊息
- [ ] 登入後 token 正確儲存
- [ ] 登入後重導向到首頁
- [ ] 登出清除認證狀態
- [ ] 路由守衛正確攔截

### **🏪 狀態管理驗證**
- [ ] Vuex store 正確載入
- [ ] Auth module 狀態正確
- [ ] UI module 載入狀態正確
- [ ] Actions 和 mutations 正常運作
- [ ] Getters 回傳正確值

### **🔌 API 服務驗證**
- [ ] API 請求格式正確
- [ ] 錯誤處理機制正常
- [ ] Token 自動附加
- [ ] 超時處理正確
- [ ] 重試機制運作

### **🎨 組件功能驗證**
- [ ] Header 組件正確顯示
- [ ] Footer 組件正確顯示
- [ ] 響應式設計正常
- [ ] 使用者互動正常
- [ ] 路由導航正確

### **📱 使用者體驗驗證**
- [ ] 載入狀態顯示
- [ ] 錯誤訊息友善
- [ ] 成功訊息顯示
- [ ] 頁面切換流暢
- [ ] 行動裝置適配

## 🎯 **驗證策略總結**

### **短期目標 (1-2 週)**
1. 建立 Mock API 和測試環境
2. 完成核心功能單元測試
3. 驗證認證流程完整性

### **中期目標 (3-4 週)**
1. 完成所有組件測試
2. 建立 E2E 測試套件
3. 達到 80% 測試覆蓋率

### **長期目標 (持續)**
1. 建立 CI/CD 測試流程
2. 效能測試和優化
3. 使用者體驗測試

透過這套完整的測試策略，即使沒有後端 API，也能充分驗證 Phase 3-1 的所有功能實作！
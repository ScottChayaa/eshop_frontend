# 🔐 完整電商功能測試指南 (MSW 版本)

## 🚀 快速開始

### 1. 啟動開發環境
```bash
npm run dev
```

啟動後，Console 會顯示：
- `🚀 Mock Service Worker started successfully`
- `📡 API requests will be intercepted by MSW`

### 2. 測試帳號
使用以下預設帳號進行測試：

| 角色 | Email | Password | 說明 |
|------|-------|----------|------|
| 管理員 | `admin@example.com` | `Admin123456` | 具有管理員權限 |
| 一般用戶 | `user@example.com` | `User123456` | 一般使用者 |
| 測試用戶 | `test@example.com` | `Test123456` | 測試專用帳號 |

## 🧪 測試流程

### Step 1: 前往登入頁面
- 在瀏覽器中訪問 `http://localhost:3000/login`
- 或點擊網站上的「登入」按鈕

### Step 2: 輸入測試帳號
1. 在「電子郵件」欄位輸入測試帳號
2. 在「密碼」欄位輸入對應密碼
3. 點擊「登入」按鈕

### Step 3: 驗證登入結果
**成功登入後應該會看到：**
- ✅ 頁面自動跳轉到首頁或指定頁面
- ✅ Header 顯示使用者名稱/頭像
- ✅ 成功通知訊息：「登入成功！歡迎回來」
- ✅ Console 顯示 MSW 攔截的 API 請求

## 🔍 功能驗證檢查清單

### ✅ 登入功能
- [ ] 成功登入後獲得 JWT Token
- [ ] Token 正確儲存到 localStorage
- [ ] 使用者資料存入 Vuex store
- [ ] 頁面狀態正確更新（顯示已登入狀態）
- [ ] Console 無錯誤訊息

### ✅ 錯誤處理
- [ ] 輸入錯誤帳密顯示「帳號或密碼錯誤」
- [ ] 網路模擬錯誤正確處理
- [ ] 表單驗證正常運作

### ✅ 登出功能
- [ ] 點擊登出按鈕
- [ ] localStorage 清除 token 和 user 資料
- [ ] Vuex store 狀態重置
- [ ] 跳轉到登入頁面

### ✅ 受保護路由
- [ ] 未登入時無法訪問需要認證的頁面
- [ ] 登入後可正常訪問所有頁面

## 🛠️ 開發者工具檢查

### Chrome DevTools - Network Tab
```
✅ 應該看到 MSW 攔截的請求：
POST /api/auth/login (Status: 200)
回應包含：{ token, user, message }
```

### Chrome DevTools - Application Tab
```
✅ localStorage 應該包含：
- token: mock-jwt-token-{userId}-{timestamp}
- user: {"id":1,"email":"admin@example.com","name":"管理員",...}
```

### Chrome DevTools - Console
```
✅ 應該看到以下日誌：
🚀 Mock Service Worker started successfully
📡 API requests will be intercepted by MSW
🔐 Authentication status checked
[MSW] POST /api/auth/login (200 OK)
```

## 🐛 常見問題排解

### Q: MSW 沒有啟動
**A:** 檢查 Console 是否有錯誤，確保 `public/mockServiceWorker.js` 檔案存在

### Q: 登入請求失敗
**A:** 
1. 檢查 Network tab 是否有 API 請求
2. 確認 baseURL 設定為 `/api`
3. 檢查 MSW handlers 是否正確設定

### Q: Token 沒有儲存
**A:** 檢查 authService.login() 方法是否正確呼叫 localStorage.setItem

### Q: 頁面沒有跳轉
**A:** 檢查 LoginView.vue 中的路由跳轉邏輯

## 🎯 進階測試

### 測試特殊帳號
```javascript
// 測試被封鎖的帳號
Email: blocked@example.com
// 應該顯示「帳號已被封鎖」錯誤
```

### 測試 Token 刷新
```javascript
// 在 Console 中執行
await store.dispatch('auth/refreshToken')
// 檢查是否獲得新的 token
```

### 測試自動登入
```javascript
// 重新整理頁面
// 檢查是否自動從 localStorage 恢復登入狀態
```

## 📝 開發注意事項

1. **MSW 僅在開發環境啟用**：生產環境會使用真實 API
2. **Token 格式**：`mock-jwt-token-{userId}-{timestamp}`
3. **API 延遲**：MSW 模擬 300-800ms 的網路延遲
4. **錯誤模擬**：支援各種錯誤情況測試

---

**🎉 如果所有測試都通過，表示登入功能整合成功！**
# 🔍 認證問題調試指南

## 📋 問題描述
使用 `user@example.com / User123456` 登入後，瀏覽基本資料頁面時：
- API 請求: `http://localhost:3000/api/user/profile`
- Bearer Token: `"mock-jwt-token-2-1753972900697"`
- 結果: 401 Unauthorized
- 行為: 被導向登入頁面

## 🛠️ 調試步驟

### 1. 打開瀏覽器開發者工具
- 按 F12 或右鍵 → 檢查元素
- 切換到 **Console** 標籤

### 2. 清除快取並重新載入
```bash
# 按 Ctrl+Shift+R 強制重新載入
# 或在 Network 標籤中勾選 "Disable cache"
```

### 3. 執行登入流程
1. 訪問 `http://localhost:3000/login`
2. 輸入：
   - Email: `user@example.com`
   - Password: `User123456`
3. 點擊登入

### 4. 檢查控制台輸出
登入成功後，應該看到：
```
🚀 Mock Service Worker started successfully
📡 API requests will be intercepted by MSW
✅ verifyToken: User found {userId: 2, userName: "陳小美"}
```

### 5. 訪問基本資料頁面
1. 點擊右上角頭像 → 基本資料
2. 或直接訪問 `http://localhost:3000/profile`

### 6. 查看調試信息
如果出現 401 錯誤，控制台會顯示：

**成功情況：**
```
✅ verifyToken: User found {userId: 2, userName: "陳小美"}
```

**失敗情況：**
```
❌ verifyToken: Invalid token format {token: "Bearer ..."}
❌ verifyToken: User not found {userId: 2, tokenParts: [...], availableUserIds: [...]}
❌ verifyToken: Token does not match pattern {tokenValue: "..."}
🔴 Profile API 401 Error: {message: "請先登入", debug: {...}}
🔴 API 401 Unauthorized: {url: "/api/user/profile", method: "get", headers: {...}}
```

## 🔧 可能的問題和解決方案

### 問題 1: MSW 未正確啟動
**症狀：** 控制台沒有顯示 MSW 啟動訊息
**解決：** 檢查 `src/mocks/browser.js` 和 `public/mockServiceWorker.js`

### 問題 2: Token 格式錯誤
**症狀：** `❌ verifyToken: Invalid token format`
**解決：** 檢查 localStorage 中的 `auth_token` 值

### 問題 3: 用戶數據未找到
**症狀：** `❌ verifyToken: User not found`
**解決：** 檢查 `src/mocks/data/db.json` 中的用戶數據

### 問題 4: Token 解析錯誤
**症狀：** `❌ verifyToken: Token does not match pattern`
**解決：** 檢查 token 生成邏輯

## 📊 手動測試步驟

### 在控制台中執行：
```javascript
// 檢查認證狀態
console.log('Token:', localStorage.getItem('auth_token'))
console.log('User:', localStorage.getItem('user_info'))
console.log('Store auth state:', window.__VUE_STORE__.state.auth)

// 手動測試 API 調用
fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
}).then(res => res.json()).then(console.log).catch(console.error)
```

## 🎯 預期結果
修正後應該看到：
1. ✅ MSW 正確啟動
2. ✅ 登入成功且 token 儲存
3. ✅ Profile API 返回用戶資料
4. ✅ 頭像正確顯示 (DiceBear API)
5. ✅ 無 401 錯誤和異常重定向

## 📞 回報問題
如果問題仍然存在，請提供：
1. 瀏覽器控制台的完整輸出
2. Network 標籤中的 API 請求詳情
3. localStorage 中的認證資料
4. 任何錯誤訊息的截圖
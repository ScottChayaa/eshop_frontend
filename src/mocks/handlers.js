/**
 * MSW API Handlers
 * @description Mock Service Worker API handlers using complete data from db.json
 */

import { http, HttpResponse } from 'msw'
import mockData, { users, products, orders, categories, cart, notifications, dataHelpers } from './data/index.js'

// Working arrays for CRUD operations (mutable copies)
let workingUsers = [...users]
let workingProducts = [...products]
let workingOrders = [...orders]
let workingCart = [...cart]
let workingNotifications = [...notifications]

// Debug: 檢查數據初始化
console.log('🚀 MSW Handlers 初始化')
console.log('📊 初始 workingUsers:', workingUsers.length, workingUsers.map(u => ({ id: u.id, email: u.email, name: u.name })))
console.log('📦 初始 workingProducts:', workingProducts.length)
console.log('📋 初始 workingOrders:', workingOrders.length)

// Utility functions
function generateToken(user) {
  const token = `mock-jwt-token-${user.id}-${Date.now()}`
  console.log('🔑 generateToken:', { userId: user.id, userName: user.name, token })
  return token
}

function verifyToken(token) {
  if (!token || !token.startsWith('Bearer ')) {
    console.warn('❌ verifyToken: Invalid token format', { token })
    return null
  }
  
  const tokenValue = token.replace('Bearer ', '')
  
  if (tokenValue.startsWith('mock-jwt-token-')) {
    const tokenParts = tokenValue.split('-')
    const userId = parseInt(tokenParts[3])
    const user = workingUsers.find(user => user.id === userId)
    
    if (!user) {
      console.warn('❌ verifyToken: User not found', { 
        userId, 
        tokenParts, 
        availableUserIds: workingUsers.map(u => u.id) 
      })
    } else {
      console.log('✅ verifyToken: User found', { userId, userName: user.name })
    }
    
    return user
  }
  
  console.warn('❌ verifyToken: Token does not match pattern', { tokenValue })
  return null
}

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function safeUser(user) {
  const { password, ...safeUserData } = user
  return safeUserData
}

export const handlers = [
  // ==================== 認證相關 API ====================
  
  // 使用者登入
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    
    const { email, password } = await request.json()
    console.log('🔐 Login attempt:', { email, password })
    console.log('📊 workingUsers:', workingUsers.map(u => ({ id: u.id, email: u.email, name: u.name })))
    
    const user = workingUsers.find(u => u.email === email && u.password === password)
    console.log('👤 Found user:', user ? { id: user.id, name: user.name, email: user.email } : null)
    
    if (!user) {
      return HttpResponse.json(
        { message: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }
    
    if (email === 'blocked@example.com') {
      return HttpResponse.json(
        { message: '帳號已被封鎖' },
        { status: 403 }
      )
    }
    
    const token = generateToken(user)
    
    return HttpResponse.json({
      token,
      user: safeUser(user),
      message: '登入成功'
    })
  }),
  
  // 使用者登出
  http.post('/api/auth/logout', async () => {
    await delay(200)
    return HttpResponse.json({ message: '登出成功' })
  }),
  
  // Token 刷新
  http.post('/api/auth/refresh', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: 'Token 無效' },
        { status: 401 }
      )
    }
    
    const newToken = generateToken(user)
    return HttpResponse.json({ token: newToken })
  }),
  
  // 使用者註冊
  http.post('/api/auth/register', async ({ request }) => {
    await delay(600)
    
    const { email, password, name } = await request.json()
    
    const existingUser = workingUsers.find(u => u.email === email)
    if (existingUser) {
      return HttpResponse.json(
        { message: '此 Email 已被使用' },
        { status: 400 }
      )
    }
    
    const newUser = {
      id: dataHelpers.generateId(workingUsers),
      email,
      password,
      name,
      role: 'user',
      avatar: null,
      phone: null,
      address: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    workingUsers.push(newUser)
    
    const token = generateToken(newUser)
    
    return HttpResponse.json({
      token,
      user: safeUser(newUser),
      message: '註冊成功'
    })
  }),
  
  // ==================== 使用者相關 API ====================
  
  // 取得使用者資料
  http.get('/api/user/profile', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      // 詳細的錯誤信息用於調試
      const debugInfo = {
        message: '請先登入',
        debug: {
          hasAuthHeader: !!authorization,
          authHeader: authorization,
          workingUsersCount: workingUsers.length,
          userIds: workingUsers.map(u => u.id)
        }
      }
      console.error('🔴 Profile API 401 Error:', debugInfo)
      
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json(safeUser(user))
  }),
  
  // 更新使用者資料
  http.put('/api/user/profile', async ({ request }) => {
    await delay(400)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const updatedData = await request.json()
    
    const userIndex = workingUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      workingUsers[userIndex] = { 
        ...workingUsers[userIndex], 
        ...updatedData,
        updatedAt: new Date().toISOString()
      }
      
      return HttpResponse.json(safeUser(workingUsers[userIndex]))
    }
    
    return HttpResponse.json(
      { message: '使用者不存在' },
      { status: 404 }
    )
  }),
  
  // ==================== 商品相關 API ====================
  
  // 取得商品列表
  http.get('/api/products', async ({ request }) => {
    await delay(400)
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    
    let filteredProducts = [...workingProducts]
    
    // 分類篩選
    if (category) {
      filteredProducts = dataHelpers.findProductsByCategory(category)
    }
    
    // 搜尋篩選
    if (search) {
      filteredProducts = dataHelpers.searchProducts(search)
    }
    
    // 排序
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }
    
    // 分頁
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    })
  }),
  
  // 取得單一商品
  http.get('/api/products/:id', async ({ params }) => {
    await delay(200)
    
    const product = dataHelpers.findProductById(params.id)
    
    if (!product) {
      return HttpResponse.json(
        { message: '商品不存在' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(product)
  }),
  
  // 搜尋商品
  http.get('/api/products/search', async ({ request }) => {
    await delay(300)
    
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query) {
      return HttpResponse.json({ data: [], total: 0 })
    }
    
    const results = dataHelpers.searchProducts(query)
    
    return HttpResponse.json({
      data: results,
      total: results.length,
      query
    })
  }),
  
  // ==================== 分類相關 API ====================
  
  // 取得分類列表
  http.get('/api/categories', async () => {
    await delay(200)
    return HttpResponse.json(categories)
  }),
  
  // 取得單一分類
  http.get('/api/categories/:slug', async ({ params }) => {
    await delay(200)
    
    const category = dataHelpers.findCategoryBySlug(params.slug)
    
    if (!category) {
      return HttpResponse.json(
        { message: '分類不存在' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(category)
  }),
  
  // ==================== 購物車相關 API ====================
  
  // 取得購物車
  http.get('/api/cart', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const userCart = dataHelpers.findCartByUserId(user.id)
    
    // 加上商品詳細資訊
    const cartWithProducts = userCart.map(item => {
      const product = dataHelpers.findProductById(item.productId)
      return {
        ...item,
        product: product || null
      }
    })
    
    return HttpResponse.json(cartWithProducts)
  }),
  
  // 新增商品到購物車
  http.post('/api/cart', async ({ request }) => {
    await delay(400)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const { productId, quantity = 1 } = await request.json()
    
    // 檢查商品是否存在
    const product = dataHelpers.findProductById(productId)
    if (!product) {
      return HttpResponse.json(
        { message: '商品不存在' },
        { status: 404 }
      )
    }
    
    // 檢查是否已在購物車中
    const existingItem = dataHelpers.findCartItem(user.id, productId)
    
    if (existingItem) {
      // 更新數量
      const itemIndex = workingCart.findIndex(item => 
        item.userId === user.id && item.productId === parseInt(productId)
      )
      workingCart[itemIndex].quantity += quantity
      workingCart[itemIndex].updatedAt = new Date().toISOString()
      
      return HttpResponse.json({
        ...workingCart[itemIndex],
        product
      })
    } else {
      // 新增項目
      const newItem = {
        id: dataHelpers.generateId(workingCart),
        userId: user.id,
        productId: parseInt(productId),
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      workingCart.push(newItem)
      
      return HttpResponse.json({
        ...newItem,
        product
      }, { status: 201 })
    }
  }),
  
  // 更新購物車項目
  http.put('/api/cart/:id', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const { quantity } = await request.json()
    const itemId = parseInt(params.id)
    
    const itemIndex = workingCart.findIndex(item => 
      item.id === itemId && item.userId === user.id
    )
    
    if (itemIndex === -1) {
      return HttpResponse.json(
        { message: '購物車項目不存在' },
        { status: 404 }
      )
    }
    
    if (quantity <= 0) {
      // 移除項目
      workingCart.splice(itemIndex, 1)
      return HttpResponse.json({ message: '項目已移除' })
    } else {
      // 更新數量
      workingCart[itemIndex].quantity = quantity
      workingCart[itemIndex].updatedAt = new Date().toISOString()
      
      const product = dataHelpers.findProductById(workingCart[itemIndex].productId)
      
      return HttpResponse.json({
        ...workingCart[itemIndex],
        product
      })
    }
  }),
  
  // 移除購物車項目
  http.delete('/api/cart/:id', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const itemId = parseInt(params.id)
    const itemIndex = workingCart.findIndex(item => 
      item.id === itemId && item.userId === user.id
    )
    
    if (itemIndex === -1) {
      return HttpResponse.json(
        { message: '購物車項目不存在' },
        { status: 404 }
      )
    }
    
    workingCart.splice(itemIndex, 1)
    return HttpResponse.json({ message: '項目已移除' })
  }),
  
  // 清空購物車
  http.delete('/api/cart', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    workingCart = workingCart.filter(item => item.userId !== user.id)
    return HttpResponse.json({ message: '購物車已清空' })
  }),
  
  // ==================== 訂單相關 API ====================
  
  // 取得使用者訂單（支援分頁和篩選）
  http.get('/api/user/orders', async ({ request }) => {
    await delay(400)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page')) || 1
    const limit = parseInt(url.searchParams.get('limit')) || 10
    const status = url.searchParams.get('status')
    const keyword = url.searchParams.get('keyword')
    const dateRange = url.searchParams.get('dateRange')
    
    let userOrders = dataHelpers.findOrdersByUserId(user.id)
    
    // 狀態篩選
    if (status && status !== 'all') {
      userOrders = userOrders.filter(order => order.status === status)
    }
    
    // 關鍵字搜尋（訂單號、商品名稱）
    if (keyword) {
      const searchTerm = keyword.toLowerCase()
      userOrders = userOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
      )
    }
    
    // 日期範圍篩選
    if (dateRange) {
      const now = new Date()
      let startDate
      
      switch (dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = null
      }
      
      if (startDate) {
        userOrders = userOrders.filter(order => 
          new Date(order.createdAt) >= startDate
        )
      }
    }
    
    // 排序（最新的在前）
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // 分頁處理
    const totalItems = userOrders.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = userOrders.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      data: paginatedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  }),

  // 取得單一訂單詳情
  http.get('/api/orders/:orderId', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const order = dataHelpers.findOrderById(params.orderId)
    
    if (!order) {
      return HttpResponse.json(
        { message: '訂單不存在' },
        { status: 404 }
      )
    }
    
    // 檢查訂單是否屬於當前用戶
    if (order.userId !== user.id) {
      return HttpResponse.json(
        { message: '無權限查看此訂單' },
        { status: 403 }
      )
    }
    
    return HttpResponse.json(order)
  }),

  // 取消訂單
  http.post('/api/orders/:orderId/cancel', async ({ params, request }) => {
    await delay(500)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const { reason } = await request.json()
    const order = dataHelpers.findOrderById(params.orderId)
    
    if (!order) {
      return HttpResponse.json(
        { message: '訂單不存在' },
        { status: 404 }
      )
    }
    
    if (order.userId !== user.id) {
      return HttpResponse.json(
        { message: '無權限操作此訂單' },
        { status: 403 }
      )
    }
    
    if (!['pending', 'paid'].includes(order.status)) {
      return HttpResponse.json(
        { message: '此訂單狀態無法取消' },
        { status: 400 }
      )
    }
    
    // 模擬更新訂單狀態
    order.status = 'cancelled'
    order.paymentStatus = 'cancelled'
    order.updatedAt = new Date().toISOString()
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      description: reason || '客戶取消訂單'
    })
    
    return HttpResponse.json({
      message: '訂單已成功取消',
      order
    })
  }),

  // 確認收貨
  http.post('/api/orders/:orderId/confirm-delivery', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const order = dataHelpers.findOrderById(params.orderId)
    
    if (!order) {
      return HttpResponse.json(
        { message: '訂單不存在' },
        { status: 404 }
      )
    }
    
    if (order.userId !== user.id) {
      return HttpResponse.json(
        { message: '無權限操作此訂單' },
        { status: 403 }
      )
    }
    
    if (order.status !== 'shipped') {
      return HttpResponse.json(
        { message: '此訂單狀態無法確認收貨' },
        { status: 400 }
      )
    }
    
    // 模擬更新訂單狀態
    order.status = 'delivered'
    order.updatedAt = new Date().toISOString()
    order.statusHistory.push({
      status: 'delivered',
      timestamp: new Date().toISOString(),
      description: '客戶確認收貨'
    })
    
    return HttpResponse.json({
      message: '已確認收貨',
      order
    })
  }),

  // 重新下單
  http.post('/api/orders/:orderId/reorder', async ({ params, request }) => {
    await delay(400)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const order = dataHelpers.findOrderById(params.orderId)
    
    if (!order) {
      return HttpResponse.json(
        { message: '訂單不存在' },
        { status: 404 }
      )
    }
    
    if (order.userId !== user.id) {
      return HttpResponse.json(
        { message: '無權限操作此訂單' },
        { status: 403 }
      )
    }
    
    // 模擬將商品添加到購物車
    return HttpResponse.json({
      message: '商品已添加到購物車',
      cartItems: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    })
  }),

  // 獲取訂單統計
  http.get('/api/user/orders/stats', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const userOrders = dataHelpers.findOrdersByUserId(user.id)
    
    const stats = {
      total: userOrders.length,
      pending: userOrders.filter(o => o.status === 'pending').length,
      processing: userOrders.filter(o => o.status === 'processing').length,
      shipped: userOrders.filter(o => o.status === 'shipped').length,
      delivered: userOrders.filter(o => o.status === 'delivered').length,
      cancelled: userOrders.filter(o => o.status === 'cancelled').length,
      returned: userOrders.filter(o => o.status === 'returned').length,
      totalAmount: userOrders.reduce((sum, order) => sum + order.total, 0)
    }
    
    return HttpResponse.json(stats)
  }),
  
  // 建立訂單
  http.post('/api/orders', async ({ request }) => {
    await delay(800)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const orderData = await request.json()
    
    const newOrder = {
      id: dataHelpers.generateId(workingOrders),
      userId: user.id,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    workingOrders.push(newOrder)
    
    return HttpResponse.json(newOrder, { status: 201 })
  }),
  
  // 取得單一訂單
  http.get('/api/orders/:id', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const order = dataHelpers.findOrderById(params.id)
    
    if (!order || order.userId !== user.id) {
      return HttpResponse.json(
        { message: '訂單不存在' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(order)
  }),
  
  // ==================== 通知相關 API ====================
  
  // 取得使用者通知
  http.get('/api/notifications', async ({ request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const userNotifications = dataHelpers.findNotificationsByUserId(user.id)
    return HttpResponse.json(userNotifications)
  }),
  
  // 標記通知為已讀
  http.put('/api/notifications/:id/read', async ({ params, request }) => {
    await delay(300)
    
    const authorization = request.headers.get('Authorization')
    const user = verifyToken(authorization)
    
    if (!user) {
      return HttpResponse.json(
        { message: '請先登入' },
        { status: 401 }
      )
    }
    
    const notificationId = parseInt(params.id)
    const notificationIndex = workingNotifications.findIndex(notification => 
      notification.id === notificationId && notification.userId === user.id
    )
    
    if (notificationIndex === -1) {
      return HttpResponse.json(
        { message: '通知不存在' },
        { status: 404 }
      )
    }
    
    workingNotifications[notificationIndex].read = true
    workingNotifications[notificationIndex].updatedAt = new Date().toISOString()
    
    return HttpResponse.json(workingNotifications[notificationIndex])
  }),
  
  // ==================== 錯誤處理測試 ====================
  
  // 模擬伺服器錯誤
  http.get('/api/error/500', async () => {
    await delay(100)
    return HttpResponse.json(
      { message: '伺服器內部錯誤' },
      { status: 500 }
    )
  }),
  
  // 模擬網路超時
  http.get('/api/error/timeout', async () => {
    await delay(30000)
    return HttpResponse.json({ message: '回應' })
  }),
  
  // 模擬未授權存取
  http.get('/api/error/unauthorized', async () => {
    await delay(100)
    return HttpResponse.json(
      { message: '未授權存取' },
      { status: 401 }
    )
  })
]
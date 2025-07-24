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

// Utility functions
function generateToken(user) {
  return `mock-jwt-token-${user.id}-${Date.now()}`
}

function verifyToken(token) {
  if (!token || !token.startsWith('Bearer ')) {
    return null
  }
  
  const tokenValue = token.replace('Bearer ', '')
  
  if (tokenValue.startsWith('mock-jwt-token-')) {
    const userId = parseInt(tokenValue.split('-')[3])
    return workingUsers.find(user => user.id === userId)
  }
  
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
    
    const user = workingUsers.find(u => u.email === email && u.password === password)
    
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
  
  // 取得使用者訂單
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
    
    const userOrders = dataHelpers.findOrdersByUserId(user.id)
    return HttpResponse.json(userOrders)
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
/**
 * MSW API Handlers
 * @description Mock Service Worker 的 API 處理器，模擬後端 API 響應
 */

import { http, HttpResponse } from 'msw'

// 模擬使用者資料
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'Admin123456',
    name: '管理員',
    role: 'admin',
    avatar: null,
    phone: '0912345678',
    address: '台北市大安區信義路四段1號'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'User123456',
    name: '一般使用者',
    role: 'user',
    avatar: null,
    phone: '0987654321',
    address: '台北市信義區市府路1號'
  },
  {
    id: 3,
    email: 'test@example.com',
    password: 'Test123456',
    name: '測試使用者',
    role: 'user',
    avatar: null,
    phone: '0911222333',
    address: '台北市中正區重慶南路一段122號'
  }
]

// 模擬商品資料
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '最新款 iPhone 15 Pro，配備 A17 Pro 晶片',
    price: 36900,
    category: 'electronics',
    stock: 50,
    image: '/images/iphone15pro.jpg',
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    description: '搭載 M2 晶片的 MacBook Air',
    price: 37900,
    category: 'electronics',
    stock: 30,
    image: '/images/macbook-air-m2.jpg',
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'AirPods Pro (第 2 代)',
    description: '主動式降噪無線耳機',
    price: 7490,
    category: 'electronics',
    stock: 100,
    image: '/images/airpods-pro-2.jpg',
    rating: 4.7,
    reviewCount: 234
  }
]

// 模擬分類資料
const categories = [
  { id: 1, name: '電子產品', slug: 'electronics' },
  { id: 2, name: '服飾配件', slug: 'clothing' },
  { id: 3, name: '書籍文具', slug: 'books' },
  { id: 4, name: '居家生活', slug: 'home' },
  { id: 5, name: '運動休閒', slug: 'sports' }
]

// 工具函數：生成 JWT Token
function generateToken(user) {
  return `mock-jwt-token-${user.id}-${Date.now()}`
}

// 工具函數：驗證 Token
function verifyToken(token) {
  if (!token || !token.startsWith('Bearer ')) {
    return null
  }
  
  const tokenValue = token.replace('Bearer ', '')
  
  // 簡單的 token 驗證 (實際情況會更複雜)
  if (tokenValue.startsWith('mock-jwt-token-')) {
    const userId = parseInt(tokenValue.split('-')[3])
    return users.find(user => user.id === userId)
  }
  
  return null
}

// 工具函數：延遲響應 (模擬網路延遲)
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const handlers = [
  // ==================== 認證相關 API ====================
  
  // 使用者登入
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500) // 模擬網路延遲
    
    const { email, password } = await request.json()
    
    // 驗證使用者
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return HttpResponse.json(
        { message: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }
    
    // 模擬特殊情況
    if (email === 'blocked@example.com') {
      return HttpResponse.json(
        { message: '帳號已被封鎖' },
        { status: 403 }
      )
    }
    
    // 成功登入
    const token = generateToken(user)
    const { password: _, ...userWithoutPassword } = user
    
    return HttpResponse.json({
      token,
      user: userWithoutPassword,
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
    
    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json(userWithoutPassword)
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
    
    // 模擬更新使用者資料
    const updatedUser = { ...user, ...updatedData }
    const userIndex = users.findIndex(u => u.id === user.id)
    users[userIndex] = updatedUser
    
    const { password: _, ...userWithoutPassword } = updatedUser
    return HttpResponse.json(userWithoutPassword)
  }),
  
  // 使用者註冊
  http.post('/api/auth/register', async ({ request }) => {
    await delay(600)
    
    const { email, password, name } = await request.json()
    
    // 檢查 email 是否已存在
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return HttpResponse.json(
        { message: '此 Email 已被使用' },
        { status: 400 }
      )
    }
    
    // 建立新使用者
    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      role: 'user',
      avatar: null,
      phone: null,
      address: null,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    
    const token = generateToken(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    
    return HttpResponse.json({
      token,
      user: userWithoutPassword,
      message: '註冊成功'
    })
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
    
    let filteredProducts = [...products]
    
    // 分類篩選
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }
    
    // 搜尋篩選
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
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
    
    const id = parseInt(params.id)
    const product = products.find(p => p.id === id)
    
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
    
    const results = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
    
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
    
    const category = categories.find(c => c.slug === params.slug)
    
    if (!category) {
      return HttpResponse.json(
        { message: '分類不存在' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json(category)
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
    
    // 模擬訂單資料
    const userOrders = [
      {
        id: 1,
        userId: user.id,
        items: [
          { productId: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
        ],
        total: 36900,
        status: 'pending',
        createdAt: '2024-01-10T10:30:00.000Z'
      }
    ]
    
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
    
    // 模擬建立訂單
    const newOrder = {
      id: Date.now(),
      userId: user.id,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    return HttpResponse.json(newOrder, { status: 201 })
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
    await delay(30000) // 30秒超時
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
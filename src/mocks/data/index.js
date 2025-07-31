/**
 * Mock Data Loader
 * @description Load and transform data from db.json for MSW handlers
 */

import mockData from './db.json'

// Debug: 檢查 JSON 數據導入
console.log('📊 MockData imported:', {
  users: mockData.users?.length || 0,
  products: mockData.products?.length || 0,
  orders: mockData.orders?.length || 0,
  hasUsers: !!mockData.users,
  firstUser: mockData.users?.[0],
  userEmails: mockData.users?.map(u => u.email)
})

// Export data directly from db.json
export const users = mockData.users || []
export const products = mockData.products || []
export const orders = mockData.orders || []
export const categories = mockData.categories || []
export const cart = mockData.cart || []
export const notifications = mockData.notifications || []

// Debug: 檢查導出的數據
console.log('📤 Exported users:', users.length, users.map(u => ({ id: u.id, email: u.email, name: u.name })))

// Helper functions for data manipulation
export const dataHelpers = {
  // User helpers
  findUserById: (id) => users.find(user => user.id === parseInt(id)),
  findUserByEmail: (email) => users.find(user => user.email === email),
  
  // Product helpers
  findProductById: (id) => products.find(product => product.id === parseInt(id)),
  findProductsByCategory: (categoryId) => 
    products.filter(product => product.categoryId === parseInt(categoryId)),
  searchProducts: (query) => 
    products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    ),
  
  // Category helpers
  findCategoryById: (id) => categories.find(category => category.id === parseInt(id)),
  findCategoryBySlug: (slug) => categories.find(category => category.slug === slug),
  
  // Cart helpers
  findCartByUserId: (userId) => cart.filter(item => item.userId === parseInt(userId)),
  findCartItem: (userId, productId) => 
    cart.find(item => item.userId === parseInt(userId) && item.productId === parseInt(productId)),
  
  // Order helpers
  findOrdersByUserId: (userId) => orders.filter(order => order.userId === parseInt(userId)),
  findOrderById: (id) => orders.find(order => order.id === parseInt(id)),
  
  // Notification helpers
  findNotificationsByUserId: (userId) => 
    notifications.filter(notification => notification.userId === parseInt(userId)),
  
  // Utility functions
  generateId: (array) => Math.max(...array.map(item => item.id), 0) + 1,
  formatPrice: (price) => new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(price)
}

// Data transformation for MSW compatibility
export const transformedData = {
  // Ensure products have proper structure for MSW
  products: products.map(product => ({
    ...product,
    categoryId: product.categoryId || 2, // Default to electronics
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    stock: product.stock || 0,
    image: product.image || '/images/placeholder.jpg',
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString()
  })),
  
  // Ensure categories have proper structure
  categories: categories.map(category => ({
    ...category,
    slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
  })),
  
  // Ensure users have proper structure (without passwords in responses)
  safeUsers: users.map(user => {
    const { password, ...safeUser } = user
    return safeUser
  })
}

export default {
  users,
  products,
  orders,
  categories,
  cart,
  notifications,
  helpers: dataHelpers,
  transformed: transformedData
}
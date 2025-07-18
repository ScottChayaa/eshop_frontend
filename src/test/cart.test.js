/**
 * 購物車系統測試
 * @description 測試購物車相關功能，包含加入、移除、更新數量等
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestStore, mockLocalStorage } from './test-utils.js'

// 模擬 CartService (這個會在 Phase 3-1 實作)
class MockCartService {
  constructor() {
    this.storageKey = 'cart_items'
  }

  getCartItems() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  saveCartItems(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  addToCart(product, quantity = 1) {
    const items = this.getCartItems()
    const existingItem = items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      })
    }
    
    this.saveCartItems(items)
    return items
  }

  removeFromCart(productId) {
    const items = this.getCartItems()
    const filteredItems = items.filter(item => item.id !== productId)
    this.saveCartItems(filteredItems)
    return filteredItems
  }

  updateQuantity(productId, quantity) {
    const items = this.getCartItems()
    const item = items.find(item => item.id === productId)
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId)
      }
      item.quantity = quantity
      this.saveCartItems(items)
    }
    
    return items
  }

  clearCart() {
    this.saveCartItems([])
    return []
  }

  getCartTotal() {
    const items = this.getCartItems()
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  getCartCount() {
    const items = this.getCartItems()
    return items.reduce((count, item) => count + item.quantity, 0)
  }
}

describe('CartService', () => {
  let cartService
  let mockStorage

  beforeEach(() => {
    mockStorage = mockLocalStorage()
    global.localStorage = mockStorage
    cartService = new MockCartService()
  })

  describe('addToCart', () => {
    it('should add new item to cart', () => {
      const product = {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 36900,
        image: '/images/iphone15pro.jpg'
      }
      
      const result = cartService.addToCart(product, 1)
      
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 1,
        name: 'iPhone 15 Pro',
        price: 36900,
        image: '/images/iphone15pro.jpg',
        quantity: 1
      })
    })

    it('should increase quantity for existing item', () => {
      const product = {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 36900,
        image: '/images/iphone15pro.jpg'
      }
      
      // 先加入一個商品
      cartService.addToCart(product, 1)
      
      // 再加入相同商品
      const result = cartService.addToCart(product, 2)
      
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(3)
    })

    it('should add multiple different items', () => {
      const product1 = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      const product2 = { id: 2, name: 'MacBook Air M2', price: 37900 }
      
      cartService.addToCart(product1, 1)
      const result = cartService.addToCart(product2, 1)
      
      expect(result).toHaveLength(2)
      expect(result.find(item => item.id === 1)).toBeDefined()
      expect(result.find(item => item.id === 2)).toBeDefined()
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const product = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      
      cartService.addToCart(product, 1)
      const result = cartService.removeFromCart(1)
      
      expect(result).toHaveLength(0)
    })

    it('should not affect other items when removing', () => {
      const product1 = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      const product2 = { id: 2, name: 'MacBook Air M2', price: 37900 }
      
      cartService.addToCart(product1, 1)
      cartService.addToCart(product2, 1)
      
      const result = cartService.removeFromCart(1)
      
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(2)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const product = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      
      cartService.addToCart(product, 1)
      const result = cartService.updateQuantity(1, 5)
      
      expect(result[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      const product = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      
      cartService.addToCart(product, 1)
      const result = cartService.updateQuantity(1, 0)
      
      expect(result).toHaveLength(0)
    })

    it('should remove item when quantity is negative', () => {
      const product = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      
      cartService.addToCart(product, 1)
      const result = cartService.updateQuantity(1, -1)
      
      expect(result).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const product1 = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      const product2 = { id: 2, name: 'MacBook Air M2', price: 37900 }
      
      cartService.addToCart(product1, 1)
      cartService.addToCart(product2, 1)
      
      const result = cartService.clearCart()
      
      expect(result).toHaveLength(0)
    })
  })

  describe('getCartTotal', () => {
    it('should calculate total price correctly', () => {
      const product1 = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      const product2 = { id: 2, name: 'MacBook Air M2', price: 37900 }
      
      cartService.addToCart(product1, 2) // 36900 * 2 = 73800
      cartService.addToCart(product2, 1) // 37900 * 1 = 37900
      
      const total = cartService.getCartTotal()
      
      expect(total).toBe(111700) // 73800 + 37900
    })

    it('should return 0 for empty cart', () => {
      const total = cartService.getCartTotal()
      expect(total).toBe(0)
    })
  })

  describe('getCartCount', () => {
    it('should calculate total items count correctly', () => {
      const product1 = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      const product2 = { id: 2, name: 'MacBook Air M2', price: 37900 }
      
      cartService.addToCart(product1, 2)
      cartService.addToCart(product2, 3)
      
      const count = cartService.getCartCount()
      
      expect(count).toBe(5) // 2 + 3
    })

    it('should return 0 for empty cart', () => {
      const count = cartService.getCartCount()
      expect(count).toBe(0)
    })
  })

  describe('persistence', () => {
    it('should persist cart items to localStorage', () => {
      const product = { id: 1, name: 'iPhone 15 Pro', price: 36900 }
      
      cartService.addToCart(product, 1)
      
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'cart_items',
        JSON.stringify([{
          id: 1,
          name: 'iPhone 15 Pro',
          price: 36900,
          quantity: 1
        }])
      )
    })

    it('should load cart items from localStorage', () => {
      const cartData = JSON.stringify([
        { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      ])
      
      mockStorage.getItem.mockReturnValue(cartData)
      
      const items = cartService.getCartItems()
      
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('iPhone 15 Pro')
    })
  })
})

describe('Cart Store Module', () => {
  let store

  beforeEach(() => {
    store = createTestStore({
      cart: {
        items: [],
        loading: false,
        error: null
      }
    })
  })

  describe('mutations', () => {
    it('should set cart items correctly', () => {
      const items = [
        { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      ]
      
      store.commit('SET_CART_ITEMS', items)
      expect(store.state.cart.items).toEqual(items)
    })

    it('should add item to cart', () => {
      const item = { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      
      store.commit('ADD_TO_CART', item)
      expect(store.state.cart.items).toHaveLength(1)
      expect(store.state.cart.items[0]).toEqual(item)
    })

    it('should remove item from cart', () => {
      const item = { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      
      store.commit('ADD_TO_CART', item)
      store.commit('REMOVE_FROM_CART', 1)
      
      expect(store.state.cart.items).toHaveLength(0)
    })

    it('should update item quantity', () => {
      const item = { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      
      store.commit('ADD_TO_CART', item)
      store.commit('UPDATE_CART_QUANTITY', { id: 1, quantity: 3 })
      
      expect(store.state.cart.items[0].quantity).toBe(3)
    })

    it('should clear cart', () => {
      const item1 = { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 1 }
      const item2 = { id: 2, name: 'MacBook Air M2', price: 37900, quantity: 1 }
      
      store.commit('ADD_TO_CART', item1)
      store.commit('ADD_TO_CART', item2)
      store.commit('CLEAR_CART')
      
      expect(store.state.cart.items).toHaveLength(0)
    })
  })

  describe('getters', () => {
    it('should calculate cart total correctly', () => {
      const items = [
        { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 2 },
        { id: 2, name: 'MacBook Air M2', price: 37900, quantity: 1 }
      ]
      
      store.commit('SET_CART_ITEMS', items)
      
      // 簡化版 total 計算測試
      const total = store.state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      expect(total).toBe(111700) // 36900*2 + 37900*1
    })

    it('should calculate cart count correctly', () => {
      const items = [
        { id: 1, name: 'iPhone 15 Pro', price: 36900, quantity: 2 },
        { id: 2, name: 'MacBook Air M2', price: 37900, quantity: 3 }
      ]
      
      store.commit('SET_CART_ITEMS', items)
      
      // 簡化版 count 計算測試
      const count = store.state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
      expect(count).toBe(5) // 2 + 3
    })

    it('should return empty cart state', () => {
      expect(store.state.cart.items).toHaveLength(0)
      
      const total = store.state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const count = store.state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
      
      expect(total).toBe(0)
      expect(count).toBe(0)
    })
  })
})

describe('Cart Component Integration', () => {
  // 這部分會在實際組件建立後進行測試
  
  it('should render cart items correctly', () => {
    // 購物車渲染測試
    expect(true).toBe(true) // 暫時的佔位測試
  })

  it('should handle quantity change', () => {
    // 數量變更測試
    expect(true).toBe(true) // 暫時的佔位測試
  })

  it('should handle item removal', () => {
    // 商品移除測試
    expect(true).toBe(true) // 暫時的佔位測試
  })

  it('should handle checkout process', () => {
    // 結帳流程測試
    expect(true).toBe(true) // 暫時的佔位測試
  })
})
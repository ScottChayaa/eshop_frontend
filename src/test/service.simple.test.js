/**
 * 簡化服務層測試
 * @description 基礎服務層功能測試
 */

import { describe, it, expect } from 'vitest'

describe('服務層基礎測試', () => {
  it('應該能夠匯入 ProductService', async () => {
    const { ProductService } = await import('../main/vue/services/product.js')
    expect(ProductService).toBeDefined()
    expect(typeof ProductService).toBe('function')
  })

  it('應該能夠匯入 UserService', async () => {
    const { UserService } = await import('../main/vue/services/user.js')
    expect(UserService).toBeDefined()
    expect(typeof UserService).toBe('function')
  })

  it('應該能夠建立 ProductService 實例', async () => {
    const { ProductService } = await import('../main/vue/services/product.js')
    const productService = new ProductService()
    
    expect(productService).toBeDefined()
    expect(typeof productService.getProducts).toBe('function')
    expect(typeof productService.getProduct).toBe('function')
    expect(typeof productService.searchProducts).toBe('function')
  })

  it('應該能夠建立 UserService 實例', async () => {
    const { UserService } = await import('../main/vue/services/user.js')
    const userService = new UserService()
    
    expect(userService).toBeDefined()
    expect(typeof userService.getProfile).toBe('function')
    expect(typeof userService.updateProfile).toBe('function')
    expect(typeof userService.getOrders).toBe('function')
  })

  it('ProductService 應該有正確的驗證方法', async () => {
    const { ProductService } = await import('../main/vue/services/product.js')
    const productService = new ProductService()
    
    expect(typeof productService.handleError).toBe('function')
  })

  it('UserService 應該有正確的驗證方法', async () => {
    const { UserService } = await import('../main/vue/services/user.js')
    const userService = new UserService()
    
    expect(typeof userService.validateProfileData).toBe('function')
    expect(typeof userService.validatePasswordData).toBe('function')
    expect(typeof userService.isValidEmail).toBe('function')
    expect(typeof userService.isValidPhone).toBe('function')
    expect(typeof userService.isStrongPassword).toBe('function')
  })

  describe('UserService 驗證功能', () => {
    let userService

    beforeEach(async () => {
      const { UserService } = await import('../main/vue/services/user.js')
      userService = new UserService()
    })

    it('應該正確驗證電子郵件格式', () => {
      expect(userService.isValidEmail('test@example.com')).toBe(true)
      expect(userService.isValidEmail('invalid-email')).toBe(false)
    })

    it('應該正確驗證手機號碼格式', () => {
      expect(userService.isValidPhone('0912345678')).toBe(true)
      expect(userService.isValidPhone('123456789')).toBe(false)
    })

    it('應該正確檢查密碼強度', () => {
      expect(userService.isStrongPassword('Password123')).toBe(true)
      expect(userService.isStrongPassword('password123')).toBe(false)
    })

    it('應該正確驗證個人資料', () => {
      expect(() => {
        userService.validateProfileData({
          name: 'Test User',
          email: 'test@example.com',
          phone: '0912345678'
        })
      }).not.toThrow()

      expect(() => {
        userService.validateProfileData({
          name: 'A',
          email: 'invalid-email'
        })
      }).toThrow()
    })
  })
})
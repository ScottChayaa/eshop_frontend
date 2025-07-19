/**
 * 整合測試
 * @description 端到端流程測試，驗證服務層與 API 的整合
 */

import { describe, it, expect, beforeEach } from 'vitest'
import productService from '../main/vue/services/product.js'
import userService from '../main/vue/services/user.js'

describe('服務層整合測試', () => {
  describe('ProductService 整合', () => {
    it('應該能夠獲取商品列表', async () => {
      const result = await productService.getProducts()
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.data)).toBe(true)
      
      if (result.data.length > 0) {
        const product = result.data[0]
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('price')
      }
    }, 10000)

    it('應該能夠根據分類篩選商品', async () => {
      const result = await productService.getProductsByCategory('electronics')
      
      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
    }, 10000)

    it('應該能夠搜尋商品', async () => {
      const result = await productService.searchProducts('iPhone')
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('query', 'iPhone')
      expect(Array.isArray(result.data)).toBe(true)
    }, 10000)

    it('應該能夠獲取商品分類', async () => {
      const categories = await productService.getCategories()
      
      expect(Array.isArray(categories)).toBe(true)
      
      if (categories.length > 0) {
        const category = categories[0]
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
      }
    }, 10000)

    it('應該能夠獲取推薦商品', async () => {
      // 先獲取一個商品
      const products = await productService.getProducts()
      if (products.data.length > 0) {
        const productId = products.data[0].id
        const recommendations = await productService.getRecommendedProducts(productId)
        
        expect(Array.isArray(recommendations)).toBe(true)
      }
    }, 10000)
  })

  describe('UserService 整合', () => {
    it('應該正確處理未授權的請求', async () => {
      // 清除 localStorage 中的 token
      localStorage.clear()
      
      try {
        await userService.getProfile()
        // 如果沒有拋出錯誤，測試失敗
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('請先登入')
      }
    }, 10000)

    it('應該能夠驗證個人資料資料', async () => {
      try {
        await userService.updateProfile({
          name: 'A', // 太短的名字
          email: 'invalid-email', // 無效的電子郵件
          phone: '123' // 無效的電話號碼
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    }, 10000)

    it('應該能夠驗證密碼資料', async () => {
      try {
        await userService.changePassword({
          currentPassword: '',
          newPassword: '123', // 太短的密碼
          confirmPassword: '456' // 不匹配的確認密碼
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    }, 10000)

    it('應該能夠驗證地址資料', async () => {
      try {
        await userService.addAddress({
          name: 'A', // 太短的名字
          phone: '123', // 無效的電話號碼
          address: 'AB' // 太短的地址
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    }, 10000)

    it('應該能夠驗證頭像檔案', async () => {
      try {
        // 創建一個無效的檔案
        const invalidFile = new File([''], 'test.txt', { type: 'text/plain' })
        await userService.uploadAvatar(invalidFile)
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('只能上傳')
      }
    }, 10000)
  })

  describe('錯誤處理測試', () => {
    it('ProductService 應該正確處理網路錯誤', async () => {
      // 模擬網路錯誤 - 使用無效的商品 ID
      try {
        await productService.getProduct(99999)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.details).toBeDefined()
      }
    }, 10000)

    it('UserService 應該正確處理驗證錯誤', async () => {
      // 測試各種驗證情況
      const testCases = [
        { name: '', email: 'test@example.com' }, // 空名字
        { name: 'Test', email: 'invalid-email' }, // 無效電子郵件
        { name: 'Test', email: 'test@example.com', phone: '123' } // 無效電話
      ]

      for (const testCase of testCases) {
        try {
          userService.validateProfileData(testCase)
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
        }
      }
    }, 10000)
  })

  describe('資料驗證測試', () => {
    it('應該正確驗證電子郵件格式', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ]

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com'
      ]

      validEmails.forEach(email => {
        expect(userService.isValidEmail(email)).toBe(true)
      })

      invalidEmails.forEach(email => {
        expect(userService.isValidEmail(email)).toBe(false)
      })
    })

    it('應該正確驗證台灣手機號碼格式', () => {
      const validPhones = [
        '0912345678',
        '0987654321',
        '0923456789'
      ]

      const invalidPhones = [
        '12345678',
        '091234567',
        '09123456789',
        '0812345678'
      ]

      validPhones.forEach(phone => {
        expect(userService.isValidPhone(phone)).toBe(true)
      })

      invalidPhones.forEach(phone => {
        expect(userService.isValidPhone(phone)).toBe(false)
      })
    })

    it('應該正確檢查密碼強度', () => {
      const strongPasswords = [
        'Password123',
        'MyStr0ngP@ss',
        'Test123456'
      ]

      const weakPasswords = [
        'password123', // 沒有大寫
        'PASSWORD123', // 沒有小寫
        'PasswordABC', // 沒有數字
        '12345678' // 沒有字母
      ]

      strongPasswords.forEach(password => {
        expect(userService.isStrongPassword(password)).toBe(true)
      })

      weakPasswords.forEach(password => {
        expect(userService.isStrongPassword(password)).toBe(false)
      })
    })
  })

  describe('API 錯誤狀態碼處理', () => {
    it('應該正確處理不同的 HTTP 錯誤狀態碼', () => {
      const testCases = [
        { status: 404, expectedMessage: '商品不存在' },
        { status: 400, expectedMessage: '請求參數錯誤' },
        { status: 500, expectedMessage: '伺服器錯誤，請稍後再試' },
        { status: 503, expectedMessage: '服務暫時不可用' }
      ]

      testCases.forEach(({ status, expectedMessage }) => {
        const mockError = {
          response: { status, statusText: 'Error' },
          message: 'Network Error'
        }

        const handledError = productService.handleError(mockError, '原始訊息')
        expect(handledError.message).toBe(expectedMessage)
        expect(handledError.details.status).toBe(status)
      })
    })

    it('應該正確處理使用者相關的 HTTP 錯誤狀態碼', () => {
      const testCases = [
        { status: 401, expectedMessage: '請先登入' },
        { status: 403, expectedMessage: '沒有權限執行此操作' },
        { status: 404, expectedMessage: '資料不存在' },
        { status: 422, expectedMessage: '資料格式錯誤' }
      ]

      testCases.forEach(({ status, expectedMessage }) => {
        const mockError = {
          response: { status, statusText: 'Error' },
          message: 'Network Error'
        }

        const handledError = userService.handleError(mockError, '原始訊息')
        expect(handledError.message).toBe(expectedMessage)
        expect(handledError.details.status).toBe(status)
      })
    })
  })
})
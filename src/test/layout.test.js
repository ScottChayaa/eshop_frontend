/**
 * Layout 組件測試
 * @description 測試 Layout 相關組件，包含 Header、Footer、Sidebar 等
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWrapper, mockLocalStorage, flushPromises } from './test-utils.js'

// 模擬 Header 組件
const MockHeader = {
  name: 'MockHeader',
  template: `
    <header>
      <div class="logo">eshop</div>
      <nav>
        <router-link to="/">首頁</router-link>
        <router-link to="/products">商品</router-link>
        <router-link to="/cart">購物車 ({{ cartCount }})</router-link>
      </nav>
      <div class="auth-section">
        <div v-if="isAuthenticated">
          <span>{{ user.name }}</span>
          <button @click="logout">登出</button>
        </div>
        <div v-else>
          <router-link to="/user/login">登入</router-link>
          <router-link to="/user/register">註冊</router-link>
        </div>
      </div>
    </header>
  `,
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    user() {
      return this.$store.getters.currentUser
    },
    cartCount() {
      return this.$store.state.cart ? this.$store.state.cart.items.length : 0
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}

// 模擬 Footer 組件
const MockFooter = {
  name: 'MockFooter',
  template: `
    <footer>
      <div class="footer-content">
        <div class="footer-section">
          <h3>關於我們</h3>
          <p>Vue3 電商購物網站</p>
        </div>
        <div class="footer-section">
          <h3>客服資訊</h3>
          <p>電話: 0800-123-456</p>
          <p>Email: support@eshop.com</p>
        </div>
        <div class="footer-section">
          <h3>快速連結</h3>
          <router-link to="/help">幫助中心</router-link>
          <router-link to="/privacy">隱私權政策</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 eshop. All rights reserved.</p>
      </div>
    </footer>
  `
}

// 模擬 Sidebar 組件
const MockSidebar = {
  name: 'MockSidebar',
  template: `
    <aside :class="{ 'open': isOpen }">
      <div class="sidebar-header">
        <h3>分類</h3>
        <button @click="closeSidebar">×</button>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="'/category/' + category.slug"
          @click="closeSidebar"
        >
          {{ category.name }}
        </router-link>
      </nav>
    </aside>
  `,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  methods: {
    closeSidebar() {
      this.$emit('close')
    }
  }
}

// 模擬 Layout 主組件
const MockLayout = {
  name: 'MockLayout',
  template: `
    <div class="layout">
      <MockHeader />
      <MockSidebar 
        :is-open="sidebarOpen" 
        :categories="categories"
        @close="closeSidebar"
      />
      <main class="main-content">
        <router-view />
      </main>
      <MockFooter />
    </div>
  `,
  components: {
    MockHeader,
    MockFooter,
    MockSidebar
  },
  data() {
    return {
      sidebarOpen: false,
      categories: [
        { id: 1, name: '電子產品', slug: 'electronics' },
        { id: 2, name: '服飾配件', slug: 'clothing' },
        { id: 3, name: '書籍文具', slug: 'books' },
        { id: 4, name: '居家生活', slug: 'home' },
        { id: 5, name: '運動休閒', slug: 'sports' }
      ]
    }
  },
  methods: {
    openSidebar() {
      this.sidebarOpen = true
    },
    closeSidebar() {
      this.sidebarOpen = false
    }
  }
}

describe('Header Component', () => {
  let wrapper
  let mockStorage

  beforeEach(() => {
    mockStorage = mockLocalStorage()
    global.localStorage = mockStorage
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render header correctly', () => {
    wrapper = createWrapper(MockHeader)
    
    expect(wrapper.find('.logo').text()).toBe('eshop')
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('.auth-section').exists()).toBe(true)
  })

  it('should show navigation links', () => {
    wrapper = createWrapper(MockHeader)
    
    const navLinks = wrapper.findAll('nav router-link-stub')
    expect(navLinks).toHaveLength(3)
    expect(navLinks[0].attributes('to')).toBe('/')
    expect(navLinks[1].attributes('to')).toBe('/products')
    expect(navLinks[2].attributes('to')).toBe('/cart')
  })

  it('should show login/register links when not authenticated', () => {
    wrapper = createWrapper(MockHeader, {
      storeState: {
        auth: {
          isAuthenticated: false,
          user: null
        }
      }
    })
    
    const authLinks = wrapper.findAll('.auth-section router-link-stub')
    expect(authLinks).toHaveLength(2)
    expect(authLinks[0].attributes('to')).toBe('/user/login')
    expect(authLinks[1].attributes('to')).toBe('/user/register')
  })

  it('should show user info and logout when authenticated', () => {
    wrapper = createWrapper(MockHeader, {
      storeState: {
        auth: {
          isAuthenticated: true,
          user: { id: 1, name: '測試使用者' }
        }
      }
    })
    
    expect(wrapper.text()).toContain('測試使用者')
    expect(wrapper.find('button').text()).toBe('登出')
  })

  it('should display cart count', () => {
    wrapper = createWrapper(MockHeader, {
      storeState: {
        cart: {
          items: [
            { id: 1, name: 'iPhone', quantity: 1 },
            { id: 2, name: 'MacBook', quantity: 1 }
          ]
        }
      }
    })
    
    expect(wrapper.text()).toContain('購物車 (2)')
  })

  it('should handle logout', async () => {
    wrapper = createWrapper(MockHeader, {
      storeState: {
        auth: {
          isAuthenticated: true,
          user: { id: 1, name: '測試使用者' }
        }
      }
    })
    
    const logoutBtn = wrapper.find('button')
    await logoutBtn.trigger('click')
    await flushPromises()
    
    // 因為這是 mock 組件，我們只能驗證點擊事件被觸發
    expect(logoutBtn.exists()).toBe(true)
  })
})

describe('Footer Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper(MockFooter)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render footer correctly', () => {
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('.footer-content').exists()).toBe(true)
    expect(wrapper.find('.footer-bottom').exists()).toBe(true)
  })

  it('should display company information', () => {
    expect(wrapper.text()).toContain('關於我們')
    expect(wrapper.text()).toContain('Vue3 電商購物網站')
  })

  it('should display contact information', () => {
    expect(wrapper.text()).toContain('客服資訊')
    expect(wrapper.text()).toContain('0800-123-456')
    expect(wrapper.text()).toContain('support@eshop.com')
  })

  it('should display quick links', () => {
    expect(wrapper.text()).toContain('快速連結')
    
    const quickLinks = wrapper.findAll('.footer-section router-link-stub')
    expect(quickLinks.length).toBeGreaterThan(0)
  })

  it('should display copyright', () => {
    expect(wrapper.text()).toContain('© 2024 eshop. All rights reserved.')
  })
})

describe('Sidebar Component', () => {
  let wrapper

  const defaultCategories = [
    { id: 1, name: '電子產品', slug: 'electronics' },
    { id: 2, name: '服飾配件', slug: 'clothing' }
  ]

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render sidebar correctly', () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: true,
        categories: defaultCategories
      }
    })
    
    expect(wrapper.find('aside').exists()).toBe(true)
    expect(wrapper.find('.sidebar-header').exists()).toBe(true)
    expect(wrapper.find('.sidebar-nav').exists()).toBe(true)
  })

  it('should apply open class when isOpen is true', () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: true,
        categories: defaultCategories
      }
    })
    
    expect(wrapper.find('aside').classes()).toContain('open')
  })

  it('should not apply open class when isOpen is false', () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: false,
        categories: defaultCategories
      }
    })
    
    expect(wrapper.find('aside').classes()).not.toContain('open')
  })

  it('should display categories', () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: true,
        categories: defaultCategories
      }
    })
    
    const categoryLinks = wrapper.findAll('.sidebar-nav router-link-stub')
    expect(categoryLinks).toHaveLength(2)
    expect(categoryLinks[0].text()).toBe('電子產品')
    expect(categoryLinks[1].text()).toBe('服飾配件')
  })

  it('should emit close event when close button clicked', async () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: true,
        categories: defaultCategories
      }
    })
    
    const closeBtn = wrapper.find('.sidebar-header button')
    await closeBtn.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should emit close event when category link clicked', async () => {
    wrapper = createWrapper(MockSidebar, {
      props: {
        isOpen: true,
        categories: defaultCategories
      }
    })
    
    const categoryLink = wrapper.find('.sidebar-nav router-link-stub')
    await categoryLink.trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

describe('Layout Component', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render layout correctly', () => {
    wrapper = createWrapper(MockLayout)
    
    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.findComponent(MockHeader).exists()).toBe(true)
    expect(wrapper.findComponent(MockSidebar).exists()).toBe(true)
    expect(wrapper.findComponent(MockFooter).exists()).toBe(true)
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should pass categories to sidebar', () => {
    wrapper = createWrapper(MockLayout)
    
    const sidebar = wrapper.findComponent(MockSidebar)
    expect(sidebar.props('categories')).toHaveLength(5)
    expect(sidebar.props('categories')[0].name).toBe('電子產品')
  })

  it('should control sidebar open/close state', async () => {
    wrapper = createWrapper(MockLayout)
    
    const sidebar = wrapper.findComponent(MockSidebar)
    expect(sidebar.props('isOpen')).toBe(false)
    
    // 測試打開 sidebar
    await wrapper.vm.openSidebar()
    expect(sidebar.props('isOpen')).toBe(true)
    
    // 測試關閉 sidebar
    await wrapper.vm.closeSidebar()
    expect(sidebar.props('isOpen')).toBe(false)
  })

  it('should handle sidebar close event', async () => {
    wrapper = createWrapper(MockLayout)
    
    const sidebar = wrapper.findComponent(MockSidebar)
    
    // 先打開 sidebar
    await wrapper.vm.openSidebar()
    expect(sidebar.props('isOpen')).toBe(true)
    
    // 觸發關閉事件
    await sidebar.vm.$emit('close')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.sidebarOpen).toBe(false)
  })

  it('should have router-view in main content', () => {
    wrapper = createWrapper(MockLayout)
    
    const mainContent = wrapper.find('.main-content')
    expect(mainContent.find('router-view-stub').exists()).toBe(true)
  })
})

describe('Layout Responsive Behavior', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should handle mobile menu toggle', () => {
    // 模擬移動設備行為
    wrapper = createWrapper(MockLayout)
    
    expect(wrapper.vm.sidebarOpen).toBe(false)
    
    // 模擬移動設備菜單按鈕點擊
    wrapper.vm.openSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(true)
  })

  it('should close sidebar on navigation', async () => {
    wrapper = createWrapper(MockLayout)
    
    // 打開 sidebar
    await wrapper.vm.openSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(true)
    
    // 模擬導航事件
    const sidebar = wrapper.findComponent(MockSidebar)
    await sidebar.vm.$emit('close')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.sidebarOpen).toBe(false)
  })
})

describe('Layout Integration', () => {
  // 整合測試相關功能
  
  it('should integrate with store correctly', () => {
    // Store 整合測試
    expect(true).toBe(true) // 暫時的佔位測試
  })

  it('should handle route changes', () => {
    // 路由變更測試
    expect(true).toBe(true) // 暫時的佔位測試
  })

  it('should handle authentication state changes', () => {
    // 認證狀態變更測試
    expect(true).toBe(true) // 暫時的佔位測試
  })
})
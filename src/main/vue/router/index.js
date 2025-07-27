import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '首頁 - eshop_frontend'
    }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('../views/home/CategoryView.vue'),
    meta: {
      title: '商品分類 - eshop_frontend'
    }
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import('../views/product/ProductView.vue'),
    meta: {
      title: '商品詳情 - eshop_frontend'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/CartView.vue'),
    meta: {
      title: '購物車 - eshop_frontend'
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/cart/CheckoutView.vue'),
    meta: {
      title: '結帳 - eshop_frontend',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/LoginView.vue'),
    meta: {
      title: '登入 - eshop_frontend',
      guest: true
    }
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/user/RegisterView.vue'),
    meta: {
      title: '註冊 - eshop_frontend'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/user/ForgotPasswordView.vue'),
    meta: {
      title: '忘記密碼 - eshop_frontend'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/ProfileView.vue'),
    meta: {
      title: '會員中心 - eshop_frontend',
      requiresAuth: true
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/user/OrdersView.vue'),
    meta: {
      title: '訂單查詢 - eshop_frontend',
      requiresAuth: true
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/home/CategoriesView.vue'),
    meta: {
      title: '所有分類 - eshop_frontend'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/home/NewsView.vue'),
    meta: {
      title: '最新消息 - eshop_frontend'
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('../views/home/NewsDetailView.vue'),
    meta: {
      title: '最新消息詳情 - eshop_frontend'
    }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/user/NotificationsView.vue'),
    meta: {
      title: '通知中心 - eshop_frontend'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/home/SearchView.vue'),
    meta: {
      title: '搜尋結果 - eshop_frontend'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/system/NotFoundView.vue'),
    meta: {
      title: '頁面不存在 - eshop_frontend'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守衛
router.beforeEach((to, from, next) => {
  // 設置頁面標題
  document.title = to.meta.title || 'eshop_frontend'
  
  // 檢查是否需要登入
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 這裡應該檢查用戶是否已登入
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
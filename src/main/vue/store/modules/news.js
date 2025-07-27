const state = {
  news: [],
  currentNews: null,
  loading: false,
  filters: {
    category: null,
    sortBy: 'newest'
  }
}

const getters = {
  allNews: state => state.news,
  currentNews: state => state.currentNews,
  loading: state => state.loading,
  filters: state => state.filters,
  
  // 依照分類篩選的最新消息
  companyNews: state => {
    return state.news.filter(news => news.category === '公司動態')
  },
  
  productNews: state => {
    return state.news.filter(news => news.category === '產品資訊')
  },
  
  promotionNews: state => {
    return state.news.filter(news => news.category === '優惠活動')
  },
  
  systemNews: state => {
    return state.news.filter(news => news.category === '系統公告')
  },
  
  techNews: state => {
    return state.news.filter(news => news.category === '技術分享')
  },
  
  industryNews: state => {
    return state.news.filter(news => news.category === '行業動態')
  },
  
  // 置頂消息
  pinnedNews: state => {
    return state.news.filter(news => news.isPinned === true)
  },
  
  // 熱門消息 (按閱讀數排序)
  hotNews: state => {
    return [...state.news]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
  },
  
  // 最新消息 (按發布時間排序)
  latestNews: state => {
    return [...state.news]
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, 10)
  },
  
  // 按分類獲取新聞
  getNewsByCategory: state => (category) => {
    if (!category || category === 'all') {
      return state.news
    }
    return state.news.filter(news => news.category === category)
  },
  
  // 篩選後的消息
  filteredNews: state => {
    let filtered = [...state.news]
    
    // 按分類篩選
    if (state.filters.category) {
      filtered = filtered.filter(news => news.category === state.filters.category)
    }
    
    // 排序
    switch (state.filters.sortBy) {
      case 'views':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'likes':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        break
    }
    
    return filtered
  }
}

const mutations = {
  SET_NEWS(state, news) {
    state.news = news
  },
  
  SET_CURRENT_NEWS(state, news) {
    state.currentNews = news
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_FILTER(state, { key, value }) {
    state.filters[key] = value
  },
  
  RESET_FILTERS(state) {
    state.filters = {
      category: null,
      sortBy: 'newest'
    }
  },
  
  // 增加閱讀數
  INCREMENT_VIEWS(state, newsId) {
    const news = state.news.find(n => n.id === newsId)
    if (news) {
      news.views = (news.views || 0) + 1
    }
  },
  
  // 增加按讚數
  INCREMENT_LIKES(state, newsId) {
    const news = state.news.find(n => n.id === newsId)
    if (news) {
      news.likes = (news.likes || 0) + 1
    }
  }
}

const actions = {
  async loadNews({ commit }, params = {}) {
    commit('SET_LOADING', true)
    
    try {
      // 這裡會調用真實的 API
      // const { default: newsService } = await import('../../services/news.js')
      // const response = await newsService.getNews(params)
      // commit('SET_NEWS', response.data)
      
      // 目前使用 Mock 資料
      const mockNews = [
        {
          id: 1,
          title: '新版購物網站正式上線！全新體驗等您來探索',
          summary: '經過數月的精心開發，我們的購物網站迎來全面升級。新版本不僅界面更加美觀，功能也更加完善，為您帶來前所未有的購物體驗。',
          content: '<h2>全新設計理念</h2><p>新版網站採用現代化的設計語言，簡潔明瞭的介面讓購物變得更加輕鬆愉快。我們重新設計了商品展示頁面，讓您能夠更直觀地瀏覽和比較商品。</p><h3>主要更新內容</h3><ul><li>全新的響應式設計，完美適配各種設備</li><li>優化的搜尋功能，快速找到心儀商品</li><li>簡化的結帳流程，一鍵完成購買</li><li>個人化推薦系統，為您精選商品</li></ul>',
          category: '系統公告',
          author: '網站管理員',
          publishDate: '2024-01-20T10:00:00.000Z',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 1520,
          likes: 89,
          isPinned: true,
          tags: ['網站更新', '用戶體驗', '功能升級']
        },
        {
          id: 2,
          title: 'iPhone 15 系列現已開放預購，早鳥優惠限時開跑',
          summary: 'Apple 最新 iPhone 15 系列手機現已在我們平台開放預購！首批預購用戶可享受專屬優惠價格和額外贈品，數量有限，欲購從速。',
          content: '<h2>iPhone 15 系列亮點</h2><p>全新的 iPhone 15 系列搭載了革命性的 A17 Pro 晶片，不僅效能大幅提升，更支援先進的攝影功能和 USB-C 連接埠。</p><h3>預購優惠詳情</h3><ul><li>前100名預購用戶享9折優惠</li><li>免費升級至256GB容量</li><li>贈送原廠保護殼一個</li><li>享有優先配送服務</li></ul>',
          category: '產品資訊',
          author: '產品團隊',
          publishDate: '2024-01-18T14:30:00.000Z',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 2340,
          likes: 156,
          isPinned: true,
          tags: ['iPhone', '預購', '優惠活動']
        },
        {
          id: 3,
          title: '春節期間配送服務調整公告',
          summary: '為配合春節假期安排，我們的配送服務將有所調整。請留意配送時間變更，提前做好購物規劃，確保您的商品能及時送達。',
          content: '<h2>春節配送安排</h2><p>春節期間我們將維持基本的配送服務，但配送時間可能會有所延長。建議您提前下單，避免影響使用需求。</p><h3>詳細安排</h3><ul><li>2月8日-14日：暫停配送服務</li><li>2月15日起：恢復正常配送</li><li>急需商品請聯繫客服安排</li><li>退換貨服務正常進行</li></ul>',
          category: '系統公告',
          author: '客服中心',
          publishDate: '2024-01-15T09:00:00.000Z',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 890,
          likes: 45,
          isPinned: false,
          tags: ['春節', '配送', '服務調整']
        },
        {
          id: 4,
          title: '會員等級制度全新升級，更多專屬權益等您解鎖',
          summary: '我們對會員等級制度進行了全面升級，新增多項專屬權益和優惠。無論您是新會員還是老會員，都能享受到更貼心的服務和更優惠的價格。',
          content: '<h2>全新會員等級</h2><p>新的會員制度分為四個等級：青銅、白銀、黃金、鑽石。每個等級都有獨特的權益和折扣優惠。</p><h3>權益升級內容</h3><ul><li>生日專屬優惠券</li><li>免費配送次數增加</li><li>專屬客服支援</li><li>新品優先購買權</li></ul>',
          category: '公司動態',
          author: '會員服務部',
          publishDate: '2024-01-12T16:20:00.000Z',
          image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 1230,
          likes: 78,
          isPinned: false,
          tags: ['會員制度', '權益升級', '優惠']
        },
        {
          id: 5,
          title: '限時搶購：MacBook Pro 系列特惠活動開跑',
          summary: 'MacBook Pro 14吋和16吋現正舉辦限時特惠活動！原價優惠最高達15,000元，還有分期0利率方案，讓您輕鬆擁有夢想中的筆電。',
          content: '<h2>MacBook Pro 特惠詳情</h2><p>這次特惠活動涵蓋了MacBook Pro全系列，無論是專業工作者還是創作者，都能找到適合的機型。</p><h3>優惠方案</h3><ul><li>MacBook Pro 14吋：現省10,000元</li><li>MacBook Pro 16吋：現省15,000元</li><li>12期分期0利率</li><li>免費升級AppleCare+</li></ul>',
          category: '優惠活動',
          author: '促銷團隊',
          publishDate: '2024-01-10T11:15:00.000Z',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 1890,
          likes: 134,
          isPinned: false,
          tags: ['MacBook', '限時優惠', '分期付款']
        },
        {
          id: 6,
          title: '2024年度最佳電商平台獎項榮獲肯定',
          summary: '很榮幸宣布，我們在2024年度電商評比中榮獲"最佳用戶體驗獎"和"創新服務獎"兩項大獎。這份榮耀屬於每一位支持我們的用戶。',
          content: '<h2>獲獎感言</h2><p>能夠獲得這兩項殊榮，我們深感榮幸。這不僅是對我們團隊努力的認可，更是用戶們信任與支持的結果。</p><h3>未來展望</h3><ul><li>持續優化用戶體驗</li><li>推出更多創新服務</li><li>擴大商品品類選擇</li><li>加強客戶服務品質</li></ul>',
          category: '公司動態',
          author: '公關部',
          publishDate: '2024-01-08T13:45:00.000Z',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 756,
          likes: 67,
          isPinned: false,
          tags: ['獲獎', '用戶體驗', '創新服務']
        },
        {
          id: 7,
          title: '安全購物指南：如何保護您的個人資訊',
          summary: '網路購物安全至關重要。我們為您整理了一份詳細的安全購物指南，幫助您在享受便利購物的同時，確保個人資訊和財產安全。',
          content: '<h2>安全購物要點</h2><p>保護個人資訊是每個人都應該重視的問題。以下是一些實用的安全購物建議。</p><h3>安全建議</h3><ul><li>使用強密碼並定期更換</li><li>啟用雙重驗證功能</li><li>避免在公共網路下購物</li><li>定期檢查帳戶交易記錄</li></ul>',
          category: '技術分享',
          author: '資安團隊',
          publishDate: '2024-01-05T10:30:00.000Z',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 654,
          likes: 89,
          isPinned: false,
          tags: ['網路安全', '個人資訊', '購物指南']
        },
        {
          id: 8,
          title: '電商趨勢分析：2024年消費者行為變化',
          summary: '隨著科技發展和消費習慣改變，2024年的電商市場呈現出許多新趨勢。讓我們一起探討這些變化對購物體驗帶來的影響。',
          content: '<h2>2024電商新趨勢</h2><p>今年的電商市場出現了許多有趣的變化，從消費者偏好到技術應用都有顯著的發展。</p><h3>主要趨勢</h3><ul><li>個人化推薦算法優化</li><li>AR/VR購物體驗興起</li><li>可持續發展意識提升</li><li>社群電商快速發展</li></ul>',
          category: '行業動態',
          author: '市場分析師',
          publishDate: '2024-01-03T15:20:00.000Z',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
          views: 432,
          likes: 56,
          isPinned: false,
          tags: ['電商趨勢', '消費行為', '市場分析']
        }
      ]
      
      commit('SET_NEWS', mockNews)
    } catch (error) {
      console.error('載入最新消息失敗:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async loadNewsDetail({ commit, state }, newsId) {
    commit('SET_LOADING', true)
    
    try {
      // 這裡會調用真實的 API
      // const { default: newsService } = await import('../../services/news.js')
      // const news = await newsService.getNewsDetail(newsId)
      // commit('SET_CURRENT_NEWS', news)
      
      // 目前從現有 news 中尋找
      const news = state.news.find(n => n.id === parseInt(newsId))
      commit('SET_CURRENT_NEWS', news)
      
      // 增加閱讀數
      if (news) {
        commit('INCREMENT_VIEWS', parseInt(newsId))
      }
    } catch (error) {
      console.error('載入新聞詳情失敗:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setFilter({ commit }, { key, value }) {
    commit('SET_FILTER', { key, value })
  },
  
  resetFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  
  incrementViews({ commit }, newsId) {
    commit('INCREMENT_VIEWS', newsId)
  },
  
  incrementLikes({ commit }, newsId) {
    commit('INCREMENT_LIKES', newsId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
import { createStore } from 'vuex'
import auth from './modules/auth'
import cart from './modules/cart'
import user from './modules/user'
import products from './modules/products'
import ui from './modules/ui'
import search from './modules/search'
import favorites from './modules/favorites'
import forms from './modules/forms'
import notifications from './modules/notifications'
import news from './modules/news'

export default createStore({
  modules: {
    auth,
    cart,
    user,
    products,
    ui,
    search,
    favorites,
    forms,
    notifications,
    news
  },
  strict: import.meta.env.MODE !== 'production'
})
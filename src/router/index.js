import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      show: true,
      keepAlive: true,
    },
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      show: true
    },
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      show: true
    },
    component: () => import('../views/Register')
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    meta: {
      show: true
    },
    component: () => import('../views/UserInfo')
  },
  {
    path: '/store/:storeId',
    name: 'Store',
    meta: {
      show: true,
    },
    component: () => import('../views/Store')
  },
  {
    path: '/goodsDetail/:goodsId',
    name: 'GoodsDetail',
    meta: {
      show: true,
    },
    component: () => import('../views/GoodsDetail')
  },
  {
    path: '/order',
    name: 'Order',
    meta: {
      show: true,
      keepAlive: true,
    },
    component: () => import('../views/Order')
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    meta: {
      show: true
    },
    component: () => import('../views/ShoppingCart')
  },
  {
    path: '/collection',
    name: 'Collection',
    meta: {
      show: true
    },
    component: () => import('../views/Collection')
  },
  {
    path: '/storeOrder',
    name: 'StoreOrder',
    meta: {
      show: true,
      keepAlive: true
    },
    component: () => import('../views/StoreOrder')
  },
  {
    path: '/chat/:chatStudentId',
    name: 'Chat',
    meta: {
      show: true
    },
    component: () => import('../views/Chat')
  },
  {
    path: '/chatList',
    name: 'ChatList',
    meta: {
      show: true
    },
    component: () => import('../views/ChatList')
  },
  {
    path: '/userDetail/:studentId',
    name: 'UserDetail',
    meta: {
      show: true,
    },
    component: () => import('../views/UserDetail')
  },
  {
    path: '/goodsQuery',
    name: 'GoodsQuery',
    meta: {
      show: true
    },
    component: () => import('../views/GoodsQuery')
  },
  {
    path: '/root',
    name: 'RootLogin',
    component: () => import('../views/RootLogin')
  },
  {
    path: '/accountInfo',
    name: 'AccountInfo',
    meta: {
      show: true,
      keepAlive: true
    },
    component: () => import('../views/AccountInfo')
  },
  {
    path: '/manage',
    name: 'Manage',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/Manage')
  },
  {
    path: '*',
    name: 'NotFind',
    meta: {
      show: true
    },
    component: () => import('../views/NotFind')
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

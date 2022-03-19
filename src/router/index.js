import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: () => import('../views/UserInfo')
  },
  {
    path: '/editUserInfo',
    name: 'EditUserInfo',
    component: () => import('../views/EditUserInfo')
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('../views/Store')
  },
  {
    path: '/goodsDetail/:goodsId',
    name: 'GoodsDetail',
    component: () => import('../views/GoodsDetail')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

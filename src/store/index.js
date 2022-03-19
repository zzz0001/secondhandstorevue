import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    isLogin: localStorage.getItem('isLogin')
  },
  mutations: {
    SET_TOKEN:((state, token) =>{
      state.token = token
      localStorage.setItem('token',token)
    }),
    SET_USERINFO:((state, userInfo) =>{
      state.userInfo = userInfo
      localStorage.setItem('userInfo',JSON.stringify(userInfo))
    }),
    REMOVE_USER:(state => {
      state.token = ''
      state.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }),
    ChangeLogin:((state,loginStatus) => {
      state.isLogin = loginStatus
      localStorage.setItem('isLogin',loginStatus)
    }),
  },
  actions: {
  },
  modules: {
  },
  getters:{
    getIsLogin:(state => {
      return (state.isLogin === "false" || state.isLogin === false) ? false : true
    }),
    getUserInfo:(state => {
      return state.userInfo
    })
  }

})

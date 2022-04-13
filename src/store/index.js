import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    isLogin: localStorage.getItem('isLogin'),
    newNum: localStorage.getItem('newNum'),
    newChat: localStorage.getItem('newChat'),
    newOrder: 0,
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
    NewNum:((state,newNum) => {
      state.newNum = newNum
      localStorage.setItem('newNum',newNum)
    }),
    RemoveNum:(state => {
      state.newNum = 0
      localStorage.removeItem("newNum")
    }),
    NewChat:((state,newChat) => {
      state.newChat = newChat
      localStorage.setItem('newChat',newChat)
    }),
    RemoveChat:(state => {
      state.newChat = 0
      localStorage.removeItem('newChat')
    }),
    NewOrder:((state,newOrder) => {
      state.newOrder = newOrder
    }),
    RemoveNewOrder:(state =>{
      state.newOrder = 0
    })
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
    }),
  }

})

<template>
  <div class="main-header" style="padding: 0px;">
    <p style="max-width: 9999px;height: 40px">
      <el-link @click="to('/')" target="_blank" :underline="false" style="margin-left: 86px;margin-right: 40px">联系客服</el-link>
      <el-link @click="to('/')" target="_blank" :underline="false" style="margin-right: 40px" icon="el-icon-s-home" >首页</el-link>
      <el-link @click="to('/chatList')" target="_blank" :underline="false" style="margin-right: 460px" icon="el-icon-chat-dot-round" >消息</el-link>
      <el-link @click="to('/shoppingCart')" target="_blank" :underline="false" style="margin-right: 30px" icon="el-icon-shopping-cart-full">购物车</el-link>
      <el-link @click="to('/collection')" target="_blank" :underline="false" style="margin-right: 30px" icon="el-icon-star-on">收藏夹</el-link>
      <el-link @click="to('/order')" target="_blank" :underline="false" style="margin-right: 30px">我的订单</el-link>
      <el-link @click="to('/login')" v-show="!isLogin" :underline="false" style="margin-right: 30px">登录</el-link>
      <el-link @click="to('/register')"  v-show="!isLogin" :underline="false" style="margin-right: 30px">免费注册</el-link>
      <el-link @click="to('/store/'+userInfo.studentId)"  v-show="isLogin" :underline="false" style="margin-right: 30px">我的店铺</el-link>
      <el-badge :value="$store.state.newNum" v-show="$store.state.newNum>0 && isLogin" class="my-order-num" >
      </el-badge>
      <el-badge :value="$store.state.newChat" v-show="$store.state.newChat>0 && isLogin" class="my-chat-num" >
      </el-badge>
      <el-dropdown trigger="click" class="el-dropdown-link" v-if="isLogin">
      <span>
        <el-avatar :src="userInfo ? userInfo.picture : '/user/123abc.jpeg'" ></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown" class="my-el-dropdown-item">
        <el-dropdown-item><el-link @click="profile">个人中心</el-link></el-dropdown-item>
        <el-dropdown-item><el-link @click="logout">退出账号</el-link></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </p>
    <span :v-show="false">{{getChange}}</span>
  </div>
</template>

<script>

export default {
  name: "Header",
  comments: {},
  data() {
    return {
      userInfo: {},
      websocket: {},
      chatWebsocket: {},
      isLogin: false,
      timer: null,
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.isLogin = this.$store.getters.getIsLogin
      this.userInfo = this.$store.getters.getUserInfo
      if (this.userInfo){
        this.initWebSocket()
        this.ChatWebSocket()
      }
    },
    to(path){
      this.$router.push(path)
    },
    profile(){
      this.$router.push('/userInfo')
    },
    logout(){
      this.$confirm("确认退出账号吗","提示",{
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        this.$store.commit('REMOVE_USER')
        this.$store.commit('ChangeLogin',false)
        this.$store.commit('RemoveChat')
        this.$store.commit('RemoveNum')
        this.$router.push('/login')
      }).catch(() => {
      });
    },
    initWebSocket(){
      const _this = this
      if('WebSocket' in window){
        this.websocket = new WebSocket('ws://localhost:8081/webSocket/store/order'+this.userInfo.studentId);
      }else{
        alert('当前浏览器不支持websocket消息通知');
      }

      this.websocket.onopen = function (){
        console.log("order连接成功")
      }

      //接收到消息的回调方法
      this.websocket.onmessage = function (event) {
        // setMessageInnerHTML(event.data);
        // alert("ws接收返回消息："+event.data);
        if (event.data){
          let orderNum = JSON.parse(event.data)
          let num = _this.$store.state.newNum
          if(num){
            orderNum = orderNum + parseInt(num)
          }
          _this.$store.commit("NewNum",orderNum)
          _this.$message.success("你有新的订单消息")
        }
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        this.websocket.close();
      }
    },
    ChatWebSocket(){
      const _this = this
      if('WebSocket' in window){
        this.chatWebsocket = new WebSocket('ws://localhost:8081/webSocket/chatList/chatList'+this.userInfo.studentId);
      }else{
        alert('当前浏览器不支持websocket消息通知');
      }

      this.chatWebsocket.onopen = function (){
        console.log("chatList连接成功")
      }

      //接收到消息的回调方法
      this.chatWebsocket.onmessage = function (event) {
        // setMessageInnerHTML(event.data);
        // alert("ws接收返回消息："+event.data);
        console.log(event)
        if (event.data){
          let newChatNum = JSON.parse(event.data)
          let chatNum = _this.$store.state.newChat
          if(chatNum){
            newChatNum = parseInt(chatNum) + newChatNum
          }
          clearTimeout(this.timer);  //清除延迟执行
          this.timer = setTimeout(()=>{   //设置延迟执行
            _this.$store.commit("NewChat", newChatNum)
          },1000);
        }
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        this.chatWebsocket.close();
      }
    },
  },
  computed:{
    getChange(){
      this.isLogin = this.$store.getters.getIsLogin
      this.userInfo = this.$store.getters.getUserInfo
    },
    getLogin(){
      return this.$store.getters.getIsLogin
    }
  },
  watch:{
    getLogin(){
      if (this.$store.getters.getIsLogin === true){
        this.initWebSocket()
        this.ChatWebSocket()
      }
    }
  }
}
</script>

<style scoped>
.main-header {
  font-family: '微软雅黑';
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  background-color: #ffffff;
  color: #333;
  text-align: center;
  padding: 0px;
}
.el-dropdown-link{
  position: absolute;
  margin-left: 20px;
}
body > .el-header {
  padding: 0px;
}
.my-order-num {
  position: absolute;
  top: -2px;
  left: 1214px;
}
.my-chat-num{
  position: absolute;
  top: -2px;
  left: 430px;
}
</style>
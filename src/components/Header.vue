<template>
  <div class="main-header" style="padding: 0px;">
    <p style="max-width: 9999px;height: 40px">
      <el-link @click="to('/login')" target="_blank" :underline="false" style="margin-right: 30px">联系客服</el-link>
      <el-link @click="to('/store')" target="_blank" :underline="false" style="margin-right: 600px">免费开店</el-link>
      <el-link @click="to('/shoppingCart')" target="_blank" :underline="false" style="margin-right: 30px" icon="el-icon-shopping-cart-full">购物车</el-link>
      <el-link @click="to('/collection')" target="_blank" :underline="false" style="margin-right: 30px" icon="el-icon-star-on">收藏夹</el-link>
      <el-link @click="to('/order')" target="_blank" :underline="false" style="margin-right: 30px">我的订单</el-link>
      <el-link @click="to('/login')" v-show="!isLogin" :underline="false" style="margin-right: 30px">登录</el-link>
      <el-link @click="to('/register')"  v-show="!isLogin" :underline="false" style="margin-right: 30px">免费注册</el-link>
      <el-link @click="to('/store')"  v-show="isLogin" :underline="false" style="margin-right: 30px">我的店铺</el-link>
      <el-dropdown trigger="click" class="el-dropdown-link" v-if="isLogin">
      <span>
        <el-avatar :src="userInfo ? userInfo.picture : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" ></el-avatar>
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
      isLogin: false
    }
  },
  created() {
    this.getUserInfo()
  },
  activated() {
  },
  watch: {
  },
  methods: {
    getUserInfo() {
      this.isLogin = this.$store.getters.getIsLogin
      this.userInfo = this.$store.getters.getUserInfo
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
        this.$router.push('/login')
      }).catch(() => {
      });
    }
  },
  computed:{
    getChange(){
      this.isLogin = this.$store.getters.getIsLogin
      this.userInfo = this.$store.getters.getUserInfo
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
}
body > .el-header {
  padding: 0px;
}
</style>
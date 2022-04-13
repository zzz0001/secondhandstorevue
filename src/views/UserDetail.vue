<template>
  <div id="userDetail">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div class="userinfo-detail">
      <el-avatar :size="100" :src="userInfo.picture"></el-avatar>
      <el-descriptions class="my-descriptions" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label" class="my-test-description">
            <i class="el-icon-s-promotion"></i>
            学号
          </template>
          {{ userInfo.studentId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ userInfo.userName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ userInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ userInfo.realName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            年龄
          </template>
          {{ userInfo.age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            性别
          </template>
          {{ userInfo.sex === 0 ? '女' : '男' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            生日
          </template>
          {{ userInfo.birthDay }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          {{ userInfo.address }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="vertical" :column="3" border style="width: 60vmax;">
        <el-descriptions-item :span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            个人简介
          </template>
          {{ userInfo.info }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="toStore" @click="toStore">
      <i class="el-icon-s-shop" style="font-size: 30px;color: #409EFF"></i>
      <p style="font-size: 16px;color: #38383b">店铺</p>
    </div>
    <div class="my-talk" @click="toChat">
      <i class="el-icon-chat-dot-round" style="font-size: 30px;color: #409EFF"></i>
      <p style="font-size: 16px;color: #38383b">客服</p>
    </div>

  </div>
</template>

<script>

export default {
  name: "UserDetail",
  data() {
    return {
      userInfo: {},
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo(){
      const studentId = this.$route.params.studentId
      this.$axios.get("/user/"+studentId).then(res =>{
        this.userInfo = res.data.data
      }).catch(err =>{
        console.log(err);
      })
    },
    toStore(){
      this.$router.push('/store/'+this.userInfo.studentId)
    },
    toChat(){
      this.$router.push("/chat/"+this.userInfo.studentId)
    },
  },
}

</script>

<style scoped>
#userDetail{
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}
.userinfo-detail{
  width: 60vmax;
  margin: 50px auto;
}
.my-descriptions {
  width: 60vmax;
  margin-top: 10px;
}
.my-talk{
  position: absolute;
  top: 200px;
  left: 84vmax;
}
.toStore{
  position: absolute;
  top: 140px;
  left: 84vmax;
}
</style>
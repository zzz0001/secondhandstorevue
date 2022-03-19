<template>
    <div id="login">
      <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="60px" class="my-login-form">
        <h2 style="margin-left: 18px;color: red;margin-bottom: 10px;margin-top: -10px">欢迎登录</h2>
        <el-form-item label="学号" prop="studentId" >
          <el-input v-model="ruleForm.studentId" placeholder="请输入学号(6-15位)"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码(6-15位)" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="my-login-button">登录</el-button>
        </el-form-item>
        <span >
          <el-link type="info" @click="to('/password')" style="size: 12px;margin-left: 160px;margin-bottom: 10px">忘记密码</el-link>
          <el-link type="info" @click="to('/register')" style="margin-left: 26px;margin-bottom: 10px">立即注册</el-link>
        </span>
      </el-form>
    </div>
</template>

<script>

export default {
  name: "Login",
  components: {
  },
  data() {
    return {
      ruleForm: {
        studentId: '6109118005',
        password: '123123',
      },
      rules: {
        studentId: [
          {required: true, message: '请输入学号', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
         this.$axios.post('/user/login',this.ruleForm).then(res =>{
           const token = res.headers['authorization']
           const userInfo = res.data.data
           _this.$store.commit('SET_TOKEN',token)
           _this.$store.commit('SET_USERINFO',userInfo)
           _this.$message.success(res.data.message);
           _this.$store.commit('ChangeLogin',true)
           _this.$router.push('/')
         }).catch(err =>{
           console.log(err);
           // this.$message.error(err)
         })
        } else {
          return false;
        }
      });
    },
    to(path){
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>

#login {
  background-image: url("../../public/login.jpg");
  background-repeat:no-repeat;
  width: auto;
  height: calc(100vh - 70px);
  padding: 0px;
}

.my-login-form {
  background: #ffffff;
  padding-top: 20px;
  padding-right: 20px;
  width: 300px;
  margin-left: 920px;
  margin-top: 180px;
  position: absolute;
  border: 1px black solid;
}

.my-login-button {
  width: 240px;
}
</style>
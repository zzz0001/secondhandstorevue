<template>
    <div id="login">
      <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="60px" class="my-login-form">
        <el-form-item label="账号" prop="userName" >
          <el-input v-model="ruleForm.userName" placeholder="请输入学号(6-15位)"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码(6-15位)" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="submitForm" class="my-login-button">登录</el-button>
        </el-form-item>
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
        userName: 'zzzzzz',
        password: '123123',
      },
      rules: {
        userName: [
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
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
         this.$axios.post('/root/login',this.ruleForm).then(res =>{
           const token = res.headers['authorization']
           const userInfo = res.data.data
           this.$store.commit('SET_TOKEN',token)
           this.$store.commit('SET_USERINFO',userInfo)
           this.$store.commit('ChangeLogin',true)
           this.$router.push('/manage')
           this.$message.success("登录成功");
         }).catch(err =>{
           console.log(err);
         })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>

#login {
  overflow: hidden;
  background-image: url("../../public/rootLogin.jpg");
  background-repeat:no-repeat;
  width: auto;
  height: calc(100vh);
  padding: 0px;
}

.my-login-form {
  background: #0e0b1e;
  padding-top: 20px;
  padding-right: 20px;
  width: 300px;
  height: 200px;
  margin-top: 266px;
  margin-left: 120px;
  border: 0px black solid;
}

.my-login-button {
  width: 240px;
  background: #c8c9f5;
}
</style>
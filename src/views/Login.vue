<template>
    <div id="login">
      <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm" label-width="60px" class="my-login-form">
        <p style="margin-left: 18px;margin-bottom: 10px;margin-top: -10px;font-size: 22px;font-weight: 700;color: #e52929;">欢迎登录</p>
        <el-divider ></el-divider>
        <el-form-item  prop="studentId" >
          <div>
            <i class="el-icon-s-custom" style="font-size: 26px;height: 40px;width: 34px;position: relative;padding-left: 7px;margin-left: -278px;z-index: 2;line-height: 40px;color: white;background: #8c939d"></i>
            <el-input v-model="ruleForm.studentId" placeholder="请输入学号(6-15位)" style="width: 240px;margin-left: -2px;float: left;"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div>
            <i class="el-icon-lock" style="font-size: 26px;height: 40px;width: 34px;position: relative;padding-left: 7px;margin-left: -278px;z-index: 2;line-height: 40px;color: white;background: #8c939d"></i>
            <el-input v-model="ruleForm.password" placeholder="请输入密码(6-15位)" show-password style="width: 240px;margin-left: -2px;float: left;"></el-input>
          </div>
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
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
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
           _this.$store.commit('ChangeLogin',true)
           _this.$message.success(res.data.message);
           _this.$router.push('/')
         }).catch(err =>{
           console.log(err);
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
  background: #F1F6F9;
  padding-top: 20px;
  padding-right: 20px;
  width: 300px;
  margin-left: 920px;
  margin-top: 180px;
  position: absolute;
  border: 1px black solid;
}

.my-login-button {
  width: 280px;
  margin-left: -40px;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 4px 0 20px 10px;
}
</style>
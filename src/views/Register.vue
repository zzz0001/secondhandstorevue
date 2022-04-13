<template>
  <div id="register">
    <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm"
             label-width="40px"  class="my-login-form">
      <p style="margin-left: 18px;margin-bottom: 10px;margin-top: 10px;font-size: 22px;font-weight: 700;color: #e52929;">欢迎注册</p>
      <el-divider ></el-divider>
      <el-form-item label="" prop="studentId">
        <el-input v-model="ruleForm.studentId" placeholder="请输入学号(6-15位)" style="width: 240px;"></el-input>
      </el-form-item>
      <el-form-item label="" prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="请输入用户名" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="" prop="realName">
        <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名" style="width: 240px" ></el-input>
      </el-form-item>
      <el-form-item label="" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入电话号码" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入密码(6-15位)" show-password style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password2">
        <el-input v-model="ruleForm.password2" autocomplete="off" placeholder="请再次输入密码(6-15位)" show-password style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" class="my-login-button">立即注册</el-button>
      </el-form-item>
      <span>
          <el-link @click="to('/password')" style="size: 12px;margin-left: 140px;margin-bottom: 10px">忘记密码</el-link>
          <el-link @click="to('/login')" style="margin-left: 26px;margin-bottom: 10px">立即登录</el-link>
        </span>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Register",
  components: {},
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    let checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        studentId: '',
        userName: '',
        password: '',
        realName: '',
        phone: '',
        password2: '',
      },
      rules: {
        studentId: [
          {required: true, message: '请输入学号', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
        ],
        phone: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        password2: [
          {validator: checkPassword, trigger: 'blur'}
        ]
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/user/register',this.ruleForm).then(res =>{
            _this.$message.success(res.data.message);
            _this.$router.push('/login')
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

#register {
  background-image: url("../../public/login.jpg");
  background-repeat: no-repeat;
  width: auto;
  height: calc(100vh - 70px);
  padding: 0px;
}

.my-login-form {
  background: #F1F6F9;
  padding-top: 0px;
  padding-right: 20px;
  width: 300px;
  margin-left: 930px;
  margin-top: 40px;
  position: absolute;
  border: 1px black solid;
}

.my-login-button {
  width: 240px;
}

.el-form-item{
  margin-bottom: 18px;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 4px 0 10px 10px;
}
</style>
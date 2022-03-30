<template>
  <div id="register">
    <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm"
             label-width="80px" class="my-login-form">
      <h2 style="margin-left: 18px;color: red;margin-top: 10px;margin-bottom: 10px;">欢迎注册</h2>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="ruleForm.studentId" placeholder="请输入学号(6-15位)"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入密码(6-15位)" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input v-model="ruleForm.password2" autocomplete="off" placeholder="请再次输入密码(6-15位)" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" class="my-login-button">立即注册</el-button>
      </el-form-item>
      <span>
          <el-link @click="to('/password')" style="size: 12px;margin-left: 160px;margin-bottom: 10px">忘记密码</el-link>
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
        studentId: '6109118000',
        userName: '魄',
        password: '123123',
        realName: '张三',
        phone: '18216669999',
        password2: '123123',
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
          {min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
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
  width: 220px;
}

.el-form-item{
  margin-bottom: 16px;
}
</style>
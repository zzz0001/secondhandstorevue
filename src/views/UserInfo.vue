<template>
  <div id="userInfo">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <el-popover
        placement="right"
        trigger="click"
        ref="editPopover2"
        class="myEditPopper2"
        :style="{'z-index': (isShow2 ? -1 : 200)}"
    >
      <el-form ref="account" :model="account" :rules="rules" :hide-required-asterisk="true" label-width="80px"
               class="my-form2">
        <h2 style="font-size: 22px;color: #f5d007;margin-bottom: 16px;margin-left: 10px;margin-top: 4px">开通账户</h2>
        <el-form-item label="支付密码" prop="password">
          <el-input v-model.number="account.password" placeholder="输入6位支付密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model.number="account.password2" placeholder="确认6位支付密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitAccount('account')" style="margin-left: 20px;margin-bottom: 0px">
            开通
          </el-button>
          <el-button @click="closePopover2" style="margin-left: 30px;margin-right: 40px;margin-bottom: 0px">取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-popover>
    <div v-if="userInfo.status === 0" @click="openAccount()"
         style="position:absolute;margin-left: 69vmax;margin-top: 40px;font-size: 16px;">
      <span class="el-icon-s-finance" style="color: #424040">开通账户 </span>
    </div>
    <div v-else-if="userInfo.status === 1" @click="startAccount()"
         style="position:absolute;margin-left: 69vmax;margin-top: 40px;font-size: 16px;">
      <span class="el-icon-s-finance" style="color: #424040">账户被锁定 </span>
    </div>
    <div v-else style="position:absolute;margin-left: 69vmax;margin-top: 20px;font-size: 16px;">
      <span class="el-icon-s-finance" style="color: #424040">账户余额 : ¥ {{ account.money.toFixed(2) }}</span>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="addMoney()">充值</el-button>
        <el-button @click="reduceMoney()" style="position: absolute;margin-left: 16px">提现</el-button>
      </div>
    </div>
    <div class="my-main">
      <el-popover
          placement="right"
          width="150"
          trigger="click"
          ref="popoverSH"
      >
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8081/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :headers="header"
            list-type="picture-card"
            v-show="isUpload"
        >
          <!--          <img v-if="userInfo.picture" :src="userInfo.picture" class="avatar" style="margin-left: -20px;margin-top: -10px">-->
          <i class="el-icon-plus avatar-uploader-icon" style="margin-left: -20px;margin-top: -10px"></i>
        </el-upload>
        <el-button slot="reference" type="text">
          <el-avatar :size="100" :src="userInfo.picture"></el-avatar>
        </el-button>
      </el-popover>
      <el-descriptions class="my-descriptions" title="" :column="3" border>
        <template slot="extra" class="my-alter">
          <el-button @click="changeUserInfo()" type="primary" size="small"
                     style="position: absolute;margin-top: 20px;margin-left: 10px">修改资料
          </el-button>
        </template>
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
    <el-popover
        placement="right"
        trigger="click"
        ref="editPopover"
        class="myEditPopper"
        :style="{'z-index': (isShow ? -1 : 200)}"
    >
      <el-form :inline="true" ref="userInfo" :model="userInfo" label-width="80px">
        <el-form-item label="用户名" style="margin-top: 20px">
          <el-input v-model="userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="学号" style="margin-left: 40px;margin-top: 20px">
          <el-input v-model="userInfo.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" style="margin-left: 40px">
          <el-input v-model="userInfo.realName" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生年月" style="margin-left: 136px">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="userInfo.birthDay"
                            style="width: 202px;" value-format='yyyy-MM-dd'></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="userInfo.address" style="width: 534px"></el-input>
        </el-form-item>
        <el-form-item label="个人信息">
          <el-input type="textarea" v-model="userInfo.info" style="width: 534px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="margin-left: 200px">上传</el-button>
          <el-button @click="closePopover" style="margin-left: 60px">取消</el-button>
        </el-form-item>
      </el-form>
    </el-popover>

  </div>
</template>

<script>

export default {
  name: "UserInfo",
  components: {},
  data() {
    const checkPassword = (rule, value, callback) => {
      const numReg = /^\d{6}$/
      const numRe = new RegExp(numReg)
      if (value === '') {
        callback(new Error('请输入6位数字密码'));
      } else {
        if (!numRe.test(value)) {
          callback(new Error("密码必须为6位数字"))
        }
        callback();
      }
    };
    const checkPassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.account.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {},
      header: {
        'Authorization': ''
      },
      account: {
        studentId: '',
        money: 0,
        password: '',
        password2: ''
      },
      rules: {
        password: [
          {validator: checkPassword, trigger: 'blur'}
        ],
        password2: [
          {validator: checkPassword2, trigger: 'blur'}
        ]
      },
      isShow: true,
      isShow2: true,
      isUpload: true
    }
  },
  created() {
    this.header.Authorization = this.$store.state.token
    this.getUser()
    this.getAccount()
  },
  methods: {
    getUser() {
      const _this = this
      const studentId = this.$store.state.userInfo.studentId
      this.account.studentId = studentId
      this.$axios.get('/user/' + studentId).then(res => {
        _this.userInfo = res.data.data
        _this.$store.commit('SET_USERINFO', res.data.data)
      }).catch(err => {
        console.log(err);
        // _this.$message.error(err);
      })
    },
    getAccount() {
      const _this = this
      const studentId = this.$store.state.userInfo.studentId
      this.$axios.get('/account/' + studentId).then(res => {
        if (res.data.data){
          _this.account = res.data.data
        }
      }).catch(err => {
        console.log(err);
        // _this.$message.error(err);
      })
    },
    handleAvatarSuccess(res, file) {
      if (file.response.code === 200) {
        this.$message.success(file.response.message)
      } else {
        this.$message.error(file.response.message)
      }
      this.getUser()
      this.$refs.popoverSH.doClose()
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
    changeUserInfo() {
      this.$refs.editPopover.doShow()
      this.isShow = false;
    },
    onSubmit() {
      this.$axios.put('/user', this.userInfo).then(res => {
        this.$message.success("信息修改成功")
        this.closePopover()
      }).catch(err => {
        console.log(err);
        this.$message.error(err)
      })
    },
    closePopover() {
      this.getUser()
      this.isShow = true
      this.$refs.editPopover.doClose()
    },
    onSubmitAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/account',this.account).then(res =>{
            _this.getUser()
            _this.getAccount()
            _this.closePopover2()
            _this.$message.success("账户开通成功")
          }).catch(err =>{
            console.log(err);
          })
        } else {
          return false;
        }
      });
    },
    closePopover2() {
      this.getAccount()
      this.isShow2 = true
      this.$refs.editPopover2.doClose()
    },
    to(path) {
      this.$router.push(path)
    },
    openAccount() {
      this.$refs.editPopover2.doShow()
      this.isShow2 = false;
    },
    startAccount() {

    },
    addMoney() {
      this.$prompt('请输入充值的金额', '充值', {
        confirmButtonText: '充值',
        inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputErrorMessage: '金额格式不正确'
      }).then(({value}) => {
        const money = value
        this.$prompt('请输入密码', '验证', {
          confirmButtonText: '充值',
          inputPattern: /^\d{6}$/,
          inputErrorMessage: '密码为6位数字'
        }).then(({value}) => {
          this.$axios.put('/account/addMoney',{money: money,password: value}).then(res =>{
            this.getAccount()
            this.$message.success("你充值的金额为"+money)
          }).catch(err =>{
            console.log(err);
          })
        }).catch((err) => {
          console.log(err);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消充值'
        });
      });
    },
    reduceMoney() {
      this.$prompt('请输入提现的金额', '提现', {
        confirmButtonText: '提现',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputErrorMessage: '金额格式不正确'
      }).then(({value}) => {
        const money = value
        this.$prompt('请输入密码', '验证', {
          confirmButtonText: '提现',
          inputPattern: /^\d{6}$/,
          inputErrorMessage: '密码为6位数字'
        }).then(({value}) => {
          this.$axios.put('/account/reduceMoney',{money: money,password: value}).then(res =>{
            this.getAccount()
            this.$message.success("你提现的金额为"+money)
          }).catch(err =>{
            console.log(err);
          })
        }).catch((err) => {
          console.log(err);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消提现'
        });
      });
    },
  }
}
</script>

<style scoped>

#userInfo {
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}

.my-main {
  margin-left: 20vmax;
}

.my-descriptions {
  width: 60vmax;
  margin-top: -10px;
}

.my-main-title {
  margin-left: 5vmax;
  font-family: 华文楷体;
  color: #1d1c1c;
  padding-top: 5vh;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.myEditPopper {
  width: 660px;
  height: 400px;
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.myEditPopper2 {
  width: 400px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.my-form2 /deep/ {
  padding-bottom: 0px;
  padding-right: 20px;
  margin-bottom: -10px;
}

.my-test-description {
  width: 200px;
}

.el-form-item {
  margin-bottom: 18px;
}

</style>
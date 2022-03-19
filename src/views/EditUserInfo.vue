<template>
  <div id="editUserInfo">
    <el-form :inline="true" ref="userInfo" :model="userInfo" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userInfo.userName"></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="userInfo.studentId"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userInfo.phone"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="userInfo.realName"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfo.sex">
          <el-radio label="男" :value="0"></el-radio>
          <el-radio label="女" :value="1"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生年月">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="userInfo.birthDay" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="userInfo.address"></el-input>
      </el-form-item>
      <el-form-item label="个人信息">
        <el-input v-model="userInfo.info"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="closePopover">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "EditUserInfo",
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      userInfo: {

      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style scoped>

#editUserInfo {

}
</style>
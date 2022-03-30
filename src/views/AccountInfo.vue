<template>
  <div id="accountInfo">
    <el-link @click="$router.back(0)" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div>
      <h2 class="my-title"> 账户详情 </h2>
    </div>
    <div style="margin-top: 14px">
      <div v-for="(item,index) in expense" class="my-user-main">
        <el-button :disabled="item.status === 1 || item.status === 3"  @click="toOrder(item.orderId)" class="my-account-order" type="primary">订单详情
        </el-button>
        <el-link @click="toUser(item.studentId)" class="my-account-studentId" :underline="false">
          <p style="height: 24px;overflow: hidden">
            {{item.studentId}}
          </p>
        </el-link>
        <div class="my-account-info">
          <p v-if="item.status === 0" style="height: 24px;overflow: hidden">
            向商家付款
          </p>
          <p v-else-if="item.status === 1" style="height: 24px;overflow: hidden">
            提现
          </p>
          <p v-else-if="item.status === 2"  style="height: 24px;overflow: hidden;color: #FF6200">
            收到转账来自
          </p>
          <p v-else style="height: 24px;overflow: hidden;color: #FF6200;">
            充值
          </p>
        </div>
        <el-link :disabled="!item.receiveId" @click="toUser(item.receiveId)" class="my-account-studentId" :underline="false">
          <p style="height: 24px;overflow: hidden">
            {{item.receiveId ? item.receiveId : '无'}}
          </p>
        </el-link>
        <div class="my-account-price">
          <p v-if="item.status <= 1 " style="height: 24px;overflow: hidden;font-size: 22px">
            -{{item.cost.toFixed(2)}}
          </p>
          <p v-else style="height: 24px;overflow: hidden;font-size: 22px;color: #FF6200">
            +{{item.cost.toFixed(2)}}
          </p>
        </div>
        <div class="my-account-time">
          <p>
            {{item.createTime.replace('T',' ')}}
          </p>
        </div>
      </div>
    </div>

    <div v-if="expense.length === 0"  style="text-align: center;font-size: 20px;margin-top: 140px;margin-bottom: 60px;color: #FF6200">
      <i class="el-icon-s-promotion"></i> 您暂时没有任何交易记录哦！
    </div>

    <div class="my-page-style">
      <el-pagination
          background
          :hide-on-single-page="true"
          layout="prev, pager, next"
          @current-change="changePage"
          :current-page="page"
          :total="resultPage.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountInfo",
  data() {
    return {
      userInfo: {},
      expense: [],
      resultPage: {},
      page: 1,
    }
  },
  created() {
    this.userInfo = this.$store.getters.getUserInfo
    this.getExpense()
  },
  methods: {
    getExpense(){
      this.$axios.get('/expense/page/'+this.userInfo.studentId + '/' + this.page).then(res =>{
        this.resultPage = res.data.data
        this.expense = this.resultPage.records
      }).catch(err =>{
      })
    },
    changePage(newPage) {
      this.page = newPage
      this.getExpense()
    },
    toUser(studentId) {
      this.$router.push("/userDetail/" + studentId)
    },
  },
}


</script>

<style scoped>
#accountInfo{
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}
.my-title {
  color: #15b4f1;
  font-size: 30px;
  margin-left: 12vmax;
  margin-top: -26px;
}
.my-query-style{
  width: 400px;
  margin-left: 50px;
  margin-bottom: 10px;
}
.my-user-main{
  width: 900px;
  height: 80px;
  background: white;
  margin: 4px auto 10px auto;
  border-radius: 10px;
}
.my-account-studentId{
  float: left;
  width: 100px;
  height: 24px;
  text-align: center;
  margin-top: 27px;
  font-size: 18px;
  margin-left: 20px;
}

.my-account-info{
  float: left;
  width: 160px;
  height: 24px;
  text-align: center;
  margin-top: 27px;
  font-size: 18px;
  margin-left: 10px;
}
.my-account-order{
  float: right;
  height: 40px;
  text-align: left;
  margin-top: 20px;
  font-size: 16px;
  margin-right: 10px;
}
.my-account-price{
  float: left;
  width: 120px;
  height: 24px;
  text-align: center;
  margin-top: 25px;
  font-size: 16px;
  margin-left: 20px;
}
.my-account-time{
  float: left;
  width: 200px;
  height: 24px;
  text-align: center;
  margin-top: 27px;
  font-size: 16px;
  margin-left: 10px;
}
.my-page-style{
  text-align: center;
  width: 500px;
  margin: 10px auto;
}
</style>
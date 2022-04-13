<template>
  <div id="accountInfo">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div>
      <h2 class="my-title"> 账户详情 </h2>
    </div>
    <div style="margin-top: 14px">
      <div v-for="(item,index) in expense" class="my-user-main">
        <el-button :disabled="item.status === 1 || item.status === 3"  @click="toOrder(item.orderId)" class="my-account-order" type="primary">订单详情
        </el-button>
        <el-link @click="toUserInfo" class="my-account-studentId" :underline="false">
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

    <el-dialog title="订单信息" :visible.sync="dialogFormVisible" width="1000px" top="150px" :modal="false" :close-on-click-modal="false">
      <el-table
          :data="order"
          border
          style="width: 900px;margin: -16px auto 14px auto;font-size: 10px"
          :row-style="{height: '100px'}"
          :cell-style="{padding: '0px 0px 0px 0px'}"
          @cell-click="toStore2"
          :cell-class-name="cellClassName"
      >
        <el-table-column
            label="商品图片"
            width="110"
        >
          　　<template slot-scope="images">
          <el-image
              style="width: 100px; height: 100px;border-radius: 2px;margin-left: -6px;margin-top: 4px"
              :src="images ? images.row.images[0] : ''"
              fit="cover">
          </el-image>
          　　</template>
        </el-table-column>

        <el-table-column
            prop="goods.goodsName"
            label="商品名称"
            width="100"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="goods.goodsIntroduce"
            label="商品介绍"
            width="200"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="store.storeName"
            label="店铺名"
            width="120"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="order.goodsNum"
            label="商品数量"
            width="70"
            align="center"
        >
        </el-table-column>
        <el-table-column
            label="金额"
            width="100"
            align="center"
        >
          <template slot-scope="order">
            <span style="color: red">¥</span> <span class="my-price">{{order.row.order.totalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="110"
            align="center"
        >
          <template slot-scope="order">
            <el-button v-if="order.row.order.orderStatus === 0 "  type="danger" :disabled="true"  size="medium" >付款</el-button>
            <el-button v-if="order.row.order.orderStatus === 1 "  type="danger" :disabled="true"  size="small"  >催发货</el-button>
            <el-button v-if="order.row.order.orderStatus === 2 "  type="danger" :disabled="true"  size="small" >确认收货</el-button>
            <el-button v-if="order.row.order.orderStatus === 3 "  type="danger" :disabled="true"  size="small" >评价</el-button>
            <el-button v-if="order.row.order.orderStatus === 4 "  type="danger" :disabled="true"  size="medium" >退货</el-button>
            <el-button v-if="order.row.order.orderStatus === 5 "  type="danger"  :disabled="true" size="small" >退货中</el-button>
            <el-button v-if="order.row.order.orderStatus === 6 "  type="primary" :disabled="true" size="small" >已退款</el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="更多详情"
            width="89"
            align="center">
          <template slot-scope="order">
            <el-tooltip class="item" effect="light" placement="bottom-start">
              <div v-if="order.row.order.orderStatus === 0" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} </div>
              <div v-if="order.row.order.orderStatus === 1" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} </div>
              <div v-if="order.row.order.orderStatus === 2" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{order.row.order.deliveryDate.replace('T',' ')}}</div>
              <div v-if="order.row.order.orderStatus === 3" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{order.row.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{order.row.order.receiveDate.replace('T',' ')}}</div>
              <div v-if="order.row.order.orderStatus === 4" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{order.row.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{order.row.order.receiveDate.replace('T',' ')}}</div>
              <!--             <br> 退货时间：{{order.row.order.returnDate.replace('T',' ')}}-->
              <button style="border: none;background: white;font-size: 12px;color: #4c5055">详情</button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

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
      order: [],
      resultPage: {},
      page: 1,
      dialogFormVisible: false,
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
    toUserInfo() {
      this.$router.push("/userInfo")
    },
    toUser(studentId){
      this.$router.push("/userDetail/"+studentId)
    },
    toOrder(orderId){
      this.dialogFormVisible = true
      this.$axios.get('/order/'+orderId).then(res =>{
        this.order = []
        this.order.push(res.data.data)
      })
    },
    getStore(storeId){
      this.$router.push('/store/'+storeId)
    },
    GoodsDetail(goodsId){
      this.$router.push(`/goodsDetail/${goodsId}`)
    },
    toStore2(row, column){
      if (column.index === 3){
        this.getStore(row.goods.studentId)
      }else if(column.index >= 6 ){

      }else {
        this.GoodsDetail(row.goods.goodsId)
      }
    },
    cellClassName({row, column, rowIndex, columnIndex}){
      row.index = rowIndex;
      column.index = columnIndex;
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
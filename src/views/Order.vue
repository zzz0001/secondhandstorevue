<template>
  <div id="order">
    <div v-for="(item,index) in orderList" class="my-order-info">
      <div>
        <el-link  @click="getStore(item.store.storeId)" :underline="false">
          <span class="my-store-name"><i class="el-icon-s-shop" style="font-size: 16px"></i>{{ item.store.storeName }} <i class="el-icon-arrow-right"></i></span>
        </el-link>
      </div>
      <div class="my-goods-image" >
        <el-image @click="GoodsDetail(item.goods.goodsId)"
            style="width: 200px; height: 200px;border-radius: 6px;margin-top: 6px;float: left"
            :src="item.images ? item.images.at(0) : ''"
            fit="cover">
        </el-image>
        <div class="my-goods-info">
          <div @click="GoodsDetail(item.goods.goodsId)">
            <h3 class="my-goods-name">{{ item.goods.goodsName }}</h3>
            <p class="my-goods-description">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.goods.goodsIntroduce }}</p>
            <p style="font-size: 14px"> 数量: x<span> {{ item.order.goodsNum }}</span></p>
            <p style="font-size: 14px;margin-top: 6px;margin-left: 150px"> 付款：<span style="color: red">¥</span> <span class="my-price">{{item.order.totalPrice.toFixed(2)}}</span></p>
          </div>

          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div v-if="item.order.orderStatus === 0" slot="content">创建日期：{{item.order.createTime.replace('T',' ')}} </div>
            <div v-if="item.order.orderStatus === 1" slot="content">创建日期：{{item.order.createTime.replace('T',' ')}} <br> 付款时间：{{item.order.orderDate.replace('T',' ')}} </div>
            <div v-if="item.order.orderStatus === 2" slot="content">创建日期：{{item.order.createTime.replace('T',' ')}} <br> 付款时间：{{item.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}}</div>
            <div v-if="item.order.orderStatus === 3" slot="content">创建日期：{{item.order.createTime.replace('T',' ')}} <br> 付款时间：{{item.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{item.order.receiveDate.replace('T',' ')}}</div>
            <div v-if="item.order.orderStatus === 4" slot="content">创建日期：{{item.order.createTime.replace('T',' ')}} <br> 付款时间：{{item.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{item.order.receiveDate.replace('T',' ')}} <br> 退货时间：{{item.order.returnDate.replace('T',' ')}}</div>
            <button style="border: none;background: white">更多</button>
          </el-tooltip>

          <el-button v-if="item.order.orderStatus === 0" @click="payment(item.order.orderId)" type="danger" class="my-button" round> 付款 </el-button>
          <el-button v-if="item.order.orderStatus === 1" @click="quick(item.order.orderId)" type="danger" class="my-button2" round> 催发货 </el-button>
          <el-button v-if="item.order.orderStatus === 2" @click="receive(item.order.orderId)" type="danger" class="my-button3" round> 确认收货 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetail",
  created() {
    this.userInfo = this.$store.state.userInfo
    this.getOrderList()
  },
  data() {
    return {
      userInfo: {},
      orderList: [],
      orderVo: {},
    }
  },
  methods: {
    getOrderList() {
      const _this = this
      this.$axios.get('/orderList/' + this.userInfo.studentId).then(res => {
        this.orderList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    getStore(storeId){
      this.$router.push({
        name: 'Store',
        params :{
          storeId: storeId,
        }
      })
    },
    GoodsDetail(goodsId){
      this.$router.push(`/goodsDetail/${goodsId}`)
    },
    payment(orderId){
      const _this = this
      this.orderVo.orderId = orderId;
      this.$prompt('请输入密码', '验证', {
        confirmButtonText: '提现',
        inputPattern: /^\d{6}$/,
        inputErrorMessage: '密码为6位数字'
      }).then(({value}) => {
        this.orderVo.password = value
        this.$axios.put('/order',this.orderVo).then(res =>{
          _this.$message.success("付款成功")
          _this.getOrderList()
        }).catch(err =>{
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    },
    quick(){

    },
    receive(){
      const _this = this
      this.$axios.put('/order/receive/'+orderId).then(res =>{
        _this.$message.success("收货成功")
        _this.getOrderList()
      }).catch(err =>{
        console.log(err);
      })
    },
  },
  computed:{
    moreInfo(info){
      return "下单日期："+ info
    }
  }
}
</script>

<style scoped>
#order {
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
  padding-top: 14px;
}

.my-order-info {
  overflow: hidden;
  background: white;
  max-width: 500px;
  min-width: 500px;
  margin: 0 auto 14px;
  padding: 6px;
  border-radius: 6px;
}

.my-goods-image {
  width: 498px;
}

.my-goods-info {
  width: 280px;
  float: left;
  margin-left: 18px;
}
.my-goods-description{
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  max-height: 42px;
  overflow: hidden;
}
.my-store-name{
  max-height: 24px;
  overflow: hidden;
}
.my-goods-name{
  max-height: 24px;
  overflow: hidden;
  margin-top: 6px;
}
.my-price{
  font-size: 24px;
  color: red;
}
.my-button{
  width: 80px;
  margin-left: 160px;
  margin-top: 20px;
}
.my-button2{
  margin-left: 150px;
  margin-top: 20px;
}
.my-button3{
  margin-left: 140px;
  margin-top: 20px;
}
</style>
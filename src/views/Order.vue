<template>
  <div id="order">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <div>
      <el-tabs v-model="activeName"  type="border-card" @tab-click="handleClick" class="my-el-tabs" >
        <el-tab-pane label="待付款" name="first">

        </el-tab-pane>
        <el-tab-pane label="待发货" name="second">

        </el-tab-pane>
        <el-tab-pane label="待收货" name="third">

        </el-tab-pane>
        <el-tab-pane label="待评价" name="fourth">

        </el-tab-pane>
        <el-tab-pane label="售后服务" name="five">

        </el-tab-pane>
      </el-tabs>
    </div>

    <el-table
        :data="orderList"
        border
        style="width: 900px;margin: -32px auto 14px auto;font-size: 10px"
        :row-style="{height: '100px'}"
        :cell-style="{padding: '0px 0px 0px 0px'}"
        @cell-click="toStore"
        :cell-class-name="cellClassName"
    >
      <el-table-column
          label="商品图片"
          width="110"
      >
        　　<template slot-scope="images">
              <el-image
                  style="width: 100px; height: 100px;border-radius: 2px;margin-left: -6px;margin-top: 4px"
                  :src="images ? images.row.images.at(0) : ''"
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
          <el-button v-if="order.row.order.orderStatus === 0" @click="payment(order.row.order.orderId)" type="danger"  size="medium" >付款</el-button>
          <el-button v-if="order.row.order.orderStatus === 1" @click="quick(order.row.order.orderId)" type="danger"  size="small"  >催发货</el-button>
          <el-button v-if="order.row.order.orderStatus === 2" @click="receive(order.row.order.orderId)" type="danger"  size="small" >确认收货</el-button>
          <el-button v-if="order.row.order.orderStatus === 3" @click="receive(order.row.order.orderId)" type="danger"  size="small" >待评价</el-button>
          <el-button v-if="order.row.order.orderStatus === 4" @click="receive(order.row.order.orderId)" type="danger"  size="small" >退货</el-button>
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
             <div v-if="order.row.order.orderStatus === 2" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}}</div>
             <div v-if="order.row.order.orderStatus === 3" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{order.row.order.receiveDate.replace('T',' ')}}</div>
             <div v-if="order.row.order.orderStatus === 4" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{item.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{order.row.order.receiveDate.replace('T',' ')}} <br> 退货时间：{{order.row.order.returnDate.replace('T',' ')}}</div>
             <button style="border: none;background: white;font-size: 12px;color: #4c5055">详情</button>
           </el-tooltip>
         </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: "order",
  created() {
    this.userInfo = this.$store.state.userInfo
    this.getOrderList()
  },
  data() {
    return {
      userInfo: {},
      orderList: [],
      orderVo: {},
      activeName: 'first',
    }
  },
  methods: {
    getOrderList() {
      const _this = this
      this.$axios.get('/orderListByStatus/0').then(res => {
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
        confirmButtonText: '付款',
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
    handleClick(tab) {
      const _this = this
      this.$axios.get('/orderListByStatus/' + tab.index).then(res => {
        this.orderList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    toStore(row, column, cell, event){
      if (column.index === 3){
        this.getStore(row.order.storeId)
      }else if(column.index >= 6 ){

      }else {
        this.GoodsDetail(row.goods.goodsId)
      }
    },
    cellClassName({row, column, rowIndex, columnIndex}){
      row.index = rowIndex;
      column.index = columnIndex;
    },
    to(path){
      this.$router.push(path)
    },
  },
  computed:{
  }
}
</script>

<style scoped>
#order {
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}

.my-price{
  font-size: 18px;
  color: red;
}
.my-el-tabs{
  width: 898px;
  text-align: center;
  margin: -10px auto 0 auto;
}
.el-table--border::after{
  width: 0px;
}
</style>
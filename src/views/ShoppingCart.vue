<template>
  <div id="shoppingCart">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <h2 class="my-title"> 购物车 </h2>
    <el-table
        ref="multipleTable"
        border
        :data="orderList"
        tooltip-effect="dark"
        style="width: 846px;margin: 10px auto 14px auto;font-size: 10px"
        :row-style="{height: '100px'}"
        :cell-style="{padding: '0px 0px 0px 0px'}"
        @cell-click="toStore"
        :cell-class-name="cellClassName"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55"
          align="center"
      >
      </el-table-column>

      <el-table-column
          label="商品图片"
          width="110">
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
          <span style="color: red">¥</span> <span class="my-price">{{ order.row.order.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="更多详情"
          width="89"
          align="center">
        <template slot-scope="order">
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div v-if="order.row.order.orderStatus === 0" slot="content">
              创建日期：{{ order.row.order.createTime.replace('T', ' ') }}
            </div>
            <div v-if="order.row.order.orderStatus === 1" slot="content">
              创建日期：{{ order.row.order.createTime.replace('T', ' ') }} <br>
              付款时间：{{ order.row.order.orderDate.replace('T', ' ') }}
            </div>
            <div v-if="order.row.order.orderStatus === 2" slot="content">
              创建日期：{{ order.row.order.createTime.replace('T', ' ') }} <br>
              付款时间：{{ order.row.order.orderDate.replace('T', ' ') }} <br>
              发货时间：{{ item.order.deliveryDate.replace('T', ' ') }}
            </div>
            <div v-if="order.row.order.orderStatus === 3" slot="content">
              创建日期：{{ order.row.order.createTime.replace('T', ' ') }} <br>
              付款时间：{{ order.row.order.orderDate.replace('T', ' ') }} <br>
              发货时间：{{ item.order.deliveryDate.replace('T', ' ') }} <br>
              成交时间：{{ order.row.order.receiveDate.replace('T', ' ') }}
            </div>
            <div v-if="order.row.order.orderStatus === 4" slot="content">
              创建日期：{{ order.row.order.createTime.replace('T', ' ') }} <br>
              付款时间：{{ order.row.order.orderDate.replace('T', ' ') }} <br>
              发货时间：{{ item.order.deliveryDate.replace('T', ' ') }} <br>
              成交时间：{{ order.row.order.receiveDate.replace('T', ' ') }} <br>
              退货时间：{{ order.row.order.returnDate.replace('T', ' ') }}
            </div>
            <button style="border: none;background: white;font-size: 12px;color: #4c5055">详情</button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div  class="my-payment-view">
      <div style="width: 30px;float: left">
        <el-button v-if="isAll" circle @click="selectAll(orderList)" size="mini" style="position: relative;top: 0px;left: 10px;background-color: #409EFF;
    border-color: #409EFF;">
          <i class="el-icon-check" style="color: white"></i>
        </el-button>
        <el-button v-else circle @click="selectAll(orderList)" style="position: relative;top: -4px;left: 10px;height: 28px;width: 28px">
        </el-button>
      </div>
      <div style="width: 810px;float: left;">
        <span style="margin-left: 14px;font-size: 14px">全选</span>
        <span style="margin-left: 510px;font-size: 14px;margin-top: 8px">合计: <span style="color: red;">¥</span> </span>
        <span class="my-price" >{{ totalPrice.toFixed(2) }}</span>
        <el-button @click="payment" type="danger" style="margin-left: 30px;margin-top: -10px" round>立即结算</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import async from "async";

export default {
  name: "shoppingCart",
  data() {
    return {
      orderList: [],
      totalPrice: 0,
      isAll: false,
      multipleSelection: [],
      orderListVO:{
        password: '',
        orderIdList: [],
      },
    }
  },
  created() {
    this.getOrderList()
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.totalPrice = 0
      this.multipleSelection.forEach(order =>{
        this.totalPrice += order.order.totalPrice
      })
      if (this.multipleSelection.length === this.orderList.length){
        this.isAll = true
      }else {
        this.isAll = false
      }
    },
    payment() {
      if (this.totalPrice === 0){
        this.$message.warning("你还没有选中任何商品哦")
        return false
      }
      this.$prompt('请输入密码', '验证', {
        confirmButtonText: '付款',
        inputPattern: /^\d{6}$/,
        inputErrorMessage: '密码为6位数字'
      }).then(({value}) => {
        this.orderListVO.password = value
        this.multipleSelection.forEach(order =>{
          this.orderListVO.orderIdList.push(order.order.orderId)
        })
        const _this = this
         this.$axios.put('/orders/payment',this.orderListVO).then(async res => {
           console.log(res);
           _this.getOrderList()
           _this.isAll = false
           if (res.data.data.length > 0) {
             for (const data of res.data.data) {
               await _this.$message.error(data)
             }
           } else {
             _this.$message.success("付款成功");
           }
         }).catch(err =>{
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    },
    getStore(storeId) {
      this.$router.push({
        name: 'Store',
        params: {
          storeId: storeId,
        }
      })
    },
    GoodsDetail(goodsId) {
      this.$router.push(`/goodsDetail/${goodsId}`)
    },
    toStore(row, column, cell, event){
      if (column.index === 4){
        this.getStore(row.order.storeId)
      }else if(column.index === 0 || column.index === 7){

      }else {
        this.GoodsDetail(row.goods.goodsId)
      }
    },
    cellClassName({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    selectAll() {
      if (this.multipleSelection.length < this.orderList.length ){
        this.$refs.multipleTable.toggleAllSelection();
      }else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    to(path){
      this.$router.push(path)
    },
  }
}
</script>

<style scoped>
#shoppingCart {
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
.my-price {
  font-size: 18px;
  color: red;
}

.my-el-tabs {
  width: 898px;
  text-align: center;
  margin: 14px auto 0 auto;
}

.el-table--border::after {
  width: 0px;
}
.my-payment-view{
  width: 846px;
  height: 52px;
  line-height: 48px;
  margin: 10px auto;
  background: white;
}
.my-payment-view1{

}
.my-payment-view2{

}
</style>
<template>
  <div id="shoppingCart">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <h2 class="my-title"> 购物车 </h2>
    <el-table
        ref="multipleTable"
        border
        :data="orderList"
        tooltip-effect="dark"
        style="width: 856px;margin: 10px auto 14px auto;font-size: 10px"
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
          label="操作"
          width="100"
          align="center">
        <template slot-scope="order">
          <el-button type="danger" @click="removeOrder(order.row.order.orderId)">删除</el-button>
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
      <div style="width: 820px;float: left;">
        <span style="margin-left: 14px;font-size: 14px">全选</span>
        <span style="margin-left: 510px;font-size: 14px;margin-top: 8px">合计: <span style="color: red;">¥</span> </span>
        <span class="my-price" style="display: inline-block;width: 90px">{{ totalPrice.toFixed(2) }}</span>
        <el-button @click="payment" type="danger" style="margin-left: 24px;margin-top: -10px" round>立即结算</el-button>
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
        inputErrorMessage: '密码为6位数字',
        inputType: 'password',
        closeOnClickModal: false,
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
           this.$store.commit("NewOrder",1)
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
        this.getStore(row.goods.studentId)
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
    removeOrder(orderId){
      this.$confirm('此操作将该订单删除, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/order/'+orderId).then(res =>{
          this.$message.success("删除成功")
          this.getOrderList()
        }).catch(err =>{
          console.log(err);
        })
      }).catch(() => {
        this.$message.info("已取消删除")
      });
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
  width: 855px;
  height: 52px;
  line-height: 48px;
  margin: -14px auto 16px auto;
  background: white;
}
.my-payment-view1{

}
.my-payment-view2{

}
</style>
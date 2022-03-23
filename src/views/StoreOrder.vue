<template>
  <div id="order">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <h2 class="my-title"> 店铺订单 </h2>
    <div>
      <el-tabs v-model="activeName"  type="border-card" @tab-click="handleClick" class="my-el-tabs" >
        <el-tab-pane label="待发货" name="first">

        </el-tab-pane>
        <el-tab-pane label="已发货" name="second">

        </el-tab-pane>
        <el-tab-pane label="已收货" name="third">

        </el-tab-pane>
        <el-tab-pane label="已评价" name="fourth">

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
          prop="user.userName"
          label="用户名"
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
          <el-button v-if="order.row.order.orderStatus === 1" @click="deliver(order.row.order.orderId)" type="danger"  size="small"  >发货</el-button>
          <el-button v-if="order.row.order.orderStatus === 2"  type="danger"  size="small" >已发货</el-button>
          <el-button v-if="order.row.order.orderStatus === 3"  type="danger"  size="small" >已收货</el-button>
          <el-button v-if="order.row.order.orderStatus === 4"  type="primary" size="small" >已评价</el-button>
          <el-button v-if="order.row.order.orderStatus === 5" @click="returnGoods(order.row.order.orderId)" type="danger"  size="small" >确认退货</el-button>
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
             <div v-if="order.row.order.orderStatus === 4" slot="content">创建日期：{{order.row.order.createTime.replace('T',' ')}} <br> 付款时间：{{order.row.order.orderDate.replace('T',' ')}} <br> 发货时间：{{order.row.order.deliveryDate.replace('T',' ')}} <br> 成交时间：{{order.row.order.receiveDate.replace('T',' ')}} <br> 退货时间：{{order.row.order.returnDate.replace('T',' ')}}</div>
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
  mounted() {
    this.initWebSocket(); //页面渲染的时候，对ws进行初始化
  },
  data() {
    return {
      userInfo: {},
      orderList: [],
      orderVo: {},
      websocket: {},
      activeName: 'first',
    }
  },
  methods: {
    getOrderList() {
      const _this = this
      this.$axios.get('/orderListByStoreId/1').then(res => {
        this.orderList = res.data.data
        console.log(res.data.data);
      }).catch(err => {
        console.log(err);
      })
    },
    getUser(storeId){
      // this.$router.push({
      //   name: 'Store',
      //   params :{
      //     storeId: storeId,
      //   }
      // })
    },
    GoodsDetail(goodsId){
      this.$router.push(`/goodsDetail/${goodsId}`)
    },
    deliver(orderId){
      const _this = this
      this.$axios.put('/order/deliver/'+orderId).then(res =>{
        _this.$message.success("发货成功")
        _this.getOrderList()
      }).catch(err =>{
        console.log(err);
      })
    },
    returnGoods(orderId){

    },
    handleClick(tab) {
      const _this = this
      let index = parseInt(tab.index)
      index += 1
      this.$axios.get('/orderListByStatus/' + index).then(res => {
        _this.orderList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    toStore(row, column, cell, event){
      if (column.index === 3){
        this.getUser(row.user.studentId)
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
    initWebSocket(){
      const _this = this
      if('WebSocket' in window){
        this.websocket = new WebSocket('ws://localhost:8081/webSocket/'+this.userInfo.studentId);
      }else{
        alert('当前浏览器不支持websocket消息通知');
      }

      //连接成功建立的回调方法
      this.websocket.onopen = function (event) {
        console.log("ws建立连接成功");
      }

      //连接关闭的回调方法
      this.websocket.onclose = function (event) {
        console.log("ws连接关闭");
      }

      //接收到消息的回调方法
      this.websocket.onmessage = function (event) {
        // setMessageInnerHTML(event.data);
        // alert("ws接收返回消息："+event.data);
        _this.getOrderList()
        _this.$message({
          message: '你有新的订单哦',
          type: 'success',
          duration: 0,
          showClose: true
        })
      }

      //连接发生错误的回调方法
      this.websocket.onerror = function(event){
        alert('websocket通信发生错误！')
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        this.websocket.close();
      }
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
.my-title {
  color: #15b4f1;
  font-size: 30px;
  margin-left: 12vmax;
  margin-top: -26px;
}
.my-price{
  font-size: 18px;
  color: red;
}
.my-el-tabs{
  width: 898px;
  text-align: center;
  margin: 10px auto 0 auto;
}
.el-table--border::after{
  width: 0px;
}
</style>
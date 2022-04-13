<template>
  <div id="manage">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1" style="margin-left: 20px">用户管理</el-menu-item>
      <el-menu-item index="2" >账户管理</el-menu-item>
      <el-menu-item index="3" >订单管理</el-menu-item>
      <el-dropdown trigger="click" class="el-dropdown-link">
      <span>
        <el-avatar src="/rootPicture.jpeg" ></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown" class="my-el-dropdown-item">
        <el-dropdown-item><el-link @click="logout">退出账号</el-link></el-dropdown-item>
      </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <div v-if="value === '1'">
      <div>
        <h2 style="margin-left: 5vmax;margin-top: 20px;margin-bottom: -10px">用户信息</h2>
        <el-button @click="allUser" type="primary" size="small" style="margin-left: 232px;">所有用户</el-button>
        <el-input class="my-query-style"
            placeholder="通过学号查询"
            v-model="inputValue">
        </el-input>
        <el-button @click="search(1)" icon="el-icon-search" size="small" style="position: relative;left: -50px;top: -1px"></el-button>
      </div>
      <div v-for="(item,index) in users" class="my-user-main">
        <div @click="toUser(item.user.studentId)" >
          <el-avatar class="my-contact-picture" fit="cover" :src="item ? item.user.picture : '/user/123abc.jpeg'" ></el-avatar>
        </div>
        <el-link @click="toUser(item.user.studentId)" class="my-contact-username" :underline="false">
          <p style="height: 24px;overflow: hidden">
            {{item.user.userName}}
          </p>
        </el-link>
        <el-link class="my-contact-storeName" :underline="false" @click="toStore(item.user.studentId,item.user.status)">
          <p style="height: 24px;overflow: hidden">
            {{item.store ? item.store.storeName : '未开通店铺'}}
          </p>
        </el-link>
        <div class="my-talk" @click="toChat(item.user.studentId)">
          <i class="el-icon-chat-dot-round" style="font-size: 30px;color: #409EFF"></i>
          <span style="position: relative;top: -6px">私信</span>
        </div>
        <el-button @click="removeUser(item.user.studentId,index)" class="my-button" type="danger" icon="el-icon-delete" circle></el-button>
        <el-button v-if="item.user.status < 2"  class="my-button3" type="info" icon="el-icon-bank-card" circle></el-button>
        <el-button v-if="item.user.status >= 2 && item.account.status !== 1" @click="lockAccount(item.user.studentId,index)" class="my-button3" type="success" icon="el-icon-bank-card" circle></el-button>
        <el-button v-if="item.user.status >= 2 && item.account.status === 1" @click="unlockAccount(item.user.studentId,index)" class="my-button3" type="danger" icon="el-icon-bank-card" circle></el-button>
        <el-button v-if="item.user.status !== 1" @click="lockUser(item.user.studentId,index)" class="my-button2" type="success" icon="el-icon-unlock" circle></el-button>
        <el-button v-else @click="unlockUser(item.user.studentId,index)" class="my-button2" type="danger" icon="el-icon-lock" circle></el-button>
      </div>
    </div>


    <div v-if="value === '2'">
      <div>
        <h2 style="margin-left: 5vmax;margin-top: 20px;margin-bottom: -10px">账户信息</h2>
        <div style="width: 500px;text-align: center;margin: 0px auto">
          <el-input class="my-query-style2"
                    placeholder="通过学号查询账户消费情况"
                    v-model="inputValue">
          </el-input>
          <el-button @click="search(2)" icon="el-icon-search" size="small" style="position: relative;left: -50px;top: -1px"></el-button>
        </div>
      </div>
      <div>
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

      <div v-if="expense.length === 0 && isShow"  style="text-align: center;font-size: 20px;margin-top: 140px;margin-bottom: 60px;color: #FF6200">
        <i class="el-icon-s-promotion"></i> 该学号没有任何交易记录哦！
      </div>

    </div>

    <div v-if="value === '3'">
      <div>
        <h2 style="margin-left: 5vmax;margin-top: 20px;margin-bottom: -10px">订单信息</h2>
        <div style="width: 500px;text-align: center;margin: 0px auto">
          <el-input class="my-query-style2"
                    placeholder="通过学号查询用户订单信息"
                    v-model="inputValue">
          </el-input>
          <el-button @click="search(3)" icon="el-icon-search" size="small" style="position: relative;left: -50px;top: -1px"></el-button>
        </div>
      </div>
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
  name: "Manage",
  data() {
    return {
      activeIndex: '1',
      users: [],
      expense: [],
      order: [],
      orderList: [],
      activeName: 'first',
      page: 1,
      resultPage: {},
      inputValue: '',
      value: '1',
      isShow: false,
      dialogFormVisible: false,
    };
  },
  created() {
    this.getUsers()
  },
  methods: {
    handleSelect(key, keyPath) {
      this.value = key
      this.inputValue = ''
      if (key === '1'){
        this.getUsers()
      }else if (key === '2'){
        this.resultPage.total = 0
      }else {
        this.resultPage.total = 0
        this.orderList = []
      }
    },
    getUsers() {
      this.$axios.get('/user/page/' + this.page).then(res => {
        this.users = res.data.data.data
        this.resultPage = res.data.data.page
      }).catch(err => {
      })
    },
    getExpense(){
      this.$axios.get('/expense/page/'+this.inputValue + '/' + this.page).then(res =>{
        this.resultPage = res.data.data
        this.expense = this.resultPage.records
      }).catch(err =>{
      })
    },
    getOrderList(status) {
      this.$axios.get('/orderListByStudentIdAndStatus/'+this.inputValue+'/'+status).then(res => {
        this.orderList = res.data.data
        this.resultPage.total = 0
      }).catch(err => {
        console.log(err);
      })
    },
    toChat(studentId) {
      this.$router.push("/chat/" + studentId)
    },
    toUser(studentId) {
      this.$router.push("/userDetail/" + studentId)
    },
    toStore(studentId, status) {
      if (status === 3) {
        this.$router.push("/store/" + studentId)
      } else {
        this.$message.warning("该用户没有开通店铺")
      }
    },
    toOrder(orderId){
      this.dialogFormVisible = true
      this.$axios.get('/order/'+orderId).then(res =>{
        this.order = []
        this.order.push(res.data.data)
      })
    },
    logout() {
      this.$confirm("确认退出账号吗", "提示", {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        this.$store.commit('REMOVE_USER')
        this.$store.commit('ChangeLogin', false)
        this.$store.commit('RemoveChat')
        this.$store.commit('RemoveNum')
        this.$router.push('/root')
      }).catch(() => {
      });
    },
    changePage(newPage){
      this.page = newPage
      if (this.value === '1'){
        this.getUsers()
      }else if (this.value === '2'){
        this.getExpense()
      }else {
      }
    },
    removeUser(studentId){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/user/' + studentId).then(res => {
          this.$message.success("用户删除成功")
          this.getUsers()
        }).catch(err => {
          this.$message.error("用户删除失败")
        })
      }).catch(() => {
        this.$message.info("已取消删除")
      });
    },
    lockAccount(studentId){
      this.$axios.put("/account/"+studentId).then(res =>{
        this.$message.success("账户锁定成功")
        this.getUsers()
      }).catch(err =>{

      })
    },
    unlockAccount(studentId){
      this.$axios.put("/account/"+studentId).then(res =>{
        this.$message.success("账户解锁成功")
        this.getUsers()
      }).catch(err =>{

      })
    },
    lockUser(studentId){
      this.$axios.put('/user/status/'+studentId).then(res =>{
        this.$message.success("账号锁定成功")
        this.getUsers()
      }).catch(err =>{
      })
    },
    unlockUser(studentId){
      this.$axios.put('/user/status/'+studentId).then(res =>{
        this.$message.success("账号解锁成功")
        this.getUsers()
      }).catch(err =>{
      })
    },
    allUser(){
      this.getUsers()
    },
    search(flag){
      if (this.inputValue.match(/^[\s　]*$/)){
        this.$message.warning("不能查询空串")
        return false
      }
      if (flag === 1){
        this.$axios.get('/userByStudentId/'+this.inputValue).then(res =>{
          console.log(res)
          this.users = []
          this.users.push(res.data.data)
          this.resultPage.total = 0
        }).catch(err =>{
        })
      }else if (flag === 2){
        this.getExpense(this.inputValue)
        this.isShow = true
      }else {
        this.getOrderList(0)
        this.isShow = true
      }
    },
    handleClick(tab) {
      if (this.inputValue.match(/^[\s　]*$/)) {
        this.$message.warning("不能查询空串")
        return false
      }
      this.getOrderList(tab.index)
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
  }
}


</script>

<style scoped>
#manage{
  overflow: hidden;
  min-height: calc(100vh);
  background: #efe8e8;
}
.my-query-style{
  width: 200px;
  margin-left: 620px;
  margin-bottom: 10px;
}
.my-query-style2{
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
.my-contact-picture{
  float: left;
  margin-top: 5px;
  height: 70px;
  width: 70px;
  margin-left: 10px;
}
.my-contact-username{
  float: left;
  width: 200px;
  height: 24px;
  text-align: center;
  margin-top: 26px;
  font-size: 20px;
  margin-left: 10px;
}
.my-contact-storeName{
  float: left;
  width: 200px;
  height: 24px;
  text-align: center;
  margin-top: 26px;
  font-size: 20px;
}
.my-talk{
  float: left;
  width: 110px;
  margin-top: 26px;
  padding-left: 50px;
}
.my-button{
  float: right;
  width: 40px;
  margin-top: 18px;
  margin-right: 20px;
}
.my-button2{
  float: right;
  width: 40px;
  margin-top: 18px;
  margin-right: 50px;
}
.my-button3{
  width: 40px;
  margin-top: 18px;
}
.el-dropdown-link{
  margin-top: 10px;
  margin-left: 70vmax;
}
.my-page-style{
  text-align: center;
  width: 500px;
  margin: 10px auto;
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
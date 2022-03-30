<template>
  <div id="order">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <h2 class="my-title"> 我的购物订单 </h2>
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
          <el-button v-if="order.row.order.orderStatus === 0 " @click="payment(order.row.order.orderId)" type="danger"  size="medium" >付款</el-button>
          <el-button v-if="order.row.order.orderStatus === 1 " @click="quick(order.row.order.orderId)" type="danger"  size="small"  >催发货</el-button>
          <el-button v-if="order.row.order.orderStatus === 2 " @click="receive(order.row.order.orderId)" type="danger"  size="small" >确认收货</el-button>
          <el-button v-if="order.row.order.orderStatus === 3 " @click="toComment(order.row.order.goodsId,order.row.order.orderId)" type="danger"  size="small" >评价</el-button>
          <el-button v-if="order.row.order.orderStatus === 4 " @click="returnGoods(order.row.order.orderId)" type="danger"  size="medium" >退货</el-button>
          <el-button v-if="order.row.order.orderStatus === 5 " type="danger"  size="small" >退货中</el-button>
          <el-button v-if="order.row.order.orderStatus === 6 " type="primary"  size="small" >已退款</el-button>
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
           <el-button v-if="order.row.order.orderStatus === 0 " @click="removeOrder(order.row.order.orderId)" type="danger"  size="medium" class="my-remove-order">删除</el-button>
         </template>
      </el-table-column>
    </el-table>

    <el-dialog title="商品评价" :visible.sync="dialogFormVisible" style="margin-top: -20px">
      <el-form :model="comment" ref="comment" :rules="rules">
        <el-form-item label="星级" label-width="80px" prop="grade">
          <div class="my-grade">
            <el-rate
                v-model="comment.grade"
                :colors="colors">
            </el-rate>
          </div>
        </el-form-item>
        <el-form-item label="评价" label-width="80px" prop="content">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="comment.content" style="width: 500px">
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片" label-width="80px" >
          <el-upload
              action="http://localhost:8081/image/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :limit="5"
              :headers="header"
              :on-exceed="MaxFile"
              :on-success="success"
              ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeComment">取 消</el-button>
        <el-button type="primary" @click="postComment">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "order",
  data() {
    return {
      userInfo: {},
      orderList: [],
      orderVo: {},
      header: {
        'Authorization': ''
      },
      activeName: 'first',
      dialogFormVisible: false,
      commentForm:{

      },
      dialogImageUrl: '',
      dialogVisible: false,
      comment:{
        studentId: 0,
        goodsId: 0,
        content: '',
        grade: 3,
        orderId: 0,
        images: [],
      },
      rules: {
        grade: [
          {required: true, message: '请打评分', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请输入商品评价', trigger: 'blur'},
          {min: 5, max: 250, message: '长度在 5 到 250 个字符之间', trigger: 'blur'}
        ],
      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    }
  },
  created() {
    this.userInfo = this.$store.state.userInfo
    this.header.Authorization = this.$store.state.token
    this.getOrderList(0)
  },
  methods: {
    getOrderList(status) {
      this.$axios.get('/orderListByStatus/'+status).then(res => {
        this.orderList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    getStore(storeId){
      this.$router.push('/store/'+storeId)
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
          _this.getOrderList(0)
        }).catch(err =>{
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    },
    quick(){
      this.$message.success("已经提醒商家发货")
    },
    receive(orderId){
      this.$axios.put('/order/receive/'+orderId).then(res =>{
        this.$message.success("收货成功")
        this.getOrderList(2)
      }).catch(err =>{
        console.log(err);
      })
    },
    returnGoods(orderId){
      this.$axios.put('/order/requestReturn/'+orderId).then(res =>{
        this.$message.success("退货申请发送成功")
        this.getOrderList(4)
      }).catch(err =>{
        console.log(err)
      })
    },
    handleClick(tab) {
      const _this = this
      this.$axios.get('/orderListByStatus/' + tab.index).then(res => {
        _this.orderList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    toStore(row, column, cell, event){
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
          this.getOrderList(0)
        }).catch(err =>{
          console.log(err);
        })
      }).catch(() => {
        this.$message.info("已取消删除")
      });
    },
    toComment(goodsId,orderId){
      this.dialogFormVisible = true
      this.comment.studentId = this.userInfo.studentId
      this.comment.goodsId = goodsId
      this.comment.orderId = orderId
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let param = {path: file.response.data}
      this.$axios.delete('/image/remove', {params: param}).then(res => {
        console.log(res);
        this.removeImage(file.response.data)
      }).catch(err => {
        console.log(err);
      })
    },
    removeImage(value) {
      const index = this.comment.images.indexOf(value);
      if (index > -1) {
        this.comment.images.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    success(response, file, fileList) {
      this.comment.images.push(response.data)
    },
    MaxFile() {
      this.$message.warning("最多只能上传5张图片哦")
    },
    deleteImages() {
      const length = this.comment.images.length
      for (let i = 0; i <length ; i++) {
        let param = {path: this.comment.images[i]}
        this.$axios.delete('/image/remove', {params: param}).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })
      }
    },
    postComment(){
      this.$refs.comment.validate((valid) => {
        if (valid) {
          this.$axios.post('/comment',this.comment).then(res =>{
            this.$message.success("评价成功")
            this.dialogFormVisible = false
            this.getOrderList(3)
          }).catch(err =>{
            console.log(err);
          })
        }else{
          return false
        }
      })
    },
    closeComment(){
      this.dialogFormVisible = false
      this.editFlag = false
      this.deleteImages()
      this.comment.content = ''
      this.comment.images = []
      this.$refs.upload.clearFiles()
      this.$refs.comment.resetFields();
    }
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
.my-remove-order{
  position: absolute;
  top: 37px;
  left: 8px;
}
.dialog-footer {
  margin-top: -30px;
}
.my-grade{
  height: 40px;
}
/deep/ .el-rate__icon{
  font-size: 30px;
}
</style>
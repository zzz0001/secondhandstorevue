<template>
  <div id="goodsDetail">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div class="block">
      <div class="my-carousel">
        <el-carousel trigger="click" height="320px">
          <el-carousel-item v-for="item in goods.images" :key="item">
            <el-image v-if="item"
                      style="width: 320px; height: 320px;border-radius: 6px"
                      :src="item ? item : '' "
                      fit="cover">
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="my-goods-description">
        <h3 style="max-height: 42px;overflow: hidden;width: 400px;margin-bottom: 6px;">{{ goods.goods.goodsName }}</h3>
        <div style="background: rgba(253,236,236,0.8);margin-left: -8px">
          <span style="color: red;font-size: 28px;width: 240px;display:inline-block;margin-left: 8px"> ¥ {{ TotalPrice.toFixed(2) }} </span>
          <span style="margin-left: 84px;font-size: 16px"> 库存: {{ goods.goods.goodsInventory }}</span>
        </div>
        <p style="width: 400px;margin-bottom: 6px;margin-top: 8px;font-size: 16px">描述:</p>
        <p style="font-size: 16px;max-height: 84px;min-height: 84px;overflow: hidden;">&nbsp;&nbsp;&nbsp;
          {{ goods.goods.goodsIntroduce }}</p>
        <div style="background: ghostwhite;margin-bottom: 14px;margin-top: 4px">
          <span>数量:</span>
          <el-input-number size="small" v-model="order.goodsNum" :min="1" :max="goods.goods.goodsInventory"
                           style="margin-left: 14px"></el-input-number>
          <span style="margin-left: 170px;">
            <span v-if="goods.goods.goodsInventory < 1" style="color: red;font-size: 18px">缺货</span>
            <span v-else>有货</span>
          </span>
        </div>
        <div>
          <el-button @click="buyGoods" type="primary" style="margin-left: 50px">立即购买</el-button>
          <el-button @click="addOrder(1)" type="danger" style="margin-left: 50px"><i
              class="el-icon-shopping-cart-full"></i> 加入购物车
          </el-button>
        </div>
        <el-link @click="collectionGoods" style="margin-left: 320px;margin-top: 6px" :underline="false"><i class="el-icon-star-off" style="color: #FF6200"/>收藏商品</el-link>
      </div>
    </div>

    <div class="clear"></div>

    <div class="my-goods-comment">
      <p style="font-size: 18px;color: #FF6200"> 商品评价 </p>
      <div v-for="item in comments.comment" class="my-goods-comment-item">
        <div @click="toUser(item.user.studentId)">
          <el-avatar  class="my-contact-picture" fit="cover" :src="item ? item.user.picture : '/user/123abc.jpeg'" ></el-avatar>
          <p style="padding-top: 14px;float: left;margin-left: 10px;width: 200px"> {{item.user.userName}} </p>
          <div style="margin-left: 500px;padding-top: 10px">
            <el-rate
                      v-model="item.comment.grade"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}">
            </el-rate>
          </div>
        </div>
        <div class="clear"></div>
        <div>
          <p style="margin-top: 6px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.comment.content}}</p>
        </div>
      </div>
      <div v-if="comments.comment.length === 0">
        <p style="text-align: center;width: 700px;font-size: 18px;color: #FF6200;"><i class="el-icon-s-promotion"></i> 该商品暂时没有评价哦</p>
      </div>
    </div>

    <div class="my-page-style">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :hide-on-single-page="true"
          :current-page="page"
          :total="comments.page.total">
      </el-pagination>
    </div>

    <div class="toStore" @click="toStore">
      <i class="el-icon-s-shop" style="font-size: 30px;color: #409EFF"></i>
      <p style="font-size: 16px;color: #38383b">店铺</p>
    </div>
    <div class="my-talk" @click="toChat">
      <i class="el-icon-chat-dot-round" style="font-size: 30px;color: #409EFF"></i>
      <p style="font-size: 16px;color: #38383b">客服</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsDetail",
  data() {
    return {
      goodsId: 0,
      goods: {
        goods: {
          studentId: 0,
          goodsName: '',
          goodsIntroduce: '',
          goodsCategory: 0,
          goodsPrice: 0,
          goodsInventory: 10,
        },
        images: [],
      },
      store: {},
      order: {
        orderId: -1,
        storeId: 0,
        studentId: 0,
        goodsId: 0,
        goodsNum: 1,
        totalPrice: 0,
      },
      collection: {
        goodsId: 0,
        studentId: 0,
        goodsCategory: 0,
      },
      comments:{
        comment: [],
        page: {},
      },
      page: 1,
    }
  },
  created() {
    this.getGoods()
    this.getStore()
    this.getComment()
  },
  methods: {
    getGoods() {
      this.goodsId = this.$route.params.goodsId
      const _this = this
      this.$axios.get('/goods/' + this.goodsId).then(res => {
        _this.goods = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    getComment(page){
      this.$axios.get("/comment/page/"+ this.goodsId +"/"+this.page).then(res =>{
        this.comments = res.data.data
      }).catch(err =>{
        console.log(err);
      })
    },
    getStore(){
      const _this = this
      this.$axios.get('/storeByGoodsId/' + this.goodsId).then(res => {
        _this.store = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    getOrder(){
      this.order.goodsId = this.goodsId
      this.order.studentId = this.$store.state.userInfo.studentId
      this.order.storeId = this.goods.goods.studentId
      this.order.totalPrice = this.TotalPrice
    },
    getCollection(){
      this.collection.studentId = this.$store.state.userInfo.studentId
      this.collection.goodsId = this.goodsId
      this.collection.goodsCategory = this.goods.goods.goodsCategory
    },
    buyGoods(){
      this.addOrder(0)
    },
    addOrder(status){
      this.getOrder()
      if (this.order.orderId != -1){
        if (status === 0){
          this.$router.push('/order')
        }else{
          this.$message.warning("商品已添加到购物车,不能重复添加")
        }
        return false
      }
      const _this = this
      this.$axios.post('/order',this.order).then(res =>{
        _this.order.orderId = res.data.data
        if (res.data.code === 415){
          if (status === 0){
            _this.$router.push('/order')
          }else{
            _this.$message.warning("商品已添加到购物车,不能重复添加")
          }
        }else {
          if (status === 1){
            _this.$message.success("商品已加入购物车")
          }else{
            _this.$router.push('/order')
          }
        }
      }).catch(err =>{
        console.log(err);
      })
    },
    collectionGoods(){
      this.getCollection()
      const _this = this
      this.$axios.post('/collection',this.collection).then(res =>{
        if (res.data.code === 415){
          _this.$message.warning(res.data.message)
        }else {
          _this.$message.success("商品收藏成功")
        }
      }).catch(err =>{
        console.log(err);
      })
    },
    to(path){
      this.$router.push(path)
    },
    toStore(){
      this.$router.push('/store/'+this.goods.goods.studentId)
    },
    toChat(){
      this.$router.push("/chat/"+this.goods.goods.studentId)
    },
    toUser(studentId){
      this.$router.push("/userDetail/"+studentId)
    },
    changePage(newPage) {
      this.page = newPage
      this.getComment()
    },
  },
  computed: {
    TotalPrice() {
      return this.goods.goods.goodsPrice * this.order.goodsNum
    }
  },

}
</script>

<style scoped>

#goodsDetail {
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}

.block {
  width: 800px;
  margin: 0 auto;
}

.my-carousel {
  width: 320px;
  float: left;
}

.my-goods-description {
  background: ghostwhite;
  padding: 6px 0px 10px 8px;
  margin-left: 20px;
  float: left;
  width: 400px;
  border-radius: 6px;
}
.my-editGoods{
  margin-left: 70px;
}
.my-talk{
  position: absolute;
  top: 140px;
  left: 80vmax;
}
.toStore{
  position: absolute;
  top: 80px;
  left: 80vmax;
}
.clear{
  clear:both;
}
.my-goods-comment{
  width: 800px;
  margin: 20px auto 10px auto;
}
.my-goods-comment-item{
  width: 750px;
  margin-left: 0px;
  margin-top: 4px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-image: linear-gradient(to right, #a8edea 0%, #e5d3d7 100%);
}
.my-contact-picture{
  float: left;
  margin-top: 5px;
  height: 40px;
  width: 40px;
}
.my-page-style{
  text-align: center;
  width: 500px;
  margin: 14px auto 14px auto;
}
</style>
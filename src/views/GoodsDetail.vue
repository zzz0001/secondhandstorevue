<template>
  <div id="goodsDetail">
    <el-link @click="to('/store')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
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
          <span style="margin-left: 90px;font-size: 16px"> 库存: {{ goods.goods.goodsInventory }}</span>
        </div>
        <p style="width: 400px;margin-bottom: 6px;margin-top: 8px;font-size: 16px">描述:</p>
        <p style="font-size: 16px;max-height: 84px;min-height: 84px;overflow: hidden;">&nbsp;&nbsp;&nbsp;
          {{ goods.goods.goodsIntroduce }}</p>
        <div style="background: ghostwhite;margin-bottom: 14px;margin-top: 4px">
          <span>数量:</span>
          <el-input-number size="small" v-model="order.goodsNum" :min="1" :max="goods.goods.goodsInventory"
                           style="margin-left: 20px"></el-input-number>
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
        <el-link @click="collectionGoods" style="margin-left: 320px;margin-top: 6px" :underline="false"><i class="el-icon-star-off"/>收藏商品</el-link>
      </div>
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
    }
  },
  created() {
    this.getGoods()
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
          this.$router.push(`/orderDetail/${this.order.orderId}`)
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
            _this.$router.push(`/orderDetail/${res.data.data}`)
          }else{
            _this.$message.warning("商品已添加到购物车,不能重复添加")
          }
        }else {
          if (status === 1){
            _this.$message.success("商品已加入购物车")
          }else{
            _this.$router.push(`/orderDetail/${res.data.data}`)
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
    }
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
  width: 750px;
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
</style>
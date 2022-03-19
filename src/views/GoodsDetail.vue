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
          <span style="margin-left: 90px;font-size: 16px"> 库存:{{ goods.goods.goodsInventory }}</span>
        </div>
        <p style="width: 400px;margin-bottom: 6px;margin-top: 8px;font-size: 16px">描述:</p>
        <p style="font-size: 16px;max-height: 84px;min-height: 84px;overflow: hidden;">&nbsp;&nbsp;&nbsp;
          {{ goods.goods.goodsIntroduce }}</p>
        <div style="background: ghostwhite;margin-bottom: 14px;margin-top: 4px">
          <span>数量:</span>
          <el-input-number size="small" v-model="order.goodsNum" :min="1" :max="goods.goods.goodsInventory"
                           style="margin-left: 20px"></el-input-number>
          <span style="margin-left: 170px;">
            <span v-if="goods.goods.goodsInventory < 1">缺货</span>
            <span v-else>有货</span>
          </span>
        </div>
        <div>
          <el-button @click="buyGoods" type="primary" style="margin-left: 50px">立即购买</el-button>
          <el-button @click="collectionGoods" type="danger" style="margin-left: 50px"><i
              class="el-icon-shopping-cart-full"></i> 加入购物车
          </el-button>
        </div>
        <el-link style="margin-left: 320px;margin-top: 6px" :underline="false"><i class="el-icon-star-off"/>收藏商品</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsDetail",
  data() {
    return {
      goodsId: '',
      goods: {
        goods: {
          goodsName: '',
          goodsIntroduce: '',
          goodsCategory: 0,
          goodsPrice: 0,
          goodsInventory: 10
        },
        images: [],
      },
      order: {
        goodsNum: 1,
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
    buyGoods(){

    },
    collectionGoods(){

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
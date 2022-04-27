<template>
  <div id="goodsQuery">
    <div class="my-home-header">
      <div class="my-deep-select">
        <el-select v-model="selectValue" placeholder="请选择" class="my-select-style">
          <el-option
              v-for="item in select"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="my-deep-input">
        <el-input placeholder="请输入要搜索的词" v-model="value" class="input-with-select" >
        </el-input>
      </div>
      <el-button @click="search" class="my-query-button" type="danger" >搜索</el-button>
    </div>

    <div  v-for="(item,index) in goodsList" class="my-goods-info" >
      <div class="my-goods-item">
        <el-link @click="getDetail(item.goods.goodsId)" :underline="false">
          <div>
            <el-image
                style="width: 200px; height: 200px;border-radius: 6px"
                :src="item.images ? item.images[0] : ''"
                fit="cover"></el-image>
          </div>
          <p class="my-goodsName">{{ item.goods.goodsName }}</p>
          <span style="color: red;margin-left: 4px;font-size: 20px;">¥ {{ item.goods.goodsPrice }} </span>
        </el-link>
      </div>
    </div>

    <div class="clear"></div>

    <div v-if="noFind"  style="text-align: center;font-size: 20px;margin-top: 60px;margin-bottom: 60px;color: #FF6200">
      <i class="el-icon-s-promotion"></i> 没有找到符合的商品哦，换个关键词试试！
    </div>

    <div class="my-page-style">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :hide-on-single-page="true"
          :current-page="page"
          :total="goodsPage.total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
export default {
  name: "GoodsQuery",
  data() {
    return {
      selectValue: 1,
      value: '',
      select: [
        {
          value: 1,
          label: '商品',
        },
        {
          value: 2,
          label: '店铺',
        }
      ],
      goodsList:[],
      goodsPage:{},
      page:1,
      category: 0,
      noFind: false,
    }
  },
  created() {
    this.category = this.$route.query.category
    this.value = this.$route.query.value
    if (this.category){
      this.getGoodsByCategory()
    }else{
      this.getGoodsByName()
    }
  },
  methods: {
    getGoodsByName() {
      this.$axios.get('/goodsByName/'+this.value+'/'+ this.page).then(res =>{
        if (res.data.data !== null){
          this.goodsList = res.data.data.goods
          this.goodsPage = res.data.data.page
        }else{
          this.goodsList = []
          this.goodsPage.total = 0
          this.noFind = true
        }
      }).catch(err =>{
        console.log(err)
      })
    },
    getGoodsByCategory(){
      this.$axios.get('/goodsByCategory/' + this.category + "/" + this.page).then(res => {
        if (res.data.data !== null){
          this.goodsList = res.data.data.goods
          this.goodsPage = res.data.data.page
        }else{
          this.goodsList = []
          this.goodsPage.total = 0
          this.noFind = true
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getDetail(goodsId) {
      this.$router.push('/goodsDetail/' + goodsId)
    },
    search() {
      if (this.value.match(/^[\s　]*$/)) {
        this.$message.warning("没有输入任何字符哦")
        return false
      }
      if (this.selectValue === 1) {
        this.$axios.get('/goodsByName/' + this.value + '/' + this.page).then(res => {
          if (res.data.data !== null){
            this.goodsList = res.data.data.goods
            this.goodsPage = res.data.data.page
          }else{
            this.goodsList = []
            this.goodsPage.total = 0
            this.noFind = true
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$axios.get('/user/' + this.value).then(res => {
          if (res.data.data.status === 3) {
            this.$router.push('/store/' + this.value)
          } else {
            this.$message.warning("没有找到该店铺")
          }
        })
      }
    },
    changePage(newPage) {
      this.page = newPage
      if(this.category){
        this.getGoodsByCategory()
      }else{
        this.getGoodsList()
      }
    },
  }
}


</script>

<style scoped>
#goodsQuery{
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}
.my-home-header{
  overflow: hidden;
  width: 800px;
  margin: 30px auto 20px auto;
}
.my-select-style{
  float: left;
  margin-left: 110px;
  margin-right: -1px;
  width: 100px;
}
.my-deep-select >>>.el-input__inner{
  border: 1px solid red;
  border-radius: 25px 0px 0px 25px;
}
.my-deep-input >>>.el-input__inner{
  border: 1px solid red;
  border-radius: 0px;
}
.input-with-select{
  float: left;
  width: 400px;
}
.my-query-button{
  border: 1px solid red;
  border-radius: 0px 25px 25px 0px;
  margin-left: -1px;
}
.my-goods-info {
  margin-left: 8vmax;
  margin-top: 4px;
  max-width: 85vmax;
  min-width: 85vmax;
}
.my-goods-item {
  border-radius: 10px;
  background: white;
  float: left;
  margin-left: 14px;
  padding: 4px;
  margin-bottom: 10px;
}
.my-goodsName {
  position: relative;
  max-height: 44px;
  min-height: 44px;
  overflow: hidden;
  max-width: 196px;
  margin-left: 4px;
  font-size: 16px;
}
.block{
  float: left;
  width: 520px;
  height: 280px;
  margin-left: 10px;
}
.my-news-main{
  float: left;
  width: 270px;
  height: 260px;
  background: white;
  margin-left: 10px;
  border-radius: 10px;
}
.my-news-item{
  font-size: 16px;
  margin-left: 10px;
  margin-bottom: 12px;
}
.clear{
  clear:both;
}
.my-page-style{
  text-align: center;
  width: 500px;
  margin: 14px auto 14px auto;
}
</style>
<template>
  <div id="home">
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
        <el-input placeholder="请输入要搜索的词 (支持学号查找店铺哦)" v-model="value" class="input-with-select" >
        </el-input>
      </div>
      <el-button @click="search" class="my-query-button" type="danger" >搜索</el-button>
    </div>

    <div class="my-home-carousel">
      <div class="my-home-category">
        <p style="font-size: 24px;color: #FF6200;text-align: center;margin-bottom: 10px">商品分类</p>
        <p class="my-goods-category">
          <el-link @click="queryByCategory(1)" :underline="false"><i class="el-icon-sunrise"></i>&nbsp;&nbsp;生活用品：护肤品 / 保温瓶 / 塑料盆 </el-link>
        </p>
        <p class="my-goods-category">
          <el-link @click="queryByCategory(2)" :underline="false"><i class="el-icon-reading"></i>&nbsp;&nbsp;书籍：校园课本 / 小说 / 漫画 / 笔记 </el-link>
        </p>
        <p class="my-goods-category">
          <el-link @click="queryByCategory(3)" :underline="false"><i class="el-icon-goods"></i>&nbsp;&nbsp;衣服：男装 / 女装 / 运动鞋 / 帽子 </el-link>
        </p>
        <p class="my-goods-category">
          <el-link @click="queryByCategory(4)" :underline="false"><i class="el-icon-basketball"></i>&nbsp;&nbsp;运动物品：篮球 / 足球 / 网球 / 乒乓球 </el-link>
        </p>
        <p class="my-goods-category">
          <el-link @click="queryByCategory(5)" :underline="false"><i class="el-icon-mobile-phone"></i>&nbsp;&nbsp;手机：安卓 / 苹果 / 耳机 / 充电器  </el-link>
        </p>
       <p class="my-goods-category">
         <el-link @click="queryByCategory(6)" :underline="false"><i class="el-icon-s-platform"></i>&nbsp;&nbsp;电脑周边：电脑 / 鼠标 / 键盘 / 散热板</el-link>
       </p>
      </div>
      <div class="block">
        <el-carousel trigger="click" height="260px">
          <el-carousel-item v-for="item in carouselList" :key="item">
            <el-image @click="queryByCategory(3)"
                style="width: 520px;height: 260px;border-radius: 10px "
                :src="item"
                fit="cover">
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="my-news-main">
        <p style="font-size: 24px;color: #111111;text-align: center;margin-bottom: 10px">校园新闻站</p>
        <el-link :underline="false" class="my-news-item"><i class="el-icon-s-promotion" style="color: #FF6200"></i> 校园招聘正在火热进行中，还没签约的同学冲冲冲！ </el-link>
        <el-link :underline="false" class="my-news-item"><i class="el-icon-s-promotion" style="color: #FF6200"></i> 数学与计算机学院的正式成立，新的培养方案已发布。 </el-link>
        <el-link :underline="false" class="my-news-item"><i class="el-icon-s-promotion" style="color: #FF6200"></i> 互联网+大赛的即将举办，为校友队伍加油！ </el-link>
        <el-link :underline="false" class="my-news-item"><i class="el-icon-s-promotion" style="color: #FF6200"></i> 百年校庆在全国各地校友的祝福下圆满结束，让我们携手共进！ </el-link>
      </div>
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

    <div v-if="goodsList.length === 0"  style="text-align: center;font-size: 20px;margin-top: 60px;margin-bottom: 60px;color: #FF6200">
      <i class="el-icon-s-promotion"></i> 没有找到符合的商品哦，换个关键词试试！
    </div>

    <div class="my-page-style">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :current-page="page"
          :total="goodsPage.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
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
      carouselList: ['main1.png','main2.png'],
      goodsList:[],
      goodsPage:{},
      page:1,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    getGoodsList(){
      this.$axios.get('/goodsPage/' + 1).then(res => {
        this.goodsList = res.data.data.goods
        this.goodsPage = res.data.data.page
      }).catch(err => {
        console.log(err);
      })
    },
    getDetail(goodsId){
      this.$router.push('/goodsDetail/'+goodsId)
    },
    search(){
      if (this.value.match(/^[\s　]*$/)){
        this.$message.warning("没有输入任何字符哦")
        return false
      }
      if (this.selectValue === 1){
        this.$router.push({
          path: 'goodsQuery',
          query: {
            value: this.value
          }
        })
      }else {
        this.$axios.get('/user/'+this.value).then(res => {
          if (res.data.data.status === 3){
            this.$router.push('/store/'+this.value)
          }else{
            this.$message.warning("没有找到该店铺")
          }
        })
      }
    },
    queryByCategory(category){
      this.$router.push({
        path: '/goodsQuery',
        query: {
          category: category
        }
      })
    },
    changePage(newPage){
      this.page = newPage
      this.$axios.get('/goodsPage/'+this.page).then(res =>{
        this.goodsList = res.data.data.goods
        this.goodsPage = res.data.data.page
      }).catch(err =>{
        console.log(err);
      })
    },
  }
}

</script>

<style scoped>
#home {
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
.my-home-carousel{
  width: 1130px;
  height: 280px;
  margin: 10px auto 0px auto;
}
.my-home-category{
  float: left;
  width: 300px;
  height: 260px;
  background: white;
  border-radius: 10px;
}
.my-goods-category{
  margin-left: 10px;
  font-size: 16px;
  margin-bottom: 12px;
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
  margin: 10px auto;
}
</style>

<template>
  <div id="home">
    <h1 class="my-button">首页信息</h1>

    <el-button @click="test(12)"></el-button>

    <el-image v-for="item in 2"
        style="width: 150px; height: 150px;border-radius: 10px"
        :src="item.images ? item.images.at(0) : ''"
        fit="cover">
    </el-image>

    <el-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">
      <el-button>下边</el-button>
    </el-tooltip>

  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
      goods:{},
    }
  },
  created() {
    this.getGoods()
  },
  methods:{
    getGoods(){
      this.userInfo = this.$store.state.userInfo
    },
    test(goodsId){
      this.$router.push({
        path: `/goodsDetail/${goodsId}`
      })
    }
  }
}

</script>

<style scoped>
#home {
  background: red;
  min-height: calc(100vh - 70px);
  overflow: hidden;
}
.my-button{
  /*margin-bottom: 900px;*/
}
.my-goods-info{
  float: left;
}
</style>

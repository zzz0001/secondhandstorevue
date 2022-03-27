<template>
  <div id="collection">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <div class="my-collection-info">
      <div v-for="(item,index) in collectionList.collection" class="my-collection-item">
        <div class="my-goods-item">
          <div>
            <el-link  @click="getStore(item.goods.studentId)" :underline="false">
              <span class="my-store-name"><i class="el-icon-s-shop" style="font-size: 16px"></i>{{ item.store.storeName }}</span>
            </el-link>
          </div>
          <el-link @click="getDetail(item.goods.goodsId)" :underline="false">
            <div>
              <el-image
                  style="width: 150px; height: 150px;border-radius: 6px"
                  :src="item.images ? item.images[0] : ''"
                  fit="cover"></el-image>
            </div>
            <p class="my-goodsName">{{ item.goods.goodsName }}</p>
            <span style="color: red;margin-left: 4px;font-size: 16px;">¥ {{ item.goods.goodsPrice.toFixed(2) }} </span>
          </el-link>
          <el-button  class="my-edit-button" icon="el-icon-delete" circle type="danger" size="mini"
                      @click="removeCollection(item.collection.collectionId)">
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Collection",
  data() {
    return {
      pageId: 1,
      collectionList: [],
    }
  },
  created() {
    this.getCollectionList()
  },
  methods: {
    to(path) {
      this.$router.push(path)
    },
    getCollectionList() {
      const _this = this
      this.$axios.get('/collection/'+this.pageId).then(res => {
        this.collectionList = res.data.data
      }).catch(err => {
        console.log(err);
      })
    },
    getStore(storeId) {
      this.$router.push('/store/'+storeId)
    },
    getDetail(goodsId) {
      this.$router.push(`/goodsDetail/${goodsId}`
      )
    },
    removeCollection(collectionId){
      const _this = this
      this.$confirm('此操作将该商品移除收藏, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/collection/'+collectionId).then(res =>{
          _this.$message.success("商品移除成功")
          this.getCollectionList()
        }).catch(err =>{

        })
      }).catch(() => {
        _this.$message.info("已取消删除")
      });
    }
  },
}
</script>

<style scoped>

#collection {
  overflow: hidden;
  min-height: calc(100vh - 70px);
  background: #efe8e8;
}

.my-collection-info {
  overflow: hidden;
  margin-left: 12vmax;
  margin-top: 0px;
  max-width: 80vmax;
  min-width: 80vmax;
}

.my-goodsName {
  position: relative;
  max-height: 22px;
  min-height: 22px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  max-width: 146px;
  margin-left: 4px;
  margin-bottom: 2px;
}

.my-collection-item {
  border-radius: 10px;
  background: white;
  float: left;
  margin-left: 14px;
  padding: 4px;
  margin-bottom: 10px;
}


.my-store-name {
  max-height: 24px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.my-edit-button {
  position: absolute;
  z-index: 10;
  margin-top: 172px;
  margin-left: -28px;
}

</style>
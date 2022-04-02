<template>
  <div id="store">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <h2 class="my-title"> {{ store.storeName ? store.storeName : '我的店铺' }}</h2>
    <span class="my-storeIntroduce">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{store.storeIntroduce ? store.storeIntroduce : '这是店铺描述哦~' }}</span>
    <el-button v-if="owner && userInfo.status === 3" type="primary" size="small" class="my-button" @click="dialogFormVisible = true">修改店铺信息
    </el-button>
    <div v-if="userInfo.status === 0 && owner" class="my-main-des">
      <el-button type="primary" @click="to('/userInfo')"> 开通账户</el-button>
      <div style="margin-left: 10px;margin-top: 20px">你需要先开通账户,才能开通店铺哦</div>
    </div>
    <div v-else-if="userInfo.status === 2 && owner" class="my-main-des">
      <el-button type="primary" @click="dialogFormVisible = true"> 开通店铺</el-button>
      <div style="margin-left: 2px;margin-top: 20px">你还没开通店铺哦</div>
    </div>
    <div v-else>
      <div v-for="(item,index) in goodsList" class="my-goods-info">
        <div class="my-goods-item">
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
          <el-button v-if="editStatus === 0 && owner" class="my-edit-button" icon="el-icon-edit" circle type="primary" size="mini"
                     @click="editGoods(index)">
          </el-button>
          <el-button v-if="editStatus === 1 && owner" class="my-edit-button" icon="el-icon-delete" circle type="danger" size="mini"
                     @click="removeGoods(item.goods.goodsId)">
          </el-button>
          <el-button v-if="editStatus === 2 && owner" class="my-edit-button" icon="el-icon-plus" circle type="primary" size="mini"
                     @click="addInventory(item.goods.goodsId)">
          </el-button>
          <el-button v-if="item.goods.goodsInventory === 0 " class="my-goods-inventory"  circle type="danger" >
            缺
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog title="开通店铺" :visible.sync="dialogFormVisible" width="40%" :close-on-click-modal='false' @close="closeChange">
      <el-form :model="store" :rules="rules" ref="store" hide-required-asterisk>
        <el-form-item label="店铺名称" label-width="80px" prop="storeName">
          <el-input v-model="store.storeName"></el-input>
        </el-form-item>
        <el-form-item label="店铺描述" label-width="80px" prop="storeIntroduce">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="store.storeIntroduce"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeChange">取消</el-button>
        <el-button v-if="userInfo.status === 2" type="primary" @click="openStore('store')">开通</el-button>
        <el-button v-else type="primary" @click="changeStore('store')">修改</el-button>
      </div>
    </el-dialog>
    <div v-if="owner && userInfo.status === 3">
      <el-button type="primary" size="small" class="my-button2" @click="addGoods">添加商品</el-button>
      <el-button  type="primary" size="small" class="my-button3" @click="editStatus=0">修改商品</el-button>
      <el-button  type="primary" size="small" class="my-button4" @click="editStatus=1">删除商品</el-button>
      <el-button  type="primary" size="small" class="my-button5" @click="editStatus=2">添加库存</el-button>
      <el-button type="danger" plain size="" class="my-button6" @click="toStoreOrder">店铺订单</el-button>
      <el-badge :value="$store.state.newNum" v-show="$store.state.newNum>0" class="item" >
      </el-badge>
    </div>
    <div class="my-chat" @click="toChat" v-if="!owner">
      <i class="el-icon-chat-dot-round" style="font-size: 30px;color: #409EFF"></i>
      <p style="font-size: 16px;color: #38383b">客服</p>
    </div>
    <el-dialog :visible.sync="dialogFormVisible2" width="40%" top="2vh" :close-on-click-modal='false' @close="closeGoods">
      <h2 style="position:absolute;margin-top: -40px;margin-bottom: 2px;font-size: 20px;color: #232a27">
        {{ editFlag ? '修改商品' : '添加商品' }} </h2>
      <el-form :model="goods" :rules="rules2" ref="goods" hide-required-asterisk>
        <el-form-item label="商品名称" label-width="80px" prop="goodsName">
          <el-input v-model="goods.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" label-width="80px" prop="goodsIntroduce">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6}" v-model="goods.goodsIntroduce"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" label-width="80px" prop="goodsCategory">
          <el-select v-model="goods.goodsCategory" placeholder="请选择" size="medium" style="width:425px">
            <el-option
                v-for="item in goodsCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" label-width="80px" prop="goodsPrice">
          <el-input v-model.number="goods.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" label-width="80px" prop="goodsInventory">
          <el-input v-model.number="goods.goodsInventory"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" label-width="80px">
          <div class="demo-image" v-if="editFlag" v-for="(item,index) in goods.images">
            <el-image v-if="item"
                      style="width: 150px; height: 150px;border-radius: 10px"
                      :src="item ? item : '' "
                      fit="cover"></el-image>
            <div class="my-delete-image" @click="EditAndDeleteImage(item,index)"><i class="el-icon-delete"></i></div>
          </div>
          <el-upload
              action="http://localhost:8081/image/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :limit="5"
              :headers="header"
              :on-exceed="MaxFile"
              :on-success="success"
              :before-upload="checkNumber"
              :show-file-list="!editFlag"
              ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" >
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer2">
        <el-button @click="closeGoods">取消</el-button>
        <el-button @click="postGoods" type="primary">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Store",
  data() {
    return {
      userInfo: {},
      store: {
        studentId: '',
        storeName: '',
        storeIntroduce: '',
      },
      rules: {
        storeName: [
          {required: true, message: '请输入店铺名称', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符之间', trigger: 'blur'}
        ],
        storeIntroduce: [
          {required: true, message: '请输入店铺描述', trigger: 'blur'},
          {min: 5, max: 250, message: '长度在 5 到 250 个字符之间', trigger: 'blur'}
        ],
      },
      rules2: {
        goodsName: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符之间', trigger: 'blur'}
        ],
        goodsIntroduce: [
          {required: true, message: '请输入商品描述', trigger: 'blur'},
          {min: 5, max: 250, message: '长度在 5 到 250 个字符之间', trigger: 'blur'}
        ],
        goodsCategory: [
          {required: true, message: '请输入商品类别', trigger: 'change'},
        ],
        goodsPrice: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
          {min: 1, max: 99999, type: 'number', message: '价格需为 1-99999', trigger: 'blur'}
        ],
        goodsInventory: [
          {required: true, message: '请输入商品库存', trigger: 'blur'},
          {min: 1, max: 999, type: 'number', message: '商品数量需为 1-999', trigger: 'blur'}
        ],
      },
      goods: {
        goodsName: '',
        images: [],
        goodsIntroduce: '',
        goodsCategory: 0,
        goodsPrice: 100,
        goodsInventory: 10
      },
      goodsList: {},
      goodsCategory: [
        {
          value: 1,
          label: '生活用品(护肤品、保温瓶、塑料盆...)'
        }, {
          value: 2,
          label: '书籍'
        }, {
          value: 3,
          label: '衣服'
        }, {
          value: 4,
          label: '运动物品(篮球、足球...)'
        }, {
          value: 5,
          label: '手机'
        }, {
          value: 6,
          label: '电脑、电脑周边'
        },
      ],
      header: {
        'Authorization': ''
      },
      FilePath: {
        path: '',
      },
      oldImage: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogImageUrl: '',
      dialogVisible: false,
      editFlag: false,
      editStatus: 0,
      owner: true,
      storeId: 0,
    }
  },
  created() {
    this.getUser()
    this.header.Authorization = this.$store.state.token
    this.storeId = this.$route.params.storeId
    if (parseInt(this.storeId) !== this.$store.state.userInfo.studentId){
      this.owner = false;
    }
    this.getStore()
    this.getGoods()
  },
  compute: {},
  methods: {
    getUser() {
      const studentId = this.$store.state.userInfo.studentId
      this.store.studentId = studentId
      if (studentId){
        this.$axios.get('/user/' + studentId).then(res => {
          this.userInfo = res.data.data
          this.$store.commit('SET_USERINFO', res.data.data)
        }).catch(err => {
          console.log(err);
        })
      }
    },
    getStore() {
      let studentId = ""
      if (this.owner){
        studentId = this.$store.state.userInfo.studentId
      }else {
        studentId = this.storeId
      }
      this.$axios.get('/storeByStudentId/' + studentId).then(res => {
        if (res.data.data) {
          this.store = res.data.data
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getGoods() {
      let studentId = ""
      if (this.owner){
        studentId = this.$store.state.userInfo.studentId
      }else {
        studentId = this.storeId
      }
      this.$axios.get('/goodsByStudentId/' + studentId).then(res => {
        if (res.data.data) {
          this.goodsList = res.data.data
        }
      }).catch(err => {
        console.log(err);
      })
    },
    to(path) {
      this.$router.push(path)
    },
    openStore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/store', this.store).then(res => {
            this.store = res.data.data
            this.getUser()
            this.dialogFormVisible = false
            this.$message.success("店铺开通成功")
          }).catch(err => {
            console.log(err);
          })
        } else {
          return false;
        }
      });
    },
    changeStore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put('/store', this.store).then(res => {
            this.store = res.data.data
            this.dialogFormVisible = false
            this.$message.success("信息修改成功")
          }).catch(err => {
            console.log(err);
          })
        } else {
          return false;
        }
      });
    },
    closeChange() {
      this.getStore()
      this.dialogFormVisible = false
    },
    addGoods() {
      this.dialogFormVisible2 = true
      this.editFlag = false
      this.goods = {}
      this.goods.images = []
    },
    removeGoods(goodsId) {
      const _this = this
      this.$confirm('此操作将永久删除该商品, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/goods/' + goodsId).then(res => {
          _this.getGoods()
          _this.$message.success("商品删除成功")
        }).catch(err => {
          _this.$message.error("商品删除失败")
          console.log(err)
        })
      }).catch(() => {
        _this.$message.info("已取消删除")
      });
    },
    addInventory(goodsId){
      this.$prompt('请输入要增加的库存数,负数则为减库存', '库存', {
        confirmButtonText: '添加',
        inputPattern: /^(-)?[1-9][0-9]*$/,
        inputErrorMessage: '需要添加非零整数',
        closeOnClickModal: false,
      }).then(({value}) => {
        this.$axios.put('/goods/inventory/'+goodsId+'/'+value).then(res =>{
          this.getGoods()
          if (value < 0){
            this.$message.success("你减少的库存为："+value)
          }else{
            this.$message.success("你增加的库存为："+value)
          }
        }).catch(err =>{
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    },
    postGoods() {
      this.$refs.goods.validate((valid) => {
        if (valid) {
          const _this = this
          if (this.editFlag) {
            _this.getNewImage()
          }
          this.$axios.post('/goods', this.goods).then(res => {
            _this.getGoods()
            _this.dialogFormVisible2 = false
            if (_this.editFlag) {
              _this.$message.success("商品修改成功")
            } else {
              _this.$message.success("商品添加成功")
            }
            _this.editFlag = false
            _this.goods.images = []
            this.$refs.upload.clearFiles()
          }).catch(err => {
            console.log(err);
          })
        } else {
          return false;
        }
      })
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
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    success(response, file, fileList) {
      this.goods.images.push(response.data)
    },
    removeImage(value) {
      const index = this.goods.images.indexOf(value);
      if (index > -1) {
        this.goods.images.splice(index, 1);
      }
    },
    MaxFile() {
      this.$message.warning("最多只能上传5张图片哦")
    },
    deleteImage(path) {
      let param = {path: path}
      this.$axios.delete('/image/remove', {params: param}).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
    closeGoods() {
      this.dialogFormVisible2 = false
      this.editFlag = false
      this.goods = {}
      this.goods.images = []
      this.$refs.upload.clearFiles()
      this.$refs.goods.resetFields();
    },
    editGoods(index) {
      this.editFlag = true
      this.dialogFormVisible2 = true
      this.goods = this.goodsList.at(index).goods
      this.goods.images = this.goodsList.at(index).images
      const _this = this
      this.goods.images.forEach(function (image) {
        _this.oldImage.push(image)
      })
    },
    EditAndDeleteImage(path, index) {
      this.goods.images.splice(index, 1)
      this.deleteImage(path)
    },
    getNewImage() {
      this.goods.images = this.goods.images.filter(x => this.oldImage.indexOf(x) < 0)
    },
    checkNumber(file) {
      if (this.goods.images && this.goods.images.length >= 5) {
        this.$message.warning("最多只能上传5张图片哦")
        return false
      }
      return true
    },
    getDetail(goodsId) {
      this.$router.push(`/goodsDetail/${goodsId}`)
    },
    toStoreOrder(){
      this.$router.push('/storeOrder')
    },
    toChat(){
      this.$router.push("/chat/"+this.goodsList[0].goods.studentId)
    }
  },
  computed:{

  },
  watch: {
    '$route' (to, from) {
      this.store = {}
      this.owner = true
      this.getUser()
      this.header.Authorization = this.$store.state.token
      this.storeId = this.$route.params.storeId
      if (parseInt(this.storeId) !== this.$store.state.userInfo.studentId){
        this.owner = false;
      }
      this.getStore()
      this.getGoods()
    },
  }
}
</script>

<style scoped>

#store {
  overflow: hidden;
  background: #efe8e8;
  min-height: calc(100vh - 70px);
}

.my-title {
   color: #15b4f1;
   font-size: 30px;
   margin-left: 12vmax;
   margin-top: -26px;
}

.my-main-des {
  text-align: center;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dialog-footer {
  margin-top: -30px;
}

.dialog-footer2 {
  margin-top: -30px;
}

.my-storeIntroduce {
  margin-left: 12vmax;
  margin-top: 4px;
  font-size: 16px;
  max-width: 70vmax;
  width: 70vmax;
  max-height: 42px;
  min-height: 42px;
  overflow: hidden;
  display: inline-block;
}

.my-button {
  position: absolute;
  margin-top: -4px;
  margin-left: 5vmax;
}

.my-button2 {
  position: absolute;
  top: 140px;
  left: 88vmax;
}
.my-chat{
  position: absolute;
  top: 140px;
  left: 90vmax;
}

.my-button3 {
  position: absolute;
  top: 180px;
  left: 88vmax;
  margin-left: 0px;
}
.my-button4 {
  position: absolute;
  top: 260px;
  left: 88vmax;
  margin-left: 0px;
}
.my-button5 {
  position: absolute;
  top: 220px;
  left: 88vmax;
  margin-left: 0px;
}
.my-button6 {
  position: absolute;
  top: 310px;
  left: 88vmax;
  margin-left: -8px;
}
.el-form-item {
  margin-bottom: 18px;
}

.my-goodsName {
  position: relative;
  max-height: 42px;
  min-height: 42px;
  overflow: hidden;
  max-width: 146px;
  margin-left: 4px;
}

.my-goods-info {
  margin-left: 10vmax;
  margin-top: 4px;
  max-width: 80vmax;
  min-width: 80vmax;
}

.my-goods-item {
  border-radius: 10px;
  background: white;
  float: left;
  margin-left: 14px;
  padding: 4px;
  margin-bottom: 10px;
}

.demo-image {
  float: left;
  margin-right: 20px;
}

.my-delete-image {
  font-size: 34px;
  color: #c90f0f;
  position: absolute;
  margin-left: 55px;
  margin-top: -110px;
}

.my-edit-button {
  position: absolute;
  z-index: 10;
  margin-top: 188px;
  margin-left: -30px;
}
.my-goods-inventory {
  z-index: 10;
  position: absolute;
  margin-top: 105px;
  margin-left: -45px;
}
.item{
  position: absolute;
  top: 300px;
  left: 1276px;
}
</style>
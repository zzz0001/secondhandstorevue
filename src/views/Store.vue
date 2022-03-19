<template>
  <div id="store">
    <el-link @click="to('/')" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-s-home">主页
    </el-link>
    <h2 class="my-title"> {{ store.storeName ? store.storeName : '我的店铺' }}</h2>
    <span class="my-storeIntroduce">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{store.storeIntroduce ? store.storeIntroduce : '这是店铺描述哦~' }}</span>
    <el-button v-if="owner" type="primary" size="small" class="my-button" @click="dialogFormVisible = true">修改店铺信息
    </el-button>
    <div v-if="userInfo.status === 0" class="my-main-des">
      <el-button type="primary" @click="to('/userInfo')"> 开通账户</el-button>
      <div style="margin-left: 10px;margin-top: 20px">你需要先开通账户,才能开通店铺哦</div>
    </div>
    <div v-else-if="userInfo.status === 2" class="my-main-des">
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
                  :src="item.images ? item.images.at(0) : ''"
                  fit="cover"></el-image>
            </div>
            <p class="my-goodsName">{{ item.goods.goodsName }}</p>
            <span style="color: red;margin-left: 4px;font-size: 16px;">¥ {{ item.goods.goodsPrice.toFixed(2) }} </span>
          </el-link>
          <el-button v-if="!editStatus && owner" class="my-edit-button" icon="el-icon-edit" circle type="primary" size="mini"
                     @click="editGoods(index)">
          </el-button>
          <el-button v-if="editStatus && owner" class="my-edit-button" icon="el-icon-delete" circle type="danger" size="mini"
                     @click="removeGoods(item.goods.goodsId)">
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog title="开通店铺" :visible.sync="dialogFormVisible" width="40%">
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
    <div v-if="owner">
      <el-button type="primary" size="small" class="my-button2" @click="addGoods">添加商品</el-button>
      <el-button v-if="editStatus" type="primary" size="small" class="my-button3" @click="editStatus=false">修改商品</el-button>
      <el-button v-else type="primary" size="small" class="my-button3" @click="editStatus=true">删除商品</el-button>
    </div>
    <el-dialog :visible.sync="dialogFormVisible2" width="40%" top="2vh">
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
          <el-select v-model="goods.goodsCategory" placeholder="请选择" size="medium" style="width:420px">
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
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer2">
        <el-button @click="closeGoods('goods')">取消</el-button>
        <el-button @click="postGoods('goods')" type="primary">上传</el-button>
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
          label: '生活用品(洗面奶、洗衣粉、盆...)'
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
          label: '电脑'
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
      editStatus: false,
      owner: true,
    }
  },
  created() {
    this.header.Authorization = this.$store.state.token
    const storeId = this.$route.params.storeId
    if (storeId){
      this.owner = false;
    }
    this.getUser()
    this.getStore()
    this.getGoods()
  },
  compute: {},
  methods: {
    getUser() {
      const _this = this
      const studentId = this.$store.state.userInfo.studentId
      this.store.studentId = studentId
      this.$axios.get('/user/' + studentId).then(res => {
        _this.userInfo = res.data.data
        _this.$store.commit('SET_USERINFO', res.data.data)
      }).catch(err => {
        console.log(err);
      })
    },
    getStore() {
      const _this = this
      const studentId = this.$store.state.userInfo.studentId
      this.store.studentId = studentId
      this.$axios.get('/storeByStudentId/' + studentId).then(res => {
        if (res.data.data) {
          _this.store = res.data.data
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getGoods() {
      const _this = this
      const studentId = this.$store.state.userInfo.studentId
      this.$axios.get('/goodsByStudentId/' + studentId).then(res => {
        if (res.data.data) {
          _this.goodsList = res.data.data
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
          const _this = this
          this.$axios.post('/store', this.store).then(res => {
            _this.store = res.data.data
            _this.getUser()
            _this.dialogFormVisible = false
            _this.$message.success("店铺开通成功")
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
          const _this = this
          this.$axios.put('/store', this.store).then(res => {
            _this.store = res.data.data
            _this.dialogFormVisible = false
            _this.$message.success("信息修改成功")
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
    postGoods(formName) {
      this.$refs[formName].validate((valid) => {
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
    closeGoods(formName) {
      this.dialogFormVisible2 = false
      this.editFlag = false
      this.goods = {}
      this.goods.images = []
      this.$refs.upload.clearFiles()
      this.$refs[formName].resetFields();
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
      this.$router.push(`/goodsDetail/${goodsId}`
      )
    },
  },
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

.my-button3 {
  position: absolute;
  top: 180px;
  left: 88vmax;
  margin-left: 0px;
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

</style>
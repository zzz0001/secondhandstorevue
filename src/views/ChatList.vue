<template>
  <div id="chatList">
    <el-link @click="$router.back()" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div>
      <h2 class="my-title"> 聊天列表 </h2>
    </div>
    <div style="width: 500px;text-align: center;margin: 0px auto">
      <el-input class="my-query-style2"
                placeholder="通过学号添加用户"
                v-model="inputValue">
      </el-input>
      <el-button @click="search()" icon="el-icon-search" size="small" style="position: relative;left: -50px;top: -1px"></el-button>
    </div>
    <div v-for="(item,index) in contactList" class="my-contact-main">
        <div @click="toUser(item.user.studentId)" >
          <el-avatar class="my-contact-picture" fit="cover" :src="item ? item.user.picture : '/user/123abc.jpeg'" ></el-avatar>
        </div>
      <el-link @click="toUser(item.user.studentId)" class="my-contact-username" :underline="false">
        <p style="height: 24px;overflow: hidden">
          {{item.user.userName}}
        </p>
      </el-link>
      <el-link class="my-contact-storeName" :underline="false" @click="toStore(item.user.studentId,item.user.status)">
        <p style="height: 24px;overflow: hidden">
          {{item.store ? item.store.storeName : '未开通店铺'}}
        </p>
      </el-link>
      <div class="my-talk" @click="toChat(item.user.studentId,item.newChatNum,index)">
        <i class="el-icon-chat-dot-round" style="font-size: 30px;color: #409EFF"></i>
        <span style="position: relative;top: -6px">私信</span>
      </div>
      <el-badge :value="item.newChatNum" v-show="item.newChatNum>0" class="my-chat-num" >
      </el-badge>
      <el-button @click="removeContact(item.contact.contactId,index)" class="my-button" type="danger" icon="el-icon-close" circle></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatList",
  data(){
    return{
      userInfo: {},
      contactList: [],
      Nums: 0,
      inputValue: '',
    }
  },
  created() {
    this.userInfo = this.$store.getters.getUserInfo
    this.getChatList()
  },
  methods:{
    getChatList(){
      this.$axios.get('/contact/'+ this.userInfo.studentId).then(res =>{
        this.contactList = res.data.data
      }).catch(err =>{
        console.log(err)
      })
    },
    toChat(studentId,newChatNum,index){
      let num = this.$store.state.newChat
      newChatNum = parseInt(num) - newChatNum
      if (newChatNum >= 0){
        this.$store.commit("NewChat",newChatNum)
      }
      this.$router.push("/chat/"+studentId)
    },
    toUser(studentId){
      this.$router.push("/userDetail/"+studentId)
    },
    toStore(studentId,status){
      if (status === 3){
        this.$router.push("/store/"+studentId)
      }else{
        this.$message.warning("该用户没有开通店铺")
      }
    },
    removeContact(contactId,index){
      this.$confirm('确定要将该用户从聊天列表中移除吗', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.contactList.splice(index,1);
        this.$axios.delete("/contact/"+contactId).then(res =>{
          this.$message.success("移除成功");
        }).catch(err =>{
          console.log(err);
        })
      }).catch(() => {
        this.$message.info("已取消删除")
      });
    },
    search(){
      this.$axios.post('/contact/'+ this.inputValue).then(res =>{
        this.getChatList()
        this.$message.success("添加成功")
      }).catch(err =>{
        console.log(err)
      })
    },
  },
  computed: {
    nums() {
      return this.$store.state.newChat
    }
  },
  watch: {
    nums() {
      this.getChatList()
    }
  }
}
</script>

<style scoped>
#chatList {
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
.my-contact-main{
  width: 800px;
  height: 80px;
  background: white;
  margin: 4px auto 10px auto;
  border-radius: 10px;
}
.my-contact-picture{
  float: left;
  margin-top: 5px;
  height: 70px;
  width: 70px;
  margin-left: 10px;
}
.my-contact-username{
  float: left;
  width: 200px;
  height: 24px;
  text-align: center;
  margin-top: 26px;
  font-size: 20px;
  margin-left: 10px;
}
.my-contact-storeName{
  float: left;
  width: 200px;
  height: 24px;
  text-align: center;
  margin-top: 26px;
  font-size: 20px;
  margin-left: 10px;
}
.my-talk{
  float: left;
  width: 110px;
  margin-top: 26px;
  padding-left: 100px;
}
.my-button{
  float: right;
  width: 40px;
  margin-top: 18px;
  margin-right: 20px;
}
.my-chat-num{
  position: relative;
  left: -100px;
  top: 10px;
}
.my-query-style2{
  width: 400px;
  margin-left: 50px;
  margin-bottom: 10px;
}
</style>
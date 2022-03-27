<template>
  <div id="chat">
    <el-link @click="$router.back(0)" :underline="false" style="margin-left: 30px;margin-top: 20px;font-size: 16px"
             class="el-icon-arrow-left">返回
    </el-link>
    <div>
      <h2 class="my-title"> 聊天界面 </h2>
    </div>
    <div class="my-chat-header">
      <div style="width: 700px;text-align: center;padding-top: 15px;">{{chatUser.userName}}</div>
    </div>
    <div class="my-chat-main" ref="chatmain">
      <div v-for="(item) in chatRecord" ref="chatlist">
          <div v-if="item.sendId != userInfo.studentId">
            <span>
              <el-avatar class="chat-user" :src="chatUser ? chatUser.picture : '/user/123abc.jpeg'" ></el-avatar>
            </span>
            <p style="margin-left: 50px;padding-top: -10px">{{item.message}}</p>
          </div>
          <div v-else class="my-picture">
            <span>
              <el-avatar class="chat-picture" :src="userInfo ? userInfo.picture : '/user/123abc.jpeg'" ></el-avatar>
            </span>
            <p class="chat-message">{{item.message}}</p>
          </div>
      </div>
    </div>
    <div class="my-chat-footer">
      <div class="my-message">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入内容"
            v-model="message"
        >
        </el-input>
      </div>
      <el-button @click="sendMessage" type="primary" class="my-submit-button">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data(){
    return{
      websocket: {},
      userInfo:{},
      chatStudentId: '',
      chatUser: {},
      message: "",
      chatRecord: [],
      chat: {},
      messagesContainerTimer: {},
      noReadList: [],
    }
  },
  created() {
    this.chatStudentId = this.$route.params.chatStudentId
    this.userInfo = this.$store.getters.getUserInfo
    this.getChatUser(this.chatStudentId)
    this.chat.sendId = this.userInfo.studentId
    this.chat.receiveId = this.chatStudentId
    this.getChat()
    this.initWebSocket()
  },
  mounted() {
  },
  destroyed() {
    this.websocket.close()
  },
  methods:{
    getChat(){
      this.$axios.get('/chat/'+ this.chatStudentId).then(res =>{
        this.chatRecord = res.data.data
        this.chatRecord.reverse()
        this.messagesContainerTimer = setTimeout(()=>{
          this.$refs.chatmain.scrollTop = this.$refs.chatmain.scrollHeight;
          // console.log("当前滚动条位置:"+this.$refs.chatmain.scrollTop);
          // console.log("当前可滚动区域容器的高度:"+this.$refs.chatmain.scrollHeight);
          // 清理定时器
          clearTimeout(this.messagesContainerTimer);
        },0);
        this.isRead()
      }).catch(err =>{
        console.log(err);
      })
    },
    getChatUser(studentId){
      this.$axios.get("/user/"+studentId).then(res =>{
        this.chatUser = res.data.data
      }).catch(err =>{
        console.log(err);
      })
    },
    sendMessage(){
      if (this.message.match(/^[ ]*$/)) {
        this.$message.warning("不能发送空消息哦")
        return false
      }
      this.chat.message = this.message
      let newChat = {}
      newChat=JSON.parse(JSON.stringify(this.chat));
      this.chatRecord.push(newChat)
      this.message = ''
      const sendMes = JSON.stringify(this.chat)
      this.websocket.send(sendMes)
    },
    isRead(){
      const length = this.chatRecord.length
      for (let i = 0; i < length; i++) {
        if (this.chatRecord[i].isRead === 1){
          this.noReadList.push(this.chatRecord[i].chatId)
        }
      }
      this.$axios.post("chatList",this.noReadList).then(res =>{
      }).catch(err =>{
        console.log(err);
      })
    },
    initWebSocket(){
      const _this = this
      if('WebSocket' in window){
        this.websocket = new WebSocket('ws://localhost:8081/webSocket/chat/chat'+this.userInfo.studentId);
      }else{
        alert('当前浏览器不支持websocket消息通知');
      }

      //接收到消息的回调方法
      this.websocket.onmessage = function (event) {
        // setMessageInnerHTML(event.data);
        // alert("ws接收返回消息："+event.data);
        if (event.data){
          const receiveMsg = JSON.parse(event.data)
          let newChat = {}
          newChat.sendId = receiveMsg.fromName
          newChat.message = receiveMsg.message
          _this.chatRecord.push(newChat)
        }
      }
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        this.websocket.close();
      }
    },
  },
  watch:{
    chatRecord(){
      this.messagesContainerTimer = setTimeout(()=>{
        this.$refs.chatmain.scrollTop = this.$refs.chatmain.scrollHeight;
        // console.log("当前滚动条位置:"+this.$refs.chatmain.scrollTop);
        // console.log("当前可滚动区域容器的高度:"+this.$refs.chatmain.scrollHeight);
        // 清理定时器
        clearTimeout(this.messagesContainerTimer);
      },0);
    },
  }

}
</script>

<style scoped>
#chat {
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
.my-chat-header{
  height: 50px;
  width: 700px;
  margin: 0 auto;
  background: #8c939d;
}
.my-chat-main{
  height: 290px;
  width: 700px;
  padding-bottom: 10px;
  margin: 0 auto;
  overflow-y:auto;
  overflow-x:hidden;
  background: white;
}
.my-chat-footer{
  height: 120px;
  width: 700px;
  margin: 0 auto;
  background: white;
  border: 1px solid grey;
}
.my-message >>> .el-textarea__inner {
  width: 700px;
  border: 0;
  resize: none;  /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
}
.my-submit-button{
  position: absolute;
  top: 510px;
  left: 950px;
}
.chat-user{
  position: relative;
  margin-top: -12px;
  top: 20px;
  left: 4px;
}
.chat-message{
  text-align: right;
  margin-right: 50px;
}
.my-picture{
  margin-left: 300px;
}
.chat-picture{
  position: relative;
  margin-top: -12px;
  top: 20px;
  left: 350px;
}
::-webkit-scrollbar {
  width: 5px; /*竖向*/
  height: 5px;/*横向*/
}

/*滚动条的滑块*/
::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 3px;
}
</style>
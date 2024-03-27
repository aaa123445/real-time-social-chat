<template>
  <div class="all">
    <div class="msg-body">
      <el-card>
        <el-container>
          <el-aside style="border-right: 1px solid #e6e6e6;background-color: #ece9e8" width="350px">
            <el-container>
              <el-header style="padding: 0;">
                <div class="search-box">
                  <el-input placeholder="搜索" prefix-icon="el-icon-search"></el-input>
                  <i class="el-icon-circle-plus-outline" style="font-size: 25px;margin-left: 5px"></i>
                </div>
              </el-header>
              <el-main style="height: 790px;line-height: 24px">
                <ul v-for="item in chatList" :key="item.id" class="msg-list">
                  <li class="msg-list-li" @click="chooseChat(item)">
                    <div class="msg-list-avatar">
                      <el-avatar :src="item.avatar" shape="square" size="large" style="float: left"></el-avatar>
                    </div>
                    <div class="msg-list-main">
                      <div class="msg-list-nickname">{{ item.nickName }}</div>
                      <div class="msg-list-content">{{ item.lastMessage === "" ? '&nbsp;' : item.lastMessage }}</div>
                    </div>
                    <div class="msg-list-time"><span>{{ item.time }}</span></div>
                  </li>
                </ul>
              </el-main>
            </el-container>
          </el-aside>
          <el-container>
            <el-header height="60px" style="border-bottom: 1px solid #e6e6e6;padding: 0;">
              <div style="text-align: left;margin-left: 20px"><h3>{{ chooseData.nickName }}</h3></div>
            </el-header>
            <el-main id="chat-body" class="chat-body"
                     style="height: 500px;line-height: 30px;padding: 0;overflow-y: auto">
              <ul>
                <li v-for="item in messageList" :key="item.id" class="chat-list-li" style="min-height: 60px">
                  <div :class="{'send':item.sendUserId === userId,'receiver':item.sendUserId !== userId}">
                    <div v-if="item.sendUserId === userId">
                      <el-avatar :size="40" :src="item.sendUserAvatar"
                                 style="float: right;margin-right: 10px;"></el-avatar>
                      <div class="chatBox chatBox-left">{{ item.content }}</div>
                    </div>
                    <div v-else>
                      <el-avatar :size="40" :src="item.sendUserAvatar"
                                 style="float: left;margin-left: 10px;"></el-avatar>
                      <div class="chatBox chatBox-right">{{ item.content }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </el-main>
            <el-footer v-show="JSON.stringify(chooseData) !== '{}'" height="230px"
                       style="border-top: 1px solid #e6e6e6;">
              <div id="tool-bar">
                <el-popover
                    placement="top"
                    trigger="click"
                    width="auto">
                  <VEmojiPicker class="emoji-body" labelSearch="Search" lang="pt-BR"
                                @select="selectEmoji"/>
                  <el-button slot="reference" class="emoji-button"
                             style="font-size:20px;padding: 2px;margin-bottom: 2px;margin-top: 5px">😃
                  </el-button>
                </el-popover>
              </div>
              <el-input id="emojiInput" v-model="msg" :border="false" class="send-input" resize="none"
                        rows="4" type="textarea"></el-input>
              <el-button class="send-button" @click="sendMessageToServer">发送</el-button>
            </el-footer>
          </el-container>
        </el-container>
      </el-card>
    </div>

  </div>
</template>

<script>

import chatRequest from "@/request/ChatRequest";
import ChatRequest from "@/request/ChatRequest";

export default {
  data() {
    return {
      userId: '',
      msg: '',
      messageList: [],
      messageListFromServer: [],
      chooseData: {},
      chatList: [],
      pageNum: 1,
      pageSize: 10,
      messagePage: {
        pageNum: 1,
        pageSize: 30,
        chatId: '',
      },
      websocketData: {},
      isChatId: '',
    };
  },
  watch: {
    messageList(newVal, oldVal) {
      // 调用函数，确保滚动条处于底部
      this.goBotom();
    }
  },
  methods: {
    getMessageList() {
      const params = {
        pageNum: this.messagePage.pageNum,
        pageSize: this.messagePage.pageSize,
        chatId: this.chooseData.chatId
      }
      ChatRequest.getMessageList(params).then(res => {
        if (res.code === 200) {
          this.messageListFromServer = res.data.resData.reverse();
          this.messageList = this.messageList.concat(this.messageListFromServer);
          this.isChatId = this.chooseData.chatId;
          this.goBotom()
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          })
        }
      })
    },
    getChatList() {
      chatRequest.getChatList({pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId}).then(res => {
        if (res.code === 200) {
          this.chatList = res.data.resData;
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          })
        }
      })
    },
    sendMessageToServer() {
      if (this.msg !== '') {
        const sendMessage = {
          chatId: this.chooseData.chatId,
          sendUserId: this.userId,
          receiverUserId: this.chooseData.receiverUserId,
          content: this.msg,
        }
        this.$socket.send(JSON.stringify(sendMessage));
        this.getChatList();
        this.messageList.push({
          chatId: this.chooseData.chatId,
          content: this.msg,
          sendUserId: this.userId,
          sendUserAvatar: JSON.parse(localStorage.getItem('userInfo')).avatar,
        })
      } else
        this.$message.error('不能发送空消息');
      this.msg = '';
    },
    // 表情输入
    selectEmoji(emoji) {
      const elInput = document.getElementById('emojiInput');//获取输入框元素
      // console.log(elInput);
      const start = elInput.selectionStart; // 记录光标开始的位置
      const end = elInput.selectionEnd; // 记录选中的字符 最后的字符的位置
      if (start === undefined || end === undefined) return
      const txt = elInput.value;
      // 将表情添加到选中的光标位置
      const result = txt.substring(0, start) + emoji.data + txt.substring(end);
      elInput.value = result // 赋值给input的value
      // 重置光标位置
      elInput.focus()
      elInput.selectionStart = start + emoji.data.length
      elInput.selectionEnd = start + emoji.data.length
      this.msg = result // 赋值(注意这里一定要赋值给表情输入框绑定的那个值)
    },
    chooseChat(val) {
      this.messageList = [];
      this.chooseData = {
        chatId: val.id,
        nickName: val.nickName,
        receiverUserId: val.receiverId
      }

      this.getMessageList();
      this.goBotom();
    },
    callBack(data) {
      this.websocketData = data.data
      this.getChatList();
      if (this.chooseData.chatId !== undefined) {
        const data1 = JSON.parse(data.data);
        if (data1.receiverUserId === this.userId)
          this.messageList.push(data1);
      }
    },
    goBotom() {
      const messageList = document.getElementById('chat-body'); // 替换 'message-list' 为您实际的消息列表的 ID
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, mounted() {
    if (localStorage.getItem('userInfo')) {
      this.userId = JSON.parse(localStorage.getItem('userInfo')).id;
      this.getChatList();
    } else {
      this.$router.push('login')
    }
    this.$socket.registerCallBack(this.callBack)
  },
  beforeDestroy() {
    this.$socket.unRegisterCallBack(this.callBack)
  },
  updated() {
    this.goBotom()
  }
};
</script>
<style lang="scss">


.all {
  display: block;
  margin: auto;
  text-align: center;
  overflow-y: auto;

  .msg-body {
    width: 70%;
    display: block; /* 或者其他块级元素的 display 属性 */
    margin: 10px auto; /* 在水平方向上居中 */

    .chat-body {
      height: 500px;
      overflow-y: auto;

      /* 聊天框中的消息列表样式 */
      .chat-list-li {
        list-style: none;
        min-height: 60px;
        margin-bottom: 10px; /* 调整每条消息之间的间距 */
        overflow: auto; /* 添加滚动条，当内容溢出时 */
      }

      .chat-list-li .send {
        text-align: right;
      }

      .chat-list-li .receiver {
        text-align: left;
      }

      .chat-list-li .chatBox {
        display: inline-block;
        max-width: 70%; /* 聊天框最大宽度 */
        padding: 10px;
        border-radius: 10px;
        margin: 5px;
        word-wrap: break-word; /* 长消息换行 */
      }

      .chat-list-li .chatBox-left {
        background-color: #f0f0f0; /* 左侧聊天框背景色 */
        text-align: left; /* 确保左侧消息对齐 */
      }

      .chat-list-li .chatBox-right {
        background-color: #d9f9ec; /* 右侧聊天框背景色 */
        text-align: right; /* 确保右侧消息对齐 */
      }

      .chat-list-li .el-avatar {
        vertical-align: middle;
      }

      /* 根据发送者和接收者不同样式化头像位置 */
      .chat-list-li .el-avatar {
        margin: 5px; /* 调整头像与聊天框之间的间距 */
      }

      .chat-list-li .send .el-avatar {
        float: right; /* 右浮动，发送者头像在右边 */
        margin-left: 10px; /* 调整发送者头像的左边距 */
      }

      .chat-list-li .receiver .el-avatar {
        float: left; /* 左浮动，接收者头像在左边 */
        margin-right: 10px; /* 调整接收者头像的右边距 */
      }
    }

    .el-card__body, .el-main {
      padding: 0;
    }

    .el-aside {
      background-color: #ffffff;

      .search-box {
        background-color: #f7f7f7;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        height: 60px;
        align-items: center;
        align-content: space-around;

        .el-input {
          width: 280px;
        }
      }

    }

    .msg-list {
      //background-color: #E9EEF3;
      //border-radius: 8px;
      //margin-bottom: 5px;
      background-color: #ece9e8;


      .msg-list-li {
        height: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .msg-list-avatar {
          margin: 5px;
          margin-left: 10px;
        }

        .msg-list-main {
          width: 60%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .msg-list-content {
            color: #c4c4c3;
            width: 100%;
            text-align: left;
            white-space: nowrap; /* 过长部分不换行 */
            text-overflow: ellipsis; /* 过长部分展示省略号 */
            overflow: hidden; /* 隐藏过长部分 */
          }

          .msg-list-nickname {
            text-align: left;
            white-space: nowrap; /* 过长部分不换行 */
            text-overflow: ellipsis; /* 过长部分展示省略号 */
            overflow: hidden; /* 隐藏过长部分 */

          }
        }

        .msg-list-time {
          margin-left: auto;
          height: 70%;
          font-size: 12px;
          padding-right: 3px;
          color: #c4c4c3;
        }
      }
    }

    .msg-list:hover {
      background-color: #dfdcda;
    }

    .el-card {
      border-radius: 0 !important;
      border: 0;
      margin: 0;
    }

    .el-header {
      background-color: #ffffff;
      color: #333;
      text-align: center;
      line-height: 60px;
    }

    .el-footer {
      background-color: #f5f5f5;
      color: #333;

      .send-input {
        font-size: 22px;


        .el-textarea__inner {
          border: none !important;
          box-shadow: none !important;
          resize: none !important;
          padding: 0;
          background-color: #f5f5f5;
        }

      }


      .emoji-button {
        float: left;
        width: auto;
        padding: 3px !important;

      }

      .emoji-body {
        width: 500px;
      }

      .send-button {
        margin-top: 5px;
        float: right;
        width: 100px;
        background-color: #e9e9e9;
        border-radius: 5px;
        color: #909399;
        border-color: #d2d2d2;
      }

      .send-button:hover {
        color: #303030;
        border-color: #d2d2d2;
        background-color: #d2d2d2;
      }


    }

    .el-aside {
      background-color: #ffffff;
      color: #ffffff;
      text-align: center;
      height: 850px;
    }

    .el-main {
      background-color: #ffffff;
      color: #333;
      text-align: center;
      line-height: 160px;
    }

    body > .el-container {
      margin-bottom: 0px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
      line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
      line-height: 320px;
    }
  }

}

</style>
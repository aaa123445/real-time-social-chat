<template>
  <div id="body" class="user-all">
    <el-button v-show="showGoTop" class="go-top" @click="goTop"><i
        class="el-icon-upload2"
        style="font-size: 24px"></i>
    </el-button>
    <div class="float-button">
      <div style="display: flex;flex-direction: column;align-items: baseline">
        <el-button style="margin-bottom: 10px" title="关注列表" @click="getFollowerList"><i
            class="el-icon-user button"></i></el-button>
        <el-button @click="2"><i class="el-icon-edit-outline button"></i></el-button>
      </div>
    </div>
    <div class="update-userInfo">
      <el-dialog
          :visible.sync="updateVisible"
          lock-scroll="false"
          style="overflow-y: hidden;"
          title="关注列表"
          top="100px"
          width="45%">
        <div style="overflow-y: auto;height: 600px">
          <ul v-for="item in followList" :key="item.id">
            <li class="follower-list">
              <div
                  style="display: flex;flex-direction: row;flex-wrap: nowrap;align-items: center;justify-content: flex-start;">
                <el-avatar :src="item.beAccountAvatar"></el-avatar>
                <h2 style="margin-left: 5px">{{ item.beAccountNickName }}</h2>
              </div>
              <div
                  style="display: flex;align-items: center;margin-right: 10px">
                <el-button class="follower-button" @click="delFollower(item.beAccountId)">取关</el-button>
                <el-button class="follower-button" @click="sendMessageChat(item.beAccountId)">私信</el-button>
              </div>
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="updateVisible = false">关 闭</el-button>
  </span>
      </el-dialog>
    </div>
    <div class="follower-list">

    </div>
    <el-container class="body">
      <el-header class="header" height="300px">
        <div class="header-avatar">
          <el-image
              :src="userInfo.avatar"
              fit="fill"
              style="width: 150px; height: 150px"></el-image>
          <el-tag class="header-nickname" type="success">@{{
              userInfo.nickName === undefined ? '未知' : userInfo.nickName
            }}
          </el-tag>
        </div>
        <div class="header-info">
          <el-descriptions title="个人信息">
            <el-descriptions-item class="info-item" label="用户名">
              {{ userInfo.userName === undefined ? '未知' : userInfo.userName }}
            </el-descriptions-item>
            <el-descriptions-item class="info-item" label="手机号">
              {{ userInfo.phonenumber === undefined ? '未知' : userInfo.phonenumber }}
            </el-descriptions-item>
            <el-descriptions-item class="info-item" label="邮箱">{{
                userInfo.email === undefined ? '未知' : userInfo.email
              }}
            </el-descriptions-item>
            <el-descriptions-item class="info-item" label="性别">
              <el-tag size="small">{{ userInfo.sex === '0' ? '男' : userInfo.sex === '1' ? '女' : '未知' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="个性签名">
              {{ userInfo.signature === undefined ? "这个人很懒什么都没留下" : userInfo.signature }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-header>
      <el-main>
        <ul class="infinite-list">
          <li v-for="i in visibleData" :key="i.id" class="article-list">
            <el-card shadow="always">
              <header>
                <!--头像 昵称-->
                <div class="article-avatar">
                  <el-avatar :size="50" :src="i.user.avatar"></el-avatar>
                  <ul class="article-nickname-createTime">
                    <li><span class="article-nickname">{{ i.user.nickName }}</span></li>
                    <li><span class="article-createTime">发布于{{ i.createTime }}</span></li>
                  </ul>
                  <div style="display: flex;width: 65%;height: 100%;flex-direction: row-reverse">
                    <el-dropdown placement="bottom">
                      <i class="el-icon-more-outline" style="font-size: 24px"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="delArticle(i.id)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </header>
              <main>
                <div class="article-content"><p>{{ i.content }}</p></div>
                <div v-show="i.images.length !== 0" class="article-image">
                  <el-image v-for="image in i.images" :key="image.id"
                            :preview-src-list="getImageList(i.images)"
                            :src="image.imageUrl"
                            class="image">
                  </el-image>
                </div>
              </main>
              <footer>
                <div>
                  <ul class="foot">
                    <li><i class="el-icon-star-on"></i>{{ i.startCount == 0 ? '' : i.startCount }}</li>
                    <li><i class="el-icon-s-comment"
                           @click="i.flag = !i.flag"></i>{{ i.commentCount == 0 ? '' : i.commentCount }}
                    </li>
                    <li><i class="el-icon-share"></i>{{ i.forwardCount == 0 ? '' : i.forwardCount }}</li>
                  </ul>
                </div>
                <div v-show="i.flag" class="comment">
                  <el-form class="comment-form">
                    <el-form-item>
                      <el-input v-model="i.commentContent" :rows="2" placeholder="发布你的评论"
                                type="textarea"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </footer>
            </el-card>
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>


</template>
<script>

import user from "@/request/User";
import User from "@/request/User";
import Article from "@/request/Article";
import ChatRequest from "@/request/ChatRequest";

export default {
  data() {
    return {
      updateVisible: false,
      showGoTop: false,
      userInfo: {},
      articleList: [],
      pageNum: 1,
      pageSize: 10,
      visibleData: [],
      commentList: [
        {
          articleId: "40",
          children: [
            {
              articleId: "40",
              content: "254",
              createBy: "1",
              createTime: "2022-12-17 01:09:05",
              id: "32",
              rootId: "31",
              toCommentId: "31",
              toCommentUserId: "1",
              toCommentUserName: "sg333",
              username: "sg333"
            }
          ],
          content: "132",
          createBy: "1",
          createTime: "2022-12-17 01:09:02",
          id: "31",
          rootId: "-1",
          toCommentId: "-1",
          toCommentUserId: "-1",
          username: "sg333"
        },
        {
          articleId: "40",
          children: [
            {
              articleId: "40",
              content: "嘁嘁嘁[哈哈][哈哈]",
              createBy: "1",
              createTime: "2022-12-17 01:09:32",
              id: "34",
              rootId: "33",
              toCommentId: "33",
              toCommentUserId: "1",
              toCommentUserName: "sg333",
              username: "sg333"
            }
          ],
          content: "test\n[嘻嘻][嘻嘻][嘻嘻]",
          createBy: "1",
          createTime: "2022-12-17 01:09:21",
          id: "33",
          rootId: "-1",
          toCommentId: "-1",
          toCommentUserId: "-1",
          username: "sg333"
        }
      ],
      loginUserId: '',
      followList: []
    }
  },
  methods: {
    delFollower(beId) {
      Article.delFollower({
        beAccountId: beId,
        AccountId: this.loginUserId
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 3000
          })
          this.getFollowerList();
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          });
        }
      })
    },
    sendMessageChat(id) {
      const params = {
        user1Id: this.loginUserId,
        user2Id: id
      }
      ChatRequest.addChat(params).then(res => {
        if (res.code === 200) {
          this.$router.push('messageList');
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          })
        }
      })
    },
    getFollowerList() {
      this.updateVisible = true;
      User.getFollower(this.loginUserId).then(res => {
        if (res.code === 200) {
          this.followList = res.data;
        }
      })
    },
    delArticle(id) {
      Article.delArticle(id).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 3000
          })
          this.visibleData = this.visibleData.filter(item => item.id !== id);
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          })
        }
      })
    },
    getArticleList() {
      Article.getSelfArticle(this.pageNum, this.pageSize, this.loginUserId).then(res => {
        if (res.code === 200) {
          this.articleList = res.data.resData;
          this.visibleData = this.visibleData.concat(res.data.resData);
          this.pageNum++;
        }
      })
    },
    getUserInfo(val) {
      user.getUserInfo(val).then(res => {
        if (res.code === 200) {
          this.userInfo = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 3000
          })
        }
      })
    },
    getImageList(images) {
      let imageList = [];
      images.forEach(image => {
        imageList.push(image.imageUrl);
      })
      return imageList;
    },
    goTop() {
      document.getElementById("body").scrollTop = 0;
    },
    handleScroll() {
      const elementById = document.getElementById("body");
      // 判断滚动条是否到达底端
      this.showGoTop = elementById.scrollTop > 20;
      if (elementById.scrollTop + elementById.clientHeight >= elementById.scrollHeight) {
        if (this.articleList.length === this.pageSize) {
          this.getArticleList();
        } else {
          this.$message({
            type: 'info',
            message: '到底了',
            duration: 3000
          })
        }
      }
    },
    callBack(data) {
      this.$notify({
        title: data.title,
        message: data.msg,
        offset: 70,
        duration: 3000
      })
    }
  }, mounted() {
    const elementById = document.getElementById("body");
    elementById.addEventListener('scroll', this.handleScroll)
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      this.loginUserId = JSON.parse(localStorage.getItem("userInfo")).id
      this.getUserInfo(JSON.parse(localStorage.getItem("userInfo")).id);
      this.$socket.registerCallBack(this.callBack);
    }
    this.getArticleList();
  },
  destroyed() {
    this.$socket.unRegisterCallBack(this.callBack);
  }
}
</script>

<style lang="scss" scoped>

.user-all {
  --article-nickname-createTime-lift: 15px;
  overflow-y: auto;
  height: 100%;

  .update-userInfo {

    .follower-list {
      display: flex;
      justify-content: space-between;
      height: 60px;
      padding-left: 10px;

      .follower-button {
        height: 40px;
      }
    }

    .follower-list:hover {
      background-color: #f7f7f7;
    }
  }

  .float-button {
    position: absolute;
    top: 70px;
    right: 23%;
    z-index: 20;

    .el-button {
      margin: 0;
      padding: 10px;

      .button {
        font-size: 30px;
      }
    }


  }

  .go-top {
    position: absolute;
    z-index: 20;
    bottom: 50px;
    right: 50px;
    padding: 10px;
    border-radius: 50px;
  }

  .body {
    .el-main {
      overflow: hidden;
      height: auto;
    }

    .infinite-list {
      margin: 0 auto;
      width: 100%;

      .article-list {

        .article-image {
          display: flex;
          margin-top: 3px;
          margin-left: calc(var(--article-nickname-createTime-lift) + 50px);
          margin-right: 2px;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: flex-start;

          .image {
            height: 200px;
            width: 215px;
            margin-top: 2px;
            margin-bottom: 6px;
            margin-right: 8px;
            border-radius: 7px;
          }

          .image:hover {
            filter: alpha(Opacity=80);
            -moz-opacity: 0.8;
            opacity: 0.8
          }
        }


        .article-content {
          display: flex;
          margin-top: 3px;
          margin-left: calc(var(--article-nickname-createTime-lift) + 50px);
        }


        .article-avatar {
          display: flex;

          .article-nickname-createTime {
            margin-left: var(--article-nickname-createTime-lift);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            .article-createTime {
              display: block;
              font-size: 15px;
              color: #909399;
              width: 100%;
            }
          }

          .article-nickname {
            font-size: 20px;
          }
        }

        margin: auto;
        margin-top: 8px;
        margin-bottom: 8px;

      }

      .foot {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: center;
        height: 30px;
        width: 100%;
        font-size: 20px;

        i {
          font-size: 20px;

        }

        i:hover {
          font-size: 21px;
          cursor: pointer; /*悬停变小手的属性*/
        }

      }
    }

    .header {
      margin-top: 10px;
      display: flex;
      align-items: center;
      background-color: #FFF;

      .header-info {
        margin-left: 10px;
        background-color: transparent;
      }

      .header-avatar {
        margin-left: 50px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center
      }

      .header-nickname {
        margin-top: 5px;
        text-align: center;
        width: 100px;
      }
    }

    width: 45% !important;
    margin: 0 auto;
    height: auto;
  }
}
</style>
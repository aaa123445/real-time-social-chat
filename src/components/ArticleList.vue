<template>
  <div id="list-ul" ref="infinite-list" class="all">
    <el-button v-show="showGoTop" class="go-top" @click="goTop"><i class="el-icon-upload2" style="font-size: 24px"></i>
    </el-button>
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
                    <el-dropdown-item v-if="i.user.id === loginUserId" @click.native="delArticle(i.id)">删除
                    </el-dropdown-item>
                    <div v-else>
                      <el-dropdown-item v-if="followerList.includes(i.user.id)" @click.native="delFollower(i.user.id)">
                        取消关注
                      </el-dropdown-item>
                      <el-dropdown-item v-else @click.native="addFollower(i.user.id)">关注</el-dropdown-item>
                      <el-dropdown-item @click.native="sendMessageChat(i.user.id)">私信</el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </header>
          <main class="content-main">
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
                  <el-input v-model="i.commentContent" :rows="2" placeholder="发布你的评论" type="textarea"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </footer>
        </el-card>
      </li>
    </ul>

  </div>

</template>

<script>
import Article from "@/request/Article";
import ChatRequest from "@/request/ChatRequest";

export default {
  data() {
    return {
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
      showGoTop: false,
      loginUserId: "",
      followerList: []
    };
  },
  methods: {
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
      Article.getFollowerList(this.loginUserId).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.followerList = res.data
        }
      })
    },
    addFollower(beId) {
      Article.addFollower({
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
    getImageList(images) {
      let imageList = [];
      images.forEach(image => {
        imageList.push(image.imageUrl);
      })
      return imageList;
    },
    getArticleList() {
      Article.getArticleListIndex(this.pageNum, this.pageSize).then(res => {
        if (res.code === 200) {
          this.articleList = res.data.resData;
          this.visibleData = this.visibleData.concat(res.data.resData);
          this.pageNum++;
        }
      })
    },
    handleScroll() {
      const elementById = document.getElementById("list-ul");
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
    goTop() {
      document.getElementById("list-ul").scrollTop = 0;
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
    callBack(data) {
      this.$notify({
        title: data.title,
        message: data.msg,
        offset: 70,
        duration: 3000
      })
    },

  },
  mounted() {
    this.getArticleList();
    const divElement = document.getElementById('list-ul');
    divElement.addEventListener('scroll', this.handleScroll);
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      this.loginUserId = JSON.parse(localStorage.getItem("userInfo")).id
      this.getFollowerList();
      this.$socket.registerCallBack(this.callBack)
    } else {
      this.loginUserId = ""
    }
  },
  destroyed() {
    this.$socket.unRegisterCallBack(this.callBack);
  }
};
</script>
<style lang="scss" scoped>
body {
  --article-nickname-lift: 15px;
}


.all {
  .go-top {
    position: absolute;
    z-index: 20;
    bottom: 50px;
    right: 50px;
  }

  .el-button {
    padding: 12px 12px;
    border-radius: 50px;
  }

  display: block;
  height: 100%;
  width: 100%;
  overflow-y: auto !important;
  text-align: center; /* 在水平方向上居中内部元素 */

  .infinite-list {
    margin: 0 auto;
    width: 78%;

    .article-list {

      .article-image {
        display: flex;
        margin-top: 3px;
        margin-left: calc(var(--article-nickname-lift) + 50px);
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

      .content-main {
        //margin-left: calc(var(--article-nickname-lift) + 50px);
        margin-left: 53px;

        .article-content {
          display: flex;
          margin-top: 3px;

        }
      }


      .article-avatar {
        display: flex;

        .article-nickname-createTime {
          margin-left: 3px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          .article-createTime {
            font-size: 15px;
            color: #909399;
          }
        }

        .article-nickname {
          font-size: 20px;
        }
      }

      margin: auto;
      margin-top: 8px;
      margin-bottom: 8px;
      width: 55%;
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

    //.comment {
    //  height: 100px;
    //  background-color: palegreen;
    //}
  }

}
</style>

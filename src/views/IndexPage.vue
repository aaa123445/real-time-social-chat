<template>
  <div>
    <el-container class="all">
      <el-header class="head">
        <div class="logo-search">
          <el-image :src="logoUrl" class="logo"></el-image>
          <el-input
              class="search"
              placeholder="输入你想搜索的内容"
              prefix-icon="el-icon-search"
              size="small"
              type="text"
          ></el-input>
        </div>
        <el-menu
            :default-active="$route.path"
            class="el-menu"
            mode="horizontal"
            router="router"
        >
          <el-menu-item class="centered-item" index="articleList" title="首页">
            <i class="el-icon-s-home icon"></i>
          </el-menu-item>
          <el-menu-item class="centered-item" index="messageList" title="消息中心">
            <i class="el-icon-message-solid icon"></i>
          </el-menu-item>
          <el-menu-item class="centered-item" index="publishArticle" title="发表文章">
            <i class="el-icon-s-promotion icon"></i>
          </el-menu-item>
        </el-menu>
        <div class="user">
          <div v-if="isLogin" class="is-login">
            <el-dropdown placement="bottom">
          <span class="el-dropdown-link">
            <el-avatar :src="avatarUrl" size="large"></el-avatar>
          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toSelfInfo">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tag class="user-nick-name">欢迎：{{ nickName }}</el-tag>
          </div>
          <div v-else class="no-login">
            <el-button type="primary"><a class="to-login-a" href="#/login">登录</a></el-button>
          </div>
        </div>
      </el-header>
      <el-main class="body">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import logoUrl from "@/assets/image.png";
import {RouterView} from "vue-router";
import request from "@/request/LoginPage"

export default {
  data() {
    return {
      nickName: "",
      logoUrl: logoUrl,
      avatarUrl: "",
      isActive: false,
      isLogin: false,
      msg: ""
    };
  },
  components: {
    RouterView,
  },
  mounted() {
    this.isLogin = localStorage.getItem("token") !== null || localStorage.getItem("token") === undefined;
    if (this.isLogin) {
      this.avatarUrl = JSON.parse(localStorage.getItem("userInfo")).avatar;
      this.nickName = JSON.parse(localStorage.getItem("userInfo")).nickName;
    }
  },
  methods: {
    toSelfInfo() {
      this.$router.push('selfInfo')
    },
    logout() {
      request.logout().then(res => {
        if (res.code === 200) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          this.isLogin = false
          this.$message.success({
            message: "退出成功",
            duration: 1000,
          });
          this.$socket.unRegisterCallBack();
          this.$socket.disconnect();
          this.avatarUrl = "";
        } else {
          this.$message.error(
              {
                message: res.msg,
                duration: 1000,
              });
        }
      })

    },
  }


};
</script>
<style lang="scss">
.all {
  display: flex;
  justify-content: center;
  align-items: center;

  .body {

    width: 100%;
    margin-top: 60px;
  }
}

.el-header {
  height: 62px;
}

.el-main {
  padding: 0;
  height: calc(100vh - 62px); // 设置主体 main 高度
}

.head {
  border-top: 2px solid #ff6700;
  background-color: white;
  /* 设置固定定位 */
  position: fixed;
  top: 0;
  height: 60px;
  border-bottom: 1px solid #e6e6e6;
  /* 该盒子位于最上层 不要被其它盒子覆盖 */
  z-index: 4;

  .el-menu--horizontal > .el-menu-item {
    border-bottom: none;
    text-decoration: none;
  }

  .el-menu--horizontal {
    border-bottom: none;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  .user {
    width: 25%;
    /* 设置固定定位 */
    position: fixed;
    top: 0;
    right: 20px;
    height: 60px;
    /* 该盒子位于最上层 不要被其它盒子覆盖 */
    z-index: 4;

    .no-login {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .to-login-a {
        color: white;
      }
    }

    .is-login {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .user-nick-name {
        margin: 15px;
      }

      .el-icon-s-tools {
        margin-left: 5px;
        font-size: 40px;
        color: rgb(144, 147, 153);
      }

      .el-icon-s-tools-click {
        color: rgb(48, 49, 51);
      }
    }
  }


  .logo-search {
    display: flex;
    align-items: center;
    width: 25%;
    /* 设置固定定位 */
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    /* 该盒子位于最上层 不要被其它盒子覆盖 */
    z-index: 4;
  }

  .logo {
    margin-left: 5%;
    height: 40px;
    width: 130px;
  }

  .search {
    width: 200px;
    margin-left: 1%;
  }

  input.el-input__inner {
    border-radius: 30px;
  }

  .el-menu {
    border-top: 2px solid #ff6700;

    .is-active {
      background-color: transparent !important;
    }

    .el-menu-item {
      background-color: transparent !important;
    }

    //设置选中el-menu-item时的样式
    .el-menu-item:hover {
      background-color: transparent !important;
    }

    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: baseline;

    /* 设置固定定位 */
    position: fixed;
    top: 0;

    height: 55px;

    /* 该盒子位于最上层 不要被其它盒子覆盖 */
    z-index: 4;
    width: 50%;

    .icon {
      font-size: 40px;
      margin: 0;
      width: auto;
    }

    .el-menu-item {
      width: 150px;
    }

    .el-dropdown-menu__item, .el-menu-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }

  padding: 0;
  width: 100vw;
}


</style>

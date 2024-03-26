<template>
  <div class="page">
    <el-image :src="src" class="background-image"></el-image>
    <div class="login"></div>
    <div class="loginInfo">
      <el-image :src="logo" class="tittle"></el-image>
      <el-input
          v-model="userInfo.userName"
          class="username"
          placeholder="请输入您的用户名"
          prefix-icon="el-icon-user"
          type="text"
      ></el-input>
      <el-input
          v-model="userInfo.password"
          class="password"
          placeholder="请输入您的密码"
          prefix-icon="el-icon-lock"
          type="password"
      ></el-input>
      <el-button class="user-button" size="medium" type="primary" @click="login"
      >登录
      </el-button
      >
      <!-- <h3>or</h3> -->
      <el-button class="register-button" plain size="medium" type="primary"
      >注册
      </el-button
      >
      <el-button
          class="forget-button"
          plain
          size="medium"
          type="primary"
      >忘记密码
      </el-button
      >
      <div class="to-home"><a class="forget-button" href="#/home">
        <i class="el-icon-info">直接访问</i> </a></div>

    </div>
  </div>
</template>

<script>
import img from "@/assets/image.png";
import request from "@/request/LoginPage";
import WebSocketServer from "@/request/WebSocketServer"

export default {
  data() {
    return {
      userInfo: {
        userName: "",
        password: "",
      },
      src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      logo: img,
    };
  },
  methods: {
    login() {
      request.loginRequest(this.userInfo).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message({
            message: "登录成功",
            type: "success",
            duration: 1000,
          });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
          WebSocketServer.Instance.connect();
          this.$router.push("/");
        } else {
          this.$message({
            message: "用户名或密码错误",
            type: "warning",
            duration: 1000,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.page {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 1000px;
    z-index: -10;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }

  .login {
    position: absolute;
    top: 28%;
    left: 37.5%;
    z-index: 1;
    box-shadow: 0 0 5px 1px #303030;
    border-radius: 0;
    width: 25%;
    height: 40%;
    background-color: white;

  }

  .loginInfo {
    .to-home {
      margin-left: 300px;

      .forget-button {
        color: #909399;
      }

      .forget-button:hover {
        color: black;
      }
    }

    display: flex;
    position: absolute;
    top: -2%;
    z-index: 2;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;

    .tittle {
      height: 8%;
      margin-top: 0;
      margin-bottom: 5px;
    }

    .username,
    .password {
      width: 20%;
      margin-top: 0;
      margin-bottom: 1%;
    }

    .username input.el-input__inner,
    .password input.el-input__inner {
      border-radius: 0px;
      border-top-style: none;
      border-right-style: none;
      border-left-style: none;
      border-bottom: 1px solid rgb(97, 96, 96);
    }

    .username input.el-input__inner:focus,
    .password input.el-input__inner:focus {
      border-bottom: 2px solid rgb(64, 158, 255);
    }

    .username input.el-input__inner:hover,
    .password input.el-input__inner:hover {
      border-bottom: 2px solid rgb(64, 158, 255);
    }

    .user-button {
      width: 20%;
      margin-top: 0%;
      margin: 0;
      margin-bottom: 15px;
    }

    .register-button,
    .forget-button {
      width: 20%;
      margin-bottom: 5px;
      margin-left: 0;
    }
  }
}
</style>

%
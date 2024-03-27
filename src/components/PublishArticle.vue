<template>
  <div class="publish-container">
    <div class="publish-body">
      <el-card>
        <el-form>
          <el-form-item>
            <div id="tool-bar">
              <el-popover
                  placement="top"
                  trigger="click"
                  width="auto">
                <VEmojiPicker class="emoji-body" labelSearch="Search" lang="pt-BR"
                              @select="selectEmoji"/>
                <el-button slot="reference" style="font-size:20px;padding: 2px">😃
                </el-button>
              </el-popover>
            </div>
            <el-input id="emojiInput" v-model="content" placeholder="分享新鲜事" rows="10" size="medium"
                      type="textarea"></el-input>
          </el-form-item>
          <el-form-item class="images">
            <el-upload
                :http-request="upload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                action=""
                class="upload"
                list-type="picture-card"
                multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img :src="dialogImageUrl" alt="" width="100%">
            </el-dialog>
          </el-form-item>
          <el-button @click="addArticle">发布</el-button>
        </el-form>
      </el-card>
    </div>

  </div>
</template>

<script>
import request from '@/request/Article'

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      images: [],
      content: ""
    };
  },
  methods: {
    // 表情输入
    selectEmoji(emoji) {
      const elInput = document.getElementById('emojiInput');//获取输入框元素
      // console.log(elInput);
      const start = elInput.selectionStart; // 记录光标开始的位置
      const end = elInput.selectionEnd; // 记录选中的字符 最后的字符的位置
      if (start === undefined || end === undefined) return
      const txt = elInput.value;
      // 将表情添加到选中的光标位置
      const result =
          txt.substring(0, start) + emoji.data + txt.substring(end);
      elInput.value = result // 赋值给input的value
      // 重置光标位置
      elInput.focus()
      elInput.selectionStart = start + emoji.data.length
      elInput.selectionEnd = start + emoji.data.length
      this.content = result // 赋值(注意这里一定要赋值给表情输入框绑定的那个值)
    },
    upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      request.addImage(formData).then(res => {
        if (res.code === 200) {
          this.images.push(res.data)
        } else {
          this.$message.error({
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    addArticle() {
      if (this.content === '') {
        this.$message({
          type: 'error',
          message: '内容不能为空',
          duration: 3000
        })
        return
      }
      request.addArticle({
        createBy: JSON.parse(localStorage.getItem('userInfo')).id,
        content: this.content,
        images: this.images.toString()
      }).then(res => {
        if (res.code === 200) {
          this.$message.success({
            message: "发布成功",
            type: "success",
            duration: 1000,
          })
          this.$router.push('/home')
        } else
          this.$message.error({
            message: res.msg,
            type: "error",
            duration: 1000
          })
      })
    }, callBack(data) {
      this.$notify({
        title: data.title,
        message: data.msg,
        offset: 70,
        duration: 3000
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.$socket.registerCallBack(this.callBack);
  },
  destroyed() {
    this.$socket.unRegisterCallBack(this.callBack);
  }

};
</script>
<style lang="scss">
.el-button {
  border-radius: 5px !important;
}

.publish-container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;

  .publish-body {
    width: 55%;

    .images {
      display: flex;

      .el-upload .el-upload--picture-card {
        width: 200px;
        height: 200px;
      }
    }
  }
}
</style>
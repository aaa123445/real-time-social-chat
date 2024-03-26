<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="scss">
</style>
<script>

export default {
  name: 'App',
  mounted() {
    if (localStorage.getItem('userInfo')) {
      this.$socket.registerCallBack(this.testData)
    }
  },
  methods: {
    testData(data) {
      this.$notify({
        title: data.title,
        message: data.msg,
        offset: 70,
        duration: 3000
      })
    }
  },
  destroyed() {
    // 取消回调函数
    this.$socket.unRegisterCallBack(this.testData)
  },
}
</script>

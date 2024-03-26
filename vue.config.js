const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    assetsDir: 'static',
    parallel: false,
    publicPath: './',

})
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7777/',// 后端接口
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
}


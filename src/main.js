import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/axios.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/config/GlobalStyle.css'
import SocketService from '@/request/WebSocketServer'
import JwChat from 'jwchat';
import VEmojiPicker from 'v-emoji-picker'

/* 在 0.2.041 之前的版本需要引入 css */
// import 'jwchat/lib/JwChat.css';
Vue.use(JwChat)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VEmojiPicker)

// 对服务端进行websocket的连接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

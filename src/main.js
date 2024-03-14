import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/axios.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/config/GlobalStyle.css'
import request from '@/utils/axios.js'

Vue.config.productionTip = false
Vue.prototype.$axios = request
request.defaults.baseURL = '/api'

Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

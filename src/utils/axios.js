import axios from 'axios'
import {getToken, removeToken} from '@/utils/getToken'
import {Message} from 'element-ui'
import router from "@/router";

// 创建axios实例
const request = axios.create({
    // 这里可以放一下公用属性等。
    baseURL: 'api', // 用于配置请求接口公用部分，请求时会自动拼接在你定义的url前面。
    withCredentials: false, // 跨域请求时是否需要访问凭证
    timeout: 100 * 1000, // 请求超时时间

})

// 请求拦截器
request.interceptors.request.use((config) => {
    const onInterceptorList = [
        'api/auth/login',
        'api/article/getList/',
    ];
    if (!onInterceptorList.includes(config.url)) {
        if (getToken('token')) {
            config.headers['token'] = getToken('token'); //携带token
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error)
})

request.interceptors.response.use((response) => {
    let {code, msg} = response.data
    if (code !== 200) {
        Message({message: msg || 'error', type: 'warning'})
    }
    if (code === 401) {
        Message({message: msg || 'error', type: 'warning'})
        removeToken('token')
        localStorage.removeItem('userInfo')
        //跳转到登录页
        router.push('/login');
    }
    return response.data;//此处可以只返回后端传出的数据（第一层data是axios封装的）
}, (error) => {
    return Promise.reject(error)
})

export default request;//记得暴露出去
import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    redirect: 'home/articleList',
    meta: { name: "index", isAuth: false },
    component: () => import('@/views/IndexPage.vue'),
    //子路由
    children: [
      {
        path: 'articleList',
        name: 'articleList',
        meta: { name: "articleList", isAuth: false },
        component: () => import('@/components/ArticleList.vue')
      },
      {
        path: 'messageList',
        name: 'messageList',
        meta: { name: "messageList", isAuth: true },
        component: () => import('@/components/MessageList.vue')
      },
      {
        path: 'publishArticle',
        name: 'publishArticle',
        meta: { name: "publishArticle", isAuth: true },
        component: () => import('@/components/PublishArticle.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// 注册一个全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {    //判断当前路由是否需要进行权限控制
    if (localStorage.getItem('token')) {    //权限控制的具体规则
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  } else {
    next() // 放行
  }
})

export default router

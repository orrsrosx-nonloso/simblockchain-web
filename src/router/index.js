import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../components/Login.vue'
import layout from '../layout/layout.vue'
import ErrPage from '../components/ErrPage.vue'
import { delCookie, getCookie } from '../utils/cookie.js'

const routerHistory = createWebHistory()

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/layout',
        name: 'layout',
        component: layout,
        children: []
    },
    {//404
        path: '/404',
        name: 'notFound',
        component: ErrPage
    }
]

const router = createRouter({
    history: routerHistory,
    routes: routes
})
// 设置addRoute判断是否已经进入过首次刷新判断，避免进入死循环
let addRoute = false;

router.onError(err => {
    console.log('err', err)
    router.push('/404')
})

router.beforeEach(async (to, from, next) => {
    console.log('to', to)
    if (to.path == '/login' || to.path == '/') {
        delCookie('userInfo')
        localStorage.clear()
        next()
    } else {
        const token = store.getters.tokenGetter;
        if (token) { // 判断是否已经登录
            if (addRoute) {
                next()
            } else {
                if (from.name == null) { // 刷新
                    store.commit('addRoute')
                    addRoute = true
                    next({ ...to, replace: true })
                } else {
                    next()
                }
            }
        } else { // 未登录
            next({ path: '/login' })
        }
    }
})

export default router

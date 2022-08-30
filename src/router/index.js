import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import layout from '../layout/layout.vue'
import ErrPage from '../components/ErrPage.vue'
import needUserPc from '../components/needUserPc.vue'
import { delCookie, getCookie } from '../utils/cookie.js'
import { loginOut } from "../api/apis";
import { useStore } from "vuex";
const routerHistory = createWebHistory()

const routes = [
    {
        path: '/',
        // redirect: '/login'
        name: 'index',
        component: Index
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
    },
    {//needPC
        path: '/needUserPc',
        name: 'needUserPc',
        component: needUserPc
    }
]

const router = createRouter({
    history: routerHistory,
    routes: routes
})
// 设置addRoute判断是否已经进入过首次刷新判断，避免进入死循环
let addRoute = false;

router.onError(err => {
    // console.log('err', err)
    router.push('/404')
})

router.beforeEach(async (to, from, next) => {
    if (to.path == '/login') {
        delCookie('userInfo')
        const userName = store.getters.authGetter;
        if (userName != null) {
            loginOut({ "auth": userName }).then((res) => { 
                // console.log("默认登出成功！") 
            });
        }
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
            if (to.name == 'index' || to.path == '/') {
                next()
            }
            else {
                next({ path: '/login' })
            }
        }
    }
})

router.afterEach((to, from, next) => {

})
export default router

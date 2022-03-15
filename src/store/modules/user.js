import {getCookie, setCookie} from '../../utils/cookie'
const user = {
    state: {
        token: getCookie('token') ? getCookie('token') : null,
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
    },
    mutations: {
        getUser(state, ctx) {
            setCookie('token', ctx.token, 'd1')
            localStorage.setItem('userInfo', JSON.stringify(ctx))
            state.userInfo = ctx
            state.token = ctx.token
        }
    },
    actions: {
        asyncGetUserInfo({ commit }) {
            setTimeout(() => {
                commit("getUser", +new Date() + 'action')
            }, 2000)
        }
    },
    getters: {
        tokenGetter(state) {
            return state.token
        },
        authGetter(state) {
            return state.userInfo.username
        }
    }
}
export default user
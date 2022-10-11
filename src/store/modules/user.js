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
        },
        updataUsername(state,username){
            if(state.userInfo.username!=null){
                state.userInfo.username = username;
            }
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
        },
        authorityGetter(state) {
            return state.userInfo.authority
        },
        authnameGetter(state) {
            let targetName = state.userInfo.username+"(用户ID)"
            if(state.userInfo.authname==""||state.userInfo.authname==null){
                targetName = state.userInfo.username+"(用户ID)";
            }else{
                targetName = state.userInfo.authname; 
            }
            return targetName
        },
    }
}
export default user
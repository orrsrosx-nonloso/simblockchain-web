import { getRoutesApi } from "../../api/apis";
import router from '../../router/index.js'
import layout from '../../layout/layout.vue'
// 动态路由菜单
import asnycRouters from '../../router/asnycRouters'

const route = {
    state: {
        routes: JSON.parse(localStorage.getItem('routes')) ? JSON.parse(localStorage.getItem('routes')) : []
    },
    mutations: {
        getRoutes(state, routes) {
            localStorage.setItem('routes', JSON.stringify(routes))
            state.routes = routes
        },
        addRoute(state) {
            // 接口获取的菜单
            const apiRoutes = state.routes

            const toPushRoutes =
            {
                path: '/layout',
                name: 'layout',
                component: layout,
                children: filterRoute(apiRoutes, asnycRouters)
            }

            router.addRoute(toPushRoutes)
            router.addRoute({ //重定向到404
                path: "/:pathMatch(.*)*", redirect: '/404'
            })


            function filterRoute(apiRoutes, asnycRouters) {
                return apiRoutes.map(val => {
                    asnycRouters.map(valIn => {
                        if (val.path == valIn.path) {
                            val.component = valIn.component
                        }
                    })
                    if (val.children) {
                        filterRoute(val.children, asnycRouters)
                    }
                    return val;
                })
            }
        }
    },
    actions: {
        asyncGetRoutes({ commit }, auth) {
            return new Promise((resolve) => {
                getRoutesApi({ page: 1, limit: 100, auth: auth }).then(res => {
                    const { data } = res
                    commit("getRoutes", data)
                    commit("addRoute", data)
                    resolve(data)
                })
            })
        }
    },
    getters: {
        routesGetter(state) {
            return state.routes
        }
    }
}
export default route
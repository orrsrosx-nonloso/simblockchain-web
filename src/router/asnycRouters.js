// 动态路由菜单  JustTwo
import table from '../views/table.vue'
import tree from '../views/tree.vue'
import auth from '../views/auth.vue'
import map from '../views/map.vue'

const asnycRouters = [
    {
        path: 'table',
        name: 'table',
        component: table
    },
    {
        path: 'auth',
        name: 'auth',
        component: auth
    },
    {
        path: 'tree',
        name: 'tree',
        component: tree
    },
    {
        path: 'map',
        name: 'map',
        component: map
    }
]

export default asnycRouters 
// 动态路由菜单  orrsrosx
import table from '../views/table.vue'
import tree from '../views/tree.vue'
import auth from '../views/auth.vue'
import map from '../views/map.vue'
import singleSim from '../views/singleSim.vue'
import wholeSim from '../views/wholeSim.vue'

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
    ,
    {
        path: 'singleSim',
        name: 'singleSim',
        component: singleSim
    },
    {
        path: 'wholeSim',
        name: 'wholeSim',
        component: wholeSim
    }
]

export default asnycRouters 
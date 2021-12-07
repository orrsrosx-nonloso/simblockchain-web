import { createStore } from 'vuex'
import user from './modules/user'
import route from './modules/route'
import system from './modules/system'

const store = createStore({
    modules: {
        user: user,
        route: route,
        system: system
    }
})

export default store
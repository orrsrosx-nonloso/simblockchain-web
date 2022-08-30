import { createStore } from 'vuex'
import user from './modules/user'
import route from './modules/route'
import system from './modules/system'
import simstate from './modules/simstate'


const store = createStore({
    modules: {
        user: user,
        route: route,
        system: system,
        simstate: simstate
    }
})

export default store
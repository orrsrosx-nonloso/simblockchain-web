const simstate = {
    state: {
        // 是否折叠
        simstatue: localStorage.getItem('simStatue') ? JSON.parse(localStorage.getItem('simStatue')) : "",
        isSiming:localStorage.getItem('isSim') ? JSON.parse(localStorage.getItem('isSim')) : false,
    },
    mutations: {
        setSimState(state, isSim) {
            localStorage.setItem('simStatue', JSON.stringify(state))
            localStorage.setItem('isSim', JSON.stringify(isSim))
        }
    },
    getters: {
        getSimStatue(state) {
            return state.simstatue
        },
        getIsSim(state) {
            return state.isSiming
        }
    }
}
export default simstate
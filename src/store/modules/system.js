const system = {
    state: {
        // 手否为手机尺寸
        isPhone: localStorage.getItem('isPhone') ? JSON.parse(localStorage.getItem('isPhone')) : false
    },
    mutations: {
        setIsPhone(state, isPhone) {
            localStorage.setItem('isPhone', isPhone)
            state.isPhone = isPhone
        }
    },
    getters: {
        getIsPhone(state) {
            return state.isPhone
        }
    }
}
export default system
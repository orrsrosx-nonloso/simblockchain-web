import http from './index.js';


// // 登录
// export const getLogin = function (data) {
//     return http('get', '/http/login', data)
// }
// 登录
export const getLoginMes = function (data) {
    return http('post', 'http://localhost:8081/user/login', data)
}

// 获取用户数据
export const getUserData = function (data) {
    return http('get', 'http://localhost:8081/user/findAll', data)
}

// // 获取用户数据
// export const getMapData = function (data) {
//     return JSON.stringify
// }

// 获取路由菜单
export const getRoutesApi = function (data) {
    return http('get', 'http://localhost:8081/route/findAll', {
        tablename: 'routes',
        ...data
    })
}

// // 获取用户菜单
// export const getUsersApi = function (data) {
//     return http('get', '/http/getTable', {
//         tablename: 'user',
//         ...data
//     })
// }

// 新键节点
export const createNewNode = function (data) {
    return http('get', 'http://localhost:8081/singleNode/createNode', data)
}

// 获取权限菜单
export const getRolesApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'role',
        ...data
    })
}
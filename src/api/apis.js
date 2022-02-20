import http from './index.js';


// 登录
export const getLogin = function (data) {
    return http('get', '/http/login', data)
}
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
//清楚仿真数据缓存
export const clearCache = function (data) {
    return http('get', 'http://localhost:8081/singleNode/clearCache', data)
}
//查找节点
export const findNodeByAddressId = function (data) {
    return http('post', 'http://localhost:8081/singleNode/findByAddressID', data)
}

//设置节点类型
export const updateNodeType = function (data) {
    return http('post', 'http://localhost:8081/singleNode/setNodeType', data)
}

//设置节点类型
export const findMinExist = function (data) {
    return http('get', 'http://localhost:8081/singleNode/isMiningExist', data)
}

//设置节点类型
export const findWalletCon = function (data) {
    return http('post', 'http://localhost:8081/wallet/findWalletById', data)
}

//查找区块
export const findBlockByBlockId = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/findByBlockId', data)
}

//清楚仿真数据缓存
export const deleteNode = function (data) {
    return http('post', 'http://localhost:8081/singleNode/deleteNode', data)
}

// 新键区块
export const createNewBlock = function (data) {
    return http('get', 'http://localhost:8081/singleBlock/createBlock', data)
}

// 获取权限菜单
export const getRolesApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'role',
        ...data
    })
}
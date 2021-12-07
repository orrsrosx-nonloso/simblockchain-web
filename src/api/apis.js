import http from './index.js';


// 登录
export const getLogin = function (data) {
    return http('get', '/http/login', data)
}

// 获取路由菜单
export const getRoutesApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'routes',
        ...data
    })
}

// 获取用户菜单
export const getUsersApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'user',
        ...data
    })
}

// 获取权限菜单
export const getRolesApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'role',
        ...data
    })
}
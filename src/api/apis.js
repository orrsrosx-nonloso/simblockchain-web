import http from './index.js';


// 登录
export const getLogin = function (data) {
    return http('get', '/http/login', data)
}
// 登录
export const getLoginMes = function (data) {
    return http('post', 'http://localhost:8081/user/getLogin', data)
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
    return http('post', 'http://localhost:8081/singleNode/createNode', data)
}
//清除仿真数据缓存
export const clearCache = function (data) {
    return http('post', 'http://localhost:8081/singleNode/clearCache', data)
}
//查找节点
export const findNodeByAddressId = function (data) {
    return http('post', 'http://localhost:8081/singleNode/findByAddressID', data)
}

//设置节点类型
export const updateNodeType = function (data) {
    return http('post', 'http://localhost:8081/singleNode/setNodeType', data)
}

//查看矿工是否存在
export const findMinExist = function (data) {
    return http('post', 'http://localhost:8081/singleNode/isMiningExist', data)
}

//查找钱包结构
export const findWalletCon = function (data) {
    return http('post', 'http://localhost:8081/wallet/findWalletById', data)
}

//查找区块
export const findBlockByBlockId = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/findByBlockId', data)
}

//删除节点
export const deleteNode = function (data) {
    return http('post', 'http://localhost:8081/singleNode/deleteNode', data)
}

//创建交易
export const TransactionSingle = function (data) {
    return http('post', 'http://localhost:8081/transSingle/createTrans', data)
}

//创建交易
export const getUnconfirmed = function (data) {
    return http('post', 'http://localhost:8081/transSingle/getAllUnConfirmedTrans', data)
}

//通过ID列表查询所有交易
export const FindTransListBYid = function (data) {
    return http('post', 'http://localhost:8081/transSingle/findTransListBYid', data)
}



//获取当前账本拥有者
export const findpresentMin = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/findpresentMin', data)
}
// 新键区块
export const createNewBlock = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/createBlock', data)
}

// 每次创建节点后会进行区块链网络构建
export const addP2pNet = function (data) {
    return http('post', 'http://localhost:8081/p2pNetwork/addP2pNet', data)
}


// 获取所有区块链网络结构
export const getAllNetWork = function (data) {
    return http('post', 'http://localhost:8081/p2pNetwork/getAllNetWork', data)
}

// 获取到所以矿工节点
export const getAllMiner = function (data) {
    return http('post', 'http://localhost:8081/singleNode/getAllMiner', data)
}

//查询10个以内未确定交易
export const getNewBlockDif = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/getNewBlockDif', data)
}

//创建分叉区块
export const createBifurcatedChain = function (data) {
    return http('post', 'http://localhost:8081/singleBlock/createBifurcatedChain', data)
}


//通过ID交易详情
export const findTransCon = function (data) {
    return http('post', 'http://localhost:8081/transSingle/findTransId', data)
}
//获取交易输入信息
export const findTXInput = function (data) {
    return http('post', 'http://localhost:8081/txInput/findTXInput', data)
}

//获取交易输出信息
export const findTXOutput = function (data) {
    return http('post', 'http://localhost:8081/txOutput/findTxOutput', data)
}


//登出
export const loginOut = function (data) {
    return http('post', 'http://localhost:8081/user/loginOut', data)
}


//检查登录状态
export const checkLoginStatus = function (data) {
    return http('post', 'http://localhost:8081/user/checkLogin', data)
}

// 获取权限菜单
export const getRolesApi = function (data) {
    return http('get', '/http/getTable', {
        tablename: 'role',
        ...data
    })
}
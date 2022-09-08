import { walletCreate } from "../wholesim/wholeWallet"
import { addressStr, uuid, normalRandom } from "../utils/utils"
import { initNetWorkTable } from "../wholesim/wholeNetwork"
import {getRandomPosition} from "../wholesim/mapPosition"
// import {MinHeap} from "../wholesim/minHeap"
//全流程计划先创建数据，后通过数据
export function nodeCreated(WholeSimData, auth) {
    let Degree_distribution = [0.025, 0.050, 0.075, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.85, 0.90, 0.95, 0.97,
        0.97, 0.98, 0.99, 0.995, 1.0]
    let regionList = [];
    for (let data in WholeSimData.regionList) {
        regionList.push(WholeSimData.regionList[data]);
    }
    let len = WholeSimData.numOfNodes;
    //节点地区分布
    const targetRegionList = getRandomListForRegion(regionList, len);
    //节点邻居分布
    const targetDegreeList = getRandomListForDegree(Degree_distribution, len);
    //节点流失分布
    const targetChurnList = getRandomListForChurnNode(WholeSimData.nodeChurnRate, len);
    //节点类型分布0fullnode，1lightnode，2miningnode
    const targetNodeTYpeList = getRandomListForNodeType(WholeSimData.nodeTypRate, len);
    //
    //节点账户创建
    const targetNodeAccount = getTargetNodeAccount(len, auth);
    // for()

    let nodeList = [];


    for (let i = 0; i < len; i++) {
        let hashRates = 0;
        if (targetNodeTYpeList[i] == "miningNode") {
            hashRates = Math.max(10000 * normalRandom(0, 1.0) + WholeSimData.averageMiningPower, 1)
        }
        let netWorkTable = {
            numConnection: 9,
            inBound: [],
            outBound: []
        }
        nodeList.push({
            id: i,
            addressId: "Node" + (i + 1),
            transactions: 0,
            totalReceived: 0,
            totalSent: 0,
            balance: 0,
            nodeType: targetNodeTYpeList[i],
            walletId: targetNodeAccount[i].walletId,
            transactionsId: "",
            auth: auth,
            hashRate: hashRates,
            accountList: targetNodeAccount[i],
            minerAccountName: targetNodeAccount[i].accountName,
            regionId: targetRegionList[i].id,
            regionPostion:targetRegionList[i].value,
            isChurn: targetChurnList[i],
            numConnection: targetDegreeList[i] + 1,
            netWorkTable: netWorkTable,
            chainBlockHeightState:1,//最新链情况0表示最新，1表示非最新
        })
    }
    //开始构建网络
    for (let i = 0; i < len; i++) {
        initNetWorkTable(nodeList[i], nodeList, len);
    }
    
    // let blockPile = new MinHeap();
    // let ary = [{
    //     timestamp:6,
    //     data:"223"
    // }, {
    //     timestamp:3,
    //     data:"223"
    // }, {
    //     timestamp:8,
    //     data:"223"
    // }, {
    //     timestamp:5,
    //     data:"223"
    // }, {
    //     timestamp:4,
    //     data:"223"
    // }, {
    //     timestamp:10,
    //     data:"223"
    // }, {
    //     timestamp:7,
    //     data:"223"
    // }, {
    //     timestamp:2,
    //     data:"223"
    // }];

    // ary.map(item => {
    //     blockPile.insert(item);
    // })
    // let j = 0;
    //返回节点列表
    return nodeList;

}

//节点地区分布
function getRandomListForRegion(distribution, size) {
    //地区列表
    let regionsLi = ["NORTH_AMERICA", "EUROPE", "SOUTH_AMERICA", "ASIA", "AFRICA",
    "OCEANIA"];
    let targetList = [];
    let regionActive = 0.0;
    for (let i = 0; i < distribution.length; i++) {
        regionActive += distribution[i];
        let len = targetList.length;
        while (len <= size * regionActive) {
            let j = JSON.parse(JSON.stringify(targetList))
            targetList.length = 0;
            let lop = getRandomPosition(regionsLi[i]);
            j.push({id:i,value:[lop.longitude, lop.latitude]
            });
            len = j.length;
            targetList = j;
        }
    }

    while (targetList.length < size) {
        targetList.push[0];
    }
    //自定义的顺序打算算法，相较sort更加快速
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    targetList.shuffle();
    return targetList;

}
//节点邻居分布
function getRandomListForDegree(distribution, size) {
    let targetList = [];
    let i = 0;
    for (; i < distribution.length; i++) {
        let len = targetList.length;
        while (len <= size * distribution[i]) {
            let j = JSON.parse(JSON.stringify(targetList))
            targetList.length = 0;
            j.push(i);
            len = j.length;
            targetList = j;
        }
    }
    while (targetList.length < size) {
        targetList.push[0];
    }
    //自定义的顺序打算算法，相较sort更加快速
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    targetList.shuffle();
    let needD = 0;
    for (let i = 0; i < targetList.length; i++) {
        if (targetList[i] == 0) {
            needD = i;
        }
    }
    targetList.splice(needD, 1);
    targetList.unshift(0);
    return targetList;

}
//节点流失分布
function getRandomListForChurnNode(nodeChurnRate, size) {
    let listForChurnNode = [];
    for (let i = 0; i < size; i++) {
        listForChurnNode.push(i < nodeChurnRate * size)
    }

    //自定义的顺序打算算法，相较sort更加快速
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    listForChurnNode.shuffle();
    return listForChurnNode;
}


//节点流失分布
function getRandomListForNodeType(nodeTypeRate, size) {
    let nodetypes = ["fullNode", "lightNode", "miningNode"];
    let targetList = [];
    let regionActive = 0.0;
    for (let i = 0; i < nodeTypeRate.length; i++) {
        regionActive += nodeTypeRate[i];
        let len = targetList.length;
        while (len < size * regionActive) {
            let j = JSON.parse(JSON.stringify(targetList))
            targetList.length = 0;
            j.push(nodetypes[i]);
            len = j.length;
            targetList = j;
        }
    }

    while (targetList.length < size) {
        targetList.push[nodetypes[0]];
    }
    //自定义的顺序打算算法，相较sort更加快速
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    targetList.shuffle();
    return targetList;
}


//账户创建
function getTargetNodeAccount(size, auth) {

    let AccountList = [];
    for (let i = 0; i < size; i++) {
        let Wallet = walletCreate(i, auth);
        AccountList.push({
            address: addressStr(),
            accountId: i + 1,
            transactions: 0,
            totalReceived: 0,
            totalSent: 0,
            balance: 0,
            walletId: Wallet,
            transactionsId: "",
            auth: auth,
            accountName: uuid("account" + (i + 1), ""),
            nodeId: "Node" + (i + 1)
        })
    }
    let j = 1;
    return AccountList;

}

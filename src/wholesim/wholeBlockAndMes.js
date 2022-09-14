import { Queue } from "../wholesim/queue"
import { MinHeap } from "../wholesim/MinHeap"
import { sha256 } from 'js-sha256'
import { re } from "mathjs";
//区块事件创建
export function blockMesListCreate(WholeSimData, nodeMesList, blockTime, blockSize) {
    let miningNodeList = [];
    for (let i = 1; i < nodeMesList.length; i++) {
        if (nodeMesList[i].nodeType == "miningNode") {
            miningNodeList.push(nodeMesList[i]);
        }
    }
    let nonce = 1;
    let targeId = 0;
    let hashList = [];
    while (true) {
        let hash = sha256("block" + nonce);
        if (hash.substr(0, 2) == "00") {
            hashList.push({
                hash: hash,
                nonce: JSON.parse(JSON.stringify(nonce)) * (Math.floor(Math.random() * 20))
            });
            targeId++;

            if (targeId > blockSize) {
                break;
            }
        }
        nonce++;
    }
    let blockMesList = [];
    for (let i = 1; i <= blockSize; i++) {
        //随机产生挖矿的矿工节点
        miningNodeList.shuffle();
        let preHash = "";
        if (i > 1) {
            preHash = hashList[i - 2].hash;
        }
        blockMesList.push({
            id: i - 1,
            blockId: "Block" + i,
            startTimestamp: (i - 1) * blockTime,
            endTimestamp: i * blockTime - 1,
            miner: miningNodeList[0],
            height: i,
            hash: hashList[i - 1].hash,
            confirmations: 0,//确定
            //交易量
            numOfTransac: 0,
            difficulty: 2000 * hashList[i - 1].nonce + miningNodeList[0].hashRate,
            nonce: hashList[i - 1].nonce,
            transactionVolume: 0,
            reward: WholeSimData.blockReward,
            prevBlockHash: preHash,
            feeReward: WholeSimData.transRePer,
            transactions: [],
            blockMesHeap: null
        })
    }
    let j = 1;
    return blockMesList;
}
//消息类型，，区块传输（基于邻居节点传输），贸易传输（内容传输与交易广播） 消息的接收//创立消息的同时也会将相关数据处理好
export function affairsMesListCreate(WholeSimData, nodeMesList, blockMesList, kindMesLen,
    noHeapBlockMesList, OrphanBlockList) {
    let haveCoinNode = [];
    let nodeCoinState = [];
    let targetorOrphanLen = WholeSimData.orphanBlock * WholeSimData.numOfEndBlock;
    let OrphanLenList = [];
    if (targetorOrphanLen > 0) {
        getOrphanLenList(OrphanLenList, WholeSimData.numOfEndBlock, targetorOrphanLen);
    }
    for (let i = 0; i < blockMesList.length; i++) {
        let minHeap = new MinHeap();
        let normalMes = [];;
        let start = JSON.parse(JSON.stringify(blockMesList[i].startTimestamp))
        let end = blockMesList[i].endTimestamp;
        let blockTransmitList = getBlockTransmitList(nodeMesList, blockMesList[i].miner);
        // let haveCoinNode = getHaveCoinNode(nodeMesList);
        let templateNodeList = JSON.parse(JSON.stringify(nodeMesList));
        let lastTime = 0;
        while (start < end) {
            if (minHeap.size() == 0) {
                let NodeTo = getNodeto(templateNodeList, blockMesList[i].miner);
                let timList = getAllTimeList(blockMesList[i].miner, NodeTo, WholeSimData);
                start += timList[0];//timList[0];
                let blockCreatedmes = {
                    id: i,
                    type: "blockCreated",
                    timestamp: start,
                    miner: JSON.parse(JSON.stringify(blockMesList[i].miner)),
                    targetBlock: blockMesList[i]
                };
                minHeap.insert(blockCreatedmes);
                normalMes.push({
                    id: i,
                    type: "blockCreated",
                    timestamp: start,
                    miner: blockMesList[i].miner.id,
                    targetBlock: blockMesList[i].id
                });
                //矿工节点添加交易信息
                coinStatePush(blockMesList[i].miner.id, WholeSimData.blockReward, nodeCoinState);
                //默认交易事务的添加
                start += timList[1];//timList[1];
                let isChurn = getNodeIsChurn(WholeSimData, NodeTo);
                let nodeTransId = kindMesLen.tradeMesLen;
                let transCoin = Math.random() * WholeSimData.blockReward;
                let enCoin = transCoin * (1 - WholeSimData.transRePer);
                let mes = {
                    id: nodeTransId,
                    transHash: sha256("trade" + nodeTransId),
                    type: "nodeTrade",
                    timestamp: start,
                    from: blockMesList[i].miner,
                    to: NodeTo,
                    isBreakdown: isChurn,
                    transCoin: Math.abs(enCoin),
                    feeCoin: Math.abs(transCoin - enCoin),
                };
                //交易来原入
                if (haveCoinNode.indexOf(templateNodeList[0].id) == -1) {
                    haveCoinNode.push(blockMesList[i].miner.id);
                }
                minHeap.insert(mes);
                normalMes.push({
                    id: nodeTransId,
                    transHash: sha256("trade" + nodeTransId),
                    type: "nodeTrade",
                    timestamp: start,
                    from: blockMesList[i].miner.id,
                    to: NodeTo.id,
                    isBreakdown: isChurn,
                    transCoin: Math.abs(enCoin),
                    feeCoin: Math.abs(transCoin - enCoin),
                });
                kindMesLen.tradeMesLen++;
                //交易接收事务
                start += timList[2];//timList[2];
                if (!isChurn) {
                    isChurn = getNodeIsChurn(WholeSimData, templateNodeList[0]);
                    //交易接收节点
                    coinStatePush(NodeTo.id, enCoin, nodeCoinState);
                }
                let tradeRecId = kindMesLen.RecMesLen;
                let tradeRecMes = {
                    id: tradeRecId,
                    type: "tradeRec",
                    timestamp: start,
                    from: NodeTo,
                    to: blockMesList[i].miner,
                    isBreakdown: isChurn,
                    transCoin: Math.abs(enCoin),
                    recMes: mes
                };
                minHeap.insert(tradeRecMes);
                normalMes.push({
                    id: tradeRecId,
                    type: "tradeRec",
                    timestamp: start,
                    from: NodeTo.id,
                    to: blockMesList[i].miner.id,
                    isBreakdown: isChurn,
                    transCoin: Math.abs(enCoin),
                    recMes: mes.id
                });
                if (haveCoinNode.indexOf(templateNodeList[0].id) == -1) {
                    haveCoinNode.push(NodeTo.id);
                }
                kindMesLen.RecMesLen++;
                //需要给代码及加上是否为分叉孤儿交易
                if (targetorOrphanLen > 0 && OrphanLenList.indexOf(i) != -1) {
                    //孤儿块的相关信息
                    //孤儿块事务50毫秒
                    console.log(i);
                    start += 50;
                    let miners = null;
                    while (true) {
                        miners = nodeMesList[Math.floor(Math.random() * nodeMesList.length)];
                        if (miners.id != blockMesList[i].miner.id) {
                            break;
                        }

                    }
                    let blockCreatedmes = {
                        id: i,
                        type: "blockOrphanCreated",
                        timestamp: start,
                        miner: miners,
                        targetBlock: blockMesList[i]
                    };
                    minHeap.insert(blockCreatedmes);
                    OrphanBlockList.push({
                        id: i,
                        blockId: "Block" + (i + 1),
                        startTimestamp: blockMesList[i].startTimestamp,
                        endTimestamp: blockMesList[i].endTimestamp,
                        miner: miners,
                        height: blockMesList[i].height,
                        hash: blockMesList[i].hash,
                        confirmations: 0,//确定
                        //交易量
                        numOfTransac: 0,
                        difficulty: blockMesList[i].difficulty,
                        nonce: blockMesList[i].nonce,
                        transactionVolume: 0,
                        reward: WholeSimData.blockReward,
                        prevBlockHash: blockMesList[i].preHash,
                        feeReward: WholeSimData.transRePer,
                        transactions: [],
                        blockMesHeap: null
                    });//孤儿块获取
                }

            }
            else {
                //间隔性产生交易事务，//后期会进行判断事务是否有效
                // let size = minHeap.size();
                if (minHeap.size() % 9 == 0) {
                    //针对矿工节点交易
                    templateNodeList.shuffle();
                    let fromNode = getFromNode(haveCoinNode, templateNodeList[0], nodeMesList);
                    let timList = getAllTimeList(fromNode, templateNodeList[0], WholeSimData);
                    start += timList[1];//timList[1];
                    //交易事务
                    let isChurn = getNodeIsChurn(WholeSimData, templateNodeList[0]);
                    let nodeTransId = kindMesLen.tradeMesLen;
                    let targetCoin = getTargetTradeCoin(fromNode.id, nodeCoinState, WholeSimData.blockReward);
                    let transCoin = Math.random() * targetCoin;
                    if (!isChurn) {
                        //交易接收节点
                        coinStatePush(fromNode.id, -transCoin, nodeCoinState);
                    }
                    let enCoin = transCoin * (1 - WholeSimData.transRePer);
                    let mes = {
                        id: nodeTransId,
                        transHash: sha256("trade" + nodeTransId),
                        type: "nodeTrade",
                        timestamp: start,
                        miner: JSON.parse(JSON.stringify(blockMesList[i].miner)),
                        from: fromNode,
                        to: templateNodeList[0],
                        isBreakdown: isChurn,
                        transCoin: Math.abs(enCoin),
                        feeCoin: Math.abs(transCoin - enCoin),
                    };
                    minHeap.insert(mes);
                    normalMes.push({
                        id: nodeTransId,
                        transHash: sha256("trade" + nodeTransId),
                        type: "nodeTrade",
                        timestamp: start,
                        miner: blockMesList[i].miner.id,
                        from: fromNode.id,
                        to: templateNodeList[0].id,
                        isBreakdown: isChurn,
                        transCoin: Math.abs(enCoin),
                        feeCoin: Math.abs(transCoin - enCoin),
                    });
                    kindMesLen.tradeMesLen++;
                    //交易接收事务
                    start += timList[2];//timList[2];
                    if (!isChurn) {
                        isChurn = getNodeIsChurn(WholeSimData, fromNode);
                        //交易接收节点
                        coinStatePush(templateNodeList[0].id, enCoin, nodeCoinState);
                    }
                    let tradeRecId = kindMesLen.RecMesLen;
                    let tradeRecMes = {
                        id: tradeRecId,
                        type: "tradeRec",
                        timestamp: start,
                        from: templateNodeList[0],
                        to: fromNode,
                        isBreakdown: isChurn,
                        transCoin: Math.abs(enCoin),
                        recMes: mes
                    };
                    //消息插入
                    minHeap.insert(tradeRecMes);
                    normalMes.push({
                        id: tradeRecId,
                        type: "tradeRec",
                        timestamp: start,
                        from: templateNodeList[0].id,
                        to: fromNode.id,
                        isBreakdown: isChurn,
                        transCoin: Math.abs(enCoin),
                        recMes: mes.id
                    });
                    if (haveCoinNode.indexOf(templateNodeList[0].id) == -1) {
                        haveCoinNode.push(templateNodeList[0].id);
                    }
                    kindMesLen.RecMesLen++;
                } else {
                    //区块传输事务，量级最多
                    let localBlockTransmit = blockTransmitList.poll();
                    let blockTimestamp = getTargetBlockTrTime(localBlockTransmit, WholeSimData, nodeMesList);
                    start += blockTimestamp[0].upLoad;//;
                    let transMesLenId = kindMesLen.transMesLen;
                    let mes = {
                        id: transMesLenId,
                        type: "BlockTrade",
                        timestamp: start,
                        miner: JSON.parse(JSON.stringify(blockMesList[i].miner)),
                        from: blockTimestamp[0].fromNode,
                        to: blockTimestamp[0].toNode,
                        isBreakdown: false,
                        blockHeight: i
                    };
                    minHeap.insert(mes);
                    normalMes.push({
                        id: transMesLenId,
                        type: "BlockTrade",
                        timestamp: start,
                        miner: blockMesList[i].miner.id,
                        from: blockTimestamp[0].fromNode.id,
                        to: blockTimestamp[0].toNode.id,
                        isBreakdown: false,
                        blockHeight: i
                    });
                    kindMesLen.transMesLen++;
                    //区块消息接收
                    start += blockTimestamp[0].downLoad;//;
                    let tradeRecId = kindMesLen.RecMesLen;
                    let tradeRecBlockMes = {
                        id: tradeRecId,
                        type: "tradeRecBlock",
                        timestamp: start,
                        from: blockTimestamp[0].toNode,
                        to: blockTimestamp[0].fromNode,
                        isBreakdown: false,
                        recMes: mes,
                        blockHeight: i
                    };
                    minHeap.insert(tradeRecBlockMes);
                    normalMes.push({
                        id: tradeRecId,
                        type: "tradeRecBlock",
                        timestamp: start,
                        from: blockTimestamp[0].toNode.id,
                        to: blockTimestamp[0].fromNode.id,
                        isBreakdown: false,
                        recMes: mes.id,
                        blockHeight: i
                    });
                    kindMesLen.RecMesLen++;
                }
            }

        }
        noHeapBlockMesList.push(normalMes);
        blockMesList[i].blockMesHeap = minHeap;

    }
    let j = 0;

}
//接收节点
function getNodeto(templateNodeList, miner) {
    while (true) {
        templateNodeList.shuffle();
        if (templateNodeList[0].addressId == miner.addressId) {
            continue;
        }
        else {
            return templateNodeList[0];
        }
    }
}
//节点是否故障
function getNodeIsChurn(WholeSimData, NodeTo) {
    let isChurn = false;
    if (NodeTo.isChurn) {
        // isChurn = Math.random() > (1 - WholeSimData.churnNodeFailureRate) ? isChurn : false;
        let ran = Math.random();
        let rate = 1 - WholeSimData.churnNodeFailureRate;
        if (ran > rate) {
            isChurn = true;
        }
        else {
            isChurn = false;
        }
    } else {
        // isChurn = Math.random() > (1 - WholeSimData.controllerNodeFailureRate) ? true : false;
        let ran = Math.random();
        let rate = 1 - WholeSimData.controllerNodeFailureRate;
        if (ran > rate) {
            isChurn = true;
        }
        else {
            isChurn = false;
        }
    }
    return isChurn;
}

//获取区块传输列表
function getBlockTransmitList(nodeMesList, miner) {
    let mesQueue = new Queue();
    let toList = [];
    let neighborsList = [];
    for (let i = 0; i < miner.netWorkTable.outBound.length; i++) {
        let num = miner.netWorkTable.outBound[i].split("e");
        neighborsList.push({ from: miner.id, to: parseInt(num[1] - 1) });
    }
    let allNeiList = [];
    for (let i = 0; i < nodeMesList.length; i++) {
        if (nodeMesList[i].addressId != miner.addressId) {
            allNeiList.push(nodeMesList[i].id);
        }
    }
    let targetLen = allNeiList.length;
    while (targetLen > 0) {
        let targetList = [];
        for (let j = 0; j < neighborsList.length; j++) {
            let newNeiList = getNeiList(nodeMesList[neighborsList[j].to], targetList);
            if (toList.indexOf(neighborsList[j].to) == -1) {
                mesQueue.offer(neighborsList[j]);
                toList.push(neighborsList[j].to);
            }
            // let list = JSON.parse(JSON.stringify(allNeiList));
            let emem = allNeiList.indexOf(neighborsList[j].to);
            if (emem != -1) {
                allNeiList.splice(emem, 1);
            }
            targetLen = allNeiList.length;
        }
        neighborsList.length = 0;
        neighborsList = targetList;
    }
    return mesQueue;

}
//邻居节点列表
function getNeiList(node, targetList) {
    let neighborsList = [];
    for (let i = 0; i < node.netWorkTable.outBound.length; i++) {
        let num = node.netWorkTable.outBound[i].split("e");
        neighborsList.push({ from: node.id, to: parseInt(num[1]) - 1 });
        targetList.push({ from: node.id, to: parseInt(num[1]) - 1 });
    }
    return neighborsList;
}
//获取节点传输延迟列表。对应交易与接收消息
function getAllTimeList(miner, nodeTo, WholeSimData) {
    let regionLatencyArray = [];
    for (let i = 0; i < WholeSimData.regionLatency.length; i++) {
        regionLatencyArray.push(WholeSimData.regionLatency[i].latency);
    }
    let fromIndexLatency = regionLatencyArray[miner.regionId][miner.regionId];
    let fromGotoLatency = regionLatencyArray[miner.regionId][nodeTo.regionId];
    let toGoFromLatency = regionLatencyArray[nodeTo.regionId][miner.regionId];

    let allTimeLatency = [fromIndexLatency, fromGotoLatency, toGoFromLatency];
    return allTimeLatency;
}
//获取区块传输延迟,传输是上传，接收是下载
function getTargetBlockTrTime(localBlockTransmit, WholeSimData, nodeMesList) {
    let fromNode = nodeMesList[localBlockTransmit[0].from];
    let toNode = nodeMesList[localBlockTransmit[0].to];

    let mesTimeList = [];
    if (fromNode.regionId == toNode.regionId) {
        let wholeDownloadBandwidthList = [WholeSimData.wholeDownloadBandwidth.na, WholeSimData.wholeDownloadBandwidth.eu, WholeSimData.wholeDownloadBandwidth.sa
            , WholeSimData.wholeDownloadBandwidth.as, WholeSimData.wholeDownloadBandwidth.af, WholeSimData.wholeDownloadBandwidth.oa];
        let wholeUploadBandwidth = [WholeSimData.wholeUploadBandwidth.na, WholeSimData.wholeUploadBandwidth.eu, WholeSimData.wholeUploadBandwidth.sa
            , WholeSimData.wholeUploadBandwidth.as, WholeSimData.wholeUploadBandwidth.af, WholeSimData.wholeUploadBandwidth.oa];

        let upLoad = parseInt(WholeSimData.maxBlockSize / wholeUploadBandwidth[fromNode.regionId] * 1000);
        let downLoad = parseInt(WholeSimData.maxBlockSize / wholeDownloadBandwidthList[toNode.regionId] * 1000);
        if (upLoad < 200) {
            upLoad = 200;
        }
        if (downLoad < 200) {
            downLoad = 200;
        }
        mesTimeList.push({
            upLoad: upLoad, downLoad: downLoad, fromNode: fromNode, toNode: toNode
        });
    }
    else {
        let upLoad = parseInt(WholeSimData.maxBlockSize / WholeSimData.transRegionalBandwidth * 1000);
        let downLoad = parseInt(WholeSimData.maxBlockSize / WholeSimData.transRegionalBandwidth * 1000);
        if (upLoad < 200) {
            upLoad = 200;
        }
        if (downLoad < 200) {
            downLoad = 200;
        }
        mesTimeList.push({
            upLoad: upLoad, downLoad: downLoad, fromNode: fromNode, toNode: toNode
        });
    }
    return mesTimeList;

}
//获取来源ID
function getFromNode(haveCoinNode, templateNodeList, nodeMesList) {
    let nodeList = JSON.parse(JSON.stringify(haveCoinNode));
    let targeNOde = templateNodeList;
    while (true) {
        nodeList.shuffle();
        if (nodeList[0] != templateNodeList.id) {
            targeNOde = nodeMesList[nodeList[0]];
            break;
        }
    }
    return targeNOde;
}
//交易coinNode列表增加
function coinStatePush(nodeId, coinAdd, nodeCoinState) {
    if (nodeCoinState.length == 0) {
        nodeCoinState.push({ nodeId: nodeId, coin: coinAdd });
    }
    else {
        let j = haveTargetNode(nodeId, nodeCoinState)
        if (j == -1) {
            nodeCoinState.push({ nodeId: nodeId, coin: coinAdd });
        } else {
            if ((coinAdd + nodeCoinState[j].coin) >= 0) {
                nodeCoinState[j].coin = coinAdd + nodeCoinState[j].coin;
            }

        }
    }
}
//获取交易金额
function getTargetTradeCoin(fromNodeID, nodeCoinState, blockReward) {
    let coin = 0;
    for (let i = 0; i < nodeCoinState.length; i++) {
        if (nodeCoinState[i].nodeId == fromNodeID) {
            coin = Math.random() * parseInt(nodeCoinState[i].coin);
        }
    }
    if (coin == 0) {
        coin = Math.random() * blockReward;
    }
    return coin;
}
//列表内是否包含节点
function haveTargetNode(nodeId, nodeCoinState) {
    let j = -1;
    for (let i = 0; i < nodeCoinState.length; i++) {
        if (nodeCoinState[i].nodeId == nodeId) {
            j = i;
        }
    }
    return j;
}

function getOrphanLenList(OrphanLenList, nodeLen, targetorOrphanLen) {
    let jl = OrphanLenList.length;
    while (jl <= targetorOrphanLen) {
        let j = Math.floor(Math.random() * nodeLen);
        if (j < 3) {
            j = 3;
        }
        if (OrphanLenList.indexOf(j) == -1) {
            OrphanLenList.push(j);
            jl++;
        }
    }
}
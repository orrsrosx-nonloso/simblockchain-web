export function initNetWorkTable(targetNode,allNode,size) {
    let nodeIdList = [];
    for(let i =0;i<size;i++){
        nodeIdList.push({id:allNode[i].id,
            addressId: allNode[i].addressId});
    }
    //自定义的顺序打算算法，相较sort更加快速
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    nodeIdList.shuffle();
    let outBound = [];

    for(let i =0;i<size;i++){
        let len = outBound.length;
        if (len<targetNode.numConnection){
            let j = JSON.parse(JSON.stringify(outBound));
            outBound.length=0;
            j.push(JSON.parse(JSON.stringify(nodeIdList[i].addressId)));
            len = j.len;
            outBound = j;
            neighborAddInbound(allNode,nodeIdList[i].id,targetNode.addressId);
        }
        else{
            break;
        }
    }
    targetNode.netWorkTable.outBound = outBound;
    targetNode.netWorkTable.numConnection = targetNode.numConnection;
}

function neighborAddInbound(allNode,nodeId,inBoundNode) {
    if(allNode[nodeId].netWorkTable.inBound.indexOf(inBoundNode) == -1){
        allNode[nodeId].netWorkTable.inBound.push(inBoundNode);
    }
}
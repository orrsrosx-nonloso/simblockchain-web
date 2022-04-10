<template>
  <el-scrollbar height="110%">
    <el-row :gutter="3">
      <el-col :span="3"
        ><div class="grid-content">
          <div class="base_title">节点操作</div>
          <div class="drag-box">
            <!-- <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="startTransactionSimVis"
              >交易模拟
            </el-button> -->
            <el-dropdown>
              <el-button class="opButtontdrwaer2" type="primary" size="small"
                >交易模拟
                <arrow-down />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-tooltip content="模拟普通流程交易!" placement="top">
                    <el-dropdown-item @click="startTransactionSimVis"
                      >普通交易模拟</el-dropdown-item
                    >
                  </el-tooltip>
                  <el-tooltip content="模拟双花问题情况下的交易!" placement="top">
                    <el-dropdown-item @click="doubleSpent">双花问题模拟</el-dropdown-item>
                  </el-tooltip>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog
              v-model="transactionSimVis"
              title="模拟交易"
              width="50%"
              :before-close="transSimVisHandleClose"
            >
              <div>
                <el-select v-model="valueTrans1" placeholder="交易发起者">
                  <el-option
                    v-for="item in NodeTrans"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span style="padding: 10px">TO:</span>
                <el-select
                  v-model="valueTrans2"
                  collapse-tags
                  style="margin-left: 20px"
                  placeholder="交易接收者"
                >
                  <el-option
                    v-for="item in NodeTrans"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="padding-top: 20px">
                交易金额 :<el-input-number
                  v-model="numTrans"
                  :precision="2"
                  :step="0.01"
                  :min="1"
                />
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="changetransactionSimVis">Cancel</el-button>
                  <el-button type="primary" @click="startTransSim">Confirm</el-button>
                </span>
              </template>
            </el-dialog>
          </div>

          <div class="drag-box">
            <el-dropdown>
              <el-button class="opButtontdrwaer" type="primary" size="small">
                交易池查看
                <arrow-down />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-tooltip content="查看所以经过记账节点确定的交易!" placement="top">
                    <el-dropdown-item @click="getPresentUtxoData('confirmed')"
                      >Confirmed</el-dropdown-item
                    >
                  </el-tooltip>
                  <el-tooltip
                    content="查看点击所以未经过记账节点确定的交易!"
                    placement="top"
                  >
                    <el-dropdown-item @click="getPresentUtxoData('unconfirmed')"
                      >Unconfirmed</el-dropdown-item
                    >
                  </el-tooltip>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog v-model="dialogUtxoVisible" width="840px">
              <el-table :data="tableUtxoData" height="300" style="width: 100%">
                <el-table-column prop="TransId" label="交易Id" width="100" />
                <el-table-column prop="inputId" label="交易输入ID" width="100" />
                <el-table-column prop="outPutId" label="交易输出ID" width="100" />
                <el-table-column prop="totalInput" label="总交易输入" width="100" />
                <el-table-column prop="totalOutput" label="总交易输出" width="100" />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column prop="UtxoBalance" label="未交易事务量" width="120" />
              </el-table>
            </el-dialog>
          </div>

          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="dialogWalletVisible = true"
              >钱包结构
            </el-button>
          </div>
          <div class="drag-box">
            <el-tooltip content="点击查看当前区块链网络结构!" placement="top">
              <el-button
                class="opButton"
                @click="getPresentP2PNetWork"
                type="primary"
                size="small"
                >P2P网络结构
              </el-button>
            </el-tooltip>
            <el-dialog v-model="dialogP2PNetVisible" width="640px">
              <el-table :data="tableP2PNetData" height="300" style="width: 100%">
                <el-table-column prop="addressId" label="节点" width="140" />
                <el-table-column prop="Neighbor1" label="邻居节点1" width="140" />
                <el-table-column prop="Neighbor2" label="邻居节点2" width="140" />
                <el-table-column prop="Neighbor3" label="邻居节点3" width="140" />
              </el-table>
            </el-dialog>
          </div>
          <div class="base_title">区块操作</div>
          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="consensusVisible = true"
              >共识选择
            </el-button>
            <el-dialog
              v-model="consensusVisible"
              title="选择需要的共识协议"
              width="30%"
              :before-close="consensusHandleClose"
            >
              <div>
                <el-tooltip content="工作量证明共识机制(Proof of Work)" placement="top">
                  <el-radio v-model="consensusChoose" label="1" size="large"
                    >POW</el-radio
                  ></el-tooltip
                >
                <el-tooltip
                  content="股权证明/权益证明共识机制(Proof of Stake)"
                  placement="top"
                >
                  <el-radio v-model="consensusChoose" label="2" disabled size="large"
                    >POS</el-radio
                  ></el-tooltip
                >
                <el-tooltip
                  content="历史工作证明共识机制(Proof of History)"
                  placement="top"
                >
                  <el-radio v-model="consensusChoose" disabled label="3" size="large"
                    >POH</el-radio
                  ></el-tooltip
                >
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="consensusVisible = false">关闭</el-button>
                  <el-button type="primary" @click="consensusVisible = false"
                    >设置</el-button
                  >
                </span>
              </template>
            </el-dialog>
          </div>
          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="stratPowFindHandleClose"
              >挖矿模拟
            </el-button>
            <el-dialog
              v-model="powFindVisible"
              title="Loading!"
              width="40%"
              :before-close="powFindHandleClose"
              :show-close="false"
            >
              <div style="padding-left: 20%; padding-right: 20%">
                <!-- <el-progress :percentage="percentage" :color="customColors" /> -->
                <el-progress
                  :percentage="percentage"
                  :color="customColors"
                  :status="staus"
                  :indeterminate="true"
                  :duration="1"
                  :stroke-width="20"
                />
                <el-form :model="showBlockMes">
                  <el-descriptions title="">
                    <el-descriptions-item label="">
                      <span style="font-size: 18px; font-weight: bold"
                        >当前事件: {{ showBlockMes[0] }}</span
                      >
                    </el-descriptions-item></el-descriptions
                  ></el-form
                >
                <div></div>
              </div>
            </el-dialog>
          </div>
          <div class="drag-box">
            <el-button class="opButton" type="primary" size="small" @click="blockTranSim"
              >区块传输模拟
            </el-button>
          </div>

          <div class="drag-box">
            <el-button
              class="opButton"
              @click="getNewBlockDifficult"
              type="primary"
              size="small"
              >新区块获取难度
            </el-button>
          </div>
          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="bifurcatedChain"
              >区块链分叉
            </el-button>
          </div>
        </div></el-col
      >
      <el-col :span="15"
        ><div class="grid-content">
          <div class="drag-box">
            <el-card class="box-card" :body-style="{ padding: '5px', height: '538px' }">
              <template #header>
                <div class="card-header">
                  <span>节点与区块</span>
                  <div>
                    <!-- <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="仿真开始前进行清除"
                      placement="top-start"
                    >
                      <el-button @click="clearCache" style="left: 0">清空缓存</el-button>
                    </el-tooltip> -->
                    <span
                      class="node-item"
                      v-for="item in nodeItemList"
                      @mousedown="(evt) => nodeItemMouseDown(evt, item.value)"
                    >
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="拖拽生成新区块或节点"
                        placement="top-start"
                      >
                        <span>{{ item.label }}</span>
                      </el-tooltip>
                    </span>
                  </div>
                </div>
              </template>
              <div class="flow-container" ref="flowContainer">
                <c-scrollbar maxHeight="538px" trigger="hover">
                  <super-flow
                    ref="superFlow"
                    :node-list="nodeList"
                    :link-list="linkList"
                    :graph-menu="graphMenu"
                    :node-menu="nodeMenu"
                    :link-menu="linkMenu"
                    :link-base-style="linkBaseStyle"
                    :link-style="linkStyle"
                    :link-desc="linkDesc"
                  >
                    <template v-slot:node="{ meta }">
                      <div
                        @mouseup="nodeMouseUp"
                        @click="nodeClick"
                        class="flow-node ellipsis"
                      >
                        {{ meta.name }}
                      </div>
                    </template>
                  </super-flow>
                </c-scrollbar>
              </div>

              <el-dialog
                v-model="nodeType"
                title="节点类型选择"
                width="30%"
                :show-close="false"
                :before-close="nodetypeHandleClose"
              >
                <div :model="presentTypeNode" style="left: 0">
                  当前节点: {{ presentTypeNode }}
                </div>
                <div>
                  <el-tooltip
                    content="包含完整的区块链数据（默认包含完整的网络路由功能）!"
                    placement="top"
                  >
                    <el-radio v-model="nodeTypeChoose" label="fullNode" size="large"
                      >全节点</el-radio
                    ></el-tooltip
                  >
                  <el-tooltip
                    content="仅包含区块头数据,移动端使用较多（默认包含完整的网络路由功能）!"
                    placement="top"
                  >
                    <el-radio v-model="nodeTypeChoose" label="lightNode" size="large"
                      >轻节点</el-radio
                    ></el-tooltip
                  >
                  <el-tooltip
                    content="负责产生区块的节点（默认包含完整的网络路由功能和区块链数据）!"
                    placement="top"
                  >
                    <el-radio v-model="nodeTypeChoose" label="miningNode" size="large"
                      >产块节点</el-radio
                    ></el-tooltip
                  >
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button type="primary" @click="setNodeType">保存</el-button>
                  </span>
                </template>
              </el-dialog>

              <!-- 算力设置界面，无法关闭，必须设置 <-->

              <el-dialog
                v-model="hashRateVis"
                title="配置矿工节点算力(HashRate)"
                width="30%"
                :show-close="false"
                :before-close="nodetypeHandleClose"
              >
                <div :model="presentTypeNode" style="left: 0">
                  当前节点: {{ presentTypeNode }}
                </div>
                <div>
                  <el-tooltip
                    content="最低算力为10,不设上线,算力跨度为10!"
                    placement="bottom"
                  >
                    <el-input-number v-model="numHashRate" :step="10" :min="10"
                  /></el-tooltip>
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button type="primary" @click="setHashRate">设置</el-button>
                  </span>
                </template>
              </el-dialog>

              <!-- <Draggable
                :list="node1"
                item-key="id"
                :group="{ name: 'article', pull: '' }"
                :disabled="false"
                @start="start2"
                @end="end2"
                class="dragArea2"
              >
                <template #item="{ element, index }">
                  <div class="list-complete-item2">
                    <div class="list-complete-item-handle">
                      <div class="leftD" @click="drawerNodeTrue">
                        <i class="iconfont">&#xe6eb;</i>Node{{ index + 1 }}
                      </div>
                      <div class="rightD">
                        <el-popconfirm
                          confirm-button-text="Yes"
                          cancel-button-text="No"
                          title="Are you sure to delete this?"
                          @confirm="handleDel(index, element.id)"
                        >
                          <template #reference>
                            <i class="iconfont">&#xe67e;</i>
                          </template>
                        </el-popconfirm>
                      </div>
                    </div>
                  </div>
                </template>
              </Draggable> -->
            </el-card>
            <br />
          </div></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <el-card class="box-card" :body-style="{ padding: '5px', height: '236px' }">
            <template #header>
              <div class="card-header" style="font-weight: bold">
                <span>SUMMARY</span>
              </div>
            </template>
            <div v-for="o in summaryMes" class="text item">
              {{ o.tabName + o.data }}
              <span
                @click="rewardFindVisible = true"
                class="feeEdit"
                v-if="o.tabName == 'Transaction fee:  '"
                type="text"
                >Edit</span
              >
            </div>
          </el-card>
          <el-card class="box-card" :body-style="{ padding: '5px', height: '237px' }">
            <template #header>
              <div class="card-header" style="font-weight: bold">
                <span>EVENT</span>
              </div>
            </template>
            <c-scrollbar maxHeight="237px" maxWidth="280px" trigger="hover">
              <div v-for="e in eventMes" class="text item">
                {{ e.eventName }}
                {{ e.data }}
              </div>
            </c-scrollbar>
          </el-card>
        </div>
        <el-drawer
          ref="drawerRef"
          v-model="dialog"
          title="区块详情"
          :before-close="handleClose"
          direction="ltr"
          custom-class="demo-drawer"
          size="40%"
          width="350px"
        >
          <div class="demo-drawer__content">
            <el-form :model="drwaerDateBlock">
              <el-descriptions :column="1" border>
                <el-descriptions-item
                  label="Hash"
                  label-align="center"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  >{{ drwaerDateBlock.hash[0] }}

                  {{ drwaerDateBlock.hash[1] }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="Confirmations"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.confirmations }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Timestamp"
                  label-align="center"
                  align="center"
                >
                  {{ drwaerDateBlock.timestamp }}</el-descriptions-item
                >
                <el-descriptions-item label="Height" label-align="center" align="center">
                  {{ drwaerDateBlock.height }}
                </el-descriptions-item>
                <el-descriptions-item label="Miner" label-align="center" align="center">{{
                  drwaerDateBlock.miner
                }}</el-descriptions-item>
                <el-descriptions-item
                  label="Number of Transactions"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.numOfTransac }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Difficulty"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.difficulty }}</el-descriptions-item
                >
                <el-descriptions-item label="Nonce" label-align="center" align="center">{{
                  drwaerDateBlock.nonce
                }}</el-descriptions-item>
                <el-descriptions-item
                  label="Transaction Volume"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.transactionVolume }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Block Reward"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.reward }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Fee Reward"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.feeReward }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="交易列表id"
                  label-align="center"
                  align="center"
                >
                  <el-button
                    type="text"
                    @click="findTransList1(drwaerDateBlock.transactionId)"
                    >{{ drwaerDateBlock.transactionId }}</el-button
                  >
                </el-descriptions-item>
              </el-descriptions>

              <el-drawer
                v-model="innerDrawer"
                direction="ltr"
                title="交易列表"
                :append-to-body="true"
                :before-close="NodeDetailHandleClose"
                size="72%"
              >
                <c-scrollbar maxWidth="400" height="640px" trigger="hover">
                  <el-table :data="blockTableData" style="width: 100%">
                    <el-table-column prop="id" label="id" width="40" />
                    <el-table-column prop="hash" label="hash" width="200" />
                    <el-table-column label="inputId" width="100">
                      <template #default="scope">
                        <el-button type="text" @click="getInputData(scope.row.inputId)">{{
                          scope.row.inputId
                        }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="outputsId" width="100">
                      <template #default="scope">
                        <el-button
                          type="text"
                          @click="getOutputData(scope.row.outputsId)"
                          >{{ scope.row.outputsId }}</el-button
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalInput" label="totalInput" width="100" />
                    <el-table-column prop="totalOutput" label="totalOutput" width="110" />
                    <el-table-column prop="createTime" label="createTime" width="200" />
                    <el-table-column prop="status" label="status" width="100" />
                    <el-table-column prop="utxo" label="utxo" width="100" />
                  </el-table>
                </c-scrollbar>
              </el-drawer>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button @click="cancelForm">Cancel</el-button>
              <!-- <el-button type="primary" :loading="loading" @click="onClick">{{
                loading ? "Submitting ..." : "Submit"
              }}</el-button> -->
            </div>
          </div>
        </el-drawer>
        <el-drawer
          ref="drawerRef"
          v-model="dialog2"
          title="节点详情"
          :before-close="handleClose"
          direction="rtl"
          custom-class="demo-drawer"
          size="40%"
        >
          <div class="demo-drawer__content">
            <el-form :model="drwaerDateNode">
              <el-descriptions :column="1" border>
                <el-descriptions-item
                  label="Address"
                  label-align="center"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  >{{ drwaerDateNode.address }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="AddressID"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.addressId }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Transactions"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.transactions }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Total Received"
                  label-align="center"
                  align="center"
                >
                  {{ drwaerDateNode.totalReceived }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Total Sent"
                  label-align="center"
                  align="center"
                >
                  {{ drwaerDateNode.totalSent }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="Final Balance"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.balance }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="NodeType"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.nodeType }}</el-descriptions-item
                >
                <el-descriptions-item
                  v-if="drwaerDateNode.nodeType == `miningNode`"
                  label="HashRate"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.hashRate }} kH/s</el-descriptions-item
                >
                <el-descriptions-item
                  label="Wallet Id"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.walletId
                  }}<el-button type="text" @click="checkWallet(drwaerDateNode.walletId)"
                    >查看</el-button
                  ></el-descriptions-item
                >
                <el-descriptions-item
                  label="交易列表ID"
                  label-align="center"
                  align="center"
                >
                  <el-tooltip
                    v-if="drwaerDateNode.nodeType == `lightNode`"
                    content="轻节点的交易信息需要通过其他全节点查询!"
                    placement="top"
                    ><el-button
                      size="small"
                      @click="findLightListTransList2(drwaerDateNode.transactionId)"
                      round
                      >查询交易
                    </el-button>
                  </el-tooltip>

                  <el-button
                    v-if="drwaerDateNode.nodeType != `lightNode`"
                    type="text"
                    @click="findTransList2(drwaerDateNode.transactionId)"
                    >{{ drwaerDateNode.transactionId }}</el-button
                  >
                </el-descriptions-item>
              </el-descriptions>

              <el-drawer
                v-model="innerDrawer2"
                direction="rtl"
                title="交易列表"
                :append-to-body="true"
                :before-close="NodeDetailHandleClose"
                size="72%"
              >
                <c-scrollbar maxWidth="400" height="640px" trigger="hover">
                  <el-table :data="nodeTableData" style="width: 100%">
                    <el-table-column prop="id" label="id" width="40" />
                    <el-table-column prop="hash" label="hash" width="200" />
                    <el-table-column label="inputId" width="100">
                      <template #default="scope">
                        <el-button type="text" @click="getInputData(scope.row.inputId)">{{
                          scope.row.inputId
                        }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="outputsId" width="100">
                      <template #default="scope">
                        <el-button
                          type="text"
                          @click="getOutputData(scope.row.outputsId)"
                          >{{ scope.row.outputsId }}</el-button
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalInput" label="totalInput" width="100" />
                    <el-table-column prop="totalOutput" label="totalOutput" width="110" />
                    <el-table-column prop="createTime" label="createTime" width="200" />
                    <el-table-column prop="status" label="status" width="100" />
                    <el-table-column prop="utxo" label="utxo" width="100" />
                  </el-table>
                </c-scrollbar>
              </el-drawer>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button @click="cancelForm2">Cancel</el-button>
              <!-- <el-button type="primary" :loading="loading" @click="onClick2">{{
                loading ? "Submitting ..." : "Submit"
              }}</el-button> -->
            </div>
          </div>
        </el-drawer>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogWalletVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="walletData">
          <el-descriptions title="钱包结构" :column="1" border>
            <el-descriptions-item
              label="id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">{{ walletData.id }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item label="publicKkey" label-align="left" align="left">{{
              walletData.publicKkey
            }}</el-descriptions-item>
            <el-descriptions-item label="Address" label-align="left" align="left">{{
              walletData.address
            }}</el-descriptions-item>
            <el-descriptions-item label="privateKey" label-align="left" align="left">
              {{ walletData.privateKey }}
            </el-descriptions-item>
          </el-descriptions></el-form
        ></c-scrollbar
      >
    </el-dialog>

    <el-dialog v-model="dialogInputVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="inputData">
          <el-descriptions title="交易输入ID" :column="1" border>
            <el-descriptions-item
              label="id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">{{ inputData.id }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item label="address" label-align="left" align="left">{{
              inputData.address
            }}</el-descriptions-item>
            <el-descriptions-item label="signature" label-align="left" align="left">
              {{ inputData.signature }}
            </el-descriptions-item>
            <el-descriptions-item label="pubKey" label-align="left" align="left">
              {{ inputData.pubKey }}
            </el-descriptions-item>
            <el-descriptions-item label="transId" label-align="left" align="left">
              <el-button
                v-for="item in inputData.transId"
                type="text"
                @click="getTransData(item)"
                >{{ item }}</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item label="tranValue" label-align="left" align="left">{{
              inputData.tranValue
            }}</el-descriptions-item>
          </el-descriptions></el-form
        ></c-scrollbar
      >
    </el-dialog>

    <el-dialog v-model="dialogOutPutVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="outputData">
          <el-descriptions title="交易输出" :column="1" border>
            <el-descriptions-item
              label="id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">{{ outputData.id }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item label="address" label-align="left" align="left">{{
              outputData.address
            }}</el-descriptions-item>
            <el-descriptions-item label="tranValue" label-align="left" align="left">{{
              outputData.tranValue
            }}</el-descriptions-item>
            <el-descriptions-item label="transId" label-align="left" align="left">
              <el-button
                v-for="item in outputData.transId"
                type="text"
                @click="getTransData(item)"
                >{{ item }}</el-button
              >
            </el-descriptions-item>
          </el-descriptions></el-form
        ></c-scrollbar
      >
    </el-dialog>

    <el-dialog v-model="dialogTransVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="transData">
          <el-descriptions title="钱包结构" :column="1" border>
            <el-descriptions-item
              label="id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">{{ transData.id }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item label="TransHash" label-align="left" align="left">{{
              transData.hash
            }}</el-descriptions-item>
            <el-descriptions-item label="InputId" label-align="left" align="left">
              <el-button type="text" @click="getInputData(transData.inputId)">{{
                transData.inputId
              }}</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="OutputId" label-align="left" align="left">
              <el-button type="text" @click="getOutputData(transData.outputId)">{{
                transData.outputId
              }}</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="createTime" label-align="left" align="left">{{
              transData.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="totalInput" label-align="left" align="left">{{
              transData.totalInput
            }}</el-descriptions-item>
            <el-descriptions-item label="totalOutput" label-align="left" align="left">{{
              transData.totalOutput
            }}</el-descriptions-item>
            <el-descriptions-item label="status" label-align="left" align="left">{{
              transData.status
            }}</el-descriptions-item>
            <el-descriptions-item label="utxo" label-align="left" align="left">{{
              transData.utxo
            }}</el-descriptions-item>
          </el-descriptions></el-form
        ></c-scrollbar
      >
    </el-dialog>
    <el-dialog
      v-model="cacheFindVisible"
      title="Notification!"
      width="40%"
      :before-close="cacheFindHandleClose"
      :show-close="false"
    >
      <div style="padding-left: 20%; padding-right: 20%">
        <!-- <el-progress :percentage="percentage" :color="customColors" /> -->

        <div>当前用户存在缓存数据,系统将自动清除缓存！</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="cacheAuthData">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="rewardFindVisible"
      title="您可以配置交易手续费费比例"
      width="40%"
      :before-close="rewardFindHandleClose"
      :show-close="false"
    >
      <div style="padding-left: 20%; padding-right: 20%">
        <!-- <el-progress :percentage="percentage" :color="customColors" /> -->

        <el-input-number
          v-model="rewardFee"
          :min="0.1"
          :precision="2"
          :step="0.1"
          :max="10"
        />(%)
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="rewardAuthData">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-scrollbar>
</template>
<script lang="ts">
import { ref, reactive } from "vue";
import Draggable from "vuedraggable";
import { ElMessageBox } from "element-plus";
import { ElMessage, ElLoading, ElNotification } from "element-plus";
import type { ElDrawer, Action } from "element-plus";
import {
  clearCache,
  createNewNode,
  createNewBlock,
  deleteNode,
  findNodeByAddressId,
  findBlockByBlockId,
  updateNodeType,
  findMinExist,
  findWalletCon,
  TransactionSingle,
  FindTransListBYid,
  findpresentMin,
  addP2pNet,
  getUnconfirmed,
  getAllNetWork,
  getAllMiner,
  getNewBlockDif,
  createBifurcatedChain,
  findTXInput,
  findTXOutput,
  findTransCon,
  checkExistCache,
  editRewardPre,
  findFullNodeToEnquire,
  setMinerHashRate,
} from "../api/apis";
import { uuid, getDataString, getNodeId } from "../utils/utils";
import { t } from "element-plus/es/locale";
import { useStore } from "vuex";
import { computed, h } from "vue";

const drawerType = {
  node: 0,
  link: 1,
};

//连线数据存储集合
const linkListId = reactive([]);
//节点数据存储
const nodeListId = reactive([]);
//区块数据存储
const blockListId = reactive([]);

//总连线集合
const totalLinkList = reactive([]);

let blockTableData = reactive([]);

let nodeTableData = reactive([]);

//模拟挖矿时需要的数据
let lastBlockcreate = reactive([]);

// 全局的共识协议变量
let globalConsensus = ref("POW");

let lastBlockCoordinate = reactive([457.8750305175781, 185.0999984741211]);

export default {
  components: {
    Draggable,
  },
  setup() {
    //拖拽区块节点配置
    const disabled = ref(false);
    const node1 = reactive([]);
    const node2 = reactive([{ id: 1, name: "节点生成" }]);
    const block1 = reactive([]);
    const block2 = reactive([{ id: 1, name: "区块生成" }]);
    const end1 = (ev) => {
      console.log("拖动结束1", ev);
    };
    const start2 = (event) => {
      console.log("开始拖动", event);
    };
    const start1 = (event) => {
      console.log(event.index);
      console.log("开始拖动", event);
    };
    const end2 = (ev) => {
      console.log(ev.index);
      console.log("拖动结束2", ev);
    };
    const handleDel = (index, id) => {
      node1.splice(index, 1);
      let q = node2.find((value, index, arr) => {
        return value.id === id;
      });
    };
    const handleDel2 = (index, id) => {
      block1.splice(index, 1);
      let q = block2.find((value, index, arr) => {
        return value.id === id;
      });
    };

    //区块抽屉配置
    const formLabelWidth = "80px";
    let timer;

    const dialog = ref(false);
    const innerDrawer = ref(false);
    const innerDrawer2 = ref(false);
    const dialog2 = ref(false);
    const loading = ref(false);

    const store = useStore();

    const auth = computed(() => {
      return store.getters.authGetter;
    });
    const getAuth = () => {
      return auth.value;
    };

    let List = {
      transListId: "",
      id: "",
      hash: "",
      auth: getAuth(),
    };
    //交易详情页
    const findTransList1 = (list) => {
      List.transListId = list;
      FindTransListBYid(List).then((ress) => {
        const res = ress.preData;
        blockTableData.length = 0;
        let lengths = res.length;
        for (let i = 0; i < lengths; i++) {
          blockTableData.push({
            id: res[i].transId,
            hash: res[i].txIdHash,
            inputId: res[i].inputsId,
            outputsId: res[i].outputsId,
            totalInput: res[i].totalInput,
            totalOutput: res[i].totalOutput,
            createTime: res[i].createTime,
            status: res[i].status,
            utxo: res[i].utxo,
          });
        }

        let aasa = blockTableData;
        innerDrawer.value = true;
      });
    };

    const findTransList2 = (list) => {
      List.transListId = list;
      nodeTableData.length = 0;
      FindTransListBYid(List).then((ress) => {
        const res = ress.preData;
        let lengths = res.length;
        for (let i = 0; i < lengths; i++) {
          nodeTableData.push({
            id: res[i].transId,
            hash: res[i].txIdHash,
            inputId: res[i].inputsId,
            outputsId: res[i].outputsId,
            totalInput: res[i].totalInput,
            totalOutput: res[i].totalOutput,
            createTime: res[i].createTime,
            status: res[i].status,
            utxo: res[i].utxo,
          });
        }

        let aasa = nodeTableData;
        innerDrawer2.value = true;
      });
    };
    //
    const findLightListTransList2 = (list) => {
      findFullNodeToEnquire({ auth: getAuth(), nodeType: "fullNode" }).then((ress) => {
        let resdata = ress.preData;
        if (resdata != null) {
          ElMessageBox.alert("该轻节点通过全节点(" + resdata + ")查询交易信息", "Mes", {
            confirmButtonText: "OK",
          });
          List.transListId = list;
          nodeTableData.length = 0;
          FindTransListBYid(List).then((ress) => {
            const res = ress.preData;
            let lengths = res.length;
            for (let i = 0; i < lengths; i++) {
              nodeTableData.push({
                id: res[i].transId,
                hash: res[i].txIdHash,
                inputId: res[i].inputsId,
                outputsId: res[i].outputsId,
                totalInput: res[i].totalInput,
                totalOutput: res[i].totalOutput,
                createTime: res[i].createTime,
                status: res[i].status,
                utxo: res[i].utxo,
              });
            }
            let aasa = nodeTableData;
            innerDrawer2.value = true;
          });
        } else {
          ElMessageBox.alert("无可用的全节点用来查询交易信息！", "Mes", {
            confirmButtonText: "OK",
          });
        }
      });
    };

    const NodeDetailHandleClose = (done: () => void) => {
      ElMessageBox.confirm("close?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };

    const form = reactive({
      name: "",
      region: "",
      date1: "",
      date2: "",
      delivery: false,
      type: [],
      resource: "",
      desc: "",
    });
    const drawerNodeTrue = () => {
      dialog.value = true;
    };
    const drawerBlockTrue = () => {
      dialog2.value = true;
    };
    const drawerRef = ref<InstanceType<typeof ElDrawer>>();
    const onClick = () => {
      ElMessageBox.confirm("Do you want to quit?")
        .then(() => {
          loading.value = true;
          timer = setTimeout(() => {
            // 动画关闭需要一定的时间
            setTimeout(() => {
              loading.value = false;
              dialog.value = false;
            }, 400);
          }, 2000);
        })
        .catch(() => {
          // catch error
        });
      clearTimeout(timer);
    };
    const onClick2 = () => {
      ElMessageBox.confirm("Do you want to quit?")
        .then(() => {
          loading.value = true;
          timer = setTimeout(() => {
            // 动画关闭需要一定的时间
            setTimeout(() => {
              loading.value = false;
              dialog2.value = false;
            }, 400);
          }, 2000);
        })
        .catch(() => {
          // catch error
        });
      clearTimeout(timer);
    };
    const handleClose = (done) => {
      if (loading.value) {
        return;
      }
      ElMessageBox.confirm("Do you want to quit?")
        .then(() => {
          loading.value = true;
          timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              loading.value = false;
            }, 400);
          }, 2000);
        })
        .catch(() => {
          // catch error
        });
    };

    const cancelForm = () => {
      loading.value = false;
      dialog.value = false;
      clearTimeout(timer);
    };
    const cancelForm2 = () => {
      loading.value = false;
      dialog2.value = false;
      clearTimeout(timer);
    };

    const consensusHandleClose = (done: () => void) => {
      ElMessageBox.confirm("确定关闭当前界面吗?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };

    const drawerTrue = (name) => {
      if (name == "dialog") {
        dialog.value = true;
      } else if (name == "dialog2") {
        dialog2.value = true;
      }
    };

    return {
      disabled,
      node1,
      node2,
      block1,
      block2,
      end1,
      start2,
      start1,
      end2,
      handleDel,
      handleDel2,
      formLabelWidth,
      timer,
      dialog,
      dialog2,
      drawerTrue,
      loading,
      form,
      onClick,
      onClick2,
      handleClose,
      cancelForm,
      drawerNodeTrue,
      cancelForm2,
      drawerBlockTrue,
      innerDrawer,
      innerDrawer2,
      NodeDetailHandleClose,
      consensusHandleClose,
      blockTableData,
      nodeTableData,
      findTransList1,
      findTransList2,
      findLightListTransList2,
    };
  },
  data() {
    //缓存查看
    const cacheFindVisible = ref(false);
    //关闭处理
    const cacheFindHandleClose = (done: () => void) => {
      // ElMessageBox.confirm("程序运行中,无法退出当前界面!")
      //   .then(() => {})
      //   .catch(() => {
      //     // catch error
      //   });
    };
    //开始前先清除缓存
    // clearCache(params);
    function cacheAuthData(params) {
      clearCaches();
      cacheFindVisible.value = false;
    }
    const changecacheFindVisible = () => {
      if (cacheFindVisible.value == true) {
        cacheFindVisible.value = false;
      } else {
        cacheFindVisible.value = true;
      }
    };

    //缓存查看
    const rewardFindVisible = ref(false);
    //默认交易中介费
    const rewardFee = ref(0);
    //关闭处理
    const rewardFindHandleClose = (done: () => void) => {
      ElMessageBox.confirm("确定放弃编辑退出吗？")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };

    //编辑中介费比例
    function rewardAuthData() {
      editRewardPre({ auth: getAuth(), rewardValue: rewardFee.value + "" }).then(
        (ress) => {
          let res = ress.preData;
          if (res == true) {
            ElMessage({
              message: "设置成功!",
              type: "success",
            });
            summaryMes[7].data = rewardFee.value + "%";
          } else {
            ElMessage.error("设置失败!");
          }
        }
      );
      rewardFindVisible.value = false;
    }

    const changerewardFindVisible = () => {
      if (rewardFindVisible.value == true) {
        rewardFindVisible.value = false;
      } else {
        rewardFindVisible.value = true;
      }
    };

    const clearCaches = () => {
      // let user = auth.value;
      let params = {
        auth: this.getAuth(),
      };
      clearCache(params).then((ress) => {
        const res = ress.preData;
        if (res == true) {
          ElMessage({
            message: "清除缓存成功!",
            type: "success",
          });
        } else {
          ElMessage.error("清除缓存失败!");
        }
      });
      this.LogEvent("Clear cache! ", null);
      const data = getDataString();
      this.summaryMes[0].data = data;
    };

    //区块共识选择
    const consensusVisible = ref(false);

    const consensusChoose = ref("1");

    const getConsensus = () => {
      if (consensusChoose.value == "1") {
        return "POW";
      } else if (consensusChoose.value == "2") {
        return "POS";
      } else if (consensusChoose.value == "3") {
        return "POH";
      }
    };
    //区块链分叉操作
    const bifurcatedChain = () => {
      if (blockListId.length > 1 && nodeListId.length > 1) {
        getAllMiner({ auth: this.getAuth() }).then((minerLists) => {
          const minerList = minerLists.preData;
          if (minerList.length > 1) {
            createBifurcatedChain({ auth: getAuth() }).then((ress) => {
              const res = ress.preData;
              this.BifurcatedChainCreate(res);
            });
          } else {
            ElMessageBox.alert("当前产块节点数量小于2,请添加新产块节点!", "WARING", {
              confirmButtonText: "OK",
            });
          }
        });
      } else {
        ElMessageBox.alert("当前区块或节点数量小于2,请添加新区块和节点!", "WARING", {
          confirmButtonText: "OK",
        });
      }
    };
    //模拟区块传输
    const blockTranSim = (done: () => void) => {
      findpresentMin({ auth: getAuth() }).then((ress) => {
        const res = ress.preData;
        if (res == null || res == "") {
          ElMessageBox.alert("请创建新区块!", "WARING", {
            confirmButtonText: "OK",
          });
        } else {
          if (nodeListId.length > 1) {
            ElMessageBox.alert(
              "即将开始区块传输模拟(当前记账权拥有者:" + res + ")!",
              "区块传输",
              {
                confirmButtonText: "确定",
                callback: (action: Action) => {
                  ElMessage({
                    message: `开始传输!`,
                    type: "success",
                  });
                  SimBlockTrans(res);
                },
              }
            );
          } else {
            ElMessageBox.alert(
              "当前只存在一个节点,且节点已拥有区块数据,请新建节点!",
              "WARING",
              {
                confirmButtonText: "OK",
              }
            );
          }

          // for (let i = 0; i < 4; i++) {
          //   (function (j) {
          //     setTimeout(function timer() {
          //       ElMessageBox.alert("请创建新区块!" + i, "WARING", {
          //         confirmButtonText: "OK",
          //       });
          //     }, j * 1000);
          //   })(i);
          // }
        }
      });
    };

    //模拟区块传输
    const SimBlockTrans = (miner) => {
      getAllNetWork({ auth: getAuth() }).then((ress) => {
        const res = ress.preData;
        summaryMes[1].data = "1s";
        //循环次数
        let length = res.length;
        let allNode = [];
        let spreadNode = [];
        let oldSpreadNode = [];
        let flowNode = [];
        for (let i = 0; i < length; i++) {
          allNode.push(res[i].nodeAddress);
        }
        //获取传输模拟数据
        while (allNode.length != 0) {
          let id = 0;
          if (spreadNode.length > 0) {
            id = getNodeId(spreadNode[0]) - 1;
          } else {
            id = getNodeId(miner) - 1;
          }
          for (let i = 0; i < allNode.length; i++) {
            if (allNode[i] == res[id].nodeAddress) {
              if (i == 0) {
                allNode.shift();
              } else {
                allNode.splice(i, i);
              }
            } else if (allNode[i] == res[id].neighbourOne) {
              if (i == 0) {
                allNode.shift();
              } else {
                allNode.splice(i, i);
              }
            } else if (allNode[i] == res[id].neighbourTwo) {
              if (i == 0) {
                allNode.shift();
              } else {
                allNode.splice(i, i);
              }
            } else if (allNode[i] == res[id].neighbourThree) {
              if (i == 0) {
                allNode.shift();
              } else {
                allNode.splice(i, i);
              }
            }
          }
          flowNode.push({
            nodeAddress: res[id].nodeAddress,
            neighbourOne: res[id].neighbourOne,
            neighbourTwo: res[id].neighbourTwo,
            neighbourThree: res[id].neighbourThree,
          });

          if (
            res[id].nodeAddress != null &&
            oldSpreadNode.indexOf(res[id].nodeAddress) == -1
          ) {
            spreadNode.push(res[id].nodeAddress);
            oldSpreadNode.push(res[id].nodeAddress);
          }
          if (
            res[id].neighbourOne != null &&
            oldSpreadNode.indexOf(res[id].neighbourOne) == -1
          ) {
            spreadNode.push(res[id].neighbourOne);
            oldSpreadNode.push(res[id].neighbourOne);
          }
          if (
            res[id].neighbourTwo != null &&
            oldSpreadNode.indexOf(res[id].neighbourTwo) == -1
          ) {
            spreadNode.push(res[id].neighbourTwo);
            oldSpreadNode.push(res[id].neighbourTwo);
          }
          if (
            res[id].neighbourThree != null &&
            oldSpreadNode.indexOf(res[id].neighbourThree) == -1
          ) {
            spreadNode.push(res[id].neighbourThree);
            oldSpreadNode.push(res[id].neighbourThree);
          }
          spreadNode.shift();
        }
        //开始模拟传输
        analogueTransmission(flowNode);
      });
    };

    //开始模拟传输
    const analogueTransmission = (miner) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Simulation",
        background: "rgba(255, 255, 255,0.4)",
      });
      setTimeout(() => {
        loading.close();
      }, 3000 * miner.length);
      for (let i = 0; i < miner.length; i++) {
        setTimeout(() => {
          ElMessage({
            message: `节点` + miner[i].nodeAddress + `开始传输!`,
            type: "success",
          });
          if (miner[i].neighbourOne != null) {
            this.addNewNodeLink(miner[i].nodeAddress, miner[i].neighbourOne);
          }
          if (miner[i].neighbourTwo != null) {
            this.addNewNodeLink(miner[i].nodeAddress, miner[i].neighbourTwo);
          }
          if (miner[i].neighbourThree != null) {
            this.addNewNodeLink(miner[i].nodeAddress, miner[i].neighbourThree);
          }
          setTimeout(() => {
            ElMessage({
              message: `节点` + miner[i].nodeAddress + `结束传输!`,
              type: "success",
            });
            this.removeAllNodeLink();
          }, 2000);
          LogEvent("Node Transmit", miner[i].nodeAddress + "开始区块传输!");
        }, 3000 * i);
      }
    };

    //获取到新区块获取难度值
    const getNewBlockDifficult = () => {
      getNewBlockDif({ auth: getAuth() }).then((ress) => {
        const res = ress.preData;
        ElNotification({
          title: "Difficulty",
          message: h("i", { style: "color: teal" }, "Value:" + res),
        });
      });
    };

    //挖矿模拟
    const powFindHandleClose = (done: () => void) => {
      ElMessageBox.confirm("程序运行中,无法退出当前界面!")
        .then(() => {})
        .catch(() => {
          // catch error
        });
    };

    const stratPowFindHandleClose = () => {
      powFindVisible.value = true;
      this.blockCreate();
    };
    const percentage = ref(0);

    const setPercentage = (value) => {
      percentage.value = value;
    };
    const setPowFindVisible = (value) => {
      powFindVisible.value = value;
    };

    const powFindVisible = ref(false);
    const staus = ref("");
    const setStatus = (value) => {
      staus.value = value;
    };

    const customColors = [
      { color: "#f03030", percentage: 10 },
      { color: "#f56c6c", percentage: 20 },
      { color: "#f39d1d", percentage: 30 },
      { color: "#e6a23c", percentage: 40 },
      { color: "#f5b95e", percentage: 50 },
      { color: "#c2f117", percentage: 60 },
      { color: "#c1e63c", percentage: 70 },
      { color: "#d7f763", percentage: 80 },
      { color: "#5cb87a", percentage: 100 },
    ];

    const increase = () => {
      percentage.value += 10;
      if (percentage.value > 100) {
        percentage.value = 100;
      }
    };
    const decrease = () => {
      percentage.value -= 10;
      if (percentage.value < 0) {
        percentage.value = 0;
      }
    };

    const showBlockMes = reactive(["全局查找正在进行挖矿的节点!"]);

    const setShowBlockMes = (value) => {
      showBlockMes[0] = value;
    };

    //获取当前用户
    const store = useStore();

    const auth = computed(() => {
      return store.getters.authGetter;
    });
    const getAuth = () => {
      return auth.value;
    };
    //页面加载
    const openFullScreen = () => {
      const loading = ElLoading.service({
        lock: true,
        text: "交易中!",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 1000);
    };

    //页面加载
    const openBlockCreate = (miner) => {
      const loading = ElLoading.service({
        lock: true,
        text: "记账节点正在获取记账权!",
        background: "rgba(0, 0, 0)",
      });
      setTimeout(() => {
        loading.text.value =
          "当前记账权拥有者" +
          miner +
          "。\n" +
          miner +
          "正在验证所有未确定交易(每个区块至多验证数量为10)!";
        setTimeout(() => {
          loading.text.value = "产生区块中!";
          setTimeout(() => {
            loading.text.value = "成功产生区块!";
            setTimeout(() => {
              loading.close();
            }, 400);
          }, 1100);
        }, 1100);
      }, 1100);
    };

    //交易模拟界面
    const transactionSimVis = ref(false);

    const changetransactionSimVis = () => {
      if (transactionSimVis.value == true) {
        transactionSimVis.value = false;
      } else {
        transactionSimVis.value = true;
      }
    };

    const startTransactionSimVis = () => {
      transactionSimVis.value = true;
      const graph = this.flowNodeGraph();
      const nodelistSize = nodeListId.length;
      if (nodelistSize <= 1) {
        setTimeout(() => {
          ElMessageBox.alert("可供交易节点数量较少,请先创建节点!", "WARN", {
            confirmButtonText: "OK",
          });
          transactionSimVis.value = false;
        }, 200);
      } else {
        //图中是否存在连接预设值

        if (NodeTrans != null) {
          NodeTrans.length = 0;
        }
        for (let i = 0; i < nodelistSize; i++) {
          NodeTrans.push({
            value: nodeListId[i].lable,
            label: nodeListId[i].lable,
          });
        }
        setTimeout(() => {
          let targetlist = this.getNearTransNode(graph.linkList);
          if (targetlist.valueTrans1 != "" && targetlist.valueTrans2 != "") {
            ElMessageBox.alert("画布中存在预设交易值！("+targetlist.valueTrans1+"=>"+targetlist.valueTrans2+")", "通知", {
              confirmButtonText: "OK",
            });
            valueTrans1.value = targetlist.valueTrans1;
            valueTrans2.value = targetlist.valueTrans2;
          }
        }, 100);
      }
    };

    //开始交易
    const startTransSim = () => {
      const sda = valueTrans1.value;
      //交易接收者
      if (
        valueTrans1.value == valueTrans2.value ||
        valueTrans1.value == undefined ||
        valueTrans2.value == undefined
      ) {
        ElMessageBox.alert("交易两方不能相同或为空.", "WARN", {
          confirmButtonText: "OK",
        });
        changetransactionSimVis();
      } else {
        const transInputType = {
          inputAddressId: valueTrans1.value,
          outputAddressId: valueTrans2.value,
          transValue: numTrans.value,
          auth: getAuth(),
        };
        TransactionSingle(transInputType).then((res) => {
          openFullScreen();
          if (res.success) {
            summaryMes[6].data = Number(summaryMes[6].data) + 1;
            setTimeout(() => {
              this.setStatus("");
              this.setShowBlockMes("正在开启交易!");
              this.setPercentage(0);
              this.setPowFindVisible(true);
              this.increase();
              setTimeout(() => {
                this.setShowBlockMes("交易发起者" + res.inputAddressId + "确定交易内容");
                this.increase();
                setTimeout(() => {
                  this.increase();
                  this.setShowBlockMes(res.inputAddressId + "利用私钥对交易进行签名");
                  setTimeout(() => {
                    this.increase();
                    this.setShowBlockMes(res.inputAddressId + "开始验证交易合法性!");
                    setTimeout(() => {
                      this.increase();
                      this.setShowBlockMes(
                        "交易合法!" +
                          res.inputAddressId +
                          "将交易广播至当前拥有记账权的节点和交易对象" +
                          res.outputAddressId
                      );
                      setTimeout(() => {
                        this.increase();
                        this.setShowBlockMes(
                          "当前拥有记账权的节点和交易对象" +
                            res.outputAddressId +
                            "开始验证交易合法性!"
                        );
                        setTimeout(() => {
                          this.increase();
                          this.setShowBlockMes("交易合法!");
                          setTimeout(() => {
                            this.increase();
                            this.increase();
                            this.increase();
                            this.setShowBlockMes(
                              "交易并入交易池中,等待记账节点产出区块时对交易进行验证!"
                            );
                            setTimeout(() => {
                              this.increase();
                              this.setShowBlockMes("交易结束!");
                              this.setStatus("success");
                              setTimeout(() => {
                                this.setPowFindVisible(false);
                              }, 500);
                            }, 1600);
                          }, 1600);
                        }, 1600);
                      }, 1600);
                    }, 1600);
                  }, 1500);
                }, 1600);
              }, 1600);
            }, 1600);
            LogEvent(
              "TransactionSingle  :",
              valueTrans1.value + "T O" + valueTrans2.value
            );
          } else {
            ElMessageBox.alert(res.mes, "WARN", {
              confirmButtonText: "OK",
            });
          }
          changetransactionSimVis();
        });
      }
    };

    const transSimVisHandleClose = (done: () => void) => {
      ElMessageBox.confirm("确定要关闭当前交易吗?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    //交易量计数器
    const numTrans = ref(1);
    //交易发起者
    const valueTrans1 = ref();
    //交易接收者
    const valueTrans2 = ref();
    //选择列表
    let NodeTrans = reactive([
      {
        value: "",
        label: "",
      },
    ]);

    //节点类型设置
    const hashRateVis = ref(false);
    //预设hashrate值
    const numHashRate = ref(10);

    const setHashRate = () => {
      let nowNodeType = nodeTypeChoose;
      setMinerHashRate({
        addressId: presentTypeNode.value,
        nodeType: nowNodeType.value,
        auth: getAuth(),
        hashRate: numHashRate.value,
      }).then((ress) => {
        let res = ress.preData;
        if (res === true) {
          ElMessage({
            message: "HashRate设置成功!",
            type: "success",
          });
        } else {
          ElMessage({
            message: "HashRate设置失败!",
            type: "warning",
          });
        }
        hashRateVis.value = false;
      });
    };
    //节点类型设置
    const nodeType = ref(false);

    let presentTypeNode = ref("Node1");
    //钱包结构查看
    let walletData = reactive({
      id: "1",
      address: "122o4YRDAJGYJEPUGcT6RMamKRWdvStnPv",
      publicKkey:
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECFGthZ5/pFz6eRNr1UX+HuqE9Aa/bsyFOxnlvaJLICIAzlrqFRdQ3TrGkDfuX6JGPzpgeHNKHXuu/gLXNQqAVA==",
      privateKey:
        "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgVdVHyHHTZXHuL2wRbXhKseA+edBkwxhnkyh8ZUopXeOgCgYIKoZIzj0DAQehRANCAAQIUa2Fnn+kXPp5E2vVRf4e6oT0Br9uzIU7GeW9oksgIgDOWuoVF1DdOsaQN+5fokY/OmB4c0ode67+Atc1CoBU",
    });
    const dialogWalletVisible = ref(false);

    const checkWallet = (walletId) => {
      findWalletCon({ walletId: walletId + "", auth: getAuth() }).then((ress) => {
        let res = ress.preData;
        if (res != null || res != "") {
          walletData.id = res.walletId;
          walletData.publicKkey = res.publicKey;
          walletData.privateKey = res.privateKey;
          walletData.address = res.address;
          dialogWalletVisible.value = true;
        } else {
          ElMessageBox.alert("查看失败", "WARN", {
            confirmButtonText: "OK",
          });
        }
      });
    };

    //交易溯源
    //输入信息
    const dialogInputVisible = ref(false);

    //钱包结构查看
    let inputData = reactive({
      id: "1",
      address: "",
      signature: "/pFz6eRNr1UX+//==",
      pubKey: "+++5fokY/OmB4c0ode67+Atc1CoBU",
      transId: [],
      tranValue: "+++5fokY/OmB4c0ode67+Atc1CoBU",
    });

    const getInputData = (Id) => {
      if (Id != null) {
        if (Id != "0") {
          findTXInput({ auth: getAuth(), inputId: Id }).then((ress) => {
            let res = ress.preData;
            if (res != null || res != "") {
              inputData.id = res.inputId;
              inputData.address = res.address;
              inputData.signature = res.signature;
              inputData.pubKey = res.pubKey;
              inputData.transId = this.setStrToStrs(res.transactionId);
              inputData.tranValue = res.value;
              dialogInputVisible.value = true;
              dialogTransVisible.value = false;
            } else {
              ElMessageBox.alert("查看失败", "WARN", {
                confirmButtonText: "OK",
              });
            }
          });
        } else {
          ElMessageBox.alert("输入ID未0时表示产生区块时的奖励输入!", "Message", {
            confirmButtonText: "OK",
          });
        }
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    };

    //输出信息
    const dialogOutPutVisible = ref(false);

    let outputData = reactive({
      id: "1",
      address: "",
      tranValue: "/pFz6eRNr1UX+//==",
      transId: [],
    });
    const getOutputData = (Id) => {
      if (Id != null) {
        findTXOutput({ auth: getAuth(), outputId: Id }).then((ress) => {
          const res = ress.preData;
          if (res != null || res != "") {
            outputData.id = res.outputId;
            outputData.address = res.address;
            outputData.tranValue = res.value;
            outputData.transId = this.setStrToStrs(res.transactionId);
            dialogOutPutVisible.value = true;
            dialogTransVisible.value = false;
            let i = outputData;
            let j = 1;
          } else {
            ElMessageBox.alert("查看失败", "WARN", {
              confirmButtonText: "OK",
            });
          }
        });
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    };
    //交易详情信息
    const dialogTransVisible = ref(false);
    let transData = reactive({
      id: "1",
      hash: "",
      inputId: "/pFz6eRNr1UX+//==",
      outputId: "+++5fokY/OmB4c0ode67+Atc1CoBU",
      createTime: "/pFz6eRNr1UX+//==",
      totalInput: "/pFz6eRNr1UX+//==",
      totalOutput: "/pFz6eRNr1UX+//==",
      status: "/pFz6eRNr1UX+//==",
      utxo: "/pFz6eRNr1UX+//==",
    });

    const getTransData = (Id) => {
      if (Id != null) {
        findTransCon({ auth: getAuth(), transID: Id }).then((ress) => {
          const res = ress.preData;
          if (res != null || res != "") {
            transData.id = res.transId;
            transData.hash = res.txIdHash;
            transData.inputId = res.inputsId;
            transData.outputId = res.outputsId;
            transData.createTime = res.createTime;
            transData.totalInput = res.totalInput;
            transData.totalOutput = res.totalOutput;
            transData.status = res.status;
            transData.utxo = res.utxo;
            dialogTransVisible.value = true;
            dialogInputVisible.value = false;
            dialogOutPutVisible.value = false;
          } else {
            ElMessageBox.alert("查看失败", "WARN", {
              confirmButtonText: "OK",
            });
          }
        });
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    };

    //双花问题

    const doubleSpent = () => {
      ElMessageBox.alert("功能开发中!", "Message", {
        confirmButtonText: "OK",
      });
    };
    const nodeTypeChoose = ref("fullNode");
    //抽屉中的节点和区块数据
    let drwaerDateBlock = reactive({
      id: 1,
      blockID: "GenesisBlock1",
      height: 1,
      hash: ["000a6c2a3347ff2ef0a48ae2508716", "cfab42ae75b71d52ab36d2815ead9efa35"],
      timestamp: "2022-02-16 23:15:09",
      confirmations: 1,
      miner: null,
      numOfTransac: null,
      difficulty: 1275840,
      nonce: 5316,
      transactionVolume: 0,
      reward: 10,
      feeReward: 0,
      prevBlockHash: "0000000000000000000000000000000000000000000000000000000000000000",
      transactionId: "",
    });
    let drwaerDateNode = reactive({
      id: 1,
      address: "1CVrnHbS5qu6kSXFoCpwnCW1sqPQuaHhoJ",
      addressId: "Node1",
      nodeType: "fullNode",
      transactions: 0,
      totalReceived: 0,
      hashRate: 0,
      totalSent: 0,
      balance: 0,
      walletId: 0,
      transactionId: "",
    });
    //连线集合
    let linkList = reactive([]);

    let nodeList = [];
    //概要信息
    let summaryMes = reactive([
      {
        tabName: "仿真时间:  ",
        data: "0",
      },
      {
        tabName: "节点数量:  ",
        data: "0",
      },
      {
        tabName: "区块数量:  ",
        data: "0",
      },

      {
        tabName: "First block:  ",
        data: "0",
      },
      {
        tabName: "Last block:  ",
        data: "0",
      },
      {
        tabName: "传播延迟:  ",
        data: "0",
      },
      {
        tabName: "交易发生次数:  ",
        data: 0,
      },
      {
        tabName: "Transaction fee:  ",
        data: "0%",
      },
    ]);
    //详情信息
    let eventMes = reactive([
      {
        eventName: "仿真准备:  ",
        data: "START!",
      },
    ]);

    const LogEvent = (eventName, data) => {
      setTimeout(() => {
        eventMes.unshift({
          eventName: eventName,
          data: data,
        });
      }, 100);
    };

    const setNodeType = () => {
      let nowNodeType = nodeTypeChoose;
      let nowNodeType1 = presentTypeNode;
      let nowNodeType2 = nowNodeType.value;
      if (nowNodeType.value == "miningNode") {
        hashRateVis.value = true;
      }
      const nodeTypeC = {
        addressId: presentTypeNode.value,
        nodeType: nowNodeType.value,
        auth: getAuth(),
      };
      if (nowNodeType) {
        updateNodeType(nodeTypeC).then((ress) => {
          const res = ress.preData;
          if (res) {
            changeNodetype();
          } else {
            changeNodetype();
          }
        });
      }
      nodeTypeChoose.value = "fullNode";
    };

    //节点类型窗口关闭
    const nodetypeHandleClose = () => {
      ElMessageBox.confirm("请保存后退出!");
    };

    const changeNodetype = () => {
      if (nodeType.value == true) {
        nodeType.value = false;
      } else {
        nodeType.value = true;
      }
    };

    //P2P网络结构相关代码
    const dialogP2PNetVisible = ref(false);

    const tableP2PNetData = reactive([
      {
        addressId: "Node1",
        Neighbor1: "Node2",
        Neighbor2: "Node3",
        Neighbor3: "Node4",
      },
    ]);

    const getPresentP2PNetWork = () => {
      getAllNetWork({ auth: getAuth() }).then((ress) => {
        const res = ress.preData;
        if (res.length == 0) {
          ElMessage({
            message: "节点网络未创建,请先创建节点!",
            type: "warning",
          });
        } else {
          tableP2PNetData.length = 0;

          for (let i = 0; i < res.length; i++) {
            tableP2PNetData.push({
              addressId: res[i].nodeAddress,
              Neighbor1: res[i].neighbourOne,
              Neighbor2: res[i].neighbourTwo,
              Neighbor3: res[i].neighbourThree,
            });
          }
          let sada = tableP2PNetData;
          dialogP2PNetVisible.value = true;
        }
      });
    };

    //所以utxo查看
    const dialogUtxoVisible = ref(false);

    const tableUtxoData = reactive([
      {
        TransId: "Node1",
        inputId: "Node2",
        outPutId: "Node3",
        totalInput: "Node4",
        totalOutput: "Node4",
        status: "confirmed",
        UtxoBalance: "2",
      },
    ]);

    const getPresentUtxoData = (status) => {
      getUnconfirmed({ auth: getAuth(), status: status }).then((ress) => {
        const res = ress.preData;
        if (res.length == 0) {
          ElMessage({
            message: "相关交易未创建,请先创建交易或区块!",
            type: "warning",
          });
        } else {
          tableUtxoData.length = 0;
          for (let i = 0; i < res.length; i++) {
            tableUtxoData.push({
              TransId: res[i].transId,
              inputId: res[i].inputsId,
              outPutId: res[i].outputsId,
              totalInput: res[i].totalInput,
              totalOutput: res[i].totalOutput,
              status: res[i].status,
              UtxoBalance: res[i].utxo,
            });
          }
          let sada = tableUtxoData;
          dialogUtxoVisible.value = true;
        }
      });
    };

    const setPresentTypeNode = (presentTypeNodes) => {
      if (presentTypeNodes) {
        presentTypeNode.value = presentTypeNodes;
      }
    };
    return {
      drawerType,
      linkSetting: {
        desc: "",
      },
      nodeSetting: {
        name: "",
        desc: "",
      },

      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        ele: null,
        info: null,
      },
      nodeItemList: [
        {
          label: "节点生成",
          value: {
            width: 100,
            height: 30,
            meta: {
              label: "node1",
              prop: "node",
              name: "节点",
            },
          },
        },
        {
          label: "区块生成",
          value: {
            width: 100,
            height: 30,
            meta: {
              label: "block1",
              prop: "block",
              name: "区块",
            },
          },
        },
      ],

      graphMenu: [
        [
          {
            // 选项 label
            label: "新键节点",
            // 选项是否禁用
            // 选项选中后回调函数
            selected(graph, coordinate) {
              let params = {
                auth: getAuth(),
              };
              lastBlockCoordinate.length = 0;
              lastBlockCoordinate = coordinate;
              createNewNode(params).then((ress) => {
                const res = ress.preData;
                graph.addNode({
                  width: 100,
                  height: 30,
                  coordinate,
                  meta: {
                    label: res.addressId,
                    name: res.addressId,
                    prop: "node",
                  },
                });
                addP2pNet({ addressId: res.addressId, auth: getAuth() }).then((ress) => {
                  const res = ress.preData;
                  if (res.success == "true") {
                    if (res.addressId == "Node1") {
                      ElMessage({
                        message: "节点网络初始化!",
                        type: "success",
                      });
                    } else {
                      ElMessage({
                        message: "节点网络添加成功!",
                        type: "success",
                      });
                    }
                  } else {
                    ElMessage({
                      message: "节点网络异常!",
                      type: "warning",
                    });
                  }
                });
                LogEvent("create new " + res.addressId + ":", res.address);
                // const nodeListIdsdadsaa = this.nodeListId;

                const newNodelist = graph.nodeList;
                const presentNode = newNodelist[newNodelist.length - 1];
                presentNode.meta.name = res.addressId;
                // let presentNodsd=presentNode.id;
                nodeListId.push({
                  lable: presentNode.meta.label,
                  id: presentNode.id,
                });
                const data = nodeListId.length;
                summaryMes[1].data = data + "";
                presentTypeNode.value = res.addressId;
                nodeType.value = true;
                // const newNodelistsda = this.$refs.superFlow.graph.nodeList;
              });
            },
          },
          // {
          //   label: "新键区块",
          //   selected(graph, coordinate) {
          //     let dsad = graph.nodelist;
          //     if (graph.nodeList.length > 0) {
          //       createNewBlock(null).then((res) => {
          //         graph.addNode({
          //           width: 100,
          //           height: 30,
          //           coordinate,
          //           meta: {
          //             label: res.blockID,
          //             name: res.blockID,
          //             prop: "block",
          //           },
          //         });
          //         const newBlocklist = graph.nodeList;
          //         const presentBlock = newBlocklist[newBlocklist.length - 1];
          //         presentBlock.meta.name = res.blockID;
          //         if (presentBlock.meta.prop == "block") {
          //           // let presentNodsd=presentNode.id;
          //           blockListId.push({
          //             lable: presentBlock.meta.label,
          //             id: presentBlock.id,
          //           });
          //         }

          //         const newId = uuid("link");
          //         const lengthblockListId = blockListId.length;
          //         if (lengthblockListId >= 2) {
          //           const lengthLinklength = linkList.length;
          //           const targetLinkList = [];
          //           if (lengthLinklength > 0) {
          //             for (var i = 0; i < lengthLinklength; i++) {
          //               targetLinkList.push(linkList[i]);
          //             }
          //           }
          //           targetLinkList.push({
          //             id: newId,
          //             startId: blockListId[lengthblockListId - 2].id,
          //             endId: blockListId[lengthblockListId - 1].id,
          //             startAt: [100, 24],
          //             endAt: [0, 25],
          //             meta: "block",
          //           });
          //           linkList = targetLinkList;
          //         }
          // const data = blockListId.length;
          // this.summaryMes[2].data = data;
          // const newId = uuid("link");
          // const lengthLink = blockListId.length;

          // if (lengthLink >= 2) {
          //   const dsaadf = totalLinkList;
          //   totalLinkList.push({
          //     id: newId,
          //     startId: blockListId[lengthLink-2].id,
          //     endId: blockListId[lengthLink-1].id,
          //     startAt: [160, 40],
          //     endAt: [0, 25],
          //     meta: null,
          //   });
          // }

          // this.$refs.superFlow.addNode({
          //   coordinate,
          //   ...conf.info,
          // });
          //       });
          //     } else {
          //       ElMessage({
          //         message: "创建区块前请先创建节点.",
          //         type: "warning",
          //       });
          //     }
          //   },
          // },
          {
            label: "创世块",
            disable(graph) {
              return !!graph.nodeList.find((node) => node.meta.label === "GenesisBlock1");
            },
            selected(graph, coordinate) {
              if (graph.nodeList.length > 0) {
                createNewBlock({ auth: getAuth() }).then((ress) => {
                  const res = ress.preData;
                  openBlockCreate(res.miner);
                  graph.addNode({
                    width: 100,
                    height: 30,
                    coordinate,
                    meta: {
                      label: res.blockID,
                      name: res.blockID,
                      prop: "block",
                    },
                  });
                  LogEvent("create new " + res.blockID + ":", res.hash);
                  const newBlocklist = graph.nodeList;
                  const presentBlock = newBlocklist[newBlocklist.length - 1];
                  presentBlock.meta.name = res.blockID;
                  if (presentBlock.meta.prop == "block") {
                    // let presentNodsd=presentNode.id;
                    blockListId.push({
                      lable: presentBlock.meta.label,
                      id: presentBlock.id,
                    });
                  }
                  summaryMes[2].data = "1";
                  summaryMes[3].data = "GenesisBlock1";
                  summaryMes[4].data = "GenesisBlock1";
                  summaryMes[6].data = 1;
                  setTimeout(() => {
                    rewardFindVisible.value = true;
                  }, 3800);
                  // this.$refs.superFlow.addNode({
                  //   coordinate,
                  //   ...conf.info,
                  // });
                });
              } else {
                ElMessage({
                  message: "创建区块前请先创建节点.",
                  type: "warning",
                });
              }
            },
          },
        ],
        [
          {
            label: "全选",
            selected: (graph) => {
              graph.selectAll();
            },
          },
          // {
          //   label: "保存",
          //   selected: (graph) => {
          //     console.log("josn", graph.toJSON());
          //   },
          // },
        ],
      ],
      nodeMenu: [
        [
          {
            label: "删除",
            hidden(node) {
              return (
                node.meta.name === "GenesisBlock1" ||
                node.meta.name.indexOf("Block") != -1
              );
            },
            selected: (node) => {
              const val = node.meta.name;
              const target = nodeListId;
              var index = 0;
              for (var i = 0; i < target.length; i++) {
                if (target[i].lable == val) {
                  index = i;
                }
              }
              if (index > -1) {
                target.splice(index, 1);
              }
              this.removeNodes();
              deleteNode({ addressId: node.meta.name, auth: getAuth() }).then((ress) => {
                const res = ress.preData;
                if (res == true) {
                  node.remove();
                  LogEvent("delete : ", node.meta.name);
                }
              });
            },
          },
          {
            label: "查看",
            selected: (node) => {
              if (node.meta.prop == "node") {
                findNodeByAddressId({ addressId: node.meta.name, auth: getAuth() }).then(
                  (ress) => {
                    const res = ress.preData;
                    if (res == null) {
                      ElMessage.error("无法查看!");
                    } else {
                      drwaerDateNode.address = res.address;
                      drwaerDateNode.addressId = res.addressId;
                      drwaerDateNode.transactions = res.transactions;
                      drwaerDateNode.totalReceived = res.totalReceived;
                      drwaerDateNode.totalSent = res.totalSent;
                      drwaerDateNode.balance = res.balance;
                      drwaerDateNode.nodeType = res.nodeType;
                      drwaerDateNode.walletId = res.walletId;
                      drwaerDateNode.transactionId = res.transactionsId;
                      drwaerDateNode.hashRate = res.hashRate;
                      let sue = drwaerDateNode;
                      this.drawerTrue("dialog2");
                      setPresentTypeNode(res.addressId);
                    }
                  }
                );
              } else if (node.meta.prop == "block") {
                findBlockByBlockId({
                  blockId: node.meta.name,
                  auth: this.getAuth(),
                }).then((ress) => {
                  const res = ress.preData;
                  if (res == null) {
                    ElMessage.error("无法查看!");
                  } else {
                    drwaerDateBlock.hash = res.hash;
                    drwaerDateBlock.confirmations = res.confirmations;
                    drwaerDateBlock.timestamp = res.timestamp;
                    drwaerDateBlock.height = res.height;
                    drwaerDateBlock.miner = res.miner;
                    drwaerDateBlock.numOfTransac = res.numOfTransac;
                    drwaerDateBlock.difficulty = res.difficulty;
                    drwaerDateBlock.nonce = res.nonce;
                    drwaerDateBlock.transactionVolume = res.transactionVolume;
                    drwaerDateBlock.reward = res.reward;
                    drwaerDateBlock.feeReward = res.feeReward;
                    drwaerDateBlock.transactionId = res.transactions;
                    if (drwaerDateBlock.hash) {
                      let lengths = res.hash.length;
                      drwaerDateBlock.hash = [
                        res.hash.substring(0, lengths / 2),
                        res.hash.substring(lengths / 2, lengths),
                      ];
                    }
                    let sue = drwaerDateBlock;
                    this.drawerTrue("dialog");
                  }
                });
              }
            },
          },
        ],
      ],
      linkMenu: [
        [
          {
            label: "删除",
            selected: (link) => {
              link.remove();
            },
          },
          {
            label: "查看",
            selected: (link) => {
              console.log("change");
            },
          },
        ],
      ],

      linkBaseStyle: {
        color: "#666666", // line 颜色
        hover: "#FF0000", // line hover 的颜色
        textColor: "#666666", // line 描述文字颜色
        textHover: "#FF0000", // line 描述文字 hover 颜色
        font: "14px Arial", // line 描述文字 字体设置 参考 canvas font
        dotted: false, // 是否是虚线
        lineDash: [4, 4], // 虚线时生效
        background: "rgba(255,255,255,0.6)", // 描述文字背景色
      },
      fontList: ["14px Arial", "italic small-caps bold 12px arial"],
      summaryMes,
      eventMes,
      linkList,
      nodeList,
      LogEvent,
      drwaerDateBlock,
      drwaerDateNode,
      nodeType,
      nodeTypeChoose,
      changeNodetype,
      setNodeType,
      presentTypeNode,
      nodetypeHandleClose,
      setPresentTypeNode,
      walletData,
      dialogWalletVisible,
      checkWallet,
      changetransactionSimVis,
      transSimVisHandleClose,
      transactionSimVis,
      numTrans,
      valueTrans1,
      valueTrans2,
      NodeTrans,
      startTransactionSimVis,
      startTransSim,
      openFullScreen,
      openBlockCreate,
      getAuth,
      tableP2PNetData,
      dialogP2PNetVisible,
      getPresentP2PNetWork,
      dialogUtxoVisible,
      tableUtxoData,
      getPresentUtxoData,
      powFindHandleClose,
      percentage,
      customColors,
      increase,
      staus,
      decrease,
      powFindVisible,
      stratPowFindHandleClose,
      showBlockMes,
      setShowBlockMes,
      setStatus,
      setPowFindVisible,
      blockTranSim,
      getNewBlockDifficult,
      bifurcatedChain,
      setPercentage,
      consensusVisible,
      consensusChoose,
      getConsensus,
      inputData,
      getTransData,
      transData,
      dialogInputVisible,
      dialogTransVisible,
      getOutputData,
      outputData,
      dialogOutPutVisible,
      getInputData,
      cacheFindVisible,
      cacheFindHandleClose,
      cacheAuthData,
      changecacheFindVisible,
      rewardFindVisible,
      rewardFindHandleClose,
      rewardAuthData,
      changerewardFindVisible,
      rewardFee,
      doubleSpent,
      hashRateVis,
      numHashRate,
      setHashRate,
    };
  },
  created() {
    let params = {
      auth: this.getAuth(),
    };
    checkExistCache(params).then((ress) => {
      let res = ress.preData;
      if (res == true) {
        this.changecacheFindVisible();
      } else {
        clearCache(params);
      }
    });
    const data = getDataString();
    this.summaryMes[0].data = data;
  },
  mounted() {
    document.addEventListener("mousemove", this.docMousemove);
    document.addEventListener("mouseup", this.docMouseup);
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.docMousemove);
    document.removeEventListener("mouseup", this.docMouseup);
  },
  methods: {
    flowNodeGraph() {
      return this.$refs.superFlow.graph;
    },
    linkStyle(link) {
      return {
        // hover: '#FF00FF'
      };
    },
    linkDesc(link) {
      return link.meta ? link.meta.desc : "";
    },
    // settingSubmit() {
    //   const conf = this.drawerConf
    //   if (this.drawerConf.type === drawerType.node) {
    //     if (!conf.info.meta) conf.info.meta = {}
    //     Object.keys(this.nodeSetting).forEach(key => {
    //       conf.info.meta.key = this.nodeSetting[key]

    //     })
    //     this.$refs.nodeSetting.resetFields()
    //   } else {
    //     if (!conf.info.meta) conf.info.meta = {}
    //     Object.keys(this.linkSetting).forEach(key => {
    //       conf.info.meta.key = this.linkSetting[key]
    //     })
    //     this.$refs.linkSetting.resetFields()
    //   }
    //   conf.visible = false
    // },

    nodeMouseUp(evt) {
      evt.preventDefault();
    },

    nodeClick() {
      console.log(arguments);
    },

    clearCache() {
      const nodelistLength = this.$refs.superFlow.graph.nodeList.length;
      if (nodelistLength > 0) {
        ElMessage({
          message: "仿真已开始,不需要清除缓存!",
        });
        this.LogEvent("There is no need to clear the cache! ", null);
      } else {
        // let user = auth.value;
        let params = {
          auth: this.getAuth(),
        };
        clearCache(params).then((ress) => {
          const res = ress.preData;
          if (res == true) {
            ElMessage({
              message: "清除缓存成功!",
              type: "success",
            });
          } else {
            ElMessage.error("清除缓存失败!");
          }
        });
        this.LogEvent("Clear cache! ", null);
      }
      const data = getDataString();
      this.summaryMes[0].data = data;
    },
    //拖拽过程动作
    docMousemove({ clientX, clientY }) {
      const conf = this.dragConf;

      if (conf.isMove) {
        conf.ele.style.top = clientY - conf.offsetTop + "px";
        conf.ele.style.left = clientX - conf.offsetLeft + "px";
      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove =
          Math.abs(clientX - conf.clientX) > 5 || Math.abs(clientY - conf.clientY) > 5;
      }
    },
    //拖拽结束动作
    docMouseup({ clientX, clientY }) {
      const conf = this.dragConf;
      conf.isDown = false;

      if (conf.isMove) {
        const {
          top,
          right,
          bottom,
          left,
        } = this.$refs.flowContainer.getBoundingClientRect();
        let graph = this.$refs.superFlow.graph;
        // 判断鼠标是否进入 flow container
        if (clientX > left && clientX < right && clientY > top && clientY < bottom) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          );
          lastBlockCoordinate.length = 0;
          lastBlockCoordinate = coordinate;
          // 添加节点或区块
          if (conf.info.meta.prop == "node") {
            let params = {
              auth: this.getAuth(),
            };
            createNewNode(params).then((ress) => {
              const res = ress.preData;
              const confInfo = conf.info;
              confInfo.meta.label = res.addressId;
              // confInfo.meta.name =
              this.$refs.superFlow.addNode({
                width: 100,
                height: 30,
                coordinate,
                meta: {
                  label: res.addressId,
                  name: res.addressId,
                  prop: "node",
                },
              });
              addP2pNet({ addressId: res.addressId, auth: this.getAuth() }).then(
                (ress) => {
                  const res = ress.preData;
                  if (res.success == "true") {
                    if (res.addressId == "Node1") {
                      ElMessage({
                        message: "节点网络初始化!",
                        type: "success",
                      });
                    } else {
                      ElMessage({
                        message: "节点网络添加成功!",
                        type: "success",
                      });
                    }
                  } else {
                    ElMessage({
                      message: "节点网络异常!",
                      type: "warning",
                    });
                  }
                }
              );
              this.LogEvent("create new " + res.addressId + ":", res.address);
              const nodeListIdsdadsaa = this.linkList;
              // const newNodelist2 = this.$refs.superFlow.graph;
              const newNodelist = this.$refs.superFlow.graph.nodeList;
              const presentNode = newNodelist[newNodelist.length - 1];
              presentNode.meta.name = res.addressId;
              if (presentNode.meta.prop == "node") {
                // let presentNodsd=presentNode.id;
                nodeListId.push({
                  lable: presentNode.meta.label,
                  id: presentNode.id,
                });
                const data = nodeListId.length;
                this.summaryMes[1].data = data;
              }
              this.setPresentTypeNode(res.addressId);
              this.changeNodetype();
              // const newNodelistsda = this.$refs.superFlow.graph.nodeList;
            });
          } else {
            const nodeEx = this.haveNodeMe(this.$refs.superFlow.graph);
            if (nodeEx) {
              if (blockListId.length == 0) {
                createNewBlock({ auth: this.getAuth() }).then((ress) => {
                  const res = ress.preData;
                  this.openBlockCreate(res.miner);
                  this.$refs.superFlow.addNode({
                    width: 100,
                    height: 30,
                    coordinate,
                    meta: {
                      label: res.blockID,
                      name: res.blockID,
                      prop: "block",
                    },
                  });
                  this.LogEvent("create new " + res.blockID + ":", res.hash);
                  const nodeListIdsdadsaa = blockListId;
                  const newBlocklist = this.$refs.superFlow.graph.nodeList;
                  const presentBlock = newBlocklist[newBlocklist.length - 1];
                  presentBlock.meta.name = res.blockID;
                  if (presentBlock.meta.prop == "block") {
                    // let presentNodsd=presentNode.id;
                    blockListId.push({
                      lable: presentBlock.meta.label,
                      id: presentBlock.id,
                    });
                  }
                  if (this.summaryMes[3].data == "0") {
                    this.summaryMes[3].data = presentBlock.meta.label;
                  }
                  this.summaryMes[4].data = presentBlock.meta.label;
                  const newId = uuid("link");
                  const lengthblockListId = blockListId.length;
                  if (lengthblockListId >= 2) {
                    const lengthLinklength = this.linkList.length;
                    const targetLinkList = [];
                    if (lengthLinklength > 0) {
                      for (var i = 0; i < lengthLinklength; i++) {
                        targetLinkList.push(this.linkList[i]);
                      }
                    }
                    targetLinkList.push({
                      id: newId,
                      startId: blockListId[lengthblockListId - 2].id,
                      endId: blockListId[lengthblockListId - 1].id,
                      startAt: [100, 24],
                      endAt: [0, 25],
                      meta: "block",
                    });
                    this.linkList = targetLinkList;
                  }

                  const data = blockListId.length;
                  this.summaryMes[2].data = data;
                  this.summaryMes[6].data = 1;
                  setTimeout(() => {
                    this.changerewardFindVisible();
                  }, 3800);
                  // this.$refs.superFlow.addNode({
                  //   coordinate,
                  //   ...conf.info,
                  // });
                });
              } else {
                findMinExist({ auth: this.getAuth() }).then((isExists) => {
                  let isExist = isExists.preData;
                  if (isExist === true) {
                    createNewBlock({ auth: this.getAuth() }).then((ress) => {
                      const res = ress.preData;
                      this.openBlockCreate(res.miner);
                      this.$refs.superFlow.addNode({
                        width: 100,
                        height: 30,
                        coordinate,
                        meta: {
                          label: res.blockID,
                          name: res.blockID,
                          prop: "block",
                        },
                      });
                      this.LogEvent("create new " + res.blockID + ":", res.hash);
                      const nodeListIdsdadsaa = blockListId;
                      const newBlocklist = this.$refs.superFlow.graph.nodeList;
                      const presentBlock = newBlocklist[newBlocklist.length - 1];
                      presentBlock.meta.name = res.blockID;
                      if (presentBlock.meta.prop == "block") {
                        // let presentNodsd=presentNode.id;
                        blockListId.push({
                          lable: presentBlock.meta.label,
                          id: presentBlock.id,
                        });
                      }
                      if (this.summaryMes[3].data == "0") {
                        this.summaryMes[3].data = presentBlock.meta.label;
                      }
                      this.summaryMes[4].data = presentBlock.meta.label;
                      const newId = uuid("link");
                      const lengthblockListId = blockListId.length;
                      if (lengthblockListId >= 2) {
                        const lengthLinklength = this.linkList.length;
                        const targetLinkList = [];
                        if (lengthLinklength > 0) {
                          for (var i = 0; i < lengthLinklength; i++) {
                            targetLinkList.push(this.linkList[i]);
                          }
                        }
                        targetLinkList.push({
                          id: newId,
                          startId: blockListId[lengthblockListId - 2].id,
                          endId: blockListId[lengthblockListId - 1].id,
                          startAt: [100, 24],
                          endAt: [0, 25],
                          meta: "block",
                        });
                        this.linkList = targetLinkList;
                      }

                      const data = blockListId.length;
                      this.summaryMes[2].data = data;
                      this.summaryMes[6].data = 1 + Number(this.summaryMes[6].data);
                      // this.$refs.superFlow.addNode({
                      //   coordinate,
                      //   ...conf.info,
                      // });
                    });
                  } else {
                    ElMessage({
                      message: "创建非创世块时请先创建产块节点.",
                      type: "warning",
                    });
                  }
                });
              }
            } else {
              ElMessage({
                message: "创建区块前请先创建节点.",
                type: "warning",
              });
            }
          }
        }

        conf.isMove = false;
      }

      if (conf.ele) {
        conf.ele.remove();
        conf.ele = null;
      }
    },
    //拖拽初始动作
    nodeItemMouseDown(evt, info) {
      const { clientX, clientY, currentTarget } = evt;

      const { top, left } = evt.currentTarget.getBoundingClientRect();

      const conf = this.dragConf;
      const ele = currentTarget.cloneNode(true);

      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info,
        ele,
        isDown: true,
      });

      ele.style.position = "fixed";
      ele.style.margin = "0";
      ele.style.top = clientY - conf.offsetTop + "px";
      ele.style.left = clientX - conf.offsetLeft + "px";

      this.$el.appendChild(this.dragConf.ele);
    },
    //生成区块时必须要有节点的存在
    haveNodeMe(graph) {
      const presentNodeList = graph.nodeList;
      const nodeLength = presentNodeList.length;
      if (nodeLength == 0) {
        return false;
      } else {
        for (let i = 0; i < nodeLength; i++) {
          if (presentNodeList[i].meta.prop == "node") {
            return true;
          }
        }
      }
      return false;
    },
    removeNodes(target, val) {},

    //模拟挖矿行为；
    blockCreate() {
      if (blockListId.length > 0) {
        let end = reactive([]);
        findMinExist({ auth: this.getAuth() }).then((isExists) => {
          const isExist = isExists.preData;
          if (isExist === true) {
            const coordinate = lastBlockCoordinate;
            coordinate[1] = coordinate[1] + 35;
            createNewBlock({ auth: this.getAuth() }).then((ress) => {
              const res = ress.preData;
              this.setStatus("");
              this.setPercentage(0);
              this.increase();
              setTimeout(() => {
                this.increase();
                getAllMiner({ auth: this.getAuth() }).then((minerLists) => {
                  const minerList = minerLists.preData;
                  let str = "";
                  for (let i = 0; i < minerList.length; i++) {
                    str = str + " " + minerList[i];
                  }
                  this.setShowBlockMes("运行中的产块节点" + str);
                  setTimeout(() => {
                    this.increase();
                    this.setShowBlockMes(
                      "计算中-" + "nonce:0" + ",targetDifficulty:" + res.difficulty
                    );
                    setTimeout(() => {
                      this.increase();
                      for (let i = 0; i < res.nonce; i++) {
                        setTimeout(() => {
                          this.setShowBlockMes(
                            "计算中-" +
                              "nonce:" +
                              i +
                              ",targetDifficulty:" +
                              res.difficulty
                          );
                        }, 1000);
                      }
                      setTimeout(() => {
                        this.increase();
                        this.setShowBlockMes(
                          "产块节点(" + res.miner + ")最先获取到记账权!"
                        );
                        setTimeout(() => {
                          this.increase();
                          this.setShowBlockMes(
                            "产块节点(" + res.miner + ")开始处理未确定交易等事务!"
                          );
                          setTimeout(() => {
                            this.increase();
                            this.setShowBlockMes(
                              res.miner + "处理的未确定交易等事务id:" + res.transactions
                            );
                            setTimeout(() => {
                              this.increase();
                              this.setShowBlockMes(res.miner + "处理完毕");
                              setTimeout(() => {
                                this.increase();
                                this.setShowBlockMes("区块产生中!");
                                setTimeout(() => {
                                  this.increase();
                                  this.setStatus("success");
                                  this.setShowBlockMes("区块产生成功!");
                                  this.$refs.superFlow.addNode({
                                    width: 100,
                                    height: 30,
                                    coordinate,
                                    meta: {
                                      label: res.blockID,
                                      name: res.blockID,
                                      prop: "block",
                                    },
                                  });
                                  this.LogEvent(
                                    "create new " + res.blockID + ":",
                                    res.hash
                                  );
                                  // const nodeListIdsdadsaa = blockListId;
                                  const newBlocklist = this.$refs.superFlow.graph
                                    .nodeList;
                                  const presentBlock =
                                    newBlocklist[newBlocklist.length - 1];
                                  presentBlock.meta.name = res.blockID;
                                  if (presentBlock.meta.prop == "block") {
                                    // let presentNodsd=presentNode.id;
                                    blockListId.push({
                                      lable: presentBlock.meta.label,
                                      id: presentBlock.id,
                                    });
                                  }
                                  if (this.summaryMes[3].data == "0") {
                                    this.summaryMes[3].data = presentBlock.meta.label;
                                  }
                                  this.summaryMes[4].data = presentBlock.meta.label;
                                  const newId = uuid("link");
                                  const lengthblockListId = blockListId.length;
                                  if (lengthblockListId >= 2) {
                                    const lengthLinklength = this.linkList.length;
                                    const targetLinkList = [];
                                    if (lengthLinklength > 0) {
                                      for (var i = 0; i < lengthLinklength; i++) {
                                        targetLinkList.push(this.linkList[i]);
                                      }
                                    }
                                    targetLinkList.push({
                                      id: newId,
                                      startId: blockListId[lengthblockListId - 2].id,
                                      endId: blockListId[lengthblockListId - 1].id,
                                      startAt: [100, 24],
                                      endAt: [0, 25],
                                      meta: "block",
                                    });
                                    this.linkList = targetLinkList;
                                  }
                                  const data = blockListId.length;
                                  this.summaryMes[2].data = data;
                                  this.summaryMes[6].data =
                                    1 + Number(this.summaryMes[6].data);
                                  lastBlockcreate = res;
                                  setTimeout(() => {
                                    this.setPowFindVisible(false);
                                  }, 500);
                                }, 1000);
                              }, 1000);
                            }, 1000);
                          }, 1000);
                        }, 1000);
                      }, 2300);
                    }, 500);
                  }, 500);
                });
              }, 500);
            });
          } else {
            this.setPowFindVisible(false);
            ElMessage({
              message: "创建非创世块时请先创建产块节点.",
              type: "warning",
            });
          }
        });
      } else {
        this.setPowFindVisible(false);
        ElMessage({
          message: "挖矿前请先创建产块节点或创世块.",
          type: "warning",
        });
      }
    },

    //模拟区块传输和交易传输时连线添加
    addNewNodeLink(start, end) {
      console.log("add:" + start + "-" + end);
      let startuuid = "";
      let enduuid = "";
      for (let i = 0; i < nodeListId.length; i++) {
        if (nodeListId[i].lable == start) {
          startuuid = nodeListId[i].id;
        } else if (nodeListId[i].lable == end) {
          enduuid = nodeListId[i].id;
        }
      }
      const newId = uuid("node" + end);
      const lengthLinklength = this.linkList.length;
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          targetLinkList.push(this.linkList[i]);
        }
      }
      targetLinkList.push({
        id: newId,
        startId: startuuid,
        endId: enduuid,
        startAt: [100, 24],
        endAt: [0, 25],
        meta: "node",
      });
      this.linkList = targetLinkList;
    },
    //模拟区块传输和交易传输时连线删除
    removeNodeLink(start, end) {
      console.log("remove:" + start + "-" + end);
      let startuuid = "";
      let enduuid = "";
      for (let i = 0; i < nodeListId.length; i++) {
        if (nodeListId[i].lable == start) {
          startuuid = nodeListId[i].id;
        } else if (nodeListId[i].lable == end) {
          enduuid = nodeListId[i].id;
        }
      }
      const lengthLinklength = this.linkList.length;
      for (let i = 0; i < lengthLinklength; i++) {
        if (this.linkList[i].startId == startuuid && this.linkList[i].endId == enduuid) {
          if (i == 0) {
            this.linkList.shift();
          } else {
            this.linkList.splice(i, i);
          }
        }
      }
    },

    //删除当前存在的所有节点连线
    removeAllNodeLink() {
      const lengthLinklength = this.linkList.length;
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          if (this.linkList[i].meta != "node") {
            targetLinkList.push(this.linkList[i]);
          } else {
            console.log(
              "remove:" + this.linkList[i].startId + "-" + this.linkList[i].endId
            );
          }
        }
      }
      this.linkList = targetLinkList;
    },
    BifurcatedChainCreate(res) {
      setTimeout(() => {
        this.setStatus("");
        this.setShowBlockMes("全局查找正在进行挖矿的节点");
        this.setPercentage(0);
        this.setPowFindVisible(true);
        this.increase();
        setTimeout(() => {
          this.increase();
          getAllMiner({ auth: this.getAuth() }).then((minerLists) => {
            const minerList = minerLists.preData;
            let str = "";
            for (let i = 0; i < minerList.length; i++) {
              str = str + " " + minerList[i];
            }
            this.setShowBlockMes("运行中的产块节点" + str);
            setTimeout(() => {
              this.increase();
              this.setShowBlockMes(
                "计算中-" + "nonce:0" + ",targetDifficulty:" + res[0].difficulty
              );
              setTimeout(() => {
                this.increase();
                for (let i = 0; i < res[0].nonce; i++) {
                  setTimeout(() => {
                    this.setShowBlockMes(
                      "计算中-" + "nonce:" + i + ",targetDifficulty:" + res[0].difficulty
                    );
                  }, 1000);
                }
                setTimeout(() => {
                  this.increase();
                  this.setShowBlockMes(
                    "产块节点(" +
                      res[0].miner +
                      "和" +
                      res[1].miner +
                      ")同时获取到记账权!"
                  );
                  setTimeout(() => {
                    this.increase();
                    this.setShowBlockMes("产块节点开始处理交易池内unconfirmed事务!");
                    setTimeout(() => {
                      this.increase();
                      this.setShowBlockMes("unconfirmed事务id:" + res[0].transactions);
                      setTimeout(() => {
                        this.increase();
                        this.setShowBlockMes("unconfirmed事务处理完毕");
                        setTimeout(() => {
                          this.increase();
                          this.setShowBlockMes("分叉链产生中");
                          setTimeout(() => {
                            this.increase();
                            this.setShowBlockMes("分叉链产生成功");
                            this.setStatus("success");
                            const coordinate = lastBlockCoordinate;
                            coordinate[0] = coordinate[0] + 120;
                            coordinate[1] = coordinate[1] + 40;
                            const bifBlock1 = res[0];
                            const bifBlock2 = res[1];
                            const lengthblockListId = blockListId.length;
                            const start = blockListId[lengthblockListId - 1].lable;
                            this.addSuperNode(coordinate, bifBlock1, "block");
                            const coordinate2 = coordinate;
                            coordinate2[1] = coordinate2[1] - 60;
                            this.addSuperNode(coordinate2, bifBlock2, "block");
                            this.LogEvent(
                              "create new " + res[0].blockID + ":",
                              res[0].hash
                            );
                            this.addNewBlockLink(start, bifBlock1.blockID);
                            this.addNewBlockLink(start, bifBlock2.blockID);
                            const data = blockListId.length;
                            this.summaryMes[4].data =
                              bifBlock1.blockId + " or " + bifBlock2.blockId;
                            this.summaryMes[2].data = data;
                            this.summaryMes[6].data = 1 + Number(this.summaryMes[6].data);
                            setTimeout(() => {
                              this.setPowFindVisible(false);
                            }, 500);
                          }, 1000);
                        }, 1000);
                      }, 1000);
                    }, 1000);
                  }, 1000);
                }, 2400);
              }, 1000);
            }, 1000);
          });
        }, 1000);
      }, 500);
    },
    //添加画板节点
    addSuperNode(coordinate, res, type) {
      this.$refs.superFlow.addNode({
        width: 100,
        height: 30,
        coordinate,
        meta: {
          label: res.blockID,
          name: res.blockID,
          prop: type,
        },
      });
      const newBlocklist = this.$refs.superFlow.graph.nodeList;
      const presentBlock = newBlocklist[newBlocklist.length - 1];
      presentBlock.meta.name = res.blockID;
      if (presentBlock.meta.prop == "block") {
        // let presentNodsd=presentNode.id;
        blockListId.push({
          lable: presentBlock.meta.label,
          id: presentBlock.id,
        });
      }
      if (this.summaryMes[3].data == "0") {
        this.summaryMes[3].data = presentBlock.meta.label;
      }
    },

    //添加区块连线
    addNewBlockLink(start, end) {
      console.log("add:" + start + "-" + end);
      let startuuid = "";
      let enduuid = "";
      for (let i = 0; i < blockListId.length; i++) {
        if (blockListId[i].lable == start) {
          startuuid = blockListId[i].id;
        } else if (blockListId[i].lable == end) {
          enduuid = blockListId[i].id;
        }
      }
      const newId = uuid("block" + end);
      const lengthLinklength = this.linkList.length;
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          targetLinkList.push(this.linkList[i]);
        }
      }
      targetLinkList.push({
        id: newId,
        startId: startuuid,
        endId: enduuid,
        startAt: [100, 24],
        endAt: [0, 25],
        meta: "block",
      });
      this.linkList = targetLinkList;
    },
    setStrToStrs(str) {
      if (str == null) {
        return null;
      } else {
        if (str.indexOf(",") != -1) {
          let strs = str.split(",");
          return strs;
        } else {
          return [str];
        }
      }
    },
    //获取画中已经连线的节点用于交易
    getNearTransNode(linkList) {
      let end = {
        valueTrans1: "",
        valueTrans2: "",
      };
      let length = linkList.length;
      for (let i = length - 1; i >= 0; i--) {
        if (linkList[i].start.meta.prop === "node" && linkList[i]._end.meta.prop) {
          end.valueTrans1 = linkList[i].start.meta.label;
          end.valueTrans2 = linkList[i]._end.meta.label;
        }
      }
      return end;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
.cursorMove {
  cursor: pointer;
}
.cursorMove .drag-box {
  .items {
    display: flex;
    justify-content: space-between;
    width: 75%;
    padding: 0 10px;
    background: #e3e3e3;
    border-radius: 5px;
    text-align: center;
  }
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #3be8ff;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.list-complete-item1 {
  cursor: pointer;
  font-size: 14px;
  padding: 0 12px;
  display: inline-block;
  margin-bottom: 10px;
  width: 100px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}
.dragArea2 {
  height: 100%;
  background-color: #fafeff;
  align-items: center;
}
.list-complete-item2 {
  top: 10%;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  margin: 10px;
  width: 100px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #bfcbd9;
  transition: all 1s;
  border-radius: 5px;
}
.list-complete-item2 .leftD {
  position: relative;
  height: 100%;
  text-align: center;
  display: inline-block;
  width: 70%;
}
.list-complete-item2 .rightD {
  position: relative;
  height: 100%;
  text-align: center;
  display: inline-block;
  width: 30%;
}
.nodeDiv {
  height: 100%;
  width: 100%;
}
.blockDiv {
  margin-top: 20px;
  margin-bottom: 20px;
  height: 265px;
  border: 1px solid #8a8a8a;
}
@font-face {
  font-family: "iconfont"; /* Project id 3114720 */
  src: url("//at.alicdn.com/t/font_3114720_6un57zlzj6s.woff2?t=1642514768733")
      format("woff2"),
    url("//at.alicdn.com/t/font_3114720_6un57zlzj6s.woff?t=1642514768733") format("woff"),
    url("//at.alicdn.com/t/font_3114720_6un57zlzj6s.ttf?t=1642514768733")
      format("truetype");
}
.iconfont {
  margin-left: 1px;
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.card-header {
  height: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
  text-align: left;
  color: rgb(99, 98, 98);
}

.item {
  margin-bottom: 8px;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 2px solid var(--el-border-color-base);
}
.el-drawer__title {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 10px;
  padding: var(--el-drawer-padding-primary);
  padding-bottom: 0;
}
.base_title {
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
}
.opButton {
  margin-bottom: 10px;
  width: 70%;
  text-align: center;
}
.opButtontdrwaer {
  margin-left: -15px;
  margin-bottom: 10px;
  width: 138%;
  text-align: center;
}
.opButtontdrwaer2 {
  margin-left: -15px;
  margin-bottom: 10px;
  width: 138%;
  text-align: center;
}
.el-dropdown {
  width: 50%;
}
.el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.super-flow {
  width: 1400px;
  height: 1400px;
}
.feeEdit {
  color: rgba(255, 255, 255, 0);
  cursor: pointer;
  padding-left: 100px;
}
</style>

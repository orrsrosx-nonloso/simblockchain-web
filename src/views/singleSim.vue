<template>
  <el-scrollbar height="110%">
    <el-row :gutter="3">
      <el-col :span="3"
        ><div class="grid-content" id="leftMenuGuide">
          <div class="base_title">节点操作</div>
          <div class="drag-box">
            <el-dropdown>
              <el-button class="opButtontdrwaer2" type="primary" size="small"
                >账户操作
                <arrow-down />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="createAccountVis(null, null)"
                    >创建空账户</el-dropdown-item
                  >
                  <el-dropdown-item @click="findAllAccount"
                    >查看所有账户</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog v-model="accountCreateVis" title="账户创建" width="30%">
              <div>
                <el-form
                  :inline="true"
                  :model="accountNameC"
                  class="demo-form-inline"
                >
                  <el-form-item label="目标节点:">
                    <el-input
                      v-model="localeNode"
                      disabled
                      placeholder="无目标时生成空账户"
                    />
                  </el-form-item>
                  <el-form-item label="账户名称:">
                    <el-input
                      v-model="accountNameC"
                      placeholder="输入为空时会生成随机账户"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="accountCreateVis = false">关闭</el-button>
                  <el-button type="primary" @click="startCreateAccount()"
                    >创建</el-button
                  >
                </span>
              </template>
            </el-dialog>
            <el-dialog v-model="dialogAllAccountVisible" width="840px">
              <el-table :data="AllAccountData" height="300" style="width: 100%">
                <el-table-column
                  prop="accountName"
                  label="账户名称"
                  width="200"
                />
                <el-table-column prop="address" label="账户地址" width="200" />
                <el-table-column
                  prop="transactions"
                  label="交易数量"
                  width="100"
                />
                <el-table-column
                  prop="totalReceived"
                  label="接收总量"
                  width="100"
                />
                <el-table-column
                  prop="totalSent"
                  label="发送总量"
                  width="100"
                />
                <el-table-column prop="balance" label="账户余额" width="100" />
              </el-table>
            </el-dialog>
          </div>
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
                  <el-tooltip
                    content="模拟双花问题情况下的交易!"
                    placement="top"
                  >
                    <el-dropdown-item @click="doubleSpent"
                      >双花问题模拟</el-dropdown-item
                    >
                  </el-tooltip>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog
              v-model="transactionSimVis"
              title="模拟交易(交易账户为节点内默认账户)"
              width="50%"
              :before-close="transSimVisHandleClose"
            >
              <div>
                <el-select v-model="valueTrans1" placeholder="交易发起者">
                  <el-option
                    v-for="item in NodeTrans"
                    :fit-input-width="true"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
                  <el-button type="primary" @click="startTransSim"
                    >Confirm</el-button
                  >
                </span>
              </template>
            </el-dialog>
          </div>

          <div class="drag-box">
            <el-dropdown>
              <el-button class="opButtontdrwaer" type="primary" size="small">
                交易信息
                <arrow-down />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-tooltip
                    content="查看所有经过记账节点确定的交易!"
                    placement="top"
                  >
                    <el-dropdown-item @click="getPresentUtxoData('confirmed')"
                      >已确定交易</el-dropdown-item
                    >
                  </el-tooltip>
                  <el-tooltip
                    content="查看点击所有未经过记账节点确定的交易!"
                    placement="top"
                  >
                    <el-dropdown-item @click="getPresentUtxoData('unconfirmed')"
                      >交易池</el-dropdown-item
                    >
                  </el-tooltip>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog v-model="dialogUtxoVisible" width="840px">
              <el-table :data="tableUtxoData" height="300" style="width: 100%">
                <el-table-column prop="TransId" label="交易Id" width="100" />
                <el-table-column
                  prop="inputId"
                  label="交易输入ID"
                  width="100"
                />
                <el-table-column
                  prop="outPutId"
                  label="交易输出ID"
                  width="100"
                />
                <el-table-column
                  prop="totalInput"
                  label="总交易输入"
                  width="100"
                />
                <el-table-column
                  prop="totalOutput"
                  label="总交易输出"
                  width="100"
                />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column
                  prop="UtxoBalance"
                  label="未交易事务量"
                  width="120"
                />
              </el-table>
            </el-dialog>
          </div>

          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="dialogConWalletVisible = true"
              >钱包结构
            </el-button>
          </div>
          <div class="drag-box">
            <el-dropdown>
              <el-button class="opButtontdrwaer2" type="primary" size="small"
                >网络配置
                <arrow-down />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="centerDialogVisible = true"
                    >配置网络参数</el-dropdown-item
                  >
                  <el-dropdown-item @click="openmanualDialog()"
                    >手动配置网络结构</el-dropdown-item
                  >
                  <el-dropdown-item @click="getPresentP2PNetWork"
                    >网络拓扑结构查看</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dialog
              v-model="manualDialogVisible"
              title="Manually configure neighbor nodes"
              width="50%"
              :show-close="false"
              :before-close="handleCloseManualConfig"
            >
              <el-row>
                <el-col :span="1"></el-col>
                <el-col :span="22"
                  ><el-table
                    :data="state.tableData"
                    height="350px"
                    stripe
                    style="width: 100%"
                  >
                    <el-table-column prop="node" label="Node" width="180" />
                    <el-table-column
                      prop="numConnect"
                      label="Num Connection"
                      width="180"
                    />
                    <!-- :ref="scope.row.node" -->
                    <el-table-column prop="neighborNode" label="Neighbor node">
                      <template #default="scope">
                        <el-cascader
                          :options="scope.row.options"
                          :props="props"
                          collapse-tags
                          clearable
                          v-model="scope.row.value"
                          @change="
                            (val) => {
                              handleChange(
                                val,
                                scope.row.node,
                                scope.row.numConnect,
                                scope.row.value
                              );
                            }
                          "
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="1"></el-col>
              </el-row>

              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="outP2pNetManualSetting">Cancel</el-button>
                  <el-button type="primary" @click="setUpP2pNet"
                    >SetUp</el-button
                  >
                </span>
              </template>
            </el-dialog>
            <!-- <el-tooltip content="点击查看当前区块链网络结构!" placement="top">
              <el-button
                class="opButton"
                @click="getPresentP2PNetWork"
                type="primary"
                size="small"
                >P2P网络结构
              </el-button>
            </el-tooltip> -->
            <el-dialog
              v-model="dialogP2PNetVisible"
              width="50%"
              title="Network details"
            >
              <el-table
                :data="filterTableData"
                height="350px"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="node" label="Node" width="140" />
                <el-table-column
                  prop="numConnect"
                  label="Num Connection"
                  width="140"
                />
                <!-- :ref="scope.row.node" -->
                <el-table-column prop="searchP2pData" label="Neighbor node">
                  <template #header>
                    <el-input
                      v-model="searchP2pData"
                      size="small"
                      placeholder="Type to search node"
                    />
                  </template>
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.boundStr"
                      disabled
                      placeholder="Please input"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="visP2pNetCheck"
                    >可视化网络结构查看</el-button
                  >
                </span>
              </template>
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
                <el-tooltip
                  content="工作量证明共识机制(Proof of Work)"
                  placement="top"
                >
                  <el-radio v-model="consensusChoose" label="1" size="large"
                    >POW</el-radio
                  ></el-tooltip
                >
                <el-tooltip
                  content="股权证明/权益证明共识机制(Proof of Stake)"
                  placement="top"
                >
                  <el-radio
                    v-model="consensusChoose"
                    label="2"
                    disabled
                    size="large"
                    >POS</el-radio
                  ></el-tooltip
                >
                <el-tooltip
                  content="历史工作证明共识机制(Proof of History)"
                  placement="top"
                >
                  <el-radio
                    v-model="consensusChoose"
                    disabled
                    label="3"
                    size="large"
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
            <!-- 所有挖矿节点竞争挖矿行为界面 -->
            <el-dialog
              v-model="powMinFindVisible"
              title="所有挖矿节点同步计算中!"
              width="40%"
              :before-close="powFindHandleClose"
              :show-close="false"
            >
              <div
                class="demo-progress"
                style="padding-left: 20%; padding-right: 20%"
              >
                <el-form :model="showFindBlockMes">
                  <el-descriptions title="">
                    <el-descriptions-item label="">
                      <span style="font-size: 15px; font-weight: bold"
                        >所有挖矿节点挖矿中。目标nonce:
                        {{ showFindBlockMes[0] }} 目标difficulty:
                        {{ showFindBlockMes[1] }}</span
                      >
                    </el-descriptions-item></el-descriptions
                  ></el-form
                >
                <el-progress
                  v-for="item in miningList"
                  :color="customColors"
                  :percentage="item.minPercentage"
                >
                  <el-button type="text">{{ item.name }}</el-button>
                </el-progress>
              </div>
            </el-dialog>
          </div>
          <div class="drag-box">
            <el-button
              class="opButton"
              type="primary"
              size="small"
              @click="blockTranSim"
              >区块传输模拟
            </el-button>
          </div>

          <div class="drag-box">
            <el-button
              class="opButton"
              @click="getNewBlockDifficult"
              type="primary"
              size="small"
              >区块获取难度
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
      <el-col :span="15" class="midContent"
        ><div class="grid-content">
          <div class="drag-box">
            <el-card
              class="box-card"
              :body-style="{ padding: '5px', height: superFlowHeight + 'px' }"
            >
              <template #header>
                <div class="card-header">
                  <span>节点与区块</span>
                  <div>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="仿真网络结构的实时显示"
                      placement="top-start"
                    >
                      <el-switch
                        v-model="switchNetwork"
                        :loading="loading1"
                        :before-change="beforeSwitchNetworkChange"
                        class="switchNetwork"
                        active-text="on"
                        inactive-text="off"
                        @change="p2pSwitchChange"
                      />
                    </el-tooltip>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="清除当前仿真所有数据"
                      placement="top-start"
                    >
                      <el-button
                        id="clearDataGuide"
                        @click="clearDatabaseVisible = true"
                        style="left: 0"
                        >清空数据</el-button
                      >
                    </el-tooltip>
                    <el-dialog
                      v-model="clearDatabaseVisible"
                      title="清空数据"
                      width="30%"
                    >
                      <span>您确定要清空所有仿真数据吗？</span>
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button @click="clearDatabaseVisible = false"
                            >取消</el-button
                          >
                          <el-button type="primary" @click="clearDatabase"
                            >确定</el-button
                          >
                        </span>
                      </template>
                    </el-dialog>
                    <span
                      class="node-item"
                      v-for="item in nodeItemList"
                      :id="item.value.meta.label"
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
              <div
                class="flow-container"
                id="flowMenuGuide"
                ref="flowContainer"
              >
                <div
                  class="ys-float-btn"
                  :style="{
                    width: itemWidth + 'px',
                    height: itemHeight + 'px',
                    left: leftFloat + 'px',
                    top: topFloat + 'px',
                  }"
                  ref="div"
                  @click="onBtnClicked"
                >
                  <div
                    class="content-node-box"
                    style="background-color: rgb(205, 254, 156)"
                  >
                    <i class="iconfont" style="color: #000000"
                      >&#xe63e;<span class="icon-text">全节点</span></i
                    >
                  </div>
                  <div
                    class="content-node-box"
                    style="background-color: aquamarine"
                  >
                    <i class="iconfont" style="color: #000000"
                      >&#xe63e;<span class="icon-text">轻节点</span></i
                    >
                  </div>
                  <div
                    class="content-node-box"
                    style="background-color: rgb(255, 153, 127); color: #000000"
                  >
                    <i class="iconfont" style="color: #000000"
                      >&#xe63e;<span class="icon-text">挖矿节点</span></i
                    >
                  </div>
                  <div
                    class="content-node-box"
                    style="background-color: #a0a0a0"
                  >
                    <i class="iconfont" style="color: #000000"
                      >&#xea18; <span class="icon-text">区块</span></i
                    >
                  </div>
                </div>
                <c-scrollbar maxHeight="100%" trigger="hover">
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
                    :link-addable="false"
                  >
                    <template v-slot:node="{ meta }">
                      <!-- 全节点 -->

                      <div
                        @mouseup="nodeMouseUp"
                        @click="nodeClick"
                        :class="`flow-node ellipsis ${meta.type}`"
                      >
                        <div
                          :id="`loacalBlockTraFor${meta.name}`"
                          style="
                            height: 100%;
                            width: 20px;
                            background-color: #878787;
                            color: #f57e7e;
                            display: none;
                          "
                          v-if="meta.prop == `node`"
                        >
                          <i class="iconfont" style="color: #000000"
                            >&#xea18;</i
                          >
                        </div>

                        <i
                          style="width: 100%; color: #000000"
                          v-if="meta.prop == `node`"
                          class="iconfont"
                          >&#xe63e;<span class="icon-text">{{
                            meta.name
                          }}</span></i
                        >
                        <i
                          style="width: 100%; color: #000000"
                          v-if="meta.prop == `block`"
                          class="iconfont"
                          >&#xea18;<span class="icon-text">{{
                            meta.name
                          }}</span></i
                        >
                      </div>
                    </template>
                  </super-flow>
                </c-scrollbar>
              </div>

              <el-dialog
                v-model="nodeType"
                title="节点类型"
                width="30%"
                :show-close="false"
                :before-close="nodetypeHandleClose"
              >
                <div
                  :model="presentTypeNode"
                  style="left: 0; padding-bottom: 20px"
                >
                  请选择节点类型
                </div>
                <div class="nodeCreateD">
                  <el-tooltip
                    content="包含完整的区块链数据（默认包含完整的网络路由功能）!"
                    placement="top"
                  >
                    <el-radio
                      v-model="nodeTypeChoose"
                      label="fullNode"
                      size="large"
                      ><div class="fullCreateNode">
                        <i class="iconfont" style="color: #000000"
                          >&#xe63e;<span class="icon-text">全节点</span></i
                        >
                      </div></el-radio
                    ></el-tooltip
                  >
                </div>
                <div>
                  <el-tooltip
                    content="仅包含区块头数据,移动端使用较多（默认包含完整的网络路由功能）!"
                    placement="top"
                  >
                    <el-radio
                      v-model="nodeTypeChoose"
                      label="lightNode"
                      size="large"
                      ><div class="lightCreateNode">
                        <i class="iconfont" style="color: #000000"
                          >&#xe63e;<span class="icon-text">轻节点</span></i
                        >
                      </div></el-radio
                    ></el-tooltip
                  >
                </div>
                <div>
                  <el-tooltip
                    content="负责产生区块的节点（默认包含完整的网络路由功能和区块链数据）!"
                    placement="top"
                  >
                    <el-radio
                      v-model="nodeTypeChoose"
                      label="miningNode"
                      size="large"
                      ><div class="miningCreateNode">
                        <i class="iconfont" style="color: #000000"
                          >&#xe63e;<span class="icon-text">挖矿节点</span></i
                        >
                      </div></el-radio
                    ></el-tooltip
                  >
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button type="primary" @click="setNodeType"
                      >保存</el-button
                    >
                  </span>
                </template>
              </el-dialog>

              <!-- 算力设置界面，无法关闭，必须设置 <-->
              <el-dialog
                v-model="regionIdList"
                title="地域配置"
                width="30%"
                :show-close="false"
              >
                <div style="left: 0; padding-bottom: 20px">请选择地域类型</div>
                <el-radio-group v-model="regionList" class="ml-4">
                  <el-radio label="0" size="large"
                    >0<span :v-model="regionData"
                      >( {{ regionData[0] }} )</span
                    ></el-radio
                  >
                  <el-radio label="1" size="large"
                    >1<span :v-model="regionData"
                      >( {{ regionData[1] }} )</span
                    ></el-radio
                  >
                  <el-radio label="2" size="large"
                    >2<span :v-model="regionData"
                      >( {{ regionData[2] }} )</span
                    ></el-radio
                  >
                  <el-radio label="3" size="large"
                    >3<span :v-model="regionData"
                      >( {{ regionData[3] }} )</span
                    ></el-radio
                  >
                  <el-radio label="4" size="large"
                    >4<span :v-model="regionData"
                      >( {{ regionData[4] }} )</span
                    ></el-radio
                  >
                  <el-radio label="5" size="large"
                    >5<span :v-model="regionData"
                      >( {{ regionData[5] }} )</span
                    ></el-radio
                  >
                </el-radio-group>

                <template #footer>
                  <span class="dialog-footer">
                    <el-button type="primary" @click="startChangeRegion()"
                      >保存</el-button
                    >
                  </span>
                </template>
              </el-dialog>

              <el-dialog
                v-model="hashRateVis"
                title="配置矿工节点算力(HashRate)"
                width="30%"
                :show-close="false"
                :before-close="nodetypeHandleClose"
              >
                <div :model="presentTypeNode" style="left: 0">
                  请设置挖矿节点算力
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
                    <el-button type="primary" @click="setHashRate"
                      >设置</el-button
                    >
                  </span>
                </template>
              </el-dialog>

              <el-dialog
                v-model="centerDialogVisible"
                :title="t('NetConfiguration')"
                width="30%"
                :show-close="false"
                :before-close="handleCloseNetConfig"
              >
                <el-form :model="networkForm" label-width="120px">
                  <h3>{{ t("NetworkStrategy") }}:</h3>
                  <el-radio-group
                    v-model="networkForm.labelPosition"
                    style="margin-top: 15px"
                  >
                    <el-radio label="Adaptive" border>自适应</el-radio>
                    <el-radio label="Manual" border>手动模式</el-radio>
                  </el-radio-group>
                  <el-form-item
                    style="margin-top: 20px"
                    label="最大出度"
                    prop="MaxOutbound"
                    :rules="[
                      {
                        type: 'number',
                        message: '输入内容必须为数字',
                      },
                    ]"
                  >
                    <el-input
                      v-model.number="networkForm.MaxOutbound"
                      type="text"
                      autocomplete="off"
                      placeholder="范围限制为4-8(默认值:4)."
                    />
                  </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false"
                      >关闭</el-button
                    >
                    <el-button type="primary" @click="submitForm()"
                      >确定</el-button
                    >
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
          <el-card
            id="summaryGuide"
            class="box-card"
            :body-style="{ padding: '5px', height: SUMMARYHeight + 'px' }"
          >
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
          <el-card
            id="eventMenuGuide"
            class="box-card"
            :body-style="{ padding: '5px', height: EVENTHeight + 'px' }"
          >
            <template #header>
              <div class="card-header" style="font-weight: bold">
                <span>EVENT</span>
              </div>
            </template>
            <c-scrollbar maxHeight="237px" maxWidth="280px" trigger="hover">
              <el-collapse height="110%" accordion>
                <el-collapse-item v-for="item in eventMes" :name="item.name">
                  <template #title>
                    <div style="margin-left = 10px">{{ item.eventName }}</div>
                  </template>
                  <p class="textEvent">{{ item.data }}</p>
                </el-collapse-item>
              </el-collapse>
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
                <el-descriptions-item
                  label="Height"
                  label-align="center"
                  align="center"
                >
                  {{ drwaerDateBlock.height }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="Miner"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.miner }}</el-descriptions-item
                >
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
                <el-descriptions-item
                  label="Nonce"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateBlock.nonce }}</el-descriptions-item
                >
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
                        <el-button
                          type="text"
                          @click="getInputData(scope.row.inputId)"
                          >{{ scope.row.inputId }}</el-button
                        >
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
                    <el-table-column
                      prop="totalInput"
                      label="totalInput"
                      width="100"
                    />
                    <el-table-column
                      prop="totalOutput"
                      label="totalOutput"
                      width="110"
                    />
                    <el-table-column
                      prop="createTime"
                      label="createTime"
                      width="200"
                    />
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
                  label="节点编号"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.addressId }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="节点描述"
                  label-align="center"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  ><span v-if="drwaerDateNode.nodeType == `fullNode`"
                    >包含完整的区块链数据（默认包含完整的网络路由功能）</span
                  >
                  <span v-if="drwaerDateNode.nodeType == `lightNode`"
                    >仅包含区块头数据,移动端使用较多（默认包含完整的网络路由功能）</span
                  >
                  <span v-if="drwaerDateNode.nodeType == `miningNode`"
                    >负责产生区块的节点（默认包含完整的网络路由功能和区块链数据）</span
                  >
                </el-descriptions-item>
                <el-descriptions-item
                  label="NodeType"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.nodeType }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="region"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.regionID
                  }}<span :v-model="regionData"
                    >( {{ regionData[drwaerDateNode.regionID] }} )</span
                  ><el-button
                    type="text"
                    @click="
                      changeRegion(
                        drwaerDateNode.regionID,
                        drwaerDateNode.addressId
                      )
                    "
                    >修改</el-button
                  ></el-descriptions-item
                >
                <el-descriptions-item
                  v-if="drwaerDateNode.nodeType == `miningNode`"
                  label="HashRate"
                  label-align="center"
                  align="center"
                  >{{ drwaerDateNode.hashRate }} kH/s</el-descriptions-item
                >
              </el-descriptions>
              <div class="textNode">节点内账户详情</div>
              <div
                v-if="drwaerDateNode.accountList == null"
                class="textStatusNode"
              >
                当前节点不包含任何账户<el-button
                  @click="createAccountVis(drwaerDateNode.addressId, 'dialog2')"
                  type="text"
                  >创建账户</el-button
                >
              </div>
              <div
                v-if="drwaerDateNode.accountList != null"
                class="textStatusNode"
                style="padding-left: 30%"
              >
                <el-button
                  type="text"
                  @click="createAccountVis(drwaerDateNode.addressId, 'dialog2')"
                  >添加账户</el-button
                >
              </div>
              <div style="width: 100%; height: 350px">
                <c-scrollbar maxHeight="350px">
                  <el-collapse
                    v-if="drwaerDateNode.accountList != null"
                    height="100%"
                    v-model="activeName"
                    accordion
                  >
                    <el-collapse-item
                      v-for="item in drwaerDateNodeAccount"
                      :name="item.id"
                    >
                      <!-- 自定义标题 -->
                      <template #title>
                        <div style="margin-left = 10px">
                          {{ item.accountName }}
                        </div>
                      </template>
                      <el-descriptions :column="1" border width="50px">
                        <el-descriptions-item
                          width="250px"
                          label="AccountID"
                          label-align="center"
                          align="center"
                          >{{ item.accountId }}</el-descriptions-item
                        >
                        <el-descriptions-item
                          label="Transactions"
                          label-align="center"
                          align="center"
                          width="250px"
                          >{{ item.transactions }}</el-descriptions-item
                        >
                        <el-descriptions-item
                          label="Total Received"
                          label-align="center"
                          align="center"
                          width="250px"
                        >
                          {{ item.totalReceived }}</el-descriptions-item
                        >
                        <el-descriptions-item
                          label="Total Sent"
                          label-align="center"
                          align="center"
                          width="250px"
                        >
                          {{ item.totalSent }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          label="Final Balance"
                          label-align="center"
                          align="center"
                          width="250px"
                          >{{ item.balance }}</el-descriptions-item
                        >
                        <el-descriptions-item
                          label="Wallet Id"
                          label-align="center"
                          align="center"
                          width="250px"
                          >{{ item.walletId
                          }}<el-button
                            type="text"
                            @click="checkWallet(item.walletId)"
                            >查看</el-button
                          ></el-descriptions-item
                        >
                        <el-descriptions-item
                          label="交易列表ID"
                          label-align="center"
                          align="center"
                          width="250px"
                        >
                          <div v-if="item.transactionsId != null">
                            <el-tooltip
                              v-if="drwaerDateNode.nodeType == `lightNode`"
                              content="轻节点内账户的交易信息需要通过其他全节点查询!"
                              placement="top"
                              ><el-button
                                size="small"
                                @click="
                                  findLightListTransList2(item.transactionsId)
                                "
                                round
                                >查询交易
                              </el-button>
                            </el-tooltip>
                          </div>
                          <el-button
                            v-if="drwaerDateNode.nodeType != `lightNode`"
                            type="text"
                            @click="findTransList2(item.transactionsId)"
                            >{{ item.transactionsId }}</el-button
                          >
                        </el-descriptions-item>
                      </el-descriptions>
                    </el-collapse-item>
                  </el-collapse>
                </c-scrollbar>
              </div>

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
                        <el-button
                          type="text"
                          @click="getInputData(scope.row.inputId)"
                          >{{ scope.row.inputId }}</el-button
                        >
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
                    <el-table-column
                      prop="totalInput"
                      label="totalInput"
                      width="100"
                    />
                    <el-table-column
                      prop="totalOutput"
                      label="totalOutput"
                      width="110"
                    />
                    <el-table-column
                      prop="createTime"
                      label="createTime"
                      width="200"
                    />
                    <el-table-column prop="status" label="status" width="100" />
                    <el-table-column prop="utxo" label="utxo" width="100" />
                  </el-table>
                </c-scrollbar>
              </el-drawer>
            </el-form>
            <!-- <div class="demo-drawer__footer">
              <el-button @click="cancelForm2">Cancel</el-button>
              <el-button type="primary" :loading="loading" @click="onClick2">{{
                loading ? "Submitting ..." : "Submit"
              }}</el-button>
            </div> -->
          </div>
        </el-drawer>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogWalletVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="walletData">
          <el-descriptions title="钱包结构信息" :column="1" border>
            <el-descriptions-item
              label="wallet_id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">{{
                walletData.id
              }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item
              label="publicKkey"
              label-align="left"
              align="left"
              >{{ walletData.publicKkey }}</el-descriptions-item
            >
            <el-descriptions-item
              label="Address"
              label-align="left"
              align="left"
              >{{ walletData.address }}</el-descriptions-item
            >
            <el-descriptions-item
              label="privateKey"
              label-align="left"
              align="left"
            >
              {{ walletData.privateKey }}
            </el-descriptions-item>
          </el-descriptions></el-form
        ></c-scrollbar
      >
    </el-dialog>

    <el-dialog v-model="dialogConWalletVisible" width="440px">
      <c-scrollbar maxWidth="400" trigger="hover">
        <el-form :model="walletData">
          <el-descriptions title="钱包结构" :column="1" border>
            <el-descriptions-item
              label="wallet_id"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small"
                >钱包唯一标识ID</el-tag
              ></el-descriptions-item
            >
            <el-descriptions-item
              label="publickey"
              label-align="left"
              align="left"
              >公钥用于接收交易虚拟货币</el-descriptions-item
            >
            <el-descriptions-item
              label="Address"
              label-align="left"
              align="left"
              >钱包对应的账户地址</el-descriptions-item
            >
            <el-descriptions-item
              label="privateKey"
              label-align="left"
              align="left"
            >
              私钥用于虚拟货币交易时的交易签名
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
              ><el-tag size="small">{{
                inputData.id
              }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item
              label="address"
              label-align="left"
              align="left"
              >{{ inputData.address }}</el-descriptions-item
            >
            <el-descriptions-item
              label="signature"
              label-align="left"
              align="left"
            >
              {{ inputData.signature }}
            </el-descriptions-item>
            <el-descriptions-item
              label="pubKey"
              label-align="left"
              align="left"
            >
              {{ inputData.pubKey }}
            </el-descriptions-item>
            <el-descriptions-item
              label="transId"
              label-align="left"
              align="left"
            >
              <el-button
                v-for="item in inputData.transId"
                type="text"
                @click="getTransData(item)"
                >{{ item }}</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item
              label="tranValue"
              label-align="left"
              align="left"
              >{{ inputData.tranValue }}</el-descriptions-item
            >
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
              ><el-tag size="small">{{
                outputData.id
              }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item
              label="address"
              label-align="left"
              align="left"
              >{{ outputData.address }}</el-descriptions-item
            >
            <el-descriptions-item
              label="tranValue"
              label-align="left"
              align="left"
              >{{ outputData.tranValue }}</el-descriptions-item
            >
            <el-descriptions-item
              label="transId"
              label-align="left"
              align="left"
            >
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
              ><el-tag size="small">{{
                transData.id
              }}</el-tag></el-descriptions-item
            >
            <el-descriptions-item
              label="TransHash"
              label-align="left"
              align="left"
              >{{ transData.hash }}</el-descriptions-item
            >
            <el-descriptions-item
              label="InputId"
              label-align="left"
              align="left"
            >
              <el-button type="text" @click="getInputData(transData.inputId)">{{
                transData.inputId
              }}</el-button>
            </el-descriptions-item>
            <el-descriptions-item
              label="OutputId"
              label-align="left"
              align="left"
            >
              <el-button
                type="text"
                @click="getOutputData(transData.outputId)"
                >{{ transData.outputId }}</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item
              label="createTime"
              label-align="left"
              align="left"
              >{{ transData.createTime }}</el-descriptions-item
            >
            <el-descriptions-item
              label="totalInput"
              label-align="left"
              align="left"
              >{{ transData.totalInput }}</el-descriptions-item
            >
            <el-descriptions-item
              label="totalOutput"
              label-align="left"
              align="left"
              >{{ transData.totalOutput }}</el-descriptions-item
            >
            <el-descriptions-item
              label="status"
              label-align="left"
              align="left"
              >{{ transData.status }}</el-descriptions-item
            >
            <el-descriptions-item
              label="utxo"
              label-align="left"
              align="left"
              >{{ transData.utxo }}</el-descriptions-item
            >
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
// import type { FormInstance } from "element-plus";
import { ref, reactive } from "vue";
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
  needGuide,
  createAccount,
  deleteAccount,
  findAllAccountList,
  findAccountList,
  manualP2pNetModift,
  changeNodeRegion,
} from "../api/apis";
import { uuid, getDataString, getNodeId, checkNumber } from "../utils/utils";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { computed, h } from "vue";
import { Box, Edit, Phone } from "@element-plus/icons";
import { useRouter } from "vue-router";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

const drawerType = {
  node: 0,
  link: 1,
};

let summaryMesUpdata = reactive([
  {
    tabName: "仿真时间:  ",
    data: getDataString(),
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
  // {
  //   tabName: "Account quantity:  ",
  //   data: "0",
  // },
]);

//节点连线数据存储集合
const nodeLinkListId = reactive([]);
//节点数据存储
const nodeListId = reactive([]);
//区块数据存储
const blockListId = reactive([]);

//账户数据存储
const accountListId = reactive([]);

//总连线集合
const totalLinkList = reactive([]);

let blockTableData = reactive([]);

let nodeTableData = reactive([]);

//模拟挖矿时需要的数据
let lastBlockcreate = reactive([]);

//节点创建信息
let nodeCreateMes = reactive({
  graph: null,
  coordinate: null,
});

// 全局的共识协议变量
let globalConsensus = ref("POW");

let lastBlockCoordinate = reactive([457.8750305175781, 185.0999984741211]);

export default {
  components: {},
  props: {
    text: {
      type: String,
      default: "默认文字",
    },
    itemWidth: {
      type: Number,
      default: 100,
    },
    itemHeight: {
      type: Number,
      default: 80,
    },
    gapWidth: {
      type: Number,
      default: 10,
    },
    coefficientHeight: {
      type: Number,
      default: 0.8,
    },
  },
  setup() {
    //仿真加载
    //折叠面板配置
    const activeName = ref(0);
    //拖拽区块节点配置
    const disabled = ref(false);
    const node1 = reactive([]);
    const node2 = reactive([{ id: 1, name: "节点生成" }]);
    const block1 = reactive([]);
    const block2 = reactive([{ id: 1, name: "区块生成" }]);
    const end1 = (ev) => {
      // console.log("拖动结束1", ev);
    };
    const start2 = (event) => {
      // console.log("开始拖动", event);
    };
    const start1 = (event) => {
      // console.log(event.index);
      // console.log("开始拖动", event);
    };
    const end2 = (ev) => {
      // console.log(ev.index);
      // console.log("拖动结束2", ev);
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
      findFullNodeToEnquire({ auth: getAuth(), nodeType: "fullNode" }).then(
        (ress) => {
          let resdata = ress.preData;
          if (resdata != null) {
            ElMessageBox.alert(
              "该轻节点通过全节点(" + resdata + ")查询交易信息",
              "Mes",
              {
                confirmButtonText: "OK",
              }
            );
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
        }
      );
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
            }, 200);
          }, 200);
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

    const drawerFalse = (name) => {
      if (name == "dialog") {
        dialog.value = false;
      } else if (name == "dialog2") {
        dialog2.value = false;
      }
    };
    const { t } = useI18n();
    return {
      props: {
        // props.
        multiple: true,
      },
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
      drawerFalse,
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
      t,
    };
  },
  data() {
    //手动配置情况下的数据列表
    const state = reactive({
      page: 1,
      pageSize: 8,
      total: 5,
      tableData: [
        {
          node: "Node1",
          numConnect: "Tom",
          boundStr: "",
          value: [],
          options: [],
        },
      ],
      tableHisData: [
        {
          node: "Node1",
          numConnect: "Tom",
          boundStr: "",
          value: [],
          options: [],
        },
      ],
      tableChangeHisData: [
        {
          node: "Node1",
          numConnect: "Tom",
          boundStr: "",
          value: [],
          options: [],
        },
      ],
    });
    //manual page change
    function handleCurrentChange(e) {}
    const options = reactive([
      {
        value: "1",
        vaString: "",
        disabled: false,
        label: "Asia",
        children: [
          {
            disabled: false,
            value: "2",
            label: "China",
          },
          {
            disabled: false,
            value: "6",
            label: "Japan",
          },
          {
            disabled: false,
            value: "10",
            label: "Korea",
          },
        ],
      },
      // ,
      // {
      //   value: 14,
      //   label: "Europe",
      //   children: [
      //     {
      //       disabled: true,
      //       value: 15,
      //       label: "France",
      //     },
      //     {
      //       value: 19,
      //       label: "UK",
      //     },
      //   ],
      // },
      // {
      //   value: 23,
      //   label: "North America",
      //   children: [
      //     {
      //       value: 24,
      //       label: "US",
      //     },
      //     {
      //       value: 28,
      //       label: "Canada",
      //     },
      //   ],
      // },
    ]);

    //网络配置相关参数
    const centerDialogVisible = ref(false);
    //手动网络配置图形界面
    const manualDialogVisible = ref(false);

    //网络配置结构参数
    const networkForm = reactive({
      labelPosition: ref("Adaptive"),
      MaxOutbound: "",
      firstStates: ref(false), //节点一初次创建
      recentlyNodeId: "",
    });
    const changeFirstStatesFor = (value: boolean) => {
      networkForm.firstStates = value;
    };

    //打开手动界面
    const openmanualDialog = () => {
      if (networkForm.labelPosition != "Adaptive") {
        if (nodeListId.length <= 1) {
          ElMessageBox.alert(
            "The number of nodes is less than 2. Please create new node.",
            "WARING",
            {
              confirmButtonText: "OK",
            }
          );
        } else {
          manualDialogVisible.value = true;
        }
      } else {
        ElMessageBox.alert(
          "You can't use this function because the current mode is Adaptive",
          "WARING",
          {
            confirmButtonText: "OK",
          }
        );
      }
    };
    // const formRef = ref<FormInstance>();

    const handleCloseNetConfig = (done: () => void) => {
      ElMessageBox.confirm(
        "Are you sure to close this dialog? The data of MaxOutbound will be reset automatically."
      )
        .then(() => {
          let a = networkForm.MaxOutbound;
          if (!checkNumber(a)) {
            networkForm.MaxOutbound = "";
          }
          done();
        })
        .catch(() => {
          // catch error
        });
    };

    const handleCloseManualConfig = (done: () => void) => {
      let change = false;
      let localHisData = state.tableHisData;
      let localData = state.tableData;
      for (let i = 0; i < localData.length; i++) {
        if (localData[i].value.toString() != localHisData[i].value.toString()) {
          change = true;
          break;
        }
      }
      if (change) {
        ElMessageBox.confirm(
          "Are you sure you want to discard the modification?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            state.tableData.length = 0;
            state.tableData = JSON.parse(JSON.stringify(state.tableHisData));
            manualDialogVisible.value = false;
          })
          .catch(() => {});
      } else {
        ElMessageBox.confirm("Are you sure to close this dialog?")
          .then(() => {
            done();
          })
          .catch(() => {
            // catch error
          });
      }
    };

    const submitForm = () => {
      let a = networkForm.MaxOutbound;
      if (!checkNumber(a)) {
        if (a == "") {
          ElMessageBox.alert(
            "您可以在网络配置工具栏中再次修改相关配置.",
            "设置成功",
            {
              confirmButtonText: "OK",
            }
          );
          if (networkForm.labelPosition != "Adaptive") {
            ElMessageBox.alert(
              "在手动状态下，需要在左侧的网络配置工具栏中进行连续配置.",
              "通知",
              {
                confirmButtonText: "OK",
              }
            );
          }
          centerDialogVisible.value = false;
          if (networkForm.recentlyNodeId == "Node1") {
            nodeAddP2pNet(
              networkForm.recentlyNodeId,
              4,
              networkForm.labelPosition
            );
          }
        } else {
          ElMessageBox.alert("请输出正确的最大出度数", "警告", {
            confirmButtonText: "OK",
          });
        }
      } else {
        let numa = parseInt(a);
        if (numa < 4 || numa > 8) {
          ElMessageBox.alert("请输出正确范围内的最大出度数(4-8)", "警告", {
            confirmButtonText: "OK",
          });
        } else {
          ElMessageBox.alert(
            "您可以在网络配置工具栏中再次修改相关配置.",
            "设置成功",
            {
              confirmButtonText: "OK",
            }
          );
          if (networkForm.labelPosition != "Adaptive") {
            ElMessageBox.alert(
              "在手动状态下，需要在左侧的网络配置工具栏中进行连续配置.",
              "通知",
              {
                confirmButtonText: "OK",
              }
            );
          }
          centerDialogVisible.value = false;
          if (networkForm.recentlyNodeId == "Node1") {
            nodeAddP2pNet(
              networkForm.recentlyNodeId,
              networkForm.MaxOutbound,
              networkForm.labelPosition
            );
          }
        }
      }
      // if (!formEl) return;
      // formEl.validate((valid) => {
      //   if (valid) {
      //     console.log("submit!");
      //   } else {
      //     console.log("error submit!");
      //     return false;
      //   }
      // });
    };

    //manual model setting commit
    const setUpP2pNet = () => {
      let localData = state.tableData;
      //历史记录
      let localHisData = state.tableHisData;
      let change = false;
      let params = { auth: getAuth(), p2pTableData: [], mes: "", status: 1 };
      for (let i = 0; i < localData.length; i++) {
        //Only the modified parameters are passed in.
        if (localData[i].value.toString() != localHisData[i].value.toString()) {
          let outBound = "";
          if (localData[i].value.length != 0) {
            localData[i].value.forEach(function (element) {
              if (outBound == "") {
                outBound = element[1];
              } else {
                outBound = outBound + "," + element[1];
              }
            });
          }
          let changeContent = {
            nodeId: localData[i].node,
            numConnection: localData[i].numConnect,
            outBound: outBound,
          };
          params.p2pTableData.push(changeContent);
          // for()
          change = true;
        }
      }
      if (change) {
        manualP2pNetModift(params).then((res) => {
          const loading = ElLoading.service({
            lock: true,
            background: "rgba(0, 0, 0, 0.7)",
          });
          setTimeout(() => {
            loading.close();
            ElMessageBox.alert(res.mes, "NOTICE", {
              confirmButtonText: "OK",
            });
            manualDialogVisible.value = false;
            //历史数据修改
            state.tableHisData = JSON.parse(JSON.stringify(state.tableData));
            state.tableChangeHisData = JSON.parse(
              JSON.stringify(state.tableData)
            );
          }, 100);
        });
      }
      // console.log(localData);
    };

    const outP2pNetManualSetting = () => {
      let change = false;
      let localHisData = state.tableHisData;
      let localData = state.tableData;
      for (let i = 0; i < localData.length; i++) {
        if (localData[i].value.toString() != localHisData[i].value.toString()) {
          change = true;
          break;
        }
      }
      if (change) {
        ElMessageBox.confirm("您确定要放弃修改吗?", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            state.tableData.length = 0;
            state.tableData = JSON.parse(JSON.stringify(state.tableHisData));
            manualDialogVisible.value = false;
          })
          .catch(() => {});
      } else {
        manualDialogVisible.value = false;
      }
    };
    const handleChange = (val, node, numConnect, values) => {
      if (values.length > numConnect) {
        //可优化。数据量过大时采用点对点修改
        state.tableData = JSON.parse(JSON.stringify(state.tableChangeHisData));
        manualDialogVisible.value = false;

        setTimeout(() => {
          manualDialogVisible.value = true;
          setTimeout(() => {
            ElMessageBox.alert("所选值大于numConnect，请重新选择.", "Warning", {
              confirmButtonText: "OK",
            });
          }, 50);
        }, 50);

        // console.log("biggger");
      } else {
        state.tableChangeHisData = JSON.parse(JSON.stringify(state.tableData));
      }
    };

    //查看情况的内容过滤：
    const searchP2pData = ref("");
    const filterTableData = computed(() =>
      state.tableData.filter(
        (data) =>
          !searchP2pData.value ||
          data.node.toLowerCase().includes(searchP2pData.value.toLowerCase())
      )
    );
    //获取当前用户
    const store = useStore();

    const auth = computed(() => {
      return store.getters.authGetter;
    });
    const isPhone = computed(() => {
      return store.getters.getIsPhone;
    });
    const getAuth = () => {
      return auth.value;
    };
    const clearDatabaseVisible = ref(false);

    const changeclearDatabaseVisible = () => {
      if (clearDatabaseVisible.value == true) {
        clearDatabaseVisible.value = false;
      } else {
        clearDatabaseVisible.value = true;
      }
    };

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
      editRewardPre({
        auth: getAuth(),
        rewardValue: rewardFee.value + "",
      }).then((ress) => {
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
      });
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

    //用户详情类
    const accountSttus = ref(false);
    //创建界面
    const accountCreateVis = ref(false);
    const changeAccountVis = () => {
      if (accountCreateVis.value == true) {
        accountCreateVis.value = false;
      } else {
        accountCreateVis.value = true;
      }
    };
    //创建用户界面显示
    let localeNode = ref(null); //每次创建结束之后置空
    let accountNameC = ref("");
    const createAccountVis = (value?, drawer?) => {
      if (value != null) {
        localeNode.value = value;
      } else {
        localeNode.value = value;
      }
      changeAccountVis();
      if (drawer != null) {
        this.drawerFalse(drawer);
      }
    };
    //账户接口参数
    let accountInput = reactive({
      accountName: "",
      auth: getAuth(),
      nodeId: null,
      account: null,
    });

    const startCreateAccount = () => {
      if (accountNameC.value == "" || accountNameC.value == null) {
        accountInput.accountName = uuid("account");
      } else {
        accountInput.accountName = accountNameC.value;
      }
      accountInput.nodeId = localeNode.value;
      createAccount(accountInput).then((res) => {
        accountListId.push({
          accountName: res.account.accountName,
          accountId: res.account.accountId + "",
          targetNode: res.account.nodeId,
        });
        if (res.staus == 0) {
          ElMessageBox.alert(res.mes, "WARING", {
            confirmButtonText: "OK",
          });
        } else {
          ElMessage({
            message: res.mes,
            type: "success",
          });
        }
        changeAccountVis();
      });
    };
    //节点下用户列表
    let drwaerDateNodeAccount = reactive([
      {
        id: 1,
        address: "1CVrnHbS5qu6kSXFoCpwnCW1sqPQuaHhoJ",
        accountId: "Node1",
        transactions: 0,
        totalReceived: 0,
        totalSent: 0,
        balance: 0,
        walletId: 0,
        transactionId: "",
        nodeId: "",
        accountName: "sada",
      },
    ]);

    const AllAccountData = reactive([
      {
        accountName: "accountZPFt5g9U1iSlnJZj",
        address: "1E8KmeoiPD2jf6UHbcu9kbNE91jLCwn4bT",
        transactions: "1",
        totalReceived: "10",
        totalSent: "0",
        balance: "10",
      },
      {
        accountName: "accountZPFt5safasdiSlnJZj",
        address: "1E8KmeoiPD2jashgjfjsaE91jLCwn4bT",
        transactions: "1",
        totalReceived: "10",
        totalSent: "0",
        balance: "10",
      },
      {
        accountName: "accountZPFgwgsdfgU1iSlnJZj",
        address: "1E8KmeoiPD2jfasdgthfgd9kbNE91jLCwn4bT",
        transactions: "1",
        totalReceived: "10",
        totalSent: "0",
        balance: "10",
      },
    ]);

    const dialogAllAccountVisible = ref(false);

    const findAllAccount = () => {
      findAllAccountList(accountInput).then((res) => {
        AllAccountData.length = 0;
        for (let i = 0; i < res.length; i++) {
          AllAccountData.push(res[i]);
        }
      });
      let asd = AllAccountData;
      dialogAllAccountVisible.value = true;
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
            ElMessageBox.alert(
              "当前挖矿节点数量小于2,请添加新挖矿节点!",
              "WARING",
              {
                confirmButtonText: "OK",
              }
            );
          }
        });
      } else {
        ElMessageBox.alert(
          "当前区块或节点数量小于2,请添加新区块和节点!",
          "WARING",
          {
            confirmButtonText: "OK",
          }
        );
      }
    };
    //模拟区块传输
    const blockTranSim = (done: () => void) => {
      if (switchNetwork.value == true) {
        switchNetwork.value = false;
        this.removeAllNodeLink();
      }
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

        }
      });
    };

    //flowNode是否包含当前节点
    const flowNodeConNode = (flowNode, localNode) => {
      if (flowNode.length == 0) {
        return false;
      } else {
        for (let j = 0; j < flowNode.length; j++) {
          if (flowNode[j].nodeAddress == localNode) {
            return true;
          }
        }
        return false;
      }
    };

    //模拟区块传输数据处理部分
    const SimBlockTrans = (miner) => {
      getAllNetWork({ auth: getAuth() }).then((ress) => {
        const res = ress.preData;
        summaryMes[1].data = "1s";
        //循环次数
        let length = res.length;
        let allNode = [];
        let spreadNode = [];
        let flowNodeAdlist = [];
        let flowNode = [];
        let localOutbound = [];
        for (let i = 0; i < length; i++) {
          allNode.push(res[i].nodeAddress);
        }
        let targetLen = 0;
        //获取传输模拟数据
        while (allNode.length != 0) {
          targetLen++;
          let id = 0;
          if (spreadNode.length > 0) {
            let end = flowNodeConNode(flowNode, spreadNode[0]);
            if (!end) {
              id = getNodeId(spreadNode[0]) - 1;
              spreadNode.shift();
            } else {
              spreadNode.shift();
              continue;
            }
          } else {
            if (allNode.length == res.length) {
              id = getNodeId(miner) - 1;
            } else {
              spreadNode.push(allNode[0]);
              continue;
            }
          }
          let minerNodes = res[id].outbound;
          if (minerNodes != null && minerNodes != "") {
            localOutbound = minerNodes.split(",");
            flowNodeAdlist.push(localOutbound);
          }
          for (let i = 0; i < allNode.length; i++) {
            if (allNode[i] == res[id].nodeAddress) {
              if (i == 0) {
                allNode.shift();
              } else {
                allNode.splice(i, i);
              }
            }
            if (localOutbound.length != 0) {
              for (let k = 0; k < localOutbound.length; k++) {
                if (localOutbound[k] == allNode[i]) {
                  spreadNode.push(localOutbound[k]);
                  if (i == 0) {
                    allNode.shift();
                  } else {
                    allNode.splice(i, i);
                  }
                }
              }
            } else {
              break;
            }
          }
          flowNode.push({
            nodeAddress: res[id].nodeAddress,
            ouboundList: JSON.parse(JSON.stringify(localOutbound)),
          });

        }
        //开始模拟传输
        analogueTransmission(flowNode, miner);
      });
    };

    //开始模拟传输
    const analogueTransmission = (miner, localMiner) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Simulation",
        background: "rgba(255, 255, 255,0.2)",
      });
      setTimeout(() => {
        loading.close();
      }, 3000 * miner.length);
      for (let i = 0; i < miner.length; i++) {
        setTimeout(() => {
          this.visTargetNode(miner[i].nodeAddress);
          ElMessage({
            message: `节点` + miner[i].nodeAddress + `开始传输!`,
            type: "success",
          });
          for (let j = 0; j < miner[i].ouboundList.length; j++) {
            this.addNewNodeLink(miner[i].nodeAddress, miner[i].ouboundList[j]);
          }
          setTimeout(() => {
            this.disVisTargetNode(miner[i].nodeAddress);
            let nodeoutboundListStr = "";
            for (let j = 0; j < miner[i].ouboundList.length; j++) {
              if (j == 0) {
                nodeoutboundListStr = miner[i].ouboundList[j];
              } else {
                nodeoutboundListStr =
                  nodeoutboundListStr + "," + miner[i].ouboundList[j];
              }
              this.visTargetNode(miner[i].ouboundList[j]);
            }
            ElMessage({
              message: `节点` + nodeoutboundListStr + `成功接收区块消息!`,
              type: "success",
            });
            setTimeout(() => {
              for (let j = 0; j < miner[i].ouboundList.length; j++) {
                this.disVisTargetNode(miner[i].ouboundList[j]);
              }
              ElMessage({
                message: `节点` + miner[i].nodeAddress + `结束传输!`,
                type: "success",
              });
              this.removeAllNodeLink();
            }, 500);
          }, 1800);
          LogEvent("Node Transmit", miner[i].nodeAddress + "开始区块传输!");
        }, 3000 * i);
      }
      setTimeout(() => {
        ElMessage({
          message: `区块传输模拟结束!`,
          type: "success",
        });
        this.removeAllNodeLink();
        this.visTargetNode(miner[0].nodeAddress);
      }, 3000 * miner.length + 500);
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

    const powFindVisible = ref(false);

    //挖矿争夺模拟界面
    const powMinFindVisible = ref(false);
    const setPowMinFindVisible = (value) => {
      powMinFindVisible.value = value;
    };

    //所有挖矿节点集合
    const miningList = reactive([{ minPercentage: 0, name: "", perAddNum: 0 }]);
    //设0
    const miningListSetEm = () => {
      miningList.length = 0;
    };

    const miningListAdd = (val) => {
      miningList.push(val);
    };

    const perAddNumAdd = (val, index) => {
      if (val > 0) {
        miningList[index].perAddNum = val;
      } else {
        miningList[index].perAddNum = 0.5;
      }
    };

    const perAddNumIns = () => {
      let i = miningList;
      for (let index = 0; index < miningList.length; index++) {
        miningList[index].minPercentage =
          miningList[index].minPercentage + miningList[index].perAddNum;
      }
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
    const showFindBlockMes = reactive(["0", "0"]);

    const setShowFindBlockMes = (nonce, difficulty) => {
      showFindBlockMes[0] = nonce;
      showFindBlockMes[1] = difficulty;
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
      }, 600);//缩短时间
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
      // const graph = this.flowNodeGraph();
      const nodelistSize = accountListId.length;
      if (nodelistSize <= 1) {
        setTimeout(() => {
          ElMessageBox.alert("可供交易账户数量较少,请先创建账户!", "WARN", {
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
            value: accountListId[i].accountId,
            label: accountListId[i].accountName,
          });
        }
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
                this.setShowBlockMes(
                  "交易发起者" + res.inputAddressId + "确定交易内容"
                );
                this.increase();
                setTimeout(() => {
                  this.increase();
                  this.setShowBlockMes(
                    res.inputAddressId + "利用私钥对交易进行签名"
                  );
                  setTimeout(() => {
                    this.increase();
                    this.setShowBlockMes(
                      res.inputAddressId + "开始验证交易合法性!"
                    );
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
                                this.setShowBlockMes(" ");
                              }, 500);
                            }, 2000);
                          }, 2000);
                        }, 2000);
                      }, 2000);
                    }, 2000);
                  }, 2000);
                }, 2000);
              }, 2000);
            }, 2000);
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
          // ElMessage({
          //   message: "HashRate设置失败!",
          //   type: "warning",
          // });
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

    const dialogConWalletVisible = ref(false);

    const checkWallet = (walletId) => {
      findWalletCon({ walletId: walletId + "", auth: getAuth() }).then(
        (ress) => {
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
        }
      );
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
          ElMessageBox.alert(
            "输入ID未0时表示产生区块时的奖励输入!",
            "Message",
            {
              confirmButtonText: "OK",
            }
          );
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
      hash: [
        "000a6c2a3347ff2ef0a48ae2508716",
        "cfab42ae75b71d52ab36d2815ead9efa35",
      ],
      timestamp: "2022-02-16 23:15:09",
      confirmations: 1,
      miner: null,
      numOfTransac: null,
      difficulty: 1275840,
      nonce: 5316,
      transactionVolume: 0,
      reward: 10,
      feeReward: 0,
      prevBlockHash:
        "0000000000000000000000000000000000000000000000000000000000000000",
      transactionId: "",
    });
    let drwaerDateNode = reactive({
      id: 1,
      address: "1CVrnHbS5qu6kSXFoCpwnCW1sqPQuaHhoJ",
      addressId: null,
      nodeType: "fullNode",
      transactions: 0,
      totalReceived: 0,
      hashRate: 0,
      totalSent: 0,
      balance: 0,
      walletId: 0,
      transactionId: "",
      accountList: null,
      regionID: 0,
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
      // {
      //   tabName: "Account quantity:  ",
      //   data: "0",
      // },
    ]);
    //详情信息
    let eventMes = reactive([
      {
        eventName: "仿真准备:  ",
        data: "START!",
        name: 1,
      },
    ]);

    const LogEvent = (eventName, data) => {
      let lenght = eventMes[0].name + 1;
      setTimeout(() => {
        eventMes.unshift({
          eventName: eventName,
          data: data,
          name: lenght,
        });
      }, 100);
    };

    //节点网络的添加
    const nodeAddP2pNet = (addressId, connected, labelPositions) => {
      addP2pNet({
        addressId: addressId,
        auth: getAuth(),
        defaultConeect: connected + "",
        labelPosition: labelPositions,
      }).then((ress) => {
        const res = ress.preData[0];
        const localNetWork = ress.preData[1];
        if (res.success == "true") {
          if (res.addressId == "Node1") {
            ElMessage({
              message: "节点网络初始化!",
              type: "success",
            });
          } else {
            if (labelPositions == "Adaptive") {
              ElMessage({
                message: "节点网络添加成功!",
                type: "success",
              });
            }
            //可视化网络节点添加
            // this.localNetWorkAdd(localNetWork);
            // this.setNodeLists();
          }
          //Configure node network data in manual mode.
          configManualData(localNetWork);
        } else {
          ElMessage({
            message: "节点网络异常!",
            type: "warning",
          });
        }
      });
    };
    //Configure node network data in manual mode.
    const configManualData = (localNetWork) => {
      let opetionLen = parseInt((localNetWork.length - 1) / 5 + "");
      let nodeLength = localNetWork.length;
      if (opetionLen == 0) {
        options.length = 0;
        let childrens = [];
        state.tableData.length = 0;
        for (let i = 0; i < nodeLength; i++) {
          childrens.push({
            value: localNetWork[i].nodeAddress,
            label: localNetWork[i].nodeAddress,
            disabled: false,
          });
          state.tableData.push({
            node: localNetWork[i].nodeAddress,
            numConnect: localNetWork[i].numConnection,
            value: reactive([]),
            boundStr: "",
            options: [],
          });
        }
        options.push({
          value: "Node1~5",
          vaString: "",
          label: "Node1~5",
          disabled: false,
          children: childrens,
        });
        for (let i = 0; i < nodeLength; i++) {
          // let newoptions = options.concat();
          let newoptions = JSON.parse(JSON.stringify(options));
          for (let j = 0; j < nodeLength; j++) {
            if (newoptions[0].children[j].value == state.tableData[i].node) {
              newoptions[0].children[j].disabled = true;
              state.tableData[i].options = newoptions;
            }
          }
        }
        //级联选择器默认值添加localNetWork.outbound
        for (let i = 0; i < nodeLength; i++) {
          for (let j = 0; j < nodeLength; j++) {
            let sda = state;
            let outbounss = localNetWork[i].outbound;
            let targetsds = state.tableData[i].options[0].children[i].value;
            if (
              localNetWork[i].outbound != null &&
              localNetWork[i].outbound.indexOf(
                state.tableData[i].options[0].children[j].value
              ) != -1
            ) {
              let valuelist = [
                "Node1~5",
                state.tableData[i].options[0].children[j].value,
              ];
              state.tableData[i].value.push(valuelist);
            }
          }
        }
      } else {
        //后期改为插入更新
        options.length = 0;
        let childrens = [];
        let childrensList = [];
        state.tableData.length = 0;
        for (let i = 0; i < nodeLength; i++) {
          if (i % 5 == 0 && i != 0) {
            let neelist = JSON.parse(JSON.stringify(childrens));
            childrensList.push(neelist);
            childrens.length = 0;
          }
          childrens.push({
            value: localNetWork[i].nodeAddress,
            label: localNetWork[i].nodeAddress,
            disabled: false,
          });
          state.tableData.push({
            node: localNetWork[i].nodeAddress,
            numConnect: localNetWork[i].numConnection,
            value: [],
            boundStr: "",
            options: [],
          });
          //结束前讲剩余的数插入
          if (i == nodeLength - 1) {
            let neelist = JSON.parse(JSON.stringify(childrens));
            childrensList.push(neelist);
          }
        }
        for (let j = 0; j < childrensList.length; j++) {
          let targetValue = "Node" + (j * 5 + 1) + "~" + (j + 1) * 5;
          options.push({
            value: targetValue,
            vaString: "",
            label: targetValue,
            disabled: false,
            children: childrensList[j],
          });
        }
        for (let i = 0; i < nodeLength; i++) {
          let normali = 0;
          let newoptions = JSON.parse(JSON.stringify(options));
          for (let j = 0; j < nodeLength; j++) {
            if (j % 5 == 0 && j != 0) {
              normali++;
            }
            if (
              newoptions[normali].children[j % 5].value ==
              state.tableData[i].node
            ) {
              newoptions[normali].children[j % 5].disabled = true;
              state.tableData[i].options = newoptions;
            }
          }
        }
        //级联选择器默认值添加localNetWork.outbound
        for (let i = 0; i < nodeLength; i++) {
          let normali = 0;
          for (let j = 0; j < nodeLength; j++) {
            if (j % 5 == 0 && j != 0) {
              normali++;
            }

            if (
              localNetWork[i].outbound != null &&
              localNetWork[i].outbound.indexOf(
                state.tableData[i].options[normali].children[j % 5].value
              ) != -1
            ) {
              let valuelist = [
                state.tableData[i].options[normali].value,
                state.tableData[i].options[normali].children[j % 5].value,
              ];
              state.tableData[i].value.push(valuelist);
            }
          }
        }
      }
      state.tableHisData.length = 0;
      state.tableHisData = JSON.parse(JSON.stringify(state.tableData));
      state.tableChangeHisData = JSON.parse(JSON.stringify(state.tableData));
    };
    //仿真存在情况
    const simState = ref(false);
    //node创建流程
    //新建节点，并赋予节点类型
    const setNodeType = () => {
      // let node = document.getElementById("loacalBlockTraForNode1");
      // if(node!=null){
      //   node.style.display="inline-block";
      // }
      let nowNodeType = nodeTypeChoose;
      let nowNodeType1 = presentTypeNode;
      let nowNodeType2 = nowNodeType.value;
      if (nowNodeType.value == "miningNode") {
        hashRateVis.value = true;
      }

      let params = {
        auth: getAuth(),
        nodeType: nowNodeType.value,
      };
      const loading = ElLoading.service({
        lock: true,
        background: "rgba(0, 0, 0, 0.7)",
      });

      createNewNode(params).then((ress) => {
        setTimeout(() => {
          loading.close();
        }, 200);

        let graph = nodeCreateMes.graph;
        let coordinate = nodeCreateMes.coordinate;
        const res = ress.preData;
        if (res.nodeType == "miningNode") {
          accountListId.push({
            accountName: res.minerAccountName,
            accountId: res.accountList + "",
            targetNode: res.addressId,
          });
        }
        graph.addNode({
          width: 94,
          height: 30,
          coordinate,
          meta: {
            label: res.addressId,
            name: res.addressId,
            prop: "node",
            type: res.nodeType,
          },
        });
        //每次创建节点后，自适应状态会自动配置节点网络
        if (res.addressId != "Node1") {
          let connected = 4;
          if (checkNumber(networkForm.MaxOutbound)) {
            nodeAddP2pNet(
              res.addressId,
              networkForm.MaxOutbound,
              networkForm.labelPosition
            );
          } else {
            nodeAddP2pNet(res.addressId, connected, networkForm.labelPosition);
          }
        }
        LogEvent("create new " + res.addressId + ":", res.address);
        // const nodeListIdsdadsaa = this.nodeListId;

        const newNodelist = graph.nodeList;
        const presentNode = newNodelist[newNodelist.length - 1];
        presentNode.meta.name = res.addressId;
        // let presentNodsd=presentNode.id;
        presentNode.meta.name = res.addressId;
        nodeListId.push({
          lable: presentNode.meta.label,
          id: presentNode.id,
        });
        // if (presentNode.meta.prop == "node") {
        //         // let presentNodsd=presentNode.id;
        //         nodeListId.push({
        //           lable: presentNode.meta.label,
        //           id: presentNode.id,
        //         });
        //         const data = nodeListId.length;
        //         this.summaryMes[1].data = data;
        //       }
        const data = nodeListId.length;
        summaryMes[1].data = data + "";
        presentTypeNode.value = res.addressId;
        networkForm.recentlyNodeId = res.addressId;
        //延迟显示网络配置
        if (networkForm.firstStates == false) {
          networkForm.firstStates = true;
          setTimeout(() => {
            centerDialogVisible.value = true;
          }, 50);
        }

        // const newNodelistsda = this.$refs.superFlow.graph.nodeList;
      });
      simState.value = true;
      changeNodetype();
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
      let seeP2pTableData = state.tableData;
      for (let i = 0; i < seeP2pTableData.length; i++) {
        if (seeP2pTableData[i].value.length != 0) {
          let str = "";
          for (let j = 0; j < seeP2pTableData[i].value.length; j++) {
            if (j == 0) {
              str = seeP2pTableData[i].value[j][1];
            } else {
              str = str + "," + seeP2pTableData[i].value[j][1];
            }
          }
          seeP2pTableData[i].boundStr = str;
        }
      }
      dialogP2PNetVisible.value = true;
    };

    //所有utxo查看
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
    //账户不为空
    const isTargetListId = () => {
      let acList = accountListId;
      for (let i = 0; i < acList.length; i++) {
        let s = acList[i].targetNode;
        if (acList[i].targetNode != undefined && acList[i].targetNode != null) {
          return 1;
        }
      }
      return 0;
    };

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

    //switchNetwork改变之前的功能
    const switchNetwork = ref(false);
    const loading1 = ref(false); //加载
    const beforeSwitchNetworkChange = () => {
      loading1.value = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          loading1.value = false;
          // console.log(Date);
          return resolve(true);
        }, 1000);
      });
    };
    const visP2pNetCheck = () => {
      dialogP2PNetVisible.value = false;
      beforeSwitchNetworkChange();
      setTimeout(() => {
        switchNetwork.value = true;
        p2pSwitchChange(true);
      }, 1000);
    };

    const p2pSwitchChange = (val) => {
      if (val) {
        const loading = ElLoading.service({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)",
        });
        setTimeout(() => {
          loading.close();
        }, 1000);
        this.localNetWorkAdd(state.tableData);
        ElMessage.success("Visualization success");
      } else {
        this.removeAllNodeLink();
        ElMessage.success("Close visualization success");
      }
      // console.log(Date + "change");
      // console.log(val + "switch");
    };
    //地域修改
    const regionIdList = ref(false);
    const regionList = ref("0");
    const localNodeId = ref("0");
    const changeRegion = (regionId, addressId) => {
      regionIdList.value = true;
      localNodeId.value = addressId;
      regionList.value = regionId + "";
    };
    const startChangeRegion = () => {
      changeNodeRegion({
        auth: getAuth(),
        regionId: regionList.value,
        addressId: localNodeId.value,
        state: 1,
        mes: "1",
      }).then((ress) => {
        if (ress.state == 1) {
          ElMessage({
            message: "修改成功！",
            type: "success",
          });
          drwaerDateNode.regionID = ress.regionId;
        } else {
          ElMessage({
            message: "修改失败！",
            type: "warning",
          });
        }
        regionIdList.value = false;
      });
    };

    return {
      regionIdList,
      regionList,
      localNodeId,
      changeRegion,
      startChangeRegion,
      p2pSwitchChange,
      visP2pNetCheck,
      state,
      handleCloseNetConfig,
      submitForm,
      switchNetwork,
      loading1,
      beforeSwitchNetworkChange,
      timerFloat: null,
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      superFlowHeight: 538,
      SUMMARYHeight: 245,
      EVENTHeight: 230,
      leftFloat: 0,
      topFloat: 0,
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
            height: 40,
            meta: {
              label: "node1",
              prop: "node",
              name: "节点",
              type: "fullNode",
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
              type: "block",
            },
          },
        },
      ],

      graphMenu: [
        [
          {
            // 选项 label
            label: "新建节点",
            // 选项是否禁用
            // 选项选中后回调函数
            selected(graph, coordinate) {
              nodeCreateMes.graph = graph;
              nodeCreateMes.coordinate = coordinate;
              nodeType.value = true;
            },
          },
          {
            label: "创世块",
            disable(graph) {
              return !!graph.nodeList.find(
                (node) => node.meta.label === "GenesisBlock1"
              );
            },
            selected(graph, coordinate) {
              if (graph.nodeList.length > 0) {
                let ad = isTargetListId();
                if (accountListId.length > 0 && isTargetListId() == 1) {
                  createNewBlock({ auth: getAuth() }).then((ress) => {
                    const res = ress.preData;
                    // this.visLocalMinerNode(res);
                    let locllen = blockListId.length;
                    if (locllen > 0) {
                      let target = blockListId;
                      let localMiner = document.getElementById(
                        "loacalBlockTraFor" + target[locllen - 1].miner
                      );
                      if (
                        localMiner != null &&
                        localMiner.style.display == "inline-block"
                      ) {
                        localMiner.style.display = "none";
                      }
                    }
                    let minNOde = document.getElementById(
                      "loacalBlockTraFor" + res.miner
                    );
                    if (minNOde != null && minNOde.style.display == "none") {
                      minNOde.style.display = "inline-block";
                    }
                    openBlockCreate(res.miner);
                    graph.addNode({
                      width: 100,
                      height: 30,
                      coordinate,
                      meta: {
                        label: res.blockID,
                        name: res.blockID,
                        prop: "block",
                        type: "block",
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
                        miner: res.miner,
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
                    message:
                      "创建创世块前请先创建处于节点下的非空账户!(接收创世块交易奖励)",
                    type: "warning",
                  });
                }
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
              deleteNode({ addressId: node.meta.name, auth: getAuth() }).then(
                (ress) => {
                  const res = ress.preData;
                  if (res == true) {
                    node.remove();
                    LogEvent("delete : ", node.meta.name);
                  }
                }
              );
            },
          },
          {
            label: "查看",
            selected: (node) => {
              if (node.meta.prop == "node") {
                findNodeByAddressId({
                  addressId: node.meta.name,
                  auth: getAuth(),
                }).then((ress) => {
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
                    drwaerDateNode.accountList = res.accountList;
                    drwaerDateNode.regionID = res.regionID;
                    if (res.accountList != null && res.accountList != "") {
                      accountInput.accountName = res.accountList;
                      findAccountList(accountInput).then((res) => {
                        drwaerDateNodeAccount.length = 0;
                        for (let i = 0; i < res.length; i++) {
                          drwaerDateNodeAccount.push(res[i]);
                        }
                      });
                    }
                    let sue = drwaerDateNode;
                    this.drawerTrue("dialog2");
                    setPresentTypeNode(res.addressId);
                  }
                });
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
              // console.log("change");
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
      driver: null,
      isPhone,
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
      dialogConWalletVisible,
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
      setPowMinFindVisible,
      miningListAdd,
      miningListSetEm,
      powMinFindVisible,
      miningList,
      perAddNumAdd,
      setShowFindBlockMes,
      showFindBlockMes,
      perAddNumIns,
      clearDatabaseVisible,
      changeclearDatabaseVisible,
      accountSttus,
      drwaerDateNodeAccount,
      accountNameC,
      createAccountVis,
      accountInput,
      startCreateAccount,
      accountCreateVis,
      localeNode,
      AllAccountData,
      dialogAllAccountVisible,
      findAllAccount,
      isTargetListId,
      centerDialogVisible,
      networkForm,
      manualDialogVisible,
      handleCloseManualConfig,
      options,
      openmanualDialog,
      setUpP2pNet,
      outP2pNetManualSetting,
      handleChange,
      searchP2pData,
      filterTableData,
      changeFirstStatesFor,
      simState,
      regionData: reactive([
        "NORTH_AMERICA",
        "EUROPE",
        "SOUTH_AMERICA",
        "ASIA",
        "AFRICA",
        "OCEANIA",
      ]),
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
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.leftFloat = this.clientWidth - this.itemWidth - this.gapWidth;
    this.topFloat = this.clientHeight * this.coefficientHeight;
    window.addEventListener("scroll", this.handleScrollStart);
  },
  mounted() {
    //网络配置第一次显示初始化
    this.networkForm.firstStates = false;
    // console.info(this.networkForm.firstStates);
    //s标识表示simblock页面
    let params = {
      auth: this.getAuth(),
      guide: "s",
    };
    let screenWidth = document.body.clientWidth;
    let minSize = 1366;
    //手机端暂时不进行引导
    if (screenWidth < minSize) {
    } else {
      needGuide(params).then((res) => {
        if (res == true) {
          // console.log("start guide!!");
          this.guide();
        }
      });
    }
    //浮动说明面板位置定制
    let targetelements: HTMLElement = document.querySelector(".flow-container");
    let targetelementsPs: HTMLElement = document.querySelector(".midContent");
    let targeTop = targetelements.offsetTop + this.itemHeight / 2;
    let targeLeft =
      targetelements.clientWidth + targetelementsPs.offsetLeft - this.itemWidth;
    if (screenWidth < minSize) {
      targeTop += this.gapWidth + this.itemHeight / 2;
      targeLeft -= this.gapWidth;
    } else {
      let targetelementsP: HTMLElement =
        document.querySelector(".verticalContent");
      targeTop += targetelementsP.offsetTop;
      targeLeft += targetelementsP.offsetLeft;
    }

    this.leftFloat = targeLeft;
    this.topFloat = targeTop;
    let tsad = document.documentElement;

    document.addEventListener("mousemove", this.docMousemove);
    document.addEventListener("mouseup", this.docMouseup);

    //画布与图像高度配置
    if (this.isPhone) {
      let targetelements: HTMLElement = document.querySelector(".isPhone");
      this.superFlowHeight = targetelements.clientHeight * 0.85; //90
      this.SUMMARYHeight = targetelements.clientHeight * 0.43; //45
      this.EVENTHeight = targetelements.clientHeight * 0.32; //32
    } else {
      let targetelements: HTMLElement =
        document.querySelector(".verticalContent");
      this.superFlowHeight = targetelements.clientHeight * 0.8; //80
      this.SUMMARYHeight = targetelements.clientHeight * 0.38; //38
      this.EVENTHeight = targetelements.clientHeight * 0.35; //36
    }
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.docMousemove);
    document.removeEventListener("mouseup", this.docMouseup);
  },
  beforeRouteLeave(to, from, next) {
    let j = this.simState;
    if (j) {
      ElMessageBox.alert(
        "仿真进行中，您确定要退出当前界面吗？(仿真数据讲自动缓存)",
        "Alert",
        {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: "OK",
          callback: (action) => {
            next();
          },
        }
      );
    } else {
      next();
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScrollStart);
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
      // console.log("点击了节点 ");
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

    clearDatabase() {
      const nodegraph = this.$refs.superFlow.graph;
      // let user = auth.value;
      let params = {
        auth: this.getAuth(),
      };
      clearCache(params).then((ress) => {
        const res = ress.preData;
        if (res == true) {
          ElMessage({
            message: "清除数据成功!",
            type: "success",
          });
          nodegraph.nodeList.length = 0;
          nodegraph.linkList.length = 0;
          nodeListId.length = 0;
          blockListId.length = 0;
          this.changeFirstStatesFor(false);
          this.summaryMes = summaryMesUpdata;
          this.LogEvent("清除数据成功 ", null);
          const router = useRouter();
        } else {
          ElMessage.error("清除数据失败!");
        }
      });
      this.changeclearDatabaseVisible();
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
          Math.abs(clientX - conf.clientX) > 5 ||
          Math.abs(clientY - conf.clientY) > 5;
      }
    },
    //拖拽结束动作
    docMouseup({ clientX, clientY }) {
      const conf = this.dragConf;
      conf.isDown = false;

      if (conf.isMove) {
        const { top, right, bottom, left } =
          this.$refs.flowContainer.getBoundingClientRect();
        let graph = this.$refs.superFlow.graph;
        // 判断鼠标是否进入 flow container
        if (
          clientX > left &&
          clientX < right &&
          clientY > top &&
          clientY < bottom
        ) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          );

          // 添加节点或区块
          if (conf.info.meta.prop == "node") {
            nodeCreateMes.graph = graph;
            nodeCreateMes.coordinate = coordinate;
            let dci = nodeCreateMes;
            this.changeNodetype();
          } else {
            lastBlockCoordinate.length = 0;
            lastBlockCoordinate = coordinate;
            //是否存在节点
            const nodeEx = this.haveNodeMe(this.$refs.superFlow.graph);
            if (nodeEx) {
              //如果当前区块链长度为0
              if (blockListId.length == 0) {
                if (accountListId.length > 0 && this.isTargetListId() == 1) {
                  createNewBlock({ auth: this.getAuth() }).then((ress) => {
                    const res = ress.preData;
                    this.visLocalMinerNode(res);
                    this.openBlockCreate(res.miner);
                    this.$refs.superFlow.addNode({
                      width: 100,
                      height: 30,
                      coordinate,
                      meta: {
                        label: res.blockID,
                        name: res.blockID,
                        prop: "block",
                        type: "block",
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
                        miner: res.miner,
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
                        startId: blockListId[lengthblockListId - 1].id,
                        endId: blockListId[lengthblockListId - 2].id,
                        startAt: [0, 25],
                        endAt: [100, 24],
                        meta: {
                          start: blockListId[lengthblockListId - 2].label,
                          end: blockListId[lengthblockListId - 1].label,
                        },
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
                  ElMessage({
                    message:
                      "创建创世块前请先创建处于节点下的非空账户!(接收创世块交易奖励)",
                    type: "warning",
                  });
                }
              } else {
                findMinExist({ auth: this.getAuth() }).then((isExists) => {
                  let isExist = isExists.preData;
                  if (isExist === true) {
                    createNewBlock({ auth: this.getAuth() }).then((ress) => {
                      const res = ress.preData;
                      this.visLocalMinerNode(res);
                      this.openBlockCreate(res.miner);
                      this.$refs.superFlow.addNode({
                        width: 100,
                        height: 30,
                        coordinate,
                        meta: {
                          label: res.blockID,
                          name: res.blockID,
                          prop: "block",
                          type: "block",
                        },
                      });
                      this.LogEvent(
                        "create new " + res.blockID + ":",
                        res.hash
                      );
                      const nodeListIdsdadsaa = blockListId;
                      const newBlocklist = this.$refs.superFlow.graph.nodeList;
                      const presentBlock =
                        newBlocklist[newBlocklist.length - 1];
                      presentBlock.meta.name = res.blockID;
                      if (presentBlock.meta.prop == "block") {
                        // let presentNodsd=presentNode.id;
                        blockListId.push({
                          lable: presentBlock.meta.label,
                          id: presentBlock.id,
                          miner: res.miner,
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
                          startId: blockListId[lengthblockListId - 1].id,
                          endId: blockListId[lengthblockListId - 2].id,
                          startAt: [0, 25],
                          endAt: [100, 24],
                          meta: {
                            start: blockListId[lengthblockListId - 2].label,
                            end: blockListId[lengthblockListId - 1].label,
                          },
                        });
                        this.linkList = targetLinkList;
                      }

                      const data = blockListId.length;
                      this.summaryMes[2].data = data;
                      this.summaryMes[6].data =
                        1 + Number(this.summaryMes[6].data);
                      // this.$refs.superFlow.addNode({
                      //   coordinate,
                      //   ...conf.info,
                      // });
                    });
                  } else {
                    ElMessage({
                      message: "创建非创世块时请先创建挖矿节点.",
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
                  //提前设置竞争挖矿界面
                  this.setShowFindBlockMes(res.nonce, res.difficulty);
                  this.miningListSetEm();
                  const minerList = minerLists.preData[0];
                  //算力排序
                  const powList = minerLists.preData[1];
                  this.minerNodeSort(powList, res.miner);
                  let str = "";
                  for (let i = 0; i < minerList.length; i++) {
                    this.miningListAdd({
                      minPercentage: 0.5,
                      name: minerList[i],
                      perAddNum: 2.5,
                    });
                    str = str + " " + minerList[i];
                  }
                  for (let i = 0; i < powList.length; i++) {
                    for (let j = 0; j < minerList.length; j++) {
                      if (powList[i] == minerList[j]) {
                        this.perAddNumAdd(2.5 - i * 0.25, j);
                      }
                    }
                  }
                  this.setShowBlockMes("运行中的挖矿节点" + str);
                  setTimeout(() => {
                    //模拟竞争挖矿
                    this.setPowMinFindVisible(true);
                    this.increase();
                    this.setShowBlockMes(
                      "即将进入所有节点竞争挖矿模拟界面......"
                    );
                    setTimeout(() => {
                      //挖矿竞争界面处理perAddNumIns
                      for (let k = 1; k <= 40; k++) {
                        setTimeout(() => {
                          this.perAddNumIns();
                        }, k * 250);
                      }
                      this.increase();
                      setTimeout(() => {
                        this.setPowMinFindVisible(false);
                        this.increase();
                        this.setShowBlockMes(
                          "挖矿节点(" + res.miner + ")最先获取到记账权!"
                        );
                        setTimeout(() => {
                          this.increase();
                          this.setShowBlockMes(
                            "挖矿节点(" +
                              res.miner +
                              ")开始处理未确定交易等事务!"
                          );
                          setTimeout(() => {
                            this.increase();
                            this.setShowBlockMes(
                              res.miner +
                                "处理的未确定交易等事务id:" +
                                res.transactions
                            );
                            setTimeout(() => {
                              this.increase();
                              this.setShowBlockMes(res.miner + "处理完毕");
                              setTimeout(() => {
                                this.increase();
                                this.setShowBlockMes("区块产生中!");
                                setTimeout(() => {
                                  this.visLocalMinerNode(res);
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
                                      type: "block",
                                    },
                                  });
                                  this.LogEvent(
                                    "create new " + res.blockID + ":",
                                    res.hash
                                  );
                                  // const nodeListIdsdadsaa = blockListId;
                                  const newBlocklist =
                                    this.$refs.superFlow.graph.nodeList;
                                  const presentBlock =
                                    newBlocklist[newBlocklist.length - 1];
                                  presentBlock.meta.name = res.blockID;
                                  if (presentBlock.meta.prop == "block") {
                                    // let presentNodsd=presentNode.id;
                                    blockListId.push({
                                      lable: presentBlock.meta.label,
                                      id: presentBlock.id,
                                      miner: res.miner,
                                    });
                                  }
                                  if (this.summaryMes[3].data == "0") {
                                    this.summaryMes[3].data =
                                      presentBlock.meta.label;
                                  }
                                  this.summaryMes[4].data =
                                    presentBlock.meta.label;
                                  const newId = uuid("link");
                                  const lengthblockListId = blockListId.length;
                                  if (lengthblockListId >= 2) {
                                    const lengthLinklength =
                                      this.linkList.length;
                                    const targetLinkList = [];
                                    if (lengthLinklength > 0) {
                                      for (
                                        var i = 0;
                                        i < lengthLinklength;
                                        i++
                                      ) {
                                        targetLinkList.push(this.linkList[i]);
                                      }
                                    }
                                    targetLinkList.push({
                                      id: newId,
                                      startId:
                                        blockListId[lengthblockListId - 1].id,
                                      endId:
                                        blockListId[lengthblockListId - 2].id,
                                      startAt: [0, 25],
                                      endAt: [100, 24],
                                      meta: {
                                        start:
                                          blockListId[lengthblockListId - 2]
                                            .label,
                                        end: blockListId[lengthblockListId - 1]
                                          .label,
                                      },
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
                                    this.setShowBlockMes(" ");
                                  }, 2000);
                                }, 2000);
                              }, 2000);
                            }, 2000);
                          }, 2000);
                        }, 2000);
                      }, 11000);
                    }, 2000);
                  }, 2000);
                });
              }, 2000);
            });
          } else {
            this.setPowFindVisible(false);
            ElMessage({
              message: "创建非创世块时请先创建挖矿节点.",
              type: "warning",
            });
          }
        });
      } else {
        this.setPowFindVisible(false);
        ElMessage({
          message: "挖矿前请先创建挖矿节点或创世块.",
          type: "warning",
        });
      }
    },

    //模拟区块传输和交易传输时连线添加
    addNewNodeLink(start, end) {
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
        startAt: [100, 15],
        endAt: [0, 15],
        meta: { start: start, end: end },
      });
      this.linkList = targetLinkList;
    },
    //模拟区块传输和交易传输时连线删除
    removeNodeLink(start, end) {
      // console.log("remove:" + start + "-" + end);
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
        if (
          this.linkList[i].startId == startuuid &&
          this.linkList[i].endId == enduuid
        ) {
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
      let sdada = this.linkList;
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          if (this.linkList[i].meta.start.indexOf("Node") == -1) {
            targetLinkList.push(this.linkList[i]);
          } else {
            // console.log(
            //   "remove:" +
            //     this.linkList[i].startId +
            //     "-" +
            //     this.linkList[i].endId
            // );
          }
        }
      }
      this.linkList = targetLinkList;
    },
    //分叉链
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
            this.setShowFindBlockMes(res[0].nonce, res[0].difficulty);
            this.miningListSetEm();
            const minerList = minerLists.preData[0];
            const powList = minerLists.preData[1];
            this.minerNodeSort(powList, res[0].miner);
            this.minerNodeSort(powList, res[1].miner);
            let str = "";
            for (let i = 0; i < minerList.length; i++) {
              this.miningListAdd({
                minPercentage: 0.5,
                name: minerList[i],
                perAddNum: 2.5,
              });
              str = str + " " + minerList[i];
            }
            for (let i = 2; i < powList.length; i++) {
              for (let j = 0; j < minerList.length; j++) {
                if (powList[i] == minerList[j]) {
                  this.perAddNumAdd(2.5 - i * 0.25, j);
                }
              }
            }
            this.setShowBlockMes("运行中的挖矿 节点" + str);
            setTimeout(() => {
              this.increase();
              //模拟竞争挖矿
              this.setPowMinFindVisible(true);
              this.setShowBlockMes("即将进入所有节点竞争挖矿模拟界面......");
              setTimeout(() => {
                //挖矿竞争界面处理perAddNumIns
                for (let k = 1; k <= 40; k++) {
                  setTimeout(() => {
                    this.perAddNumIns();
                  }, k * 250);
                }
                this.increase();
                setTimeout(() => {
                  this.setPowMinFindVisible(false);
                  this.increase();
                  this.setShowBlockMes(
                    "挖矿节点(" +
                      res[0].miner +
                      "和" +
                      res[1].miner +
                      ")同时获取到记账权!"
                  );
                  setTimeout(() => {
                    this.increase();
                    this.setShowBlockMes(
                      "挖矿节点开始处理交易池内unconfirmed事务!"
                    );
                    setTimeout(() => {
                      this.increase();
                      this.setShowBlockMes(
                        "unconfirmed事务id:" +
                          res[0].transactions +
                          "," +
                          res[1].transactions
                      );
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
                            const start =
                              blockListId[lengthblockListId - 1].lable;
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
                              bifBlock1.blockID + " or " + bifBlock2.blockID;
                            this.summaryMes[2].data = data;
                            this.summaryMes[6].data =
                              1 + Number(this.summaryMes[6].data);
                            setTimeout(() => {
                              this.setPowFindVisible(false);
                              this.setShowBlockMes(" ");
                            }, 2000);
                          }, 2000);
                        }, 2000);
                      }, 2000);
                    }, 2000);
                  }, 2000);
                }, 11000);
              }, 2000);
            }, 2000);
          });
        }, 2000);
      }, 300);
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
          type: "block",
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
      // console.log("add:" + start + "-" + end);
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
        meta: { start: start, end: end },
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
        if (
          linkList[i].start.meta.prop === "node" &&
          linkList[i]._end.meta.prop
        ) {
          end.valueTrans1 = linkList[i].start.meta.label;
          end.valueTrans2 = linkList[i]._end.meta.label;
        }
      }
      return end;
    },
    minerNodeSort(list, miner) {
      list.unshift(miner);
      for (let i = 1; i < list.length; i++) {
        if (list[i] === miner) {
          list.splice(i, 1);
        }
      }
      let i = list;
      let g = list;
    },

    //网络节点连线添加
    localNetWorkAdd(list) {
      if (list.length <= 1) {
        return;
      } else {
        let localLinkList = this.linkList;
        for (let i = 0; i < list.length; i++) {
          if (list[i].value.length != 0) {
            for (let j = 0; j < list[i].value.length; j++) {
              this.bothWayLinkAdd(list[i].node, list[i].value[j][1]);
            }
          }
          // if (list[i].neighbourOne != null) {
          //   if (this.isLinkExist(list[i].nodeAddress, list[i].neighbourOne)) {
          //     this.bothWayLinkAdd(list[i].nodeAddress, list[i].neighbourOne);
          //   }
          //   if (list[i].neighbourTwo != null) {
          //     if (this.isLinkExist(list[i].nodeAddress, list[i].neighbourTwo)) {
          //       this.bothWayLinkAdd(list[i].nodeAddress, list[i].neighbourTwo);
          //     }
          //   }
          //   if (list[i].neighbourThree != null) {
          //     if (
          //       this.isLinkExist(list[i].nodeAddress, list[i].neighbourThree)
          //     ) {
          //       this.bothWayLinkAdd(
          //         list[i].nodeAddress,
          //         list[i].neighbourThree
          //       );
          //     }
          //   }
          // }
        }
        let linksada = this.$refs.superFlow.graph.linkList;
        let linksadasda = 1;
      }
    },
    isLinkExist(start, end, localLinkList) {
      for (let i = 0; i < localLinkList.length; i++) {
        let rqw = start === localLinkList[i].meta.start;
        let sdas = end === localLinkList[i].meta.end;
        if (
          start === localLinkList[i].meta.start &&
          end === localLinkList[i].meta.end
        ) {
          return false;
        } else if (
          end === localLinkList[i].meta.start &&
          start === localLinkList[i].meta.end
        ) {
          return false;
        }
      }
      return true;
    },
    bothWayLinkAdd(start, end) {
      let needBoth = false;
      if (start > end == true) {
        needBoth = true;
      }
      this.addNewBothNodeLink(start, end, needBoth);
    },
    addNewBothNodeLink(start, end, neddBoth?) {
      let startuuid = "";
      let enduuid = "";
      for (let i = 0; i < nodeListId.length; i++) {
        if (nodeListId[i].lable == start) {
          startuuid = nodeListId[i].id;
        } else if (nodeListId[i].lable == end) {
          enduuid = nodeListId[i].id;
        }
      }
      let newId = uuid("node" + end);
      let lengthLinklength = this.linkList.length;
      const difDist = [
        [100, 15],
        [50, 0],
        [50, 30],
      ];
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          targetLinkList.push(this.linkList[i]);
          if (start == this.linkList[i].meta.start) {
            for (let j = 0; j < difDist.length; j++) {
              if (
                difDist[j][0] == this.linkList[i].startAt[0] &&
                difDist[j][1] == this.linkList[i].startAt[1]
              ) {
                difDist.splice(j, 1);
              }
            }
          }
        }
      }
      if (this.isLinkExist(start, end, targetLinkList)) {
        targetLinkList.push({
          id: newId,
          startId: startuuid,
          endId: enduuid,
          startAt: difDist[0],
          endAt: [0, 15],
          meta: { start: start, end: end },
        });
        newId = uuid("node" + start);
        //   targetLinkList.push({
        //         id: newId,
        //         startId: enduuid,
        //         endId: startuuid,
        //         startAt: [0, 15],
        //         endAt: targetLinkList[i].startAt,
        //         meta: { start: start, end: end },
        //       });

        // if (neddBoth == false) {
        //   targetLinkList.push({
        //     id: newId,
        //     startId: startuuid,
        //     endId: enduuid,
        //     startAt: difDist[0],
        //     endAt: [0, 15],
        //     meta: { start: start, end: end },
        //   });
        // } else {
        lengthLinklength = targetLinkList.length;
        for (var i = 0; i < lengthLinklength; i++) {
          if (
            end == targetLinkList[i].meta.end &&
            targetLinkList[i].endAt[0] == 0 &&
            targetLinkList[i].endAt[1] == 15
          ) {
            targetLinkList.push({
              id: newId,
              startId: enduuid,
              endId: startuuid,
              startAt: [0, 15],
              endAt: targetLinkList[i].startAt,
              meta: { start: end, end: start },
            });
            break;
          }
        }
      }
      // }
      this.linkList = targetLinkList;
    },
    setNodeLists() {
      const lengthLinklength = this.linkList.length;
      nodeLinkListId.length = 0;
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          if (this.linkList[i].meta.start.indexOf("Node") != -1) {
            nodeLinkListId.push(this.linkList[i]);
          }
        }
      }
    },
    makeNodelistVis() {
      const lengthLinklength = this.linkList.length;
      const lengthnodeLinklength = nodeLinkListId.length;
      const targetLinkList = [];
      if (lengthLinklength > 0) {
        for (var i = 0; i < lengthLinklength; i++) {
          targetLinkList.push(this.linkList[i]);
        }
      }
      if (lengthnodeLinklength > 0) {
        for (var i = 0; i < lengthnodeLinklength; i++) {
          targetLinkList.push(nodeLinkListId[i]);
        }
      }
      this.linkList = targetLinkList;
    },
    guide() {
      // leftMenuGuide
      // flowMenuGuide
      // summaryGuide
      // eventMenuGuide
      this.$nextTick(function () {
        const steps = [
          {
            element: "#node1",
            popover: {
              title: "Tip",
              description: "仿真的开始需要先创建节点。",
              position: "bottom", //top
            },
          },
          {
            element: "#block1",
            popover: {
              title: "Tip",
              description: "节点的相应操作需要创建区块。",
              position: "bottom", //top
            },
          },
          {
            element: "#leftMenuGuide",
            popover: {
              title: "Tip",
              description: "节点和区块相应的操作栏。",
              position: "top", //top
            },
          },
          {
            element: "#clearDataGuide",
            popover: {
              title: "Tip",
              description: "清空所有缓存数据的功能按钮",
              position: "bottom", //top
            },
          },
          {
            element: "#flowMenuGuide",
            popover: {
              title: "Tip",
              description: "仿真主要容纳处,节点和区块创建可拖拽至此处。",
              position: "top", //top
            },
          },
          {
            element: "#summaryGuide",
            popover: {
              title: "Tip",
              description: "仿真过程中的概要信息显示在此处！",
              position: "bottom", //top
            },
          },
          {
            element: "#eventMenuGuide",
            popover: {
              title: "Tip",
              description: "仿真过程中的详情信息显示在此处！",
              position: "top", //top
            },
          },
        ];
        this.driver = new Driver({
          doneBtnText: "完成", // 结束按钮的文字
          animate: true, // 动画
          opacity: 0.55, // 遮罩层不透明度（0表示仅弹出且不覆盖）
          stageBackground: "#ffffff", // 突出显示元素的背景颜色
          nextBtnText: "下一步", // 下一步按钮的文字
          prevBtnText: "上一步", // 上一步按钮的文字
          closeBtnText: "关闭", // 关闭按钮的文字
        });
        this.driver.defineSteps(steps);
        this.driver.start();
      });
    },
    getVistargetBlock(res) {
      console.log("adsadjkasghdjkasgdkajshdakjhdka");
    },
    visLocalMinerNode(res) {
      let locllen = blockListId.length;
      if (locllen > 0) {
        let target = blockListId;
        let localMiner = document.getElementById(
          "loacalBlockTraFor" + target[locllen - 1].miner
        );
        if (localMiner != null && localMiner.style.display == "inline-block") {
          localMiner.style.display = "none";
        }
      }
      let minNOde = document.getElementById("loacalBlockTraFor" + res.miner);
      if (minNOde != null && minNOde.style.display == "none") {
        minNOde.style.display = "inline-block";
      }
    },
    visTargetNode(nodeId) {
      let localMiner = document.getElementById("loacalBlockTraFor" + nodeId);
      localMiner.style.display = "inline-block";
    },
    disVisTargetNode(nodeId) {
      let localMiner = document.getElementById("loacalBlockTraFor" + nodeId);
      localMiner.style.display = "none";
    },
    onBtnClicked() {
      this.$emit("onFloatBtnClicked");
    },
    handleScrollStart() {
      this.timerFloat && clearTimeout(this.timerFloat);
      this.timerFloat = setTimeout(() => {
        this.handleScrollEnd();
      }, 300);
      this.currentTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (this.leftFloat > this.clientWidth / 2) {
        this.leftFloat = this.clientWidth - this.itemWidth / 2;
      } else {
        this.leftFloat = -this.itemWidth / 2;
      }
    },
    handleScrollEnd() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        if (this.leftFloat > this.clientWidth / 2) {
          this.leftFloat = this.clientWidth - this.itemWidth - this.gapWidth;
        } else {
          this.leftFloat = this.gapWidth;
        }
        clearTimeout(this.timerFloat);
      }
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
  src: url("//at.alicdn.com/t/font_3114720_53ytv0qyp8e.woff2?t=1650037385345")
      format("woff2"),
    url("//at.alicdn.com/t/font_3114720_53ytv0qyp8e.woff?t=1650037385345")
      format("woff"),
    url("//at.alicdn.com/t/font_3114720_53ytv0qyp8e.ttf?t=1650037385345")
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
.icon-text {
  color: #000000;
  font-size: 13.5px;
  line-height: 100%;
  text-align: center;
}
.nodeCreateD {
  width: 60%;
  padding-left: 20%;
}
.fullNode {
  background-color: rgb(205, 254, 156);
}
.fullCreateNode {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgb(205, 254, 156);
}
.block {
  background-color: rgb(187, 187, 187);
}
.lightNode {
  background-color: aquamarine;
}
.lightCreateNode {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: aquamarine;
}
.miningNode {
  background-color: rgb(255, 153, 127);
}
.miningCreateNode {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgb(255, 153, 127);
}
.textEvent {
  width: 260px;
  height: auto;
  white-space: pre-line;
  overflow-wrap: break-word;
  /*就是下面这一句，好像网上没有这一个的说明，但是浏览器都支持*/
  word-break: break-word;
  word-wrap: break-word;
}
.textNode {
  padding-top: 20px;
  height: 30px;
  width: 100%;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
}
.textStatusNode {
  border-bottom-style: 1px solid var(--el-border-color);
  padding-top: 20px;
  height: 30px;
  width: 100%;
  text-align: center;
  line-height: 30px;
}
.demo-progress .el-progress--line {
  margin-bottom: 1px;
  width: 350px;
}
[class*="driver-close-btn"] {
  visibility: hidden;
}
.content-node-box {
  width: 85%;
  height: 23%;
  margin: 2%;
  font-size: 6px;
  color: #1f1f1f;
  line-height: 16px;
}
.switchNetwork {
  padding-right: 15px;
}
.loacalBlockForNode {
  height: 100%;
  width: 20px;
  background-color: #878787;
}
</style>

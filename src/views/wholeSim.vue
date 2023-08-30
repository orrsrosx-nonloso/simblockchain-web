<template>
  <el-row>
    <el-col :span="24">
      <el-dialog
        v-model="powFindVisible"
        title="仿真流程进行中!"
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
          <!-- <el-form :model="showBlockMes">
            <el-descriptions title="">
              <el-descriptions-item label="">
                <span style="font-size: 18px; font-weight: bold"
                  >仿真流程进行中！</span
                >
              </el-descriptions-item></el-descriptions
            ></el-form
          > -->
          <div></div>
        </div>
      </el-dialog>
      <el-dialog
        v-model="dialogDetailTransVisible"
        title="请选择交易id"
        width="20%"
      >
        <el-button
          v-for="item in targetTransData"
          type="text"
          @click="getOutputData(item)"
          >{{ item }}</el-button
        >
      </el-dialog>
      <div>
        <el-drawer
          v-model="innerDrawer"
          direction="rtl"
          title="交易列表"
          :append-to-body="true"
          size="75%"
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
                    v-if="getDataContain(scope.row.outputsId)"
                    type="text"
                    @click="getOutputData(scope.row.outputsId)"
                    >{{ scope.row.outputsId }}</el-button
                  >
                  <div v-if="!getDataContain(scope.row.outputsId)">
                    <el-button
                      v-for="item in targetTransData"
                      type="text"
                      @click="getOutputData(item)"
                      >{{ item }}</el-button
                    >
                  </div>
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
        <el-dialog
          v-model="dialogSearchDataVisible"
          width="840px"
          title="查询结果"
        >
          <el-table :data="searchMesList" height="300" style="width: 100%">
            <el-table-column prop="type" label="消息类型" width="200" />
            <el-table-column prop="mes" label="消息内容" width="200" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  v-if="
                    scope.row.type == 'tradeRecBlock' ||
                    scope.row.type == 'BlockTrade'
                  "
                  size="small"
                  @click="showBlockDetial(scope.row)"
                  >Check</el-button
                >
                <el-button
                  v-else
                  size="small"
                  @click="showNodeDetial(scope.row)"
                  >Check</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
              <el-descriptions title="交易详情" :column="1" border>
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
                  <el-button
                    type="text"
                    @click="getInputData(transData.inputId)"
                    >{{ transData.inputId }}</el-button
                  >
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
      </div>
      <div class="bs-sysMsg">
        <span style="font-weight: bold"
          ><span v-show="sysMesStates == false">区块和节点事件</span>
          <el-input
            v-show="sysMesStates == true"
            size="small"
            v-model="sysMesStatesContent"
            style="width: 65%"
            placeholder="输入想搜索的内容" />
          <!-- <el-button
            v-show="sysMesStates == false"
            type="text"
            size="small"
            round
            @click="sysMesStates = true"
          > -->
          <el-icon
            v-show="sysMesStates == false"
            @click="sysMesStates = true"
            :size="20"
            class="searchStartButton"
          >
            <Search />
          </el-icon>
          <!-- </el-button> -->
          <el-button
            v-show="sysMesStates == true"
            type="text"
            size="small"
            round
            @click="searTargetMesList"
          >
            搜索 </el-button
          ><el-icon
            v-show="sysMesStates == true"
            @click="sysMesStates = false"
            class="closebold"
            ><CloseBold /></el-icon
        ></span>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="1">
            <template #title>
              <el-carousel
                style="width: 100%"
                height="49px"
                direction="vertical"
                indicator-position="none"
                :autoplay="false"
                :interval="1000"
              >
                <!-- <el-carousel-item v-for="item in systemMsgNode" :key="item.id">
                <span>{{ item.title }}</span>
              </el-carousel-item> -->
                <el-carousel-item>
                  <span>点击查看节点消息</span>
                </el-carousel-item>
              </el-carousel>
              <!-- <span>点击查看节点消息</span> -->
            </template>
            <!-- <c-scrollbar maxHeight="100%" trigger="hover"> -->
            <c-scrollbar maxHeight="280px" height="280px" trigger="hover">
              <div v-for="item in nodeMesVisList" class="event-content">
                <div class="event-mes-block-node">
                  {{ item.mes }}
                </div>
                <!-- <el-icon :size="18" class="iconfont">
                    <Edit />
                  </el-icon> -->
                <div class="event-detail" @click="showNodeDetial(item)">
                  <el-icon class="event-detail-buttom"><MoreFilled /></el-icon>
                </div>
              </div>
            </c-scrollbar>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <el-carousel
                style="width: 100%"
                height="49px"
                direction="vertical"
                indicator-position="none"
                :autoplay="true"
                :interval="1000"
              >
                <!-- <el-carousel-item v-for="item in systemMsgBlock" :key="item.id">
                <span>{{ item.title }}</span>
              </el-carousel-item> -->
                <el-carousel-item>
                  <span>点击查看区块消息</span>
                </el-carousel-item>
              </el-carousel>
              <!-- <span>点击查看区块消息</span> -->
            </template>
            <c-scrollbar maxHeight="280px" height="280px" trigger="hover">
              <div v-for="item in blockMesVisList" class="event-content">
                <div class="event-mes-block-node">
                  {{ item.mes }}
                </div>
                <!-- <el-icon :size="18" class="iconfont">
                    <Edit />
                  </el-icon> -->
                <div class="event-detail" @click="showBlockDetial(item)">
                  <el-icon class="event-detail-buttom"><MoreFilled /></el-icon>
                </div>
              </div>
            </c-scrollbar>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 当前用户仿真数据获取 -->
      <el-dialog v-model="simDataeVisible" title="仿真记录" width="36%">
        <el-table :data="blockDataTableData" style="width: 100%">
          <el-table-column prop="id" label="Id" width="60" />
          <el-table-column prop="numOfNodes" label="NumOfNode" width="130" />
          <el-table-column prop="numOfBlocks" label="NumOfBlock" width="130" />
          <el-table-column prop="simEndTime" label="EndTime" width="200" />
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="simDataeVisible = false">Cancel</el-button>
            <!-- <el-button type="primary" @click="dialogNodeVisible = false"
            >Confirm</el-button
          > -->
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogNodeVisible" title="详情" width="30%">
        <el-form :model="nodeMesData">
          <el-descriptions :column="1" border>
            <el-descriptions-item
              label="消息类型"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ nodeMesData.type }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息简略信息"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ nodeMesData.mes }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息状态"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ nodeMesData.state }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息发起节点"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ nodeMesData.from }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息接收节点"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ nodeMesData.to }}</el-descriptions-item
            >
            <el-descriptions-item
              label="发生时间"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-date-picker
                v-model="nodeMesData.timestamp"
                size="large"
                type="datetime"
                placeholder="选择结束时间"
                :disabled="true"
              />
            </el-descriptions-item>
            <el-descriptions-item
              label="交易id"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-button
                type="text"
                @click="findDetailTrans(nodeMesData.transactionId)"
                >{{ nodeMesData.transactionId }}</el-button
              >
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogNodeVisible = false">Cancel</el-button>
            <!-- <el-button type="primary" @click="dialogNodeVisible = false"
            >Confirm</el-button
          > -->
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogBlockVisible" title="详情" width="50%">
        <el-form :model="blockMesData">
          <el-descriptions :column="2" border>
            <el-descriptions-item
              label="消息类型"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.type }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息简略信息"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.mes }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息状态"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.state }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息发起节点"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.from }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息接收节点"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.to }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息传输时间"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.tradeTime }}</el-descriptions-item
            >
            <el-descriptions-item
              label="传输区块ID"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.blockId }}</el-descriptions-item
            >
            <el-descriptions-item
              label="传输区块HASH"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.blockHash }}</el-descriptions-item
            >
            <el-descriptions-item
              label="当前区块高度"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ blockMesData.blockHeight }}</el-descriptions-item
            >
            <el-descriptions-item
              label="发生时间"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-date-picker
                v-model="blockMesData.timestamp"
                size="large"
                type="datetime"
                placeholder="选择结束时间"
                :disabled="true"
              />
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogBlockVisible = false">Cancel</el-button>
            <!-- <el-button type="primary" @click="dialogBlockVisible = false"
            >Confirm</el-button
          > -->
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogCreateVisible" title="详情" width="30%">
        <el-form :model="createMesData">
          <el-descriptions :column="1" border>
            <el-descriptions-item
              label="消息类型"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ createMesData.type }}</el-descriptions-item
            >
            <el-descriptions-item
              label="消息简略信息"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ createMesData.mes }}</el-descriptions-item
            >
            <el-descriptions-item
              label="区块挖掘难度"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ createMesData.blockDif }}</el-descriptions-item
            >

            <el-descriptions-item
              label="矿工节点"
              label-align="left"
              align="left"
              min-width="100px"
              >{{ createMesData.miner }}</el-descriptions-item
            >
            <el-descriptions-item
              label="发生时间"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-date-picker
                v-model="createMesData.timestamp"
                size="large"
                type="datetime"
                placeholder="选择结束时间"
                :disabled="true"
              />
            </el-descriptions-item>
            <el-descriptions-item
              label="挖矿奖励交易"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-button
                type="text"
                @click="findDetailTrans(createMesData.minerReward)"
                >{{ createMesData.minerReward }}</el-button
              >
            </el-descriptions-item>
            <el-descriptions-item
              label="是否分叉块"
              label-align="left"
              align="left"
              min-width="100px"
            >
              {{ createMesData.isOrphan }}
            </el-descriptions-item>
            <el-descriptions-item
              label="认证交易列表"
              label-align="left"
              align="left"
              min-width="100px"
            >
              <el-button
                type="text"
                @click="findDetailTrans(createMesData.transactionId)"
                >{{ createMesData.transactionId }}</el-button
              >
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">Cancel</el-button>
            <!-- <el-button type="primary" @click="dialogBlockVisible = false"
            >Confirm</el-button
          > -->
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogNodeDetailVisible" title="节点详情" width="50%">
        <el-form :model="dodeDetailMesData">
          <div
            style="
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
            "
          >
            <div class="nodeDetail1">
              <el-descriptions :column="1" border title="节点详情">
                <el-descriptions-item
                  label="节点ID"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{ dodeDetailMesData.addressId }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="节点类型"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{ dodeDetailMesData.nodeType }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="节点地域"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  v-model="regionData"
                  >{{
                    regionData[dodeDetailMesData.regionId]
                  }}</el-descriptions-item
                >
                <el-descriptions-item
                  v-if="dodeDetailMesData.nodeType == `miningNode`"
                  label="节点算力"
                  label-align="center"
                  align="center"
                  >{{ dodeDetailMesData.hashRate }} kH/s</el-descriptions-item
                >
              </el-descriptions>
            </div>
            <div class="nodeDetail1Account">
              <el-descriptions :column="2" border title="账户详情">
                <el-descriptions-item
                  label="账户ID"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{
                    dodeDetailMesData.accountList.accountId
                  }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Transactions"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{
                    dodeDetailMesData.accountList.transactions
                  }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="Total Received"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{
                    dodeDetailMesData.accountList.totalReceived
                  }}</el-descriptions-item
                ><el-descriptions-item
                  label="Total Sent"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{
                    dodeDetailMesData.accountList.totalSent
                  }}</el-descriptions-item
                ><el-descriptions-item
                  label="Final Balance"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{
                    dodeDetailMesData.accountList.balance
                  }}</el-descriptions-item
                ><el-descriptions-item
                  label="Wallet Id"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  >{{ dodeDetailMesData.accountList.walletId.walletId
                  }}<el-button
                    type="text"
                    @click="
                      checkWallet(
                        dodeDetailMesData.accountList.walletId,
                        dodeDetailMesData.accountList.address
                      )
                    "
                    >查看</el-button
                  ></el-descriptions-item
                ><el-descriptions-item
                  label="交易列表ID"
                  label-align="left"
                  align="left"
                  min-width="100px"
                  ><div
                    v-if="dodeDetailMesData.accountList.transactionsId != ``"
                  >
                    <el-tooltip
                      v-if="dodeDetailMesData.nodeType == `lightNode`"
                      content="轻节点内账户的交易信息需要通过其他全节点查询!"
                      placement="top"
                      ><el-button
                        size="small"
                        @click="
                          findDetailTrans(
                            dodeDetailMesData.accountList.transactionsId
                          )
                        "
                        round
                        >查询交易
                      </el-button>
                    </el-tooltip>
                  </div>
                  <el-button
                    v-if="dodeDetailMesData.nodeType != `lightNode`"
                    type="text"
                    @click="
                      findDetailTrans(
                        dodeDetailMesData.accountList.transactionsId
                      )
                    "
                    >{{
                      dodeDetailMesData.accountList.transactionsId
                    }}</el-button
                  ></el-descriptions-item
                >
              </el-descriptions>
            </div>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogNodeDetailVisible = false"
              >Cancel</el-button
            >
            <!-- <el-button type="primary" @click="dialogBlockVisible = false"
            >Confirm</el-button
          > -->
          </span>
        </template>
      </el-dialog>
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
      <div class="reStarteSim">
        <el-button type="primary" @click="reStartSim" plain>再次仿真</el-button>
      </div>
      <div class="simDataGet">
        <el-button @click="simDataGetlist5" plain>仿真记录</el-button>
      </div>
      <div class="wholeSimTeamstamp" style="color: #916b0a">
        <!-- <el-button
          style="color: rgb(87, 75, 0)"
          type="text"
          v-model="simFlowTime"
          disabled
          @click="reStartSim"
          >虚拟时间进度:{{ simFlowTime.timeString }}</el-button
        > -->
        <span>虚拟时间进度:</span
        >
        <el-date-picker
          v-model="simFlowTime.timeData"
          size="large"
          type="datetime"
          placeholder="选择结束时间"
          :disabled="true"
        />
      </div>
      <div class="wholeSimNodeMes" style="color: #916b0a">
        <el-select
          v-model="valueNode"
          :disabled="valueNodeStatue"
          filterable
          placeholder="节点详情"
          @change="optionsNodeChange"
        >
          <el-option
            v-for="item in optionsNode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="bs-sysMsg-summary">
        <span style="font-weight: bold">总览</span>
        <el-collapse v-model="activeSumName" accordion>
          <el-collapse-item name="1">
            <template #title>
              <el-carousel
                style="width: 100%"
                height="49px"
                direction="vertical"
                indicator-position="none"
                :autoplay="true"
              >
                <!-- <el-carousel-item v-for="item in systemMsgBlock" :key="item.id">
                <span>{{ item.title }}</span>
              </el-carousel-item> -->
                <el-carousel-item>
                  <span>点击查看总览信息</span>
                </el-carousel-item>
              </el-carousel>
            </template>
            <el-scrollbar height="280px">
              <div class="summary-content">
                <div v-for="o in summaryMes">
                  {{ o.tabName + o.data }}
                </div>
              </div>
            </el-scrollbar>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog
        v-model="dialogWholeSimVisible"
        :title="t('WholeSimSeting')"
        width="76%"
        :close-on-click-modal="false"
        center
      >
        <el-card>
          <el-steps
            style="display: flex; justify-content: center"
            :space="200"
            :active="activeIndex - 0"
            align-center
            finish-status="success"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="节点配置"></el-step>
            <el-step title="区块配置"></el-step>
            <el-step title="网络配置"></el-step>
            <el-step title="完成配置"></el-step>
          </el-steps>
          <div class="cardContent">
            <div class="mesBox" v-show="activeIndex == 0">
              <div v-show="activeIndex == 0">
                <h2>
                  {{ t("wholeSimStartMes") }}
                </h2>

                <div class="dataImport">
                  <!-- <el-button type="primary" size="large">导入数据</el-button> -->
                </div>
              </div>
            </div>
            <div class="mesBox" v-show="activeIndex == 4">
              <div v-show="activeIndex == 4">
                <h2>
                  配置完相关参数后点击创建,全流程仿真系统会自动开始对预设仿真,当仿真区块链高度达到目标高度时会自动结束仿真。
                </h2>
                <div class="dataImport">
                  <!-- <el-button type="primary" size="large">导入数据</el-button> -->
                  <el-button type="primary" @click="nextEnd"
                    >直接获取仿真结果</el-button
                  >
                </div>
              </div>
            </div>
            <div
              class="cardSeting"
              v-show="activeIndex != 0 && activeIndex != 4"
            >
              <div v-show="activeIndex == 1">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="120px"
                >
                  <el-form-item :label="t('Numberofnodes')">
                    <el-input-number
                      v-model="WholeSimData.numOfNodes"
                      :min="100"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item :label="t('NumberofNeighbor')">
                    <el-input-number
                      v-model="WholeSimData.numOfMaxOutBound"
                      :min="4"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="矿工平均算力(kH/s)">
                    <el-input-number
                      v-model="WholeSimData.averageMiningPower"
                      :min="2000"
                      :step="1000"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="节点地域分布">
                    <el-tooltip
                      :content="`NA: ` + WholeSimData.regionList.na"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success">NA</el-tag>
                    </el-tooltip>
                    <el-tooltip
                      :content="`EU: ` + WholeSimData.regionList.eu"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success"
                        >EU</el-tag
                      > </el-tooltip
                    ><el-tooltip
                      :content="`SA: ` + WholeSimData.regionList.sa"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success"
                        >SA</el-tag
                      > </el-tooltip
                    ><el-tooltip
                      :content="`AS: ` + WholeSimData.regionList.as"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success"
                        >AS</el-tag
                      > </el-tooltip
                    ><el-tooltip
                      :content="`AF: ` + WholeSimData.regionList.af"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success"
                        >AF</el-tag
                      > </el-tooltip
                    ><el-tooltip
                      :content="`OA: ` + WholeSimData.regionList.oa"
                      placement="top"
                      effect="light"
                    >
                      <el-tag class="ml-2" type="success">OA</el-tag>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="activeIndex == 2">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="160px"
                >
                  <el-form-item label="区块高度">
                    <el-input-number
                      v-model="WholeSimData.numOfEndBlock"
                      :min="1"
                      size="small"
                      @change="
                        (currentValue, oldValue) => {
                          dateTimeChange(currentValue, oldValue, 0);
                        }
                      "
                    />
                  </el-form-item>
                  <el-form-item label="区块内交易量级">
                    <el-input-number
                      v-model="WholeSimData.numOfTransInblock"
                      :min="10"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="共识算法">
                    <el-select
                      style="top: 2px; left: 0px; width: 120"
                      v-model="WholeSimData.consensusAlgorithm"
                      placeholder="共识算法选择"
                      size="small"
                    >
                      <el-option
                        v-for="item in optionsAlgorithm"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易手续费占比">
                    <el-input-number
                      v-model="WholeSimData.transRePer"
                      :min="0.001"
                      :step="0.001"
                      :max="1"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="分叉率">
                    <el-input-number
                      v-model="WholeSimData.orphanBlock"
                      :min="0.0001"
                      :max="0.05"
                      :step="0.0001"
                      size="small"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="activeIndex == 3">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="160px"
                >
                  <el-form-item
                    label="网络上行带宽(kb/s)"
                    style="margin-bottom: 10px"
                  >
                    <div>
                      NA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.na"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      EU:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.eu"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>

                    <div>
                      SA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.sa"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      AS:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.as"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>
                    <div>
                      AF:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.af"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      OA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeUploadBandwidth.oa"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="网络下行带宽(kb/s)">
                    <div>
                      NA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.na"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      EU:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.eu"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>

                    <div>
                      SA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.sa"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      AS:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.as"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>
                    <div>
                      AF:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.af"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                      OA:
                      <el-input-number
                        style="width: 35%"
                        v-model="WholeSimData.wholeDownloadBandwidth.oa"
                        :min="10"
                        size="small"
                        controls-position="right"
                      />
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div
              class="cardSeting2"
              v-show="activeIndex != 0 && activeIndex != 4"
            >
              <div v-show="activeIndex == 1">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="160px"
                >
                  <!-- <el-form-item label="节点默认账户量">
                <el-input-number
                  v-model="WholeSimData.defaultAccount"
                  :min="1"
                  :max="10"
                  size="small"
                />
              </el-form-item> -->

                  <el-form-item label="邻居节点发现间隔(ms)">
                    <el-input-number
                      v-model="WholeSimData.neighborDiscoveryInterval"
                      :min="100"
                      :step="10"
                      :max="10000"
                      size="small"
                    />
                  </el-form-item>
                  <!--节点可能会随时加入或退出系统，导致委员会组成会随着时间而改变。-->
                  <el-form-item label="节点流失率">
                    <el-input-number
                      v-model="WholeSimData.nodeChurnRate"
                      :min="0"
                      :max="1"
                      :step="0.001"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="节点类型(全节点、轻节点、挖矿节点)">
                    <el-input-number
                      v-model="WholeSimData.nodeTypRate[0]"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      size="small"
                      @change="nodeTypechange"
                      controls-position="right"
                    />
                    <el-input-number
                      v-model="WholeSimData.nodeTypRate[1]"
                      style="margin-left: 10px"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      size="small"
                      @change="nodeTypechange"
                      controls-position="right"
                    />
                    <el-input-number
                      v-model="WholeSimData.nodeTypRate[2]"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      size="small"
                      :disabled="true"
                      controls-position="right"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="activeIndex == 2">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="160px"
                >
                  <el-form-item label="最大块大小(KB)">
                    <el-input-number
                      v-model="WholeSimData.maxBlockSize"
                      :min="1000"
                      :step="1000"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="区块生成间隔(ms)">
                    <el-input-number
                      v-model="WholeSimData.blockTime"
                      :min="2000"
                      :step="1000"
                      size="small"
                      @change="
                        (currentValue, oldValue) => {
                          dateTimeChange(currentValue, oldValue, 1);
                        }
                      "
                    />
                    <el-button type="text" v-model="simDataGapTime" disabled
                      >虚拟:{{ simDataGapTime }} min</el-button
                    >
                  </el-form-item>
                  <el-form-item label="新块共识奖励">
                    <el-input-number
                      v-model="WholeSimData.blockReward"
                      :min="1"
                      :step="1"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="仿真虚拟预结束时间">
                    虚拟:
                    <el-date-picker
                      v-model="simDataEndtime"
                      type="datetime"
                      placeholder="选择结束时间"
                      :disabled="true"
                      @change="wholeSimDataChange"
                    />
                    <div></div>
                    实际:
                    <el-date-picker
                      v-model="WholeSimData.simEndTime"
                      type="datetime"
                      placeholder="选择结束时间"
                      :disabled="true"
                      @change="wholeSimDataChange"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="activeIndex == 3">
                <el-form
                  :model="WholeSimData"
                  class="demo-form-inline"
                  label-width="160px"
                >
                  <el-form-item label="跨地区上下行带宽(kb/s)">
                    <el-input-number
                      v-model="WholeSimData.transRegionalBandwidth"
                      :min="1000"
                      :step="1000"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="地区延迟列表(ms)">
                    <el-button
                      type="primary"
                      @click="dialogWholeLatencyVisible = true"
                    >
                      <el-icon :size="18" class="iconfont">
                        <Edit />
                      </el-icon>
                    </el-button>
                  </el-form-item>
                  <el-form-item label="流失节点网络故障率">
                    <el-input-number
                      v-model="WholeSimData.churnNodeFailureRate"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="控制(非流失)节点网络故障率">
                    <el-input-number
                      v-model="WholeSimData.controllerNodeFailureRate"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      size="small"
                    />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-card>
        <template #footer>
          <span class="dialog-footer">
            <el-button v-if="activeIndex != 0" @click="activeIndex--">{{
              t("PreviousStep")
            }}</el-button>
            <el-button
              type="primary"
              @click="next"
              v-text="activeIndex == 4 ? t('create') : t('NextStep')"
            ></el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        v-model="dialogWholeLatencyVisible"
        title="地区延迟列表配置"
        width="63%"
        :close-on-click-modal="false"
        center
      >
        <el-table :data="WholeSimData.regionLatency" style="width: 100%">
          <el-table-column label="地区" width="70">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span style="font-weight: bold; color: #909399">{{
                  scope.row.name
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="NA" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[0]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="EU" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[1]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="SA" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[2]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="AS" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[3]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="AF" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[4]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="OA" width="130">
            <template #default="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.latency[5]"
                :min="1"
                :step="10"
                size="small"
                controls-position="right"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-col>
  </el-row>

  <!-- <div class="wholeSimSlider">
    <el-slider
      :max="maxSloderValue"
      class="sliderbox"
      v-model="wholeSimSliderValue"
    />
  </div> -->
  <div
    v-loading="boxLoading"
    :element-loading-text="loadingValue"
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    style="width: 100%"
    class="map-content"
  >
    <!-- <el-button @click="redrsad">ssadadada</el-button> -->

    <div id="china-map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import JSONMAP from "../assets/mapRow/world.json";
import { useI18n } from "vue-i18n";
import { Edit, MoreFilled, View, Search, CloseBold } from "@element-plus/icons";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { computed } from "vue";
import * as math from "mathjs";
import { ElLoading } from "element-plus";
import { getRandomPosition } from "../wholesim/mapPosition";
import { sha256 } from "js-sha256";
import { getTargetDataStr, getDataString, getSign } from "../utils/utils";

import {
  configWholeSettingData,
  configWholeNodeData,
  configWholeSettingEndData,
  configWholeBlockMes,
  getConfigSimData,
} from "../api/apis";
// import * as  bitcoin from 'bitcoinjs-lib';
import { nodeCreated } from "../wholesim/wholeNode";
import {
  blockMesListCreate,
  affairsMesListCreate,
} from "../wholesim/wholeBlockAndMes";
import { config } from "mathjs";

export default {
  components: {
    Edit,
    View,
    MoreFilled,
    Search,
    CloseBold,
  },
  data() {
    //数据总览
    let summaryMes = reactive([
      {
        tabName: "仿真开始时间:  ",
        data: "0",
      },
      {
        tabName: "仿真虚拟预结束时间:  ",
        data: "0",
      },
      {
        tabName: "节点数量:  ",
        data: "0",
      },
      {
        tabName: "当前区链高度:  ",
        data: 0,
      },
      {
        tabName: "交易发生次数:  ",
        data: 0,
      },
      {
        tabName: "共识奖励:  ",
        data: "0",
      },
      {
        tabName: "交易中介费:  ",
        data: "0%",
      },
      {
        tabName: "账户数量:  ",
        data: "0",
      },
      {
        tabName: "默认产块时间单位:  ",
        data: "10"
      },
    ]);
    //
    let nodeMesVisList = reactive([
      {
        id: 0,
        content: "节点消息创建",
        mes: "节点消息创建",
        type: "normalMes",
        contentMessage: {
          blockDetail: { blockId: "", blockHeight: "", blockHash: "" },
          tradeTime: "",
          content: { id: null, mes: "区块消息创建" },
          id: null,
          type: "normalMes",
          isOrphan: "false",
          from: "1",
          to: "2",
          miner: "0",
          confirmId: null,
          transactionId: "0",
        },
      },
    ]);
    let blockMesVisList = reactive([
      {
        id: 0,
        content: { mes: "区块消息创建" },
        mes: "节点消息创建",
        type: "normalMes",
        contentMessage: {
          blockDetail: { blockId: "", blockHeight: "", blockHash: "" },
          tradeTime: "",
          content: { id: null, mes: "区块消息创建", blockId: "" },
          id: null,
          type: "normalMes",
          from: "1",
          to: "2",
          miner: "0",
          confirmId: null,
          isOrphan: "false",
          transactionId: "0",
        },
      },
    ]);
    //各类信息长度变化
    const kindMesLen = reactive({
      tradeMesLen: 0,
      RecMesLen: 0,
      transMesLen: 0,
    });
    //交易列表
    let transactionsList = reactive({
      transactions: [],
      input: [],
      output: [],
    });
    //未确定交易列表
    let unconfirmedTransactions = reactive({
      transactions: [],
      input: [],
      output: [],
    });
    //区块传输消息标识(失败状态)
    let blockTransmitMes = reactive([]);
    //用户获取
    const store = useStore();

    const auth = computed(() => {
      return store.getters.authGetter;
    });
    const getAuth = () => {
      return auth.value;
    };
    //全流程仿真相关参数
    //区块链分叉bitconin = 0.58% litecoin:0.30,dogecoin:0.80
    const wholeSimSliderValue = ref(0);
    const maxSloderValue = ref(40000);
    const simDataGapTime = ref(10);
    const simDataEndtime = reactive(new Date(2023, 10, 10, 10, 10));
    const simFlowTime = reactive({
      timeData: new Date(),
      timeString: "",
      startTimeData: new Date(),
    });
    let WholeSimData = reactive({
      numOfNodes: 100,
      numOfMaxOutBound: 4,
      averageMiningPower: 40000,
      regionList: {
        na: 0.3412,
        eu: 0.4194,
        sa: 0.0257,
        as: 0.1861,
        af: 0.006,
        oa: 0.0216,
      },
      defaultAccount: 1,
      neighborDiscoveryInterval: 100,
      nodeChurnRate: 0.976,
      simEndTime: new Date(2023, 10, 10, 10, 10),
      simEndTimeString: "",
      numOfEndBlock: 10,
      numOfTransInblock: 10,
      consensusAlgorithm: "POW",
      maxBlockSize: 535000,
      blockTime: 10000,
      blockReward: 12,
      transRePer: 0.001,
      wholeDownloadBandwidth: {
        na: 52000000,
        eu: 40000000,
        sa: 18000000,
        as: 22800000,
        af: 22800000,
        oa: 29900000,
      },
      wholeUploadBandwidth: {
        na: 19200000,
        eu: 20700000,
        sa: 5800000,
        as: 15700000,
        af: 10200000,
        oa: 11300000,
      },
      transRegionalBandwidth: 8000000,
      regionLatency: [
        { name: "NA", latency: [221, 236, 246, 244, 234, 233] },
        { name: "EU", latency: [234, 218, 245, 254, 254, 255] },
        { name: "SA", latency: [242, 245, 243, 264, 232, 232] },
        { name: "AS", latency: [234, 222, 212, 221, 232, 234] },
        { name: "AF", latency: [212, 245, 234, 212, 217, 234] },
        { name: "OA", latency: [267, 245, 254, +223, 223, 218] },
      ],
      churnNodeFailureRate: 0.27,
      orphanBlock: 0.05,
      controllerNodeFailureRate: 0.13,
      nodeTypRate: [0.3, 0.3, 0.4],
    });
    const valueDate = ref([
      new Date(2023, 10, 10, 10, 10),
      new Date(2023, 10, 11, 10, 10),
    ]);
    //共识选择
    const optionsAlgorithm = [
      {
        value: "POW",
        label: "POW",
      },
      {
        value: "POS",
        label: "POS",
        disabled: true,
      },
      {
        value: "POH",
        label: "POH",
        disabled: true,
      },
    ];
    //重置时间参数
    const reSetSimEndTime = () => {
      WholeSimData.simEndTime = "";
    };
    //设置时间字符串类型
    const reSetSimEndTimeStr = (value) => {
      WholeSimData.simEndTimeString = value;
    };
    //全流程仿真配置栏
    const dialogWholeSimVisible = ref(false);
    //区域延迟列表配置栏
    const dialogWholeLatencyVisible = ref(false);
    let activeIndex = ref(0);

    //全局加载事件
    const openFullScreen = (mes) => {
      const loading = ElLoading.service({
        lock: true,
        text: mes,
        background: "rgba(0, 0, 0, 0.7)",
      });
      return loading;
    };
    //开始仿真流程
    //节点与区块列表放置全局，便于获取。
    let simDataId = 0; //仿真标识ID
    let nodeMesList = [];
    let blocMeskList = [];
    let OrphanBlockList = []; //孤儿块不参与任何事务，仅显示一次的分叉事件
    const startWholeSim = (wholeSimId, displaySimulation) => {
      //全局内容配置
      this.setSummary(WholeSimData, summaryMes);
      let loading = openFullScreen("节点创建中...");
      // boxLoading.value = true;
      // loadingValue.value = "节点创建中...";
      nodeMesList = nodeCreated(WholeSimData, getAuth());
      blocMeskList = [];
      let time = (WholeSimData.numOfNodes / 100) * 1000 + 1000;
      //节点数据导入迁移到仿真结束或者异常中值终止
      // configWholeNodeData({
      //   wholeNodeType: nodeMesList,
      //   auth: getAuth(),
      //   wholeSimIds: wholeSimId,
      // }).then((resnode) => {
      // if (resnode.status == 1) {
      let endTiem = setTimeout(() => {
        // boxLoading.value = false;
        this.redrsad(nodeMesList);
        loading.close();
        if (WholeSimData.numOfEndBlock > 100) {
          time = (WholeSimData.numOfEndBlock / 100) * 1000 + 1000;
        } else {
          time = 2000;
        }
        //区块事件创建
        let endTiem2 = setTimeout(() => {
          let loading2 = openFullScreen("区块消息创建中...");
          blocMeskList = blockMesListCreate(
            WholeSimData,
            nodeMesList,
            WholeSimData.blockTime,
            WholeSimData.numOfEndBlock
          );
          let noHeapBlockMesList = [];
          let noHeapBlockMesListss = JSON.parse(JSON.stringify(blocMeskList));
          let endTiem3 = setTimeout(() => {
            loading2.close();
            let loading3 = openFullScreen("事务消息创建中...");
            affairsMesListCreate(
              WholeSimData,
              nodeMesList,
              blocMeskList,
              kindMesLen,
              noHeapBlockMesList,
              OrphanBlockList
            );
            let asd = JSON.stringify(noHeapBlockMesList);
            let sdsd = {
              wholeBlockMesTypes: noHeapBlockMesListss,
              auth: getAuth(),
              wholeSimIds: wholeSimId,
              noHeapBlockMesList: noHeapBlockMesList,
            };
            configWholeBlockMes(sdsd).then((resblock) => {
              if (resblock.status == 1) {
                let endTiem4 = setTimeout(() => {
                  //开始仿真流程
                  loading3.close();
                  let endTiem5 = setTimeout(() => {
                    //开始仿真流程
                    // maxSloderValue.value =
                    //   WholeSimData.blockTime * WholeSimData.numOfEndBlock;
                    // for (var j = 1; j <= maxSloderValue.value; j++) {
                    //   setTimeout(() => {
                    //     wholeSimSliderValue.value++;
                    //   }, j * 100);
                    // }
                    nodeMesData.type = "132";
                    nodeMesData.from = "132";
                    if (displaySimulation == 0) {
                      this.startFlowSim(
                        nodeMesList,
                        blocMeskList,
                        WholeSimData,
                        wholeSimId
                      );
                      let loading2 = openFullScreen("仿真开始中...");
                      let loadingSim = setTimeout(() => {
                        loading2.close();
                        clearTimeout(loadingSim);
                      }, 300);
                    } else {
                      let loading2 =
                        openFullScreen("仿真开始中...(直接获取仿真结果)");
                      let loadingSim = setTimeout(() => {
                        this.startNoDisplayFlowSim(
                          nodeMesList,
                          blocMeskList,
                          WholeSimData,
                          wholeSimId
                        );
                        loading2.close();

                        clearTimeout(loadingSim);
                      }, 500);
                    }

                    clearTimeout(endTiem5);
                  }, 1000);
                  clearTimeout(endTiem4);
                }, time);
              } else {
                ElMessageBox.alert("一些错误：" + resblock.mes, "ALERT", {
                  // if you want to disable its autofocus
                  // autofocus: false,
                  confirmButtonText: "OK",
                });
              }
            });

            clearTimeout(endTiem3);
          }, time);
          clearTimeout(endTiem2);
        }, 1000);
        clearTimeout(endTiem);
      }, time);
      // } else {
      //   ElMessageBox.alert("一些错误：" + resnode.mes, "ALERT", {
      //     // if you want to disable its autofocus
      //     // autofocus: false,
      //     confirmButtonText: "OK",
      //   });
      // }
      // });
    };

    const simState = ref(false);
    //直接获取仿真结果
    const nextEnd = () => {
      dialogWholeSimVisible.value = false;
      let loading = openFullScreen("加载中...");
      reSetSimEndTimeStr(getTargetDataStr(WholeSimData.simEndTime));
      let data = {
        wholeSimDataInput: JSON.parse(JSON.stringify(WholeSimData)),
        auth: getAuth(),
      };
      //基本数据导入
      configWholeSettingData(data).then((res) => {
        // 创建结束后开始仿真;
        if (res.status == 1) {
          simDataId = res.wholeSimId;
          simState.value = true;
          loading.close();
          startWholeSim(res.wholeSimId, 1); // 1表示不实时显示仿真流程
        } else {
          ElMessageBox.alert("一些错误：" + res.mes, "ALERT", {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: "OK",
          });
        }
      });
    };
    //下一步
    const next = () => {
      if (activeIndex.value == 4) {
        let j = WholeSimData;
        dialogWholeSimVisible.value = false;
        let loading = openFullScreen("加载中...");
        reSetSimEndTimeStr(getTargetDataStr(WholeSimData.simEndTime));
        let data = {
          wholeSimDataInput: JSON.parse(JSON.stringify(WholeSimData)),
          auth: getAuth(),
        };
        //基本数据导入
        configWholeSettingData(data).then((res) => {
          // 创建结束后开始仿真;
          if (res.status == 1) {
            simDataId = res.wholeSimId;
            simState.value = true;
            loading.close();
            startWholeSim(res.wholeSimId, 0); //0表示实时显示仿真流程
          } else {
            ElMessageBox.alert("一些错误：" + res.mes, "ALERT", {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: "OK",
            });
          }
        });
        // this.redrsad();
      } else {
        if (activeIndex.value == 2 && WholeSimData.simEndTime == "") {
          ElMessageBox.alert("请预设仿真结束时间！", "ALERT", {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: "OK",
          });
        } else {
          activeIndex.value++;
        }
      }
    };
    //修改可视化
    const setWholeSimVis = (value) => {
      dialogWholeSimVisible.value = value;
    };
    //事件可视化
    const activeName = ref("1");
    const activeSumName = ref("1");

    //加载文字变化
    const loadingValue = ref("loadingss");
    const boxLoading = ref(false);
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
    //节点类型数据修改
    const nodeTypechange = (currentValue, oldValue) => {
      const subtractNumber = math.format(
        oldValue - currentValue + WholeSimData.nodeTypRate[2],
        2
      );
      let num = Number(subtractNumber); //将字符串转换为Number类型
      WholeSimData.nodeTypRate[2] = num;
      //后期要处理超出范围问题
    };
    const dateTimeChange = (currentValue, oldValue, index) => {
      if (index == 0) {
        //节点数量
        let times = currentValue * WholeSimData.blockTime;
        let vmtimes = currentValue * simDataGapTime.value * 60 * 1000;
        const date = new Date();
        //获取四分钟操作时间
        times = date.getTime() + times + (4000 / 1000) * 60 * 1000;
        vmtimes = date.getTime() + vmtimes + 24000;
        let targetDate = new Date(times);
        WholeSimData.simEndTime = targetDate;
        this.simDataEndtime = new Date(vmtimes);
      } else {
        //index ==1?;
        simDataGapTime.value = currentValue / 1000;
        let times = currentValue * WholeSimData.numOfEndBlock;
        const date = new Date();
        //获取四分钟操作时间nodeMesData
        times = date.getTime() + times + 24000;
        let targetDate = new Date(times);
        WholeSimData.simEndTime = targetDate;

        //虚拟结束时间
        let vmtimes =
          WholeSimData.numOfEndBlock * simDataGapTime.value * 60 * 1000;
        vmtimes = date.getTime() + vmtimes + (4000 / 1000) * 60 * 1000;
        this.simDataEndtime = new Date(vmtimes);
      }
    };
    let blockMesData = reactive({
      type: "0",
      mes: "1",
      state: "",
      from: 1,
      to: 2,
      transactionId: "",
      blockDetail: "",
      blockId: "",
      blockHeight: "",
      tradeTime: "", //传输时间
      blockHash: "",
      timestamp: "",
    });
    let createMesData = reactive({
      type: "0",
      mes: "1",
      state: "",
      from: 1,
      to: 2,
      miner: 0,
      transactionId: "",
      isOrphan: "false",
      minerReward: "",
      timestamp: "",
      blockDif:0
    });
    let nodeMesData = reactive({
      type: "0",
      state: "",
      mes: "1",
      from: 2,
      to: 1,
      transactionId: "",
      timestamp: "",
    });

    const powFindHandleClose = () => {
      ElMessageBox.confirm("程序运行中,无法退出当前界面!")
        .then(() => {})
        .catch(() => {
          // catch error
        });
    };
    const staus = ref("");
    const setStatus = (value) => {
      staus.value = value;
    };

    const percentage = ref(0);
    const addPercentage = (value) => {
      if (percentage.value < 96) {
        percentage.value += value;
      }
    };
    const setPercentage = (value) => {
      percentage.value = value;
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
    const dialogNodeDetailVisible = ref(false);
    const dodeDetailMesData = reactive({
      id: 0,
      addressId: "Node1",
      transactions: 0,
      totalReceived: 0,
      totalSent: 0,
      balance: 0,
      nodeType: "fullNode",
      walletId: {
        walletId: 0,
        privateKey:
          "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgEsY2KmIjmib67wwekmLRV3L99WrJPlNDyl4obT6cdxK3x1Mvfx0sIjs4U2D7n7eRG3svzVPiuzCTxtkP45fCPzWPOjD0o+oD4HPqyablAnhmwYk3349EE842BCa7SV5hSJVBm6EjvUl6oKTYQ99utLF3",
        publicKey:
          "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEaOKZgHVKwHdoHqXRaTrGHpRVvzpKr6sGU2R7QUgKdqCYPbnOJkZJylvVwAxYY7CWgLRcnlJBQ04awF3gmnqRCe==",
        auth: "admin",
      },
      transactionsId: "",
      auth: "admin",
      hashRate: 0,
      accountList: {
        address: "1mKfv1KWUphwwPkYJMl55oc6UxHdsirUyW",
        accountId: 1,
        transactions: 0,
        totalReceived: 0,
        totalSent: 0,
        balance: 0,
        walletId: {
          walletId: 0,
          privateKey:
            "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgEsY2KmIjmib67wwekmLRV3L99WrJPlNDyl4obT6cdxK3x1Mvfx0sIjs4U2D7n7eRG3svzVPiuzCTxtkP45fCPzWPOjD0o+oD4HPqyablAnhmwYk3349EE842BCa7SV5hSJVBm6EjvUl6oKTYQ99utLF3",
          publicKey:
            "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEaOKZgHVKwHdoHqXRaTrGHpRVvzpKr6sGU2R7QUgKdqCYPbnOJkZJylvVwAxYY7CWgLRcnlJBQ04awF3gmnqRCe==",
          auth: "admin",
        },
        transactionsId: "",
        auth: "admin",
        accountName: "account1cYu0qMtbbWgRbu1G",
        nodeId: "Node1",
      },
      minerAccountName: "account1cYu0qMtbbWgRbu1G",
      regionId: 0,
      regionPostion: [-106.83853872929289, 47.14434616746079],
      isChurn: true,
      numConnection: 1,
      netWorkTable: {
        numConnection: 1,
        inBound: ["Node20", "Node54", "Node71", "Node74", "Node91", "Node95"],
        outBound: ["Node5"],
      },
      chainBlockHeightState: 10,
    });
    const optionsNodeChange = (value) => {
      let targetNode = nodeMesList[value];
      dodeDetailMesData.addressId = targetNode.addressId;
      dodeDetailMesData.nodeType = targetNode.nodeType;
      dodeDetailMesData.regionId = targetNode.regionId;
      dodeDetailMesData.hashRate = targetNode.hashRate;
      dodeDetailMesData.accountList.accountId =
        targetNode.accountList.accountId;
      dodeDetailMesData.accountList.totalReceived =
        targetNode.accountList.totalReceived;
      dodeDetailMesData.accountList.totalSent =
        targetNode.accountList.totalSent;
      dodeDetailMesData.accountList.balance = targetNode.accountList.balance;
      dodeDetailMesData.accountList.walletId.walletId =
        targetNode.accountList.walletId.walletId;
      dodeDetailMesData.accountList.transactionsId =
        targetNode.accountList.transactionsId;
      //交易存入
      dodeDetailMesData.accountList.walletId.privateKey =
        targetNode.accountList.walletId.privateKey;
      dodeDetailMesData.accountList.walletId.publicKey =
        targetNode.accountList.walletId.publicKey;
      dodeDetailMesData.accountList.address = targetNode.accountList.address;
      dialogNodeDetailVisible.value = true;
    };
    const dialogWalletVisible = ref(false);
    let walletData = reactive({
      id: "1",
      address: "122o4YRDAJGYJEPUGcT6RMamKRWdvStnPv",
      publicKkey:
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECFGthZ5/pFz6eRNr1UX+HuqE9Aa/bsyFOxnlvaJLICIAzlrqFRdQ3TrGkDfuX6JGPzpgeHNKHXuu/gLXNQqAVA==",
      privateKey:
        "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgVdVHyHHTZXHuL2wRbXhKseA+edBkwxhnkyh8ZUopXeOgCgYIKoZIzj0DAQehRANCAAQIUa2Fnn+kXPp5E2vVRf4e6oT0Br9uzIU7GeW9oksgIgDOWuoVF1DdOsaQN+5fokY/OmB4c0ode67+Atc1CoBU",
    });
    const checkWallet = (res, address) => {
      walletData.id = res.walletId;
      walletData.publicKkey = res.publicKey;
      walletData.privateKey = res.privateKey;
      walletData.address = address;
      dialogWalletVisible.value = true;
    };
    return {
      checkWallet,
      walletData,
      dialogWalletVisible,
      dialogNodeDetailVisible,
      dodeDetailMesData,
      regionData: reactive([
        "NORTH_AMERICA",
        "EUROPE",
        "SOUTH_AMERICA",
        "ASIA",
        "AFRICA",
        "OCEANIA",
      ]),
      optionsNodeChange,
      blockTableData: reactive([]),
      blockDataTableData: reactive([]),
      nodeMesVisList,
      blockMesVisList,
      dateTimeChange,
      valueDate,
      nodeTypechange,
      simState,
      svg,
      boxLoading,
      blocMeskList,
      loadingValue,
      startWholeSim,
      simDataId,
      dialogNodeVisible: ref(false),
      simDataeVisible: ref(false),
      dialogBlockVisible: ref(false),
      dialogCreateVisible: ref(false),
      activeName,
      activeSumName,
      reSetSimEndTimeStr,
      getAuth,
      wholeSimSliderValue,
      maxSloderValue,
      mapOption: {},
      dialogWholeLatencyVisible,
      optionsAlgorithm,
      reSetSimEndTime,
      WholeSimData,
      simDataGapTime,
      simDataEndtime,
      setWholeSimVis,
      dialogWholeSimVisible,
      activeIndex,
      transactionsList,
      next,
      nextEnd,
      nodeMesList,
      blockTransmitMes,
      unconfirmedTransactions,
      value: "world", //初始化为世界地图
      myChart: null, //初始化地图渲染器
      //准备数据
      jiangbeiData: [
        {
          name: "江北区",
          value: 80,
        },
      ],
      systemMsgNode: [{ id: 0, title: "节点事件" }],
      systemMsgBlock: [{ id: 0, title: "区块事件" }],
      blockMesData,
      createMesData,
      nodeMesData,
      summaryMes,
      innerDrawer: ref(false),
      dialogInputVisible: ref(false), //输入信息
      dialogOutPutVisible: ref(false), //输出信息
      inputData: reactive({
        id: "1",
        address: "",
        signature: "/pFz6eRNr1UX+//==",
        pubKey: "+++5fokY/OmB4c0ode67+Atc1CoBU",
        transId: [],
        tranValue: "+++5fokY/OmB4c0ode67+Atc1CoBU",
      }),
      dialogDetailTransVisible: ref(false),
      targetTransData: reactive([]),
      outputData: reactive({
        id: "1",
        address: "",
        tranValue: "/pFz6eRNr1UX+//==",
        transId: [],
      }),
      //单个交易详情信息
      dialogTransVisible: ref(false),
      transData: reactive({
        id: "1",
        hash: "",
        inputId: "/pFz6eRNr1UX+//==",
        outputId: "+++5fokY/OmB4c0ode67+Atc1CoBU",
        createTime: "/pFz6eRNr1UX+//==",
        totalInput: "/pFz6eRNr1UX+//==",
        totalOutput: "/pFz6eRNr1UX+//==",
        status: "/pFz6eRNr1UX+//==",
        utxo: "/pFz6eRNr1UX+//==",
      }),
      changeInThisSim: {
        node: [],
        block: [],
        transaction: [],
        input: [],
        output: [],
        simDataId: simDataId,
      },
      openFullScreen,
      simFlowTime,
      powFindVisible: ref(false),
      powFindHandleClose,
      percentage,
      setPercentage,
      addPercentage,
      customColors,
      staus,
      setStatus,
      showBlockMes: reactive(["全局查找正在进行挖矿的节点!"]),
      valueNode: ref(""),
      valueNodeStatue: ref(false),
      optionsNode: reactive([
        {
          value: "1",
          label: "Option1",
        },
      ]),
      sysMesStates: ref(false),
      sysMesStatesContent: ref(""),
      searchMesList: reactive([
        {
          id: 0,
          content: { mes: "区块消息创建" },
          mes: "节点消息创建",
          type: "normalMes",
          contentMessage: {
            blockDetail: { blockId: "", blockHeight: "", blockHash: "" },
            tradeTime: "",
            content: { id: null, mes: "区块消息创建" },
            id: null,
            type: "normalMes",
            from: "1",
            to: "2",
            miner: "0",
            confirmId: null,
            isOrphan: "false",
            transactionId: "0",
          },
        },
      ]),
      dialogSearchDataVisible: ref(false),
    };
  },
  setup() {
    const { t } = useI18n();
    const Numberofnodes = t("Numberofnodes");
    return {
      Numberofnodes,
      t,
    };
  },
  created() {
    this.setWholeSimVis(true);
    let times = 100 * 4000;
    const date = new Date();
    //获取四秒钟操作时间
    times = date.getTime() + times + 24000;
    //将原本的10000ms改为10分钟10*00*1000
    let vmtimes = date.getTime() + 240000 + 600000 * 10;
    let targetDate = new Date(times);
    this.WholeSimData.simEndTime = targetDate;
    this.simDataEndtime = new Date(vmtimes);
  },
  mounted() {
    let lop = getRandomPosition("AFRICA");
    let mapPointData = [];
    // mapPointData.push({
    //   name: "六安",
    //   value: [26.5, 31.75],
    // });
    // mapPointData.push({
    //   name: "马鞍山",
    //   value: [118.51, 31.68],
    // });
    // mapPointData.push({
    //   name: "NORTH_AMERICA",
    //   value: [lop.longitude, lop.latitude],
    // });

    let mapPointData2 = [];
    // mapPointData2.push({
    //   name: "六安aa",
    //   value: [16.5, 31.75],
    // });
    // mapPointData2.push({
    //   name: "马鞍山aa",
    //   value: [38.51, 21.68],
    // });

    let mapPointData3 = [];
    // mapPointData3.push({
    //   name: "六安aa",
    //   value: [6.5, 31.75],
    // });
    // mapPointData3.push({
    //   name: "马鞍山aa",
    //   value: [8.51, 21.68],
    // });

    let lineData = [];
    // lineData.push({
    //   point: ["六安", "马鞍山"],
    //   coords: [
    //     [26.5, 31.75],
    //     [118.51, 31.68],
    //   ],
    // });

    this.initMap(mapPointData, lineData, mapPointData2, mapPointData3);
    this.changeMapMiner(mapPointData);
    this.drawMap();
  },
  beforeRouteLeave(to, from, next) {
    let j = this.simState;
    if (j) {
      ElMessageBox.alert(
        "仿真进行中，您确定要退出当前界面吗？(仿真数据无法缓存)",
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
  methods: {
    showNodeDetial(mes) {
      this.nodeMesData.type = mes.contentMessage.type;
      if (
        mes.contentMessage.type == "blockCreated" ||
        mes.contentMessage.type == "normalMes"
      ) {
        this.createMesData.type = mes.contentMessage.type;
        this.createMesData.blockDif = parseInt(mes.contentMessage.blockDif);
        this.createMesData.mes = mes.mes;
        this.createMesData.isOrphan = mes.contentMessage.isOrphan;
        this.createMesData.timestamp = new Date(mes.contentMessage.timestamp);
        this.createMesData.type = mes.contentMessage.type;
        this.createMesData.state = mes.contentMessage.state + "(成功)";
        this.createMesData.miner = mes.contentMessage.miner;
        this.createMesData.minerReward = mes.contentMessage.content.id;
        this.createMesData.transactionId = mes.contentMessage.confirmId;
        this.dialogCreateVisible = true;
      } else {
        this.nodeMesData.mes = mes.mes;
        this.nodeMesData.timestamp = new Date(mes.contentMessage.timestamp);
        this.nodeMesData.from = mes.contentMessage.from;
        this.nodeMesData.to = mes.contentMessage.to;
        this.nodeMesData.transactionId = mes.contentMessage.content.id;
        if (mes.contentMessage.state == 0) {
          this.nodeMesData.state = mes.contentMessage.state + "(成功)";
        } else {
          this.nodeMesData.state =
            mes.contentMessage.state + "(" + mes.contentMessage.content + ")";
        }
        this.dialogNodeVisible = true;
      }
      // if (mes.type == "nodeTrade") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.nodeMesData.allData = mess;
      // } else if (mes.type == "tradeRec") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.nodeMesData.allData = mess;
      // } else if (mes.type == "blockCreated") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.nodeMesData.allData = mess;
      // } else {
      // }
    },
    showBlockDetial(mes) {
      if (
        mes.contentMessage.type == "blockCreated" ||
        mes.contentMessage.type == "normalMes"
      ) {
        this.createMesData.type = mes.contentMessage.type;
        this.createMesData.blockDif = parseInt(mes.contentMessage.blockDif);
        this.createMesData.mes = mes.mes;
        this.createMesData.isOrphan = mes.contentMessage.isOrphan;
        this.createMesData.timestamp = new Date(mes.contentMessage.timestamp);
        this.createMesData.state = mes.contentMessage.state + "(成功)";
        this.createMesData.miner = mes.contentMessage.miner;
        this.createMesData.minerReward = mes.contentMessage.content.id;
        this.createMesData.transactionId = mes.contentMessage.confirmId;
        this.dialogCreateVisible = true;
      } else {
        this.blockMesData.type = mes.contentMessage.type;
        this.blockMesData.timestamp = new Date(mes.contentMessage.timestamp);
        this.blockMesData.mes = mes.mes;
        this.blockMesData.from = mes.contentMessage.from;
        this.blockMesData.to = mes.contentMessage.to;

        this.blockMesData.blockDetail = mes.contentMessage.blockDetail;
        this.blockMesData.tradeTime = mes.contentMessage.tradeTime;
        this.blockMesData.blockHash = mes.contentMessage.blockDetail.hash;
        this.blockMesData.blockId = mes.contentMessage.blockDetail.blockId;
        this.blockMesData.blockHeight = mes.contentMessage.blockDetail.height;
        if (mes.contentMessage.state == 0) {
          this.blockMesData.state = mes.contentMessage.state + "(成功)";
        } else {
          this.blockMesData.state =
            mes.contentMessage.state + "(" + mes.contentMessage.content + ")";
        }
        this.dialogBlockVisible = true;
      }

      // if (mes.type == "BlockTrade") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.blockMesData.allData = mess;
      // } else if (mes.type == "tradeRecBlock") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.blockMesData.allData = mess;
      // } else if (mes.type == "blockCreated") {
      //   let mess = [];
      //   mess.push({ name: "消息内容", data: mes.mes });
      //   this.blockMesData.allData = mess;
      // } else {
      // }
    },
    wholeSimDataChange(value) {
      // let year = value.getYear();
      // let day = value.getDay();
      // let month = value.getMonth();
      // let min = value.getMinutes();
      // let hours = value.getHours();
      // let seconds = value.getSeconds();
      this.reSetSimEndTimeStr(getTargetDataStr(value));
      let localData = new Date();
      // let localyear = localData.getYear();
      // let localday = localData.getDay();
      // let localmonth = localData.getMonth();
      // let localmin = localData.getMinutes();
      // let localhours = localData.getHours();
      // let localseconds = localData.getSeconds();
      let isaccurate = true;
      let time = value.getTime();
      let localTime = localData.getTime();
      if (time < localTime) {
        isaccurate = false;
      }
      if (!isaccurate) {
        ElMessageBox.alert("您选择的时间小于当前时间！", "ALERT", {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: "OK",
          callback: (action) => {
            this.reSetSimEndTime();
            ElMessage({
              type: "info",
              message: `时间已重置`,
            });
          },
        });
      }
    },
    redrsad(nodeMesList) {
      let mapPointData1 = [];
      let mapPointData2 = [];
      let mapPointData3 = [];
      for (let i = 0; i < nodeMesList.length; i++) {
        if (nodeMesList[i].nodeType == "fullNode") {
          mapPointData1.push({
            name: nodeMesList[i].addressId,
            id: i,
            type: "fullNode",
            value: nodeMesList[i].regionPostion,
            nodeDetail: nodeMesList[i],
          });
        } else if (nodeMesList[i].nodeType == "lightNode") {
          mapPointData2.push({
            name: nodeMesList[i].addressId,
            id: i,
            type: "lightNode",
            value: nodeMesList[i].regionPostion,
            nodeDetail: nodeMesList[i],
          });
        } else if (nodeMesList[i].nodeType == "miningNode") {
          mapPointData3.push({
            name: nodeMesList[i].addressId,
            id: i,
            type: "miningNode",
            value: nodeMesList[i].regionPostion,
            nodeDetail: nodeMesList[i],
          });
        }
      }
      let lineData = [];
      // lineData.push({
      //   point: ["六安", "宿asda州"],
      //   coords: [
      //     [126.5, 31.75],
      //     [16.98, 33.63],
      //   ],
      // });
      // lineData.push({
      //   point: ["宿州", "马鞍山"],
      //   coords: [
      //     [116.98, 33.63],
      //     [118.51, 31.68],
      //   ],
      // });
      // lineData.push({
      //   point: ["宿州", "六安"],
      //   coords: [
      //     [116.98, 33.63],
      //     [126.5, 31.75],
      //   ],
      // });

      this.changeMapOption(
        mapPointData1,
        mapPointData2,
        mapPointData3,
        lineData
      );
      this.reDrawMaps();
    },
    drawMap() {
      echarts.registerMap("world", JSONMAP, {});
      const myChart = echarts.init(document.getElementById("china-map"));
      myChart.setOption(this.mapOption);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    reDrawMaps() {
      const myChart = echarts.getInstanceByDom(
        document.getElementById("china-map")
      );
      myChart.setOption(this.mapOption);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    clearMapLine() {
      const myChart = echarts.getInstanceByDom(
        document.getElementById("china-map")
      );
      let data = this.mapOption.series[3].data[0];
      let line = [
        {
          point: [data.point[0], data.point[0]],
          coords: [data.coords[0], data.coords[0]],
        },
      ];
      this.mapOption.series[3].data = [];
      myChart.setOption(this.mapOption);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    changeMapOption(dataGeo1, dataGeo2, dataGeo3, lineData) {
      this.mapOption.series[0].data = dataGeo1;
      this.mapOption.series[1].data = dataGeo2;
      this.mapOption.series[2].data = dataGeo3;
      this.mapOption.series[3].data = lineData;
    },
    changeMapMiner(dataGeo1) {
      this.mapOption.series[4].data = dataGeo1;
    },
    addMapMiner(dataGeo1) {
      this.mapOption.series[4].data.push(dataGeo1);
    },
    changeMapLine(lineData) {
      this.mapOption.series[3].data = lineData;
    },
    initMap(dataGeo, lineData, dataGeo2, dataGeo3) {
      this.mapOption = {
        color: ["#5470c6"],
        tooltip: {
          trigger: "item",
          renderMode: "html",
          // 触发方式
          triggerOn: "click",
          enterable: true,
          backgroundColor: "#fff",
          padding: 0,
          textStyle: {
            color: "#000",
            fontSize: "12",
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        dispatchAction: {
          type: "downplay",
        },
        roam: false,
        roamController: {
          show: true,
          x: "right",
          mapTypeControl: {
            china: true,
          },
        },
        series: [
          {
            name: "fullNode",
            type: "scatter",
            coordinateSystem: "geo",
            color: ["rgb(205, 254, 156)"],
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                return `<div style="padding: 5px 10px;">【名称:${d.data.name},类型:${d.data.type},网络链接数:${d.data.nodeDetail.netWorkTable.numConnection}】
                </div>`;
              },
            },
            data: dataGeo,
          },
          {
            name: "lightNode",
            type: "scatter",
            coordinateSystem: "geo",
            color: ["aquamarine"],
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                return `<div style="padding: 5px 10px;">【名称:${d.data.name},类型:${d.data.type},网络链接数:${d.data.nodeDetail.netWorkTable.numConnection}】
                </div>`;
              },
            },
            data: dataGeo2,
          },
          {
            name: "minerNode",
            type: "scatter",
            coordinateSystem: "geo",
            color: ["rgb(255, 153, 127)"],
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                return `<div style="padding: 5px 10px;">【名称:${d.data.name},类型:${d.data.type},网络链接数:${d.data.nodeDetail.netWorkTable.numConnection}】
                </div>`;
                // return `<div style="padding: 5px 10px;">【name:${d.data.name},type:${d.data.type}】</div>`;
              },
            },
            data: dataGeo3,
          },
          {
            name: "lines",
            type: "lines",
            zlevel: 6,
            animation: false,
            effect: {
              show: true,
              symbol: "arrow",
              period: 2,
            },
            lineStyle: {
              type: "solid",
              width: 1,
              opacity: 1,
              curveness: 0,
              orient: "horizontal",
              color: "#000",
            },
            show: true,
            data: lineData,
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                return `<div style="padding: 5px 10px;"> 【${d.data.point[0]}】< ---- >【${d.data.point[1]}】</div>`;
              },
            },
          },
          {
            name: "locakminerNode",
            type: "effectScatter",
            coordinateSystem: "geo",
            color: ["rgb(244, 49, 0)"],
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                return `<div style="padding: 5px 10px;">【名称:${d.data.name},state:记账权拥有者 ,网络链接数:${d.data.nodeDetail.netWorkTable.numConnection}】
                </div>`;
              },
            },
            data: [],
          },
        ],
        geo: {
          show: true,
          map: "world",
          type: "map",
          mapType: "world",
          roam: false,//是否可以移动
          zoom: 1.2,
          label: {
            normal: {
              // 显示省份标签
              show: false,
              textStyle: {
                color: "#fff",
                fontSize: 10,
              },
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: true,
              // 选中后的字体样式
              textStyle: {
                color: "#000",
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            color: "#ddb926",
            normal: {
              areaColor: "#8abcd1",
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              borderWidth: 0.5,
              borderColor: "#8abcd1",
              areaColor: "#fff",
            },
          },
          emphasis: {
            label: {
              show: false,
            },
          },
        },
      };
    },
    //掠过地图流程的变化
    startNoDisplayFlowSim(nodeMesList, blocMeskList, WholeSimData, wholeSimId) {
      let heass = [];
      // this.powFindVisible = true;
      let loadingss = this.openFullScreen(
        "仿真流程快速处理中...(预计花费" +
          (blocMeskList.length * 0.5 + 1) +
          "s)"
      );
      let addNum = 0;
      if (blocMeskList.length > 96) {
        addNum = Number(96 / blocMeskList.length).toFixed(2);
      } else {
        addNum = parseInt(96 / blocMeskList.length);
      }
      for (let i = 0; i < blocMeskList.length; i++) {
        let timeeout = setTimeout(() => {
          // this.addPercentage(addNum);
          let localMesStartTime =
            i * this.simDataGapTime * 60 * 1000 + (1300 / 1000) * 60 * 1000;
          //上一个时间
          let preTime = 0;
          let heapList = [];
          let timeMesList = [];
          let len = heapList.length;
          let localHeap = blocMeskList[i].blockMesHeap;
          while (localHeap.size() > 0) {
            let mes = localHeap.pop();
            //查看交易数量
            // if (mes.type == "nodeTrade") {
            //   haddNod.push(mes);
            // }
            heapList.push(mes);
            len++;
            let time = mes.timestamp - blocMeskList[i].startTimestamp;
            timeMesList.push(localMesStartTime + (time / 1000) * 60 * 1000);
            if (len >= 10) {
              //发送消息与接收消息时间
              let tradeTime = time - parseInt((time - preTime) / 2);
              let recTime = time;
              preTime = time;
              const newHeapList = JSON.parse(JSON.stringify(heapList));
              const newtimeMesList = JSON.parse(JSON.stringify(timeMesList));
              timeMesList = [];
              heapList = [];
              len = 0;
              //发送消息
              //需要处理的线集合
              let lineList = [];
              let targetI = 0;
              for (let heap of newHeapList) {
                if (heap != undefined || heap != null) {
                  if (
                    heap.type == "nodeTrade" ||
                    heap.type == "BlockTrade" ||
                    heap.type == "blockCreated"
                  ) {
                    let lineMes = this.dealAllMes(
                      nodeMesList,
                      blocMeskList[i],
                      WholeSimData,
                      heap,
                      blocMeskList,
                      i,
                      newtimeMesList[targetI]
                    );
                    if (lineMes != null) {
                      lineList.push(lineMes);
                    }
                  }
                }
                targetI++;
              }
              this.setVmSimTimeChange(
                localMesStartTime + (tradeTime / 1000) * 60 * 1000
              );
              //接收消息
              //发送消息与接收消息
              //需要处理的线集合
              let lineList1 = [];
              let targetIL = 0;
              for (let heap of newHeapList) {
                if (heap != undefined || heap != null) {
                  if (heap.type == "tradeRec" || heap.type == "tradeRecBlock") {
                    let lineMes = this.dealAllMes(
                      nodeMesList,
                      blocMeskList[i],
                      WholeSimData,
                      heap,
                      blocMeskList,
                      i,
                      newtimeMesList[targetIL]
                    );
                    if (lineMes != null) {
                      lineList1.push(lineMes);
                    }
                  }
                }
                targetIL++;
              }
              this.setVmSimTimeChange(
                localMesStartTime + (recTime / 1000) * 60 * 1000
              );
            }
            if (i == blocMeskList.length - 1 && localHeap.size() == 0) {
              let lineTime = setTimeout(() => {
                clearTimeout(lineTime);
                let targetEnd = {
                  wholeNodeType: nodeMesList,
                  blockList: blocMeskList,
                  transactionList: this.transactionsList.transactions,
                  inputList: this.transactionsList.input,
                  outputList: this.transactionsList.output,
                  auth: this.getAuth(),
                  wholeSimIds: wholeSimId,
                };
                configWholeSettingEndData(targetEnd).then((resnode) => {});
                this.setoptionsNode(nodeMesList);
                // this.setPercentage(100);
                setTimeout(() => {
                  this.powFindVisible = false;
                  loadingss.close();
                  //加个处理完成的弹出框
                  ElMessage({
                    message: "流程结束！",
                    type: "success",
                  });
                }, 100);
                //时间处理
                this.setVmSimEndTimeChange();
                //将相关信息存入数据库
              }, 1000);
            }
          }
          clearTimeout(timeeout);
        }, 500 * i);
      }
    },
    //全体流程的开始
    startFlowSim(nodeMesList, blocMeskList, WholeSimData, wholeSimId) {
      let heass = [];
      for (let i = 0; i < blocMeskList.length; i++) {
        let localMesStartTime =
          i * this.simDataGapTime * 60 * 1000 + (1300 / 1000) * 60 * 1000;
        //上一个时间
        let preTime = 0;
        let heapList = [];
        let timeMesList = [];
        let len = heapList.length;
        let timeout = setTimeout(() => {
          let localHeap = blocMeskList[i].blockMesHeap;
          while (localHeap.size() > 0) {
            let mes = localHeap.pop();
            //查看交易数量
            // if (mes.type == "nodeTrade") {
            //   haddNod.push(mes);
            // }
            heapList.push(mes);
            len++;
            let time = mes.timestamp - blocMeskList[i].startTimestamp;
            timeMesList.push(localMesStartTime + (time / 1000) * 60 * 1000);
            if (len >= 10) {
              //发送消息与接收消息时间
              let tradeTime = time - parseInt((time - preTime) / 2);
              let recTime = time;
              preTime = time;
              const newHeapList = JSON.parse(JSON.stringify(heapList));
              const newtimeMesList = JSON.parse(JSON.stringify(timeMesList));
              timeMesList = [];
              heapList = [];
              len = 0;
              //发送消息
              setTimeout(() => {
                //发送消息与接收消息
                let tradeLineList = [];
                let recLineList = [];
                //需要处理的线集合
                let lineList = [];
                let targetI = 0;
                for (let heap of newHeapList) {
                  if (heap != undefined || heap != null) {
                    if (
                      heap.type == "nodeTrade" ||
                      heap.type == "BlockTrade" ||
                      heap.type == "blockCreated"
                    ) {
                      let lineMes = this.dealAllMes(
                        nodeMesList,
                        blocMeskList[i],
                        WholeSimData,
                        heap,
                        blocMeskList,
                        i,
                        newtimeMesList[targetI]
                      );
                      if (lineMes != null) {
                        lineList.push(lineMes);
                      }
                    }
                  }
                  targetI++;
                }
                this.changeMapLine(lineList);
                this.reDrawMaps();
                this.setVmSimTimeChange(
                  localMesStartTime + (tradeTime / 1000) * 60 * 1000
                );
              }, tradeTime);
              //接收消息
              setTimeout(() => {
                //发送消息与接收消息
                let tradeLineList = [];
                let recLineList = [];
                //需要处理的线集合
                let lineList = [];
                let targetIL = 0;
                for (let heap of newHeapList) {
                  if (heap != undefined || heap != null) {
                    if (
                      heap.type == "tradeRec" ||
                      heap.type == "tradeRecBlock"
                    ) {
                      let lineMes = this.dealAllMes(
                        nodeMesList,
                        blocMeskList[i],
                        WholeSimData,
                        heap,
                        blocMeskList,
                        i,
                        newtimeMesList[targetIL]
                      );
                      if (lineMes != null) {
                        lineList.push(lineMes);
                      }
                    }
                  }
                  targetIL++;
                }
                this.changeMapLine(lineList);
                this.reDrawMaps();
                this.setVmSimTimeChange(
                  localMesStartTime + (recTime / 1000) * 60 * 1000
                );
              }, recTime);
            }
            if (i == blocMeskList.length - 1 && localHeap.size() == 0) {
              let lineTime = setTimeout(() => {
                this.clearMapLine();
                clearTimeout(lineTime);
                let loadingss = this.openFullScreen("仿真结束中...");
                let targetEnd = {
                  wholeNodeType: nodeMesList,
                  blockList: blocMeskList,
                  transactionList: this.transactionsList.transactions,
                  inputList: this.transactionsList.input,
                  outputList: this.transactionsList.output,
                  auth: this.getAuth(),
                  wholeSimIds: wholeSimId,
                };
                configWholeSettingEndData(targetEnd).then((resnode) => {});
                //时间处理
                this.setVmSimEndTimeChange();
                //将相关信息存入数据库
                this.setoptionsNode(nodeMesList);
                let lineTimes = setTimeout(() => {
                  loadingss.close();
                  clearTimeout(lineTimes);
                }, 3000);
              }, 500 + time);
            }
          }

          clearTimeout(timeout);
        }, i * WholeSimData.blockTime + 400);
      }
    },
    //开始处理消息类型
    dealAllMes(
      nodeMesList,
      blocMes,
      WholeSimData,
      mes,
      blockMesList,
      indexB,
      timestampMes
    ) {
      timestampMes = this.dealtargetTeime(timestampMes);
      if (timestampMes == NaN) {
        let j = 1;
      }
      if (mes.type == "blockCreated") {
        this.summaryMes[3].data++;
        let value = blocMes.miner.regionPostion;
        //矿工节点高亮
        this.changeMapMiner([
          {
            name: blocMes.miner.addressId,
            type: "Miner",
            value: value,
            id: blocMes.miner.id,
            nodeDetail: blocMes.miner,
          },
        ]);
        this.reDrawMaps();
        //矿工节点获取奖励
        let transactionsList = this.transactionsList;
        let minerTrans = {
          id: transactionsList.transactions.length,
          hash: sha256("trans" + transactionsList.transactions.length),
          intputId: "",
          outputId: "",
          createdTime: getDataString(),
          totalInput: WholeSimData.blockReward,
          totalOutput: 0,
          status: "confirmed",
          utxo: WholeSimData.blockReward,
          auth: this.getAuth(),
          fees: 0,
          feesTransId: "",
          feeMark: 1,
        };
        //矿工节点交易载入
        this.minerTradeDeal(nodeMesList, minerTrans, mes);
        //区块相关交易信息载入（包含一定量级的未确定交易）
        let confirmedId = this.blcokCreateMesDeal(
          blockMesList,
          indexB,
          minerTrans,
          WholeSimData
        );
        //信息载入
        let titleMesBlock = this.systemMsgBlock;
        let contentMesBlock = this.blockMesVisList;
        let contentMes = this.nodeMesVisList;
        transactionsList.transactions.push(minerTrans);
        this.configChangeMes(minerTrans, "node");
        let nodeEndMes = {
          type: mes.type,
          state: 0, //成功
          kind: 0,
          content: minerTrans,
          miner: mes.miner.addressId,
          confirmId: confirmedId,
          timestamp: timestampMes,
          isOrphan: "false",
        };
        let blockEndMes = {
          type: mes.type,
          state: 0, //成功
          kind: 0,
          content: blocMes,
          miner: mes.miner.addressId,
          confirmId: confirmedId,
          timestamp: timestampMes,
          isOrphan: "false",
          blockDif: mes.targetBlock.difficulty,
        };
        titleMesBlock.push({ id: titleMesBlock.length, content: "区块创建" });
        contentMesBlock.unshift({
          id: contentMesBlock.length,
          type: mes.type,
          contentMessage: blockEndMes,
          mes:
            "区块" +
            blocMes.blockId +
            "被节点" +
            mes.miner.addressId +
            "成功挖掘",
        });
        contentMes.unshift({
          id: contentMesBlock.length,
          type: mes.type,
          contentMessage: nodeEndMes,
          mes: "节点" + mes.miner.addressId + "获取挖矿奖励",
        });
        return null;
      } else if (mes.type == "blockOrphanCreated") {
        this.summaryMes[3].data++;
        let value = blocMes.miner.regionPostion;
        //矿工节点高亮
        this.addMapMiner([
          {
            name: blocMes.miner.addressId,
            type: "Miner",
            value: value,
          },
        ]);
        this.reDrawMaps();
        //矿工节点获取奖励
        let transactionsList = this.transactionsList;
        let minerTrans = {
          id: transactionsList.transactions.length,
          hash: sha256("trans" + transactionsList.transactions.length),
          intputId: "",
          outputId: "",
          createdTime: getDataString(),
          totalInput: WholeSimData.blockReward,
          totalOutput: 0,
          status: "confirmed",
          utxo: WholeSimData.blockReward,
          auth: this.getAuth(),
          fees: 0,
          feesTransId: "",
          feeMark: 1,
        };
        //矿工节点交易载入
        this.minerTradeDeal(nodeMesList, minerTrans, mes);
        //区块相关交易信息载入（包含一定量级的未确定交易）
        // let confirmedId = this.blcokCreateMesDeal(
        //   blockMesList,
        //   indexB,
        //   minerTrans,
        //   WholeSimData
        // );
        //信息载入
        let titleMesBlock = this.systemMsgBlock;
        let contentMesBlock = this.blockMesVisList;
        let contentMes = this.nodeMesVisList;
        transactionsList.transactions.push(minerTrans);
        this.configChangeMes(minerTrans, "node");
        let nodeEndMes = {
          type: mes.type,
          state: 0, //成功
          kind: 0,
          content: minerTrans,
          miner: mes.miner.addressId,
          confirmId: "",
          timestamp: timestampMes,
          isOrphan: "true",
        };
        let blockEndMes = {
          type: mes.type,
          state: 0, //成功
          kind: 0,
          content: blocMes,
          miner: mes.miner.addressId,
          confirmId: "",
          timestamp: timestampMes,
          isOrphan: "true",
          blockDif: mes.targetBlock.difficulty
        };
        titleMesBlock.push({ id: titleMesBlock.length, content: "区块创建" });
        contentMesBlock.unshift({
          id: contentMesBlock.length,
          type: mes.type,
          contentMessage: blockEndMes,
          mes:
            "区块" +
            blocMes.blockId +
            "被节点" +
            mes.miner.addressId +
            "成功挖掘,但无法认证,链分叉,且为孤儿块",
        });
        contentMes.unshift({
          id: contentMesBlock.length,
          type: mes.type,
          contentMessage: nodeEndMes,
          mes:
            "节点" + mes.miner.addressId + "挖掘的区块无法认证,转变为孤儿块。",
        });
        return null;
      } else if (mes.type == "nodeTrade") {
        this.summaryMes[4].data++;
        if (!mes.isBreakdownn) {
          // if (nodeMesList[mes.from.id].accountList.balance > mes.transCoin) {
          //交易引导线创建
          let lineData = [];
          let from = mes.from;
          let to = mes.to;
          lineData.push({
            point: [from.addressId, to.addressId],
            coords: [from.regionPostion, to.regionPostion],
          });
          // this.changeMapLine(lineData);
          // this.reDrawMaps();
          //交易列表获取
          let transactionsList = this.transactionsList;
          let inputTransactionId = this.getInputTrans(
            nodeMesList,
            blocMes,
            mes,
            from,
            transactionsList.transactions.length
          );
          let tradeInput = {
            id: transactionsList.input.length,
            index: transactionsList.input.length,
            addressId: from.accountList.address,
            transactionId: inputTransactionId + "",
            tranValue: mes.transCoin,
            signature: getSign(),
            auth: this.getAuth(),
          };
          let minerTrans = {
            id: transactionsList.transactions.length,
            hash: sha256("trans" + transactionsList.transactions.length),
            intputId: tradeInput.id + "",
            outputId: "",
            createdTime: getDataString(),
            totalInput: mes.transCoin,
            totalOutput: 0,
            status: "unconfirmed",
            utxo: mes.transCoin,
            auth: this.getAuth(),
            fees: 1,
            feesTransId: transactionsList.transactions.length + 1,
            feeMark: 0,
            tradeMesId: mes.id,
            isBreakdownn: 1,
            nodeTo: to.addressId,
          };
          this.unconfirmedTransactions.transactions.length = 0;
          this.unconfirmedTransactions.transactions.push(minerTrans);
          //交易信息处理，接收交易之后在处理交易内容
          let titleMesNode = this.systemMsgNode;
          let contentMesNode = this.nodeMesVisList;
          let nodeEndMes = {
            type: mes.type,
            state: 0, //成功
            kind: 0, //0为普通交易类型
            content: minerTrans,
            from: mes.from.addressId,
            to: mes.to.addressId,
            timestamp: timestampMes,
          };
          titleMesNode.unshift({
            id: titleMesNode.length,
            content:
              "节点" +
              from.addressId +
              "向节点" +
              to.addressId +
              "发起交易请求",
          });
          contentMesNode.unshift({
            id: contentMesNode.length,
            contentMessage: nodeEndMes,
            type: mes.type,
            mes:
              "节点" +
              from.addressId +
              "向节点" +
              to.addressId +
              "发起交易请求",
          });
          return lineData[0];
          // } else {
          //   this.addBreakenMes(mes, 2, "节点持有货币不足");
          //   return null;
          // }
        } else {
          this.addBreakenMes(mes, 1, "节点故障", timestampMes);
          return null;
        }
      } else if (mes.type == "tradeRec") {
        let j = this.nodeMesList;
        if (!mes.isBreakdownn) {
          if (
            nodeMesList[mes.to.id].accountList.balance > mes.recMes.transCoin
          ) {
            let allliasy = this.transactionsList.transactions;
            //交易线创建
            let lineData = [];
            let from = mes.from;
            let to = mes.to;
            lineData.push({
              point: [from.addressId, to.addressId],
              coords: [from.regionPostion, to.regionPostion],
            });
            // this.changeMapLine(lineData);
            // this.reDrawMaps();
            //交易列表获取
            let recMes = mes.recMes;
            let transactionsList = this.transactionsList;
            let targetTransId = transactionsList.transactions.length;
            let inputTransactionId = this.setTargetInputTrans(
              nodeMesList,
              blocMes,
              recMes,
              recMes.from
            );
            let tradeInput = {
              id: transactionsList.input.length,
              index: transactionsList.input.length,
              addressId: from.accountList.address,
              transactionId: inputTransactionId + "",
              tranValue: mes.transCoin,
              pubKeyHash: from.accountList.walletId,
              signature: getSign(),
              auth: this.getAuth(),
            };
            let minerTrans = {
              id: transactionsList.transactions.length,
              hash: sha256("trans" + transactionsList.transactions.length),
              intputId: tradeInput.id + "",
              outputId: "",
              createdTime: getDataString(),
              totalInput: recMes.transCoin,
              totalOutput: 0,
              status: "unconfirmed",
              utxo: recMes.transCoin,
              auth: this.getAuth(),
              fees: recMes.feeCoin,
              feesTransId: transactionsList.transactions.length + 1,
              feeMark: 1,
            };
            this.transactionsList.input.push(tradeInput);
            this.transactionsList.transactions.push(minerTrans);
            //交易费信息处理
            let feeTradeInput = {
              id: transactionsList.input.length,
              index: transactionsList.input.length,
              addressId: from.accountList.address,
              transactionId: "",
              tranValue: mes.recMes.feeCoin,
              pubKeyHash: from.accountList.walletId,
              signature: getSign(),
              auth: this.getAuth(),
            };
            let feeMinerTrans = {
              id: transactionsList.transactions.length,
              hash: sha256("trans" + transactionsList.transactions.length),
              intputId: feeTradeInput.id + "",
              outputId: "",
              createdTime: getDataString(),
              totalInput: recMes.feeCoin,
              totalOutput: 0,
              status: "unconfirmed",
              utxo: recMes.feeCoin,
              auth: this.getAuth(),
              fees: 0,
              feesTransId: "",
              feeMark: 0,
            };
            this.transactionsList.input.push(feeTradeInput);
            this.transactionsList.transactions.push(feeMinerTrans);
            //交易来源与对象数据信息处理
            this.dealFormAndToTrans(
              nodeMesList,
              recMes.from,
              recMes.to,
              minerTrans,
              feeMinerTrans
            );
            // //区块交易信息处理,区块创建时调用
            // this.blcokTradeMesDeal(
            //   blockMesList,
            //   indexB,
            //   minerTrans,
            //   feeMinerTrans
            // );
            //交易信息处理，接收交易之后在处理交易内容
            let titleMesNode = this.systemMsgNode;
            let contentMesNode = this.nodeMesVisList;
            let nodeEndMes = {
              type: mes.type,
              state: 0, //成功
              kind: 0, //0为普通交易类型
              content: minerTrans,
              feeContent: feeMinerTrans,
              from: mes.from.addressId,
              to: mes.to.addressId,
              timestamp: timestampMes,
            };
            titleMesNode.unshift({
              id: titleMesNode.length,
              content:
                "节点" +
                mes.from.addressId +
                "向节点" +
                mes.to.addressId +
                "发起交易接收消息",
            });
            contentMesNode.unshift({
              id: contentMesNode.length,
              contentMessage: nodeEndMes,
              type: mes.type,
              mes:
                "节点" +
                mes.from.addressId +
                "向节点" +
                mes.to.addressId +
                "发起交易接收消息",
            });
            return lineData[0];
          } else {
            this.addRecBreakenMes(mes, 2, "节点持有货币不足", timestampMes);
            return null;
          }
        } else {
          this.addRecBreakenMes(mes, 1, "节点故障", timestampMes);
          return null;
        }
      } else if (mes.type == "BlockTrade") {
        if (!mes.isBreakdownn) {
          //交易线创建
          let lineData = [];
          let from = mes.from;
          let to = mes.to;
          lineData.push({
            point: [from.addressId, to.addressId],
            coords: [from.regionPostion, to.regionPostion],
          });
          // this.changeMapLine(lineData);
          // this.reDrawMaps();
          //传输消息处理
          let mesContent = {
            id: blocMes.id,
            blockId: blocMes.blockId,
            startTimestamp: blocMes.startTimestamp,
            endTimestamp: blocMes.endTimestamp,
            miner: blocMes.miner,
            height: blocMes.height,
            hash: blocMes.hash,
            confirmations: blocMes.confirmations,
            //交易量
            numOfTransac: blocMes.numOfTransac,
            difficulty: blocMes.difficulty,
            nonce: blocMes.nonce,
            transactionVolume: blocMes.transactionVolume,
            reward: blocMes.reward,
            prevBlockHash: blocMes.prevBlockHash,
            feeReward: blocMes.feeReward,
            transactions: [],
            blockMesHeap: null,
          };
          let titleMesNode = this.systemMsgBlock;
          let contentMesNode = this.blockMesVisList;
          let blockEndMes = {
            type: mes.type,
            state: 0, //失败
            kind: 0, //1为节点故障
            content: mesContent,
            from: mes.from.addressId,
            to: mes.to.addressId,
            blockDetail: blockMesList[indexB],
            timestamp: timestampMes,
          };
          titleMesNode.unshift({
            id: titleMesNode.length,
            content:
              "节点" +
              mes.from.addressId +
              "向节点" +
              mes.to.addressId +
              "进行区块传输",
          });
          contentMesNode.unshift({
            id: contentMesNode.length,
            contentMessage: blockEndMes,
            type: mes.type,
            mes:
              "节点" +
              mes.from.addressId +
              "向节点" +
              mes.to.addressId +
              "进行区块传输",
          });
          return lineData[0];
        } else {
          this.addBlockTrBreakenMes(mes, 1, "区块传输失败！", timestampMes);
          return null;
        }
      } else if (mes.type == "tradeRecBlock") {
        if (!mes.isBreakdownn) {
          //交易线创建
          let lineData = [];
          let from = mes.from;
          let to = mes.to;
          lineData.push({
            point: [from.addressId, to.addressId],
            coords: [from.regionPostion, to.regionPostion],
          });
          // this.changeMapLine(lineData);
          // this.reDrawMaps();
          //传输消息接收处理
          let mesContent = {
            id: blocMes.id,
            blockId: blocMes.blockId,
            startTimestamp: blocMes.startTimestamp,
            endTimestamp: blocMes.endTimestamp,
            miner: blocMes.miner,
            height: blocMes.height,
            hash: blocMes.hash,
            confirmations: blocMes.confirmations,
            //交易量
            numOfTransac: blocMes.numOfTransac,
            difficulty: blocMes.difficulty,
            nonce: blocMes.nonce,
            transactionVolume: blocMes.transactionVolume,
            reward: blocMes.reward,
            prevBlockHash: blocMes.prevBlockHash,
            feeReward: blocMes.feeReward,
            transactions: [],
            blockMesHeap: null,
          };
          let titleMesNode = this.systemMsgBlock;
          let contentMesNode = this.blockMesVisList;
          let blockEndMes = {
            type: mes.type,
            state: 0, //失败
            kind: 0, //1为节点故障
            content: mesContent,
            from: mes.from.addressId,
            to: mes.to.addressId,
            blockDetail: blockMesList[indexB],
            tradeTime: getDataString(),
            timestamp: timestampMes,
          };
          titleMesNode.unshift({
            id: titleMesNode.length,
            content:
              "节点" +
              mes.from.addressId +
              "向节点" +
              mes.to.addressId +
              "发送区块传输接收消息",
          });
          contentMesNode.unshift({
            id: contentMesNode.length,
            type: mes.type,
            contentMessage: blockEndMes,
            mes:
              "节点" +
              mes.from.addressId +
              "向节点" +
              mes.to.addressId +
              "发送区块传输接收消息",
          });
          nodeMesList[mes.from.id].chainBlockHeightState = mes.blockHeight + 1;
          return lineData[0];
        } else {
          this.addBlockTrRecBreakenMes(mes, 1, "区块接收失败！", timestampMes);
          return null;
        }
      } else {
        return null;
      }
    },
    ////交易来源与对象数据信息处理
    dealFormAndToTrans(nodeMesList, from, to, minerTrans, feeMinerTrans) {
      //来源信息处理
      nodeMesList[from.id].accountList.totalSent =
        nodeMesList[from.id].accountList.totalSent + minerTrans.totalInput;
      nodeMesList[from.id].accountList.balance =
        nodeMesList[from.id].accountList.balance - minerTrans.totalInput;
      if (from.accountList.transactionsId == "") {
        nodeMesList[from.id].accountList.transactionsId = minerTrans.id + "";
      } else {
        nodeMesList[from.id].accountList.transactionsId =
          nodeMesList[from.id].accountList.transactionsId + "," + minerTrans.id;
      }

      //去向信息处理
      nodeMesList[to.id].accountList.totalReceived =
        nodeMesList[to.id].accountList.totalReceived + minerTrans.totalInput;
      nodeMesList[to.id].accountList.balance =
        nodeMesList[to.id].accountList.balance + minerTrans.totalInput;
      nodeMesList[to.id].accountList.transactions =
        nodeMesList[to.id].accountList.transactions + minerTrans.totalInput;
      if (to.accountList.transactionsId == "") {
        nodeMesList[to.id].accountList.transactionsId = minerTrans.id + "";
      } else {
        nodeMesList[to.id].accountList.transactionsId =
          nodeMesList[to.id].accountList.transactionsId + "," + minerTrans.id;
      }
    },
    //矿工的奖励交易处理
    minerTradeDeal(nodeMesList, minerTrans, mes) {
      nodeMesList[mes.miner.id].chainBlockHeightState = mes.id + 1;
      nodeMesList[mes.miner.id].accountList.transactions =
        minerTrans.totalInput;
      nodeMesList[mes.miner.id].accountList.totalReceived =
        minerTrans.totalInput;
      nodeMesList[mes.miner.id].accountList.balance = minerTrans.totalInput;
      if (nodeMesList[mes.miner.id].accountList.transactionsId == "") {
        nodeMesList[mes.miner.id].accountList.transactionsId =
          minerTrans.id + "";
      } else {
        nodeMesList[mes.miner.id].accountList.transactionsId =
          nodeMesList[mes.miner.id].accountList.transactionsId +
          "," +
          minerTrans.id;
      }
      this.configChangeMes(nodeMesList[mes.miner.id], "transaction");
    },
    //交易输入来源获取
    getInputTrans(nodeMesList, blocMes, mes, targetFrom) {
      let from = nodeMesList[targetFrom.id];
      let conin = mes.transCoin;
      let transListt = "";
      if (from.accountList.transactionsId.indexOf(",") == -1) {
        return from.accountList.transactionsId;
      } else {
        let transList = from.accountList.transactionsId.split(",");
        let tradeList = this.transactionsList;
        for (let i = transList.length - 1; i >= 0; i--) {
          let targetNode = tradeList.transactions[parseInt(transList[i])];
          if (targetNode.utxo > conin) {
            targetNode.utxo = 0;
            if (transListt == "") {
              transListt = targetNode.id;
            } else {
              transListt = targetNode.id + "," + transListt;
            }
          } else {
            conin = conin - targetNode.utxo;
            if (transListt == "") {
              transListt = targetNode.id;
            } else {
              transListt = targetNode.id + "," + transListt;
            }
          }
        }
      }
      return transListt;
    },
    //交易输入来源设置与获取
    setTargetInputTrans(nodeMesList, blocMes, mes, targetFrom) {
      let from = nodeMesList[targetFrom.id];
      let conin = mes.transCoin;
      let transListt = "";
      if (from.accountList.transactionsId.indexOf(",") == -1) {
        let transList = this.transactionsList;
        let transactionsId = parseInt(
          nodeMesList[from.id].accountList.transactionsId
        );
        let outPut = {
          id: transList.output.length,
          index: transList.output.length,
          addressId: mes.to.accountList.address,
          tranValue: mes.transCoin,
          pubKeyHash: from.accountList.walletId,
          transactionId: from.accountList.transactionsId + "",
          auth: this.getAuth(),
        };

        if (transList.transactions[transactionsId].outputId == "") {
          this.transactionsList.transactions[transactionsId].outputId =
            outPut.id + "";
        } else {
          this.transactionsList.transactions[transactionsId].outputId =
            this.transactionsList.transactions[transactionsId].outputId +
            "," +
            outPut.id;
        }
        let j = transList.transactions[transactionsId].utxo - mes.transCoin;
        if (j < 0) {
          let asweallknow = 0;
        }
        this.transactionsList.transactions[transactionsId].utxo =
          transList.transactions[transactionsId].utxo - mes.transCoin;
        this.transactionsList.output.push(outPut);
        return from.accountList.transactionsId;
      } else {
        let transList = from.accountList.transactionsId.split(",");
        let tradeList = this.transactionsList;
        for (let i = transList.length - 1; i >= 0; i--) {
          let targetNode = tradeList.transactions[parseInt(transList[i])];
          if (targetNode.utxo > conin) {
            targetNode.utxo = targetNode.utxo - conin;
            if (transListt == "") {
              transListt = targetNode.id;
            } else {
              transListt = targetNode.id + "," + transListt;
            }
            let outPut = {
              id: tradeList.output.length,
              index: tradeList.output.length,
              addressId: mes.to.accountList.address,
              tranValue: mes.transCoin,
              pubKeyHash: from.accountList.walletId,
              transactionId: targetNode.id + "",
              auth: this.getAuth(),
            };
            if (tradeList.transactions[targetNode.id].outputId == "") {
              this.transactionsList.transactions[targetNode.id].outputId =
                outPut.id + "";
            } else {
              this.transactionsList.transactions[targetNode.id].outputId =
                this.transactionsList.transactions[targetNode.id].outputId +
                "," +
                outPut.id;
            }

            this.transactionsList.transactions[targetNode.id].utxo =
              targetNode.utxo;
            this.transactionsList.output.push(outPut);
            break;
          } else {
            if (targetNode.utxo != 0) {
              conin = conin - targetNode.utxo;
              if (transListt == "") {
                transListt = targetNode.id;
              } else {
                transListt = targetNode.id + "," + transListt;
              }
              let outPut = {
                id: tradeList.output.length,
                index: tradeList.output.length,
                addressId: mes.to.accountList.address,
                tranValue: mes.transCoin,
                pubKeyHash: from.accountList.walletId,
                transactionId: targetNode.id + "",
                auth: this.getAuth(),
              };
              if (tradeList.transactions[targetNode.id].outputId == "") {
                this.transactionsList.transactions[targetNode.id].outputId =
                  outPut.id + "";
              } else {
                this.transactionsList.transactions[targetNode.id].outputId =
                  this.transactionsList.transactions[targetNode.id].outputId +
                  "," +
                  outPut.id;
              }
              this.transactionsList.transactions[targetNode.id].utxo = 0;
              this.transactionsList.output.push(outPut);
            }
          }
        }
        return transListt;
      }
    },
    // setOutputContent() {},
    //临时交易信息的处理
    addBreakenMes(mes, kind, content, timestampMes) {
      let titleMesNode = this.systemMsgNode;
      let contentMesNode = this.nodeMesVisList;
      let nodeEndMes = {
        type: mes.type,
        state: 1, //失败
        kind: kind, //1为节点故障，2为交易货币量级不足
        content: content,
        from: mes.from.addressId,
        to: mes.to.addressId,
        timestamp: timestampMes,
      };
      this.unconfirmedTransactions.transactions.length = 0;
      this.unconfirmedTransactions.transactions.push({
        isBreakdownn: 0,
        nodeTo: mes.to.addressId,
      });
      titleMesNode.unshift({
        id: titleMesNode.length,
        content:
          "节点" +
          mes.from.addressId +
          "向节点" +
          mes.to.addressId +
          "发起交易请求失败",
      });
      contentMesNode.unshift({
        id: contentMesNode.length,
        contentMessage: nodeEndMes,
        type: mes.type,
        mes:
          "节点" +
          mes.from.addressId +
          "向节点" +
          mes.to.addressId +
          "发起交易请求失败",
      });
    },
    addRecBreakenMes(mes, kind, content, timestampMes) {
      if (
        this.unconfirmedTransactions.transactions.length >= 1 &&
        this.unconfirmedTransactions.transactions[0].isBreakdownn != 0
      ) {
        let titleMesNode = this.systemMsgNode;
        let contentMesNode = this.nodeMesVisList;
        let nodeEndMes = {
          type: mes.type,
          state: 1, //失败
          kind: kind, //1为节点故障
          content: content,
          from: mes.from.addressId,
          to: mes.to.addressId,
          timestamp: timestampMes,
        };
        titleMesNode.unshift({
          id: titleMesNode.length,
          content:
            "节点" +
            mes.from.addressId +
            "向节点" +
            mes.to.addressId +
            "发送接收消息失败",
        });
        contentMesNode.unshift({
          id: contentMesNode.length,
          contentMessage: nodeEndMes,
          type: mes.type,
          mes:
            "节点" +
            mes.from.addressId +
            "向节点" +
            mes.to.addressId +
            "发送接收消息失败",
        });
      }
    },
    //区块传输消息处理
    addBlockTrBreakenMes(mes, kind, content, timestampMes) {
      let titleMesNode = this.systemMsgBlock;
      let contentMesNode = this.blockMesVisList;
      let blockEndMes = {
        type: mes.type,
        state: 1, //失败
        kind: kind, //1为节点故障
        content: content,
        from: mes.from.addressId,
        to: mes.to.addressId,
        timestamp: timestampMes,
      };
      titleMesNode.unshift({
        id: titleMesNode.length,
        content:
          "节点" +
          mes.from.addressId +
          "向节点" +
          mes.to.addressId +
          "发送区块消息失败",
      });
      contentMesNode.unshift({
        id: contentMesNode.length,
        contentMessage: blockEndMes,
        type: mes.type,
        mes:
          "节点" +
          mes.from.addressId +
          "向节点" +
          mes.to.addressId +
          "发送区块消息失败",
      });
      this.blockTransmitMes.length = 0;
      this.blockTransmitMes.push({ isBreakdownn: 0, nodeTo: mes.to.addressId });
    },
    //区块传输接收消息处理
    addBlockTrRecBreakenMes(mes, kind, content, timestampMes) {
      if (
        this.blockTransmitMes.length >= 1 &&
        this.blockTransmitMes[0].isBreakdownn != 0 &&
        this.blockTransmitMes[0].nodeTo == mes.from.addressId
      ) {
        let titleMesNode = this.systemMsgBlock;
        let contentMesNode = this.blockMesVisList;
        let blockEndMes = {
          type: mes.type,
          state: 1, //失败
          kind: kind, //1为节点故障
          content: content,
          from: mes.from.addressId,
          to: mes.to.addressId,
          timestamp: timestampMes,
        };
        titleMesNode.unshift({
          id: titleMesNode.length,
          content:
            "节点" +
            mes.from.addressId +
            "接收节点" +
            mes.to.addressId +
            "的区块消息失败",
        });
        contentMesNode.unshift({
          id: contentMesNode.length,
          contentMessage: blockEndMes,
          type: mes.type,
          mes:
            "节点" +
            mes.from.addressId +
            "接收节点" +
            mes.to.addressId +
            "的区块消息失败",
        });
      }
    },
    blcokCreateMesDeal(blockMesList, indexB, minerTrans, WholeSimData) {
      let confirmedId = minerTrans.id + "";
      let transactionsList = this.transactionsList;
      //交易列表内不存在信息时直接导入
      if (transactionsList.transactions.length == 0) {
        blockMesList[indexB].transactionVolume =
          blockMesList[indexB].transactionVolume + minerTrans.totalInput;
        blockMesList[indexB].numOfTransac++;
        blockMesList[indexB].transactions.push(minerTrans.id);
      } else {
        //交易列表内存在信息时选择信息载入
        let index = 0;
        blockMesList[indexB].numOfTransac =
          blockMesList[indexB].numOfTransac + 1;
        blockMesList[indexB].transactionVolume =
          blockMesList[indexB].transactionVolume + minerTrans.totalInput;
        blockMesList[indexB].transactions.push(minerTrans.id);
        for (let i = 0; i < transactionsList.transactions.length; i++) {
          if (
            index <= WholeSimData.numOfTransInblock - 1 &&
            transactionsList.transactions[i].status == "unconfirmed"
          ) {
            transactionsList.transactions[i].status = "confirmed";
            blockMesList[indexB].transactionVolume =
              blockMesList[indexB].transactionVolume +
              transactionsList.transactions[i].utxo;
            blockMesList[indexB].numOfTransac++;
            blockMesList[indexB].transactions.push(
              transactionsList.transactions[i].id
            );
            confirmedId =
              transactionsList.transactions[i].id + "," + confirmedId;
          }
        }
      }
      return confirmedId;
    },
    blcokTradeMesDeal(blockMesList, indexB, minerTrans, feeMinerTrans) {
      blockMesList[indexB].numOfTransac =
        blockMesList[indexB].numOfTransac +
        minerTrans.totalInput +
        feeMinerTrans.totalInput;
      blockMesList[indexB].transactions.push(minerTrans.id);
      blockMesList[indexB].transactions.push(feeMinerTrans.id);
    },
    //     mySetInterval(fn, millisec,count){
    //   function interval(){
    //     if(typeof count===‘undefined’||count-->0){
    //       setTimeout(interval, millisec);
    //       try{
    //         fn()
    //       }catch(e){
    //         count = 0;
    //         throw e.toString();
    //       }
    //     }
    //   }
    //   setTimeout(interval, millisec)
    // },
    setSummary(wholesimData, summaryMes) {
      summaryMes[0].data = getDataString();
      this.simFlowTime.timeString = summaryMes[0].data;
      this.simFlowTime.timeData = new Date();
      this.simFlowTime.startTimeData = new Date();
      summaryMes[1].data = getTargetDataStr(this.simDataEndtime);
      summaryMes[2].data = wholesimData.numOfNodes + "";
      summaryMes[3].data = 0;
      summaryMes[5].data = wholesimData.blockReward + "";
      summaryMes[6].data = wholesimData.transRePer * 100 + "%";
      summaryMes[7].data = wholesimData.numOfNodes + "";
    },
    findDetailTrans(idOrList) {
      idOrList = idOrList + "";
      this.blockTableData.length = 0;
      if (idOrList.indexOf(",") == -1) {
        let res = this.transactionsList.transactions[parseInt(idOrList)];
        this.blockTableData.push({
          id: res.id,
          hash: res.hash,
          inputId: res.intputId,
          outputsId: res.outputId,
          totalInput: res.totalInput,
          totalOutput: res.totalOutput,
          createTime: res.createdTime,
          status: res.status,
          utxo: res.utxo,
        });
        let j = 1;
      } else {
        let idListS = idOrList.split(",");
        let lengths = idListS.length;
        for (let i = 0; i < lengths; i++) {
          let res = this.transactionsList.transactions[idListS[i]];
          let j = 1;
          this.blockTableData.push({
            id: res.id,
            hash: res.hash,
            inputId: res.intputId,
            outputsId: res.outputId,
            totalInput: res.totalInput,
            totalOutput: res.totalOutput,
            createTime: res.createdTime,
            status: res.status,
            utxo: res.utxo,
          });
        }
      }
      this.innerDrawer = true;
    },
    getInputData(Id) {
      Id = Id + "";
      if (Id != null) {
        let res = this.transactionsList.input[parseInt(Id)];

        if (res != null || res != "") {
          this.inputData.id = res.id;
          this.inputData.address = res.addressId;
          this.inputData.signature = res.signature;
          this.inputData.pubKey = res.pubKeyHash.publicKey;
          this.inputData.transId = res.transactionId;
          this.inputData.tranValue = res.tranValue;
          this.dialogInputVisible = true;
          this.dialogTransVisible = false;
        } else {
          ElMessageBox.alert("查看失败", "WARN", {
            confirmButtonText: "OK",
          });
        }
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    },
    getOutputData(Id) {
      Id = Id + "";
      if (Id != null) {
        if (Id.indexOf(",") == -1) {
          this.dialogDetailTransVisible = false;
          let res = this.transactionsList.output[parseInt(Id)];
          if (res != null || res != "") {
            this.outputData.id = res.id;
            this.outputData.address = res.addressId;
            this.outputData.tranValue = res.tranValue;
            this.outputData.transId = res.transactionId;
            this.dialogOutPutVisible = true;
            this.dialogTransVisible = false;
          } else {
            ElMessageBox.alert("查看失败", "WARN", {
              confirmButtonText: "OK",
            });
          }
        } else {
          this.getDataContain(Id);
          setTimeout(() => {
            this.dialogDetailTransVisible = true;
          }, 100);
        }
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    },
    getTransData(Id) {
      Id = Id + "";
      if (Id != null) {
        let res = this.transactionsList.transactions[parseInt(Id)];
        if (res != null || res != "") {
          this.transData.id = res.id;
          this.transData.hash = res.hash;
          this.transData.inputId = res.intputId;
          this.transData.outputId = res.outputId;
          this.transData.createTime = res.createdTime;
          this.transData.totalInput = res.totalInput;
          this.transData.totalOutput = res.totalOutput;
          this.transData.status = res.status;
          this.transData.utxo = res.utxo;
          this.dialogTransVisible = true;
          this.dialogInputVisible = false;
          this.dialogOutPutVisible = false;
        } else {
          ElMessageBox.alert("查看失败", "WARN", {
            confirmButtonText: "OK",
          });
        }
      } else {
        ElMessageBox.alert("信息不存在!", "Message", {
          confirmButtonText: "OK",
        });
      }
    },
    getDataContain(val) {
      if (val.indexOf(",") == -1) {
        return true;
      } else {
        //包含目标符号时targetTransData
        let dataS = val.split(",");
        this.targetTransData.length = 0;
        for (let j = 0; j < dataS.length; j++) {
          this.targetTransData.push(dataS[j]);
        }
        return false;
      }
    },
    configChangeMes(mes, type) {
      let changeTYpeList = this.changeInThisSim;
      if (type == "node") {
        if (this.changeInThisSim.node.indexOf(mes.id) == -1) {
          this.changeInThisSim.node.push(mes.id);
        }
      } else if (type == "block") {
        if (this.changeInThisSim.block.indexOf(mes.id) == -1) {
          this.changeInThisSim.block.push(mes.id);
        }
      } else if (type == "transaction") {
        if (this.changeInThisSim.transaction.indexOf(mes.id) == -1) {
          this.changeInThisSim.transaction.push(mes.id);
        }
      } else if (type == "input") {
        if (this.changeInThisSim.input.indexOf(mes.id) == -1) {
          this.changeInThisSim.input.push(mes.id);
        }
      } else if (type == "output") {
        if (this.changeInThisSim.output.indexOf(mes.id) == -1) {
          this.changeInThisSim.output.push(mes.id);
        }
      } else {
        this.changeInThisSim.node.length = 0;
        this.changeInThisSim.block.length = 0;
        this.changeInThisSim.transaction.length = 0;
        this.changeInThisSim.input.length = 0;
        this.changeInThisSim.output.length = 0;
      }
    },
    reStartSim() {
      location.reload();
      // let localTime = this.simFlowTime.timeData.getTime() + 600000;
      // this.simFlowTime.timeData = new Date(localTime);
      // this.simFlowTime.timeString = getDataString(this.simFlowTime.timeData);
    },
    simDataGetlist5() {
      let targetEnd = {
        wholeNodeType: null,
        blockList:null ,
        transactionList: null,
        inputList: null,
        outputList: null,
        auth: this.getAuth(),
        wholeSimIds: 0,
      };
      getConfigSimData(targetEnd).then((resnode) => {
          this.blockDataTableData.length=0;
          if(resnode.length>0){
            for(let i =0;i<resnode.length;i++){
              this.blockDataTableData.push({
                id:resnode[i].id,
                numOfNodes:resnode[i].numOfNodes,
                numOfBlocks:resnode[i].numOfBlocks,
                simEndTime:resnode[i].simEndTime
              })
            }
          }
          this.simDataeVisible = true;
      });
      
    },
    setVmSimTimeChange(time) {
      let localTime = this.simFlowTime.startTimeData.getTime() + time;
      // let target = localTime + time;
      this.simFlowTime.timeData = new Date(localTime);
      this.simFlowTime.timeString = getDataString(this.simFlowTime.timeData);
    },
    setVmSimEndTimeChange() {
      // let target = localTime + time;
      let j = Math.random();
      let targetTime = 0;
      if (j > 0.5) {
        targetTime = -6000;
      }
      this.simFlowTime.timeData = new Date(
        this.simDataEndtime.getTime() + targetTime
      );
      this.simFlowTime.timeString = getDataString(this.simFlowTime.timeData);
    },
    dealtargetTeime(timestampMes) {
      let localTime = this.simFlowTime.startTimeData.getTime() + timestampMes;
      return localTime;
    },
    setoptionsNode(nodeMesLists) {
      this.optionsNode.length = 0;
      this.valueNodeStatue = false;
      for (let i = 0; i < nodeMesLists.length; i++) {
        this.optionsNode.push({
          value: nodeMesLists[i].id,
          label: nodeMesLists[i].addressId,
        });
      }
    },
    searTargetMesList() {
      let is = 1;
      let contents = this.sysMesStatesContent;
      let content = contents.toLowerCase();
      let mesList1 = this.blockMesVisList;
      let mesList2 = this.nodeMesVisList;
      this.searchMesList.length = 0;
      if (content.indexOf("node") != -1) {
        for (let i = 0; i < mesList2.length; i++) {
          if (
            mesList2[i].contentMessage.type == "blockCreated" ||
            mesList2[i].contentMessage.type == "blockOrphanCreated"
          ) {
            let targetminer = mesList2[i].contentMessage.miner;
            if (targetminer.toLowerCase().indexOf(content) != -1) {
              
              this.searchMesList.push(mesList2[i]);
            }
          } else {
            let targetfrom = mesList2[i].contentMessage.from;
            let targetto = mesList2[i].contentMessage.to;
            if (
              targetfrom.toLowerCase().indexOf(content) != -1 ||
              targetto.toLowerCase().indexOf(content) != -1
            ) {
              this.searchMesList.push(mesList2[i]);
            }
          }
        }
        this.dialogSearchDataVisible = true;
      } else if (content.indexOf("block") != -1) {
        for (let i = 0; i < mesList1.length; i++) {
          if (
            mesList1[i].contentMessage.type == "blockCreated" ||
            mesList1[i].contentMessage.type == "blockOrphanCreated"
          ) {
            let targetminer = mesList1[i].contentMessage.content.blockId;
            if (targetminer.toLowerCase().indexOf(content) != -1) {
              this.searchMesList.push(mesList1[i]);
            }
          } else {
            let targetfrom = mesList1[i].contentMessage.blockDetail.blockId;
            if (targetfrom.toLowerCase().indexOf(content) != -1) {
              this.searchMesList.push(mesList1[i]);
            }
          }
        }
        this.dialogSearchDataVisible = true;
      } else if (content.indexOf("挖掘") != -1) {
        for (let i = 0; i < mesList2.length; i++) {
          if (mesList2[i].mes.indexOf(content) != -1) {
            this.searchMesList.push(mesList2[i]);
          }
        }
        this.dialogSearchDataVisible = true;
      } else {
        ElMessageBox.alert(
          "请输入正确形式的搜索内容,形式分为节点ID(node1)、区块ID(block1)、挖掘等",
          "通知",
          {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: "OK",
          }
        );
      }
    },
  },
};
</script>

<style>
.bs-sysMsg {
  margin-top: 10%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  position: absolute;
  background-color: #fff;
  width: 19%;
  height: auto;
  z-index: 999;
  padding: 0 1%;
  opacity: 0.8;
}
.bs-sysMsg-summary {
  margin-top: 10%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  position: absolute;
  background-color: #fff;
  right: 0px;
  width: 18%;
  height: auto;
  z-index: 999;
  padding: 0 1%;
  opacity: 0.8;
}

.reStarteSim {
  margin-top: 1%;
  position: absolute;
  background-color: #fff;
  right: 2%;
  width: 8%;
  height: auto;
  z-index: 999;
  padding: 0 1%;
  opacity: 0.8;
}
.simDataGet {
  margin-top: 43%;
  position: absolute;
  background-color: #fff;
  right: 2%;
  width: 8%;
  height: auto;
  z-index: 999;
  padding: 0 1%;
  opacity: 0.8;
}
.wholeSimTeamstamp {
  /* margin-top: 1%; */
  position: absolute;
  background-color: #fff;
  left: 1px;
  width: 12%;
  height: auto;
  z-index: 999;
  padding: 0 1%;
  opacity: 0.8;
}
.wholeSimTeamstamp .el-input.is-disabled .el-input__inner {
  color: rgb(120, 114, 0);
}
.wholeSimNodeMes {
  margin-top: 4%;
  position: absolute;
  background-color: #fff;
  right: 3%;
  width: 10%;
  z-index: 999;
  opacity: 0.8;
}
.map-content {
  position: relative;
  width: 100%;
  height: 96%;
  z-index: 199;
}
.wholeSimSlider {
  position: absolute;
  margin-left: 8%;
  padding: 0 2%;
  height: 10%;
  width: 80%;
  bottom: 10px;
  background-color: rgb(255, 255, 255);
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  z-index: 998;
}
.sliderbox {
  padding-top: 2%;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.el-select {
  position: absolute;
  left: 20px;
  top: 20px;
}
#map {
  position: absolute;
  width: 100%;
  height: 100%;
}
.cardContent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 315px;
}
.cardSeting {
  margin-left: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 49%;
  height: auto;
}
.cardSeting2 {
  margin-left: 1%;
  display: flex;

  width: 49%;
  height: auto;
}
.mesBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: auto;
}
.iconfont {
  color: #fff;
}
.event-content {
  width: 100%;
  height: 35px;
  display: flex;
}
summary-content {
  width: 100%;
  height: 35px;
}
.event-mes-block-node {
  width: 80%;
  height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-detail {
  width: 20%;
  height: 35px;
}
.event-detail-buttom {
  font-size: 18px;
}
.event-detail-buttom:hover {
  cursor: pointer;
}
/* .closebold {
} */
.closebold:hover {
  cursor: pointer;
}
.searchStartButton {
  padding-left: 20%;
  padding-top: 2px;
}
.searchStartButton:hover {
  cursor: pointer;
}
.dataImport {
  margin-top: 20px;
  margin-left: 43%;
}
.nodeDetail1 {
  /* display: flex; */
  padding-right: 10px;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: auto;
}
.nodeDetail1Account {
  /* display: flex; */
  justify-content: center;
  align-items: center;
  width: 70%;
  height: auto;
}
</style>                                                  

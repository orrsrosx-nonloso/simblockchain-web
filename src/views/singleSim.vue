<template>
  <el-scrollbar height="100%">
    <el-row :gutter="3">
      <el-col :span="4"
        ><div class="grid-content">
          <div class="base_title">节点操作</div>
          <div class="drag-box">
            <div class="list-complete-item1">
              <div class="list-complete-item-handle2">节点生成</div>
            </div>
          </div>
          <div class="base_title">区块操作</div>
          <div class="drag-box">
            <Draggable
              :list="block2"
              item-key="id"
              :animation="100"
              :sort="false"
              :group="{ name: 'article2', pull: 'clone' }"
              @end="end1"
              class="dragArea1"
            >
              <template #item="{ element }">
                <div class="list-complete-item1">
                  <div class="list-complete-item-handle2">{{ element.name }}</div>
                </div>
              </template>
            </Draggable>
          </div>
        </div></el-col
      >
      <el-col :span="14"
        ><div class="grid-content">
          <div class="drag-box">
            <el-card class="box-card" :body-style="{ padding: '5px', height: '538px' }">
              <template #header>
                <div class="card-header">
                  <span>节点与区块</span>
                  <div>
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
                <super-flow
                  ref="superFlow"
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
              </div>

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
              <div class="card-header">
                <span>SUMMARY</span>
              </div>
            </template>
            <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
          </el-card>
          <el-card class="box-card" :body-style="{ padding: '5px', height: '237px' }">
            <template #header>
              <div class="card-header">
                <span>EVENT</span>
              </div>
            </template>
            <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
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
        >
          <div class="demo-drawer__content">
            <el-form :model="form">
              <el-descriptions :column="1" border>
                <el-descriptions-item
                  label="Address"
                  label-align="center"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  >18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX</el-descriptions-item
                >
                <el-descriptions-item
                  label="Transactions"
                  label-align="center"
                  align="center"
                  >30,838</el-descriptions-item
                >
                <el-descriptions-item
                  label="Total Received"
                  label-align="center"
                  align="center"
                >
                  289155.43415856 BTC</el-descriptions-item
                >
                <el-descriptions-item
                  label="Total Sent"
                  label-align="center"
                  align="center"
                >
                  289086.00621223 BTC
                </el-descriptions-item>
                <el-descriptions-item
                  label="Final Balance"
                  label-align="center"
                  align="center"
                  >69.42794633 BTC</el-descriptions-item
                >
              </el-descriptions>
              <el-button type="text" @click="innerDrawer = true"
                >节点内所有交易详情</el-button
              >
              <el-drawer
                v-model="innerDrawer"
                direction="ltr"
                title="I'm inner Drawer"
                :append-to-body="true"
                :before-close="NodeDetailHandleClose"
              >
                <p>_(:зゝ∠)_</p>
              </el-drawer>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button @click="cancelForm">Cancel</el-button>
              <el-button type="primary" :loading="loading" @click="onClick">{{
                loading ? "Submitting ..." : "Submit"
              }}</el-button>
            </div>
          </div>
        </el-drawer>
        <el-drawer
          ref="drawerRef"
          v-model="dialog2"
          title="I have a nested form inside!"
          :before-close="handleClose"
          direction="rtl"
          custom-class="demo-drawer"
          size="40%"
        >
          <div class="demo-drawer__content">
            <el-form :model="form">
              <el-form-item label="Name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Area" :label-width="formLabelWidth">
                <el-select
                  v-model="form.region"
                  placeholder="Please select activity area"
                >
                  <el-option label="Area1" value="shanghai"></el-option>
                  <el-option label="Area2" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button @click="cancelForm2">Cancel</el-button>
              <el-button type="primary" :loading="loading" @click="onClick2">{{
                loading ? "Submitting ..." : "Submit"
              }}</el-button>
            </div>
          </div>
        </el-drawer>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script lang="ts">
import { ref, reactive } from "vue";
import Draggable from "vuedraggable";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import type { ElDrawer } from "element-plus";
const drawerType = {
  node: 0,
  link: 1,
};

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
    const dialog2 = ref(false);
    const loading = ref(false);

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
      ElMessageBox.confirm("Do you want to submit?")
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
      ElMessageBox.confirm("Do you want to submit?")
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
      ElMessageBox.confirm("Do you want to submit?")
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
      NodeDetailHandleClose,
    };
  },
  data() {
    return {
      drawerType,
      linkSetting: {
        desc: "",
      },
      nodeSetting: {
        name: "",
        desc: "",
      },
      //连线集合
      linkList: [],
      linkListId: [],
      nodeListId: [],
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
              label: "1",
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
              label: "2",
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
              graph.addNode({
                width: 100,
                height: 30,
                coordinate,
                meta: {
                  label: "1",
                  name: "节点",
                },
              });
            },
          },
          {
            label: "新键区块",
            selected(graph, coordinate) {
              graph.addNode({
                width: 100,
                height: 30,
                coordinate,
                meta: {
                  label: "2",
                  name: "区块",
                },
              });
            },
          },
          {
            label: "创世块",
            disable(graph) {
              return !!graph.nodeList.find((node) => node.meta.label === "3");
            },
            selected(graph, coordinate) {
              graph.addNode({
                width: 100,
                height: 30,
                coordinate,
                meta: {
                  label: "3",
                  name: "genesisBlock",
                },
              });
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
          {
            label: "保存",
            selected: (graph) => {
              console.log("josn", graph.toJSON());
            },
          },
        ],
      ],
      nodeMenu: [
        [
          {
            label: "删除",
            selected: (node) => {
              node.remove();
            },
          },
          {
            label: "编辑",
            selected: (node) => {
              console.log("关了吧");
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
            label: "编辑",
            selected: (link) => {
              console.log("change");
            },
          },
        ],
      ],
      //概要信息
      summaryMes:reactive([
        {
          tabName:"仿真时间:",
          data:"0"
        },
        {
          tabName:"区块数量:",
          data:"0"
        },
        {
          tabName:"节点数量:",
          data:"0"
        },
        {
          tabName:"First block:",
          data:"0"
        },
        {
          tabName:"Last block:",
          data:"0"
        },
        {
          tabName:"传播延迟:",
          data:"0"
        },
        {
          tabName:"交易发生次数:",
          data:"0"
        },
      ]),
      //详情信息
      eventMes:reactive([
          {
            eventName:"仿真准备:",
            data:"START!"
          }
      ]),

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
    };
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
    flowNodeClick(meta) {
      console.log(this.$refs.superFlow.graph);
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

        // 判断鼠标是否进入 flow container
        if (clientX > left && clientX < right && clientY > top && clientY < bottom) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          );

          // 添加节点或区块
          if (conf.info.meta.prop == "node") {
            const nodelist = this.$refs.superFlow.graph;
            this.$refs.superFlow.addNode({
              coordinate,
              ...conf.info,
            });
          } else {
            const nodeEx = this.haveNodeMe(this.$refs.superFlow.graph);
            if (nodeEx) {
              this.$refs.superFlow.addNode({
                coordinate,
                ...conf.info,
              });
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
  background: #e5e9f2;
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
}

.item {
  margin-bottom: 18px;
}
.el-drawer__title {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 10px;
  padding: var(--el-drawer-padding-primary);
  padding-bottom: 0;
}
</style>

<template>
  <div>
    <retrieval
      :retrievalList="retrievalList"
      :retrievalActionBtn="retrievalActionBtn"
      @retrievalAction="retrievalAction"
    >
      <!-- 自定义检索 -->
      <template
        v-slot:custom="{form, props, slotChange}"
      >
        <el-input v-model="form[props]" placeholder="自定义检索" @change="slotChange"></el-input>
      </template>
    </retrieval>
    <table-box
      :tableData="state.tableData"
      :tableColumn="tableColumn"
      :selection="true"
      :selectedData="selectedData"
      :routeRoles="route.meta.roles"
      @actionClick="actionClick"
    >
      <!-- 自定义列 -->
      <template
        v-slot:status="{row}"
      >
        <i
          class="el-icon-circle-check"
          v-if="row.status"
        ></i>
        <i
          class="el-icon-circle-close"
          v-else
        ></i>
      </template>
    </table-box>
    <pagination
      :current-page="state.page"
      :page-size="state.pageSize"
      :total="state.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import retrieval from "../components/retrieval.vue";
import tableBox from "../components/table.vue";
import pagination from "../components/pagination.vue";
import { reactive, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
const message = getCurrentInstance()?.appContext.config.globalProperties
  .$message;
const confirm = getCurrentInstance()?.appContext.config.globalProperties
  .$confirm;

const route = useRoute();

// ----------------------------------------------------检索配置

const options = [
  {
    label: "全部",
    value: "",
  },
  {
    label: "值1",
    value: "1",
  },
  {
    label: "值2",
    value: "2",
  },
];

const retrievalList = [
  {
    props: "input",
    label: "输入框",
    type: "input",
    default: "111",
  },
  {
    props: "select",
    label: "下拉检索",
    type: "select",
    options: options,
    default: "1",
  },
  {
    props: "daterange",
    label: "时间搜索",
    type: "date",
    dateType: "daterange",
    default: [new Date(), new Date().getTime() - 3600 * 1000 * 24 * 7],
  },
  {
    props: "custom",
    label: "自定义检索",
    type: "slot",
    default: "1",
  },
];
// add新增 retrieval查询 reset重置 download导出
const retrievalActionBtn = ["add", "retrieval"];

function retrievalAction(e) {
  console.log(e);
}

// --------------------------------------------------表格配置
const selectedData = [
  {
    id: 1,
    date: "2022-05-04",
    name: "orrsrosx",
    address: "内蒙古大学",
  },
  {
    id: 2,
    date: "2022-05-01",
    name: "orrsrosx",
    address: "内蒙古大学",
  },
];

const tableColumn = [
  {
    type: "index",
    label: "序号",
  },
  {
    prop: "date",
    label: "日期",
  },
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "address",
    label: "地址",
  },
  {
    prop: "status",
    label: "状态",
    slot: true,
  },
  {
    type: "action",
    label: "操作列",
    width: "150",
    actionBtn: [
      // 如果要做权限，这里的funName需要和路由菜单中meta的auth一致
      {
        funName: "detail",
        title: "详情",
      },
      {
        funName: "edit",
        color: "orange",
        title: "编辑",
      },
      {
        funName: "del",
        color: "red",
        title: "删除",
      },
    ],
  },
];
const state = reactive({
  page: 1,
  pageSize: 10,
  total: 100,
  tableData: [
    {
      id: 3,
      date: "2022-05-02",
      name: "orrsrosx",
      address: "内蒙古大学",
      status: false,
    },
    {
      id: 1,
      date: "2022-05-04",
      name: "orrsrosx",
      address: "内蒙古大学",
      status: false,
    },
    {
      id: 2,
      date: "2022-05-01",
      name: "orrsrosx",
      address: "内蒙古大学",
      status: false,
    },
    {
      id: 4,
      date: "2022-05-03",
      name: "orrsrosx",
      address: "内蒙古大学",
      status: true,
    },
  ],
});
function handleCurrentChange(e) {
  console.log(e);
  state.page = e;
}
function actionClick(e) {
  console.log(e);
  if (e.funName === "del") {
    confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        message({
          type: "success",
          message: "删除成功!",
        });
      })
      .catch(() => {
        message({
          type: "info",
          message: "已取消删除",
        });
      });
  }
}
</script>
<style lang='scss' scoped>
</style>
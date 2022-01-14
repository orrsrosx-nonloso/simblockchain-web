<template>
  <div>
    <retrieval
      :retrievalList="retrievalList"
      :retrievalActionBtn="retrievalActionBtn"
      @retrievalAction="retrievalAction"
    />
    <table-box
      v-loading="tableLoading"
      :tableData="state.tableData"
      :tableColumn="tableColumn"
      @actionClick="actionClick"
    >
      <!-- 自定义列 -->
      <template v-slot:status="{row}">
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
    <!-- 权限菜单 -->
    <el-dialog
      title="权限菜单"
      v-model="state.centerDialogVisible"
      width="50%"
      center
    >
      <tree
        :authMenus="state.authMenus"
        :auth="state.dialogAuth"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="state.centerDialogVisible = false"
          >确 定</el-button>
          <el-button @click="state.centerDialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import retrieval from "../components/retrieval.vue";
import tableBox from "../components/table.vue";
import pagination from "../components/pagination.vue";
import { reactive, getCurrentInstance, onMounted, nextTick, toRef, ref } from "vue";
import { useRoute } from "vue-router";
import { getRoutesApi, getRolesApi } from "../api/apis";
const message = getCurrentInstance()?.appContext.config.globalProperties
  .$message;
const confirm = getCurrentInstance()?.appContext.config.globalProperties
  .$confirm;

// 检索条件
const retrievalList = [
  {
    props: "role",
    label: "权限名",
    type: "input",
    default: "",
  },
];

// add新增 retrieval查询 reset重置 download导出
const retrievalActionBtn = ["reset", "add", "retrieval"];

function retrievalAction(e) {
  state.page = 1;
  const searchLists = e.form;
  const params = {
    search: true,
    searchLists: {
      ...searchLists,
    },
  };
  getRolesData(params);
}
// --------------------------------------------------虚拟权限菜单
const route = useRoute();
// --------------------------------------------------表格配置
const tableColumn = [
  {
    type: "index",
    label: "序号",
  },
  {
    prop: "role",
    label: "权限名称",
  },
  {
    prop: "name",
    label: "权限中文名称",
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
    ],
  },
];
const state = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  dialogAuth: "",
  tableData: [],
  authMenus: [],
});
function handleCurrentChange(e) {
  if (e) {
    state.page = e;
    getRolesData();
  }
}
function actionClick(e) {
  if (e.funName === "detail") {
    getAuthRoutes("admin").then((res) => {
      state.dialogAuth = e.data.role;
      state.centerDialogVisible = true;
      nextTick(() => {
        state.authMenus = res;
      });
    });
  }
}

onMounted(() => {
  getRolesData();
});
const tableLoading = ref(true)
function getRolesData(data) {
  tableLoading.value = false
  getRolesApi({ page: state.page, limit: state.pageSize, ...data }).then(
    (res) => {
      state.tableData = res.data;
      state.total = res.total;
      tableLoading.value = false
    }
  );
}

function getAuthRoutes(auth) {
  return new Promise((resolve) => {
    getRoutesApi({ page: 1, limit: 100, auth: auth }).then((res) => {
      const { data } = res;
      resolve(data);
    });
  });
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
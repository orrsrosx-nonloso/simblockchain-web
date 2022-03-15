<template>
  <div>
    <retrieval
      :retrievalList="retrievalList"
      :retrievalActionBtn="retrievalActionBtn"
      @retrievalAction="retrievalAction"
    >
      <!-- 自定义检索 -->
      <template v-slot:custom="{ form, props, slotChange }">
        <el-input
          v-model="form[props]"
          placeholder="自定义检索"
          @change="slotChange"
        ></el-input>
      </template>
    </retrieval>
    <table-box
      :tableData="state.tableData"
      :tableColumn="tableColumn"
      :selectedData="selectedData"
      :routeRoles="route.meta.roles"
      @actionClick="actionClick"
    >
      <!-- 自定义列 -->
      <template v-slot:status="{ row }">
        <i class="el-icon-circle-check" v-if="row.status"></i>
        <i class="el-icon-circle-close" v-else></i>
      </template>
    </table-box>
    <pagination
      :current-page="state.page"
      :page-size="state.pageSize"
      :total="state.total"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      v-model="dialogVisible"
      title="新增用户"
      width="30%"
      :before-close="handleClose"
    >
      <el-input v-model="useAdd.username" placeholder="输入用户名" />
      <el-input v-model="useAdd.password" placeholder="输入预设密码" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="addUsers">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import retrieval from "../components/retrieval.vue";
import tableBox from "../components/table.vue";
import pagination from "../components/pagination.vue";
import { reactive, getCurrentInstance,ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const auth = store.getters.authGetter;


import { findAllUser, findUserPage, deleteUser ,registerUser} from "../api/apis";
const message = getCurrentInstance()?.appContext.config.globalProperties.$message;
const confirm = getCurrentInstance()?.appContext.config.globalProperties.$confirm;

let useAdd = reactive({
  username:"",
  password:"",
  auth:auth,
})

const route = useRoute();

// ----------------------------------------------------检索配置

const options = [
  {
    label: "全部",
    value: "",
  },
  // ,
  // {
  //   label: "值1",
  //   value: "1",
  // },
  // {
  //   label: "值2",
  //   value: "2",
  // },
];

const retrievalList = [
  {
    props: "username",
    label: "用户名",
    type: "input",
  },
  {
    props: "select",
    label: "创建者",
    type: "select",
    options: options,
  },
  {
    props: "daterange",
    label: "时间搜索",
    type: "date",
    dateType: "daterange",
    default: [new Date(), new Date().getTime() - 3600 * 1000 * 24 * 7],
  },
];
// add新增 retrieval查询 reset重置 download导出, "retrieval"
const retrievalActionBtn = ["add"];

function retrievalAction(e) {
  dialogVisible.value = true;
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
    prop: "username",
    label: "用户名",
  },
  {
    prop: "auth",
    label: "创建者",
  },
  {
    prop: "date",
    label: "日期",
  },
  {
    prop: "status",
    label: "状态",
  },
  {
    type: "action",
    label: "操作列",
    width: "150",
    actionBtn: [
      // 如果要做权限，这里的funName需要和路由菜单中fmeta的auth一致
      // {
      //   funName: "detail",
      //   title: "详情",
      // },
      // {
      //   funName: "edit",
      //   color: "orange",
      //   title: "编辑",
      // },
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
  pageSize: 8,
  total: 12,
  tableData: [
    // {
    //   id: 3,
    //   date: "2022-05-02",
    //   username: "orrsrosx",
    //   auth: "内蒙古大学",
    //   status: "true",
    // }
  ],
});

findAllUser(null).then((reas) => {
  let length = reas.length - 1;
  state.total = length;
  findUserPage({ page: state.page }).then((res) => {
    let length2 = res.length;
    if (length2 > 0) {
      for (let i = 0; i < length2; i++) {
        if (res[i].username != "admin") {
          let data = {
            id: res[i].id,
            date: res[i].createData,
            username: res[i].username,
            auth: res[i].auth,
            status: "true",
          };
          state.tableData.push(data);
          // let sad = state.tableData;
          // let das = 1;
        }
      }
    }
  });
});

function handleCurrentChange(e) {
  findAllUser(null).then((reas) => {
    let length = reas.length - 1;
    state.total = length;
    findUserPage({ page: e }).then((res) => {
      let length2 = res.length;
      if (length2 > 0) {
        state.tableData.length = 0;
        for (let i = 0; i < length2; i++) {
          if (res[i].username != "admin") {
            let data = {
              id: res[i].id,
              date: res[i].createData,
              username: res[i].username,
              auth: res[i].auth,
              status: "true",
            };
            state.tableData.push(data);
            // let sad = state.tableData;
            // let das = 1;
          }
        }
      }
      state.page = e;
    });
  });

  console.log(e);
}
function actionClick(e) {
  console.log(e);
  if (e.funName === "del") {
    confirm("此操作将永久删除该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteUsers(state.page);
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

function deleteUsers(e) {
  deleteUser({ username: e.data.username, auth: e.data.auth }).then((res) => {
    if (res.status == 1) {
      message({
        type: "success",
        message: "删除成功!",
      });
      handleCurrentChange(1);
    } else {
      message({
        type: "warning",
        message: res.msg,
      });
    }
  });
}
//登录用户改为用户名（原为auth）
function addUsers() {
  registerUser({ username:useAdd.username ,password:useAdd.password, auth: useAdd.auth }).then((res) => {
    if (res.status == 1) {
      message({
        type: "success",
        message: "添加成功!",
      });
      handleCurrentChange(state.page);
    } else {
      message({
        type: "warning",
        message: res.msg,
      });
    }
    dialogVisible.value=false;
  });
}

const dialogVisible = ref(false)

const handleClose = () => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style lang="scss" scoped></style>

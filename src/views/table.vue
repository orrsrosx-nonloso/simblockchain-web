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
      <el-input  v-model="useAdd.authname" placeholder="输入用户名" />
      <el-input style="padding-top:10px" v-model="useAdd.username" placeholder="输入用户ID" />
      <el-input style="padding-top:10px" v-model="useAdd.password" placeholder="输入预设密码" />
      <el-input style="padding-top:10px" v-model="useAdd.phone" placeholder="输入手机号" />
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
//权限页面封装
import retrieval from "../components/retrieval.vue";
import tableBox from "../components/table.vue";
import pagination from "../components/pagination.vue";
import { reactive, getCurrentInstance, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElLoading, ElNotification } from "element-plus";
const store = useStore();
const auth = store.getters.authGetter;

import {
  findAllUser,
  findUserPage,
  deleteUser,
  registerUser,
  findSearchUserPage,
  resetPasswords
} from "../api/apis";
const message = getCurrentInstance()?.appContext.config.globalProperties.$message;
const confirm = getCurrentInstance()?.appContext.config.globalProperties.$confirm;

let useAdd = reactive({
  username: "",
  authname:"",
  password: "",
  phone:"",
  auth: auth,
});

let searchData = reactive({
  username: "",
  auth: "",
});

const route = useRoute();
const routes = 123;
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
    props: "auth",
    label: "创建者",
    type: "input",
    // options: options,
  },
  // {
  //   props: "daterange",
  //   label: "时间搜索",
  //   type: "date",
  //   dateType: "daterange",
  //   default: [new Date(), new Date().getTime() - 3600 * 1000 * 24 * 7],
  // },
];
// add新增 retrieval查询 reset重置 download导出, "retrieval"
const retrievalActionBtn = ["add","retrieval"];

function retrievalAction(e) {
  if (e.type == "retrieval") {
    searchData.username = e.form.username;
    searchData.auth = e.form.auth;
    findSearchUserPage({
      auth: e.form.auth,
      username: e.form.username,
      page: 1,
    }).then((res) => {
      state.page = 1;
      state.total = res.totalElements;
      let content = res.content;
      let length2 = content.length;
      state.tableData.length = 0;
      if (length2 > 0) {
        for (let i = 0; i < length2; i++) {
          if (content[i].username != "admin") {
            let data = {
              id: content[i].id,
              date: content[i].createData,
              username: content[i].username,
              auth: content[i].auth,
              phone: content[i].phone,
            };
            state.tableData.push(data);
            // let sad = state.tableData;
            // let das = 1;
          }
        }
      }
    });
    // console.log("查询中");
  } else if (e.type == "add") {
    dialogVisible.value = true;
  }
  // console.log(e);
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
    label: "创建日期",
  },
  {
    prop: "phone",
    label: "手机号",
  },
  {
    type: "action",
    label: "操作",
    width: "150",
    actionBtn: [
      // 如果要做权限，这里的funName需要和路由菜单中meta的auth一致
      // {
      //   funName: "detail",
      //   title: "详情",
      // },
      {
        funName: "edit",
        color: "orange",
        title: "重置密码",
      },
      {
        funName: "del",
        color: "red",
        title: "删除用户",
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
        if (res[i].username != "admin" ) {
          let data = {
            id: res[i].id,
            date: res[i].createData,
            username: res[i].username,
            auth: res[i].auth,
            phone: res[i].phone,
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
  if (searchData.username != "" || searchData.auth != "") {
    findSearchUserPage({
      auth: searchData.auth,
      username: searchData.username,
      page: e,
    }).then((res) => {
      state.page = e;
      state.total = res.totalElements;
      let content = res.content;
      let length2 = content.length;
      state.tableData.length = 0;
      if (length2 > 0) {
        for (let i = 0; i < length2; i++) {
          if (content[i].username != "admin") {
            let data = {
              id: content[i].id,
              date: content[i].createData,
              username: content[i].username,
              auth: content[i].auth,
              phone: content[i].phone,
            };
            state.tableData.push(data);
            // let sad = state.tableData;
            // let das = 1;
          }
        }
      }
    });
  } else {
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
                phone: res[i].phone,
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
  }

  // console.log(e);
}
function actionClick(e) {
  // console.log(e);
  if (e.funName === "del") {
    confirm("此操作将永久删除该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteUsers(e);
      })
  }
  else if (e.funName === "edit") {
    confirm("是否重置该用户的密码(重置密码为：用户名+123456)!", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        resetPassword(e);
      })
  }
}

function deleteUsers(e) {
  deleteUser({ username: e.data.username, auth: e.data.auth }).then((res) => {
    if (res.status == 1) {
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
      handleCurrentChange(1);
    } else {
      ElMessage({
        type: "warning",
        message: res.msg,
      });
    }
  });
}

function resetPassword(e){
  resetPasswords({ username: e.data.username, auth: e.data.auth }).then((res) => {
    if(res === true){
    ElMessage({
        type: "success",
        message: "重置成功!",
      });
      handleCurrentChange(1);
    }
    else{
      ElMessage({
        type: "warning",
        message: "重置失败！",
      });
    }

  });
}
//登录用户改为用户名（原为auth）
function addUsers() {
  registerUser({
    username: useAdd.username,
    authname: useAdd.authname,
    password: useAdd.password,
    phone:useAdd.phone,
    auth: useAdd.auth,
  }).then((res) => {
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
    dialogVisible.value = false;
  });
}

const dialogVisible = ref(false);

const handleClose = () => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style lang="scss" scoped></style>

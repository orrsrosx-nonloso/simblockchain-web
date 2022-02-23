<template>
  <div class="coverAll">
    <div class="content">
      <div>
        <div class="box">
          <div class="box-card">
            <div class="toptitle">SIMBLOCKCHAIN</div>
            <el-form
              :label-position="state.labelPosition"
              label-width="60px"
              :model="state.formLabelAlign"
            >
              <el-form-item :label="t('username')">
                <el-input v-model="state.formLabelAlign.username"></el-input>
              </el-form-item>
              <el-form-item :label="t('password')">
                <el-input
                  v-model="state.formLabelAlign.password"
                  :type="state.passwordType"
                >
                  <template #suffix>
                    <i class="el-input__icon el-icon-view" @click="changeType"></i>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
            <el-button
              type="primary"
              class="login"
              :loading="state.loginLoading"
              @click="login"
              >{{ t("simblock") }}</el-button
            >
            <div class="regist" @click="regist">{{ t("regist") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { getDate } from "../utils/utils";
import { useRouter } from "vue-router";
import { getLoginMes, getUserData, getLogin } from "../api/apis";

defineProps({
  msg: String,
});

onMounted(() => {
  setInterval(() => {
    state.localTime = getDate();
  }, 1000);
});
const router = useRouter();
const store = useStore();

const isPhone = computed(() => {
  return store.getters.getIsPhone;
});

const state = reactive({
  count: 0,
  loginLoading: false,
  localTime: getDate(),
  labelPosition: "right",
  formLabelAlign: {
    username: "",
    password: "",
  },
  passwordType: "password",
});

const { t } = useI18n();

function changeType() {
  state.passwordType = state.passwordType == "password" ? "text" : "password";
}
// function getLoginMesss(){
//   const params = {
//     "username": "admin",
//     "password": "111111"
//     }
//   getLoginMes(params).then((res) =>{
//     console.log("获取数据:");
//     console.log(res);
//   });
// }
function login() {

  const params = JSON.parse(JSON.stringify(state.formLabelAlign));

  // JSON.parse(JSON.stringify(state.formLabelAlign));
  state.loginLoading = true;
  const res = {
    status: 1,
    msg: "登录成功",
    data: {
      _id: "60405311da60180001956279",
      password: "111111",
      username: "admin1",
      auth: "admin1",
      create_date: "2022/3/23",
      delete_date: "0",
    },
  };
  getLoginMes(params).then((res) => {
    if (res.status === 1) {
      store.commit("getUser", { token: res.data._id, ...res.data });
      console.log("store", store);
      store
        .dispatch("asyncGetRoutes", res.data.auth)
        .then((path) => {
          console.log("path", path);
          state.loginLoading = false;
          router.push("/layout/" + path[0].path);
        })
        .catch(() => {
          console.log("store2", store);
          state.loginLoading = false;
        });
      // console.log(store.dispatch('asyncGetRoutes'))
    } else {
      state.loginLoading = false;
    }
  });
  console.log(params);
}

// function regist() {
//   const params = JSON.parse(JSON.stringify(state.formLabelAlign));
//   console.log(params);
// }
</script>

<style scoped lang="scss">
.coverAll {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #40a0ff9c;
  .localTime {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .content {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .box-card {
      background-color: rgba(255, 255, 255, 0.6);
      padding: 60px;
      .login {
        width: 60%;
        margin-top: 20px;
      }
      .regist {
        text-align: right;
        font-size: 12px;
        margin-top: 20px;
        cursor: pointer;
        color: #409eff;
      }
    }
  }
}

.toptitle {
  font-family: "Hiragino Sans GB";
  font-size: 24px;
  padding-bottom: 24px;
}
</style>

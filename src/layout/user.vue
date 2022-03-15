<template>
  <!-- 默认用户设置 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      ></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :model="userName">{{ userName }}</el-dropdown-item>
        <el-dropdown-item divided @click="logOut">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { loginOut } from "../api/apis";
import { ElMessageBox } from "element-plus";

const router = useRouter();

//获取当前用户

const store = useStore();
const userName = store.getters.authGetter;

function logOut() {
  let user = userName;
  loginOut({ "auth": user }).then((res) => {
    if (res.status == 1) {
      ElMessageBox.alert(res.msg, "Success", {
        confirmButtonText: "OK",
      });
      router.replace("/login");
    } else {
      ElMessageBox.alert(res.msg, "WARING", {
        confirmButtonText: "OK",
      });
    }
  });
}

const { t } = useI18n();
</script>
<style lang="css" scoped></style>

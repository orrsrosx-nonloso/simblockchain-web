<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <div class="textTop">用户名</div>
        <div class="textBton" :model="userName">{{ userName }}</div>
      </el-card>
    </el-col>
    
    <el-col :span="6">
      <el-card class="box-card">
        <div class="textTop">最近登录</div>
        <div class="textBton" :model="userLastLogin">{{ userLastLogin }}</div>
      </el-card></el-col
    >
    
    <el-col :span="6">
      <el-card class="box-card">
        <div class="textTop">最近仿真实验</div>
        <div class="textBton" :model="userLastSim">
          <span v-if="userLastSim != null">{{ userLastSim }}</span>
          <span v-else>未仿真</span>
        </div>
      </el-card></el-col
    >
    <el-col :span="6">
      <el-card class="box-card">
        <div class="textTop">实验次数</div>
        <div class="textBton" :model="userSimNum">{{userSimNum}}</div>
      </el-card></el-col
    >
  </el-row>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>平台概述</span>
            <el-button class="button" type="text"></el-button>
          </div>
        </template>
        <el-form>
          <el-descriptions title="项目描述" :column="1">
            <el-descriptions-item
              label="项目名称"
              label-align="left"
              align="left"
              min-width="100px"
              ><el-tag size="small">SIMBLOCKCHAIN</el-tag></el-descriptions-item
            >
            <el-descriptions-item label="项目开始时间" label-align="left" align="left"
              >2021-11-18</el-descriptions-item
            >
            <el-descriptions-item label="技术栈" label-align="left" align="left">
              SpringBoot+Redis+Mysql+Vue
            </el-descriptions-item>

            <el-descriptions-item label="基本描述" label-align="left" align="left"
              >本项目主要为区块链的仿真实验平台,仿真内容包括单流程仿真和全流程仿真</el-descriptions-item
            >
            <el-descriptions-item label="推荐浏览器" label-align="left" align="left"
              >Google Chrome/Microsoft Edge</el-descriptions-item
            >
          </el-descriptions></el-form
        >
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>操作日志</span>
            <el-button
              v-if="userName == `admin`"
              @click="drawer = true"
              class="button"
              type="text"
              >详细操作日志</el-button
            >
            <el-button
              v-else-if="userName == `orrsrosx`"
              @click="drawer = true"
              class="button"
              type="text"
              >详细操作日志</el-button
            >
            <el-button
              v-else-if="userName == `huyun`"
              @click="drawer = true"
              class="button"
              type="text"
              >详细操作日志</el-button
            >
            <el-button
              v-else=""
              size="large"
              class="button"
              @click="drawer = true"
              type="text"
              >...</el-button
            >
          </div>
        </template>
        <div class="content">
          <div v-for="item in userLogMesSimple" class="logMes">
            <div class="leftMes">{{ item.message }}</div>
            <div class="leftMes">
              <div class="leftMesb1">{{ item.data }}</div>
              <div class="leftMesb2" style="color: #0de61b">{{ item.auth }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-drawer v-model="drawer" direction="rtl" title="日志" size="40%">
        <el-scrollbar v-if="screenWidth<1366" height="38%">
          <div v-for="use in userLogMesAll" class="logMes">
            <div class="leftMes">{{ use.message }}</div>
            <div class="leftMes">
              <div class="leftMesb1">{{ use.data }}</div>
              <div class="leftMesb2" style="color: #0de61b">{{ use.auth }}</div>
            </div>
          </div>
        </el-scrollbar>
        <el-scrollbar v-if="screenWidth>=1366" height="48%">
          <div v-for="use in userLogMesAll" class="logMes">
            <div class="leftMes">{{ use.message }}</div>
            <div class="leftMes">
              <div class="leftMesb1">{{ use.data }}</div>
              <div class="leftMesb2" style="color: #0de61b">{{ use.auth }}</div>
            </div>
          </div>
        </el-scrollbar>
      </el-drawer></el-col
    >
  </el-row>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, reactive } from "vue";
import { findUserLogMes } from "../api/apis";
import { ElMessage } from "element-plus";

const drawer = ref(false);
const router = useRouter();
const store = useStore();
let screenWidth = document.body.clientWidth;
const userName = store.getters.authGetter;
const userLastLogin = ref("");
const userLastSim = ref("");
const userSimNum = ref(0);
let userLogMes = reactive([]);
let userLogMesSimple = reactive([]);
let userLogMesAll = reactive([]);
let params = {
  username: userName,
  password: "",
  phone: "",
};

//按升序排列
function up(x, y) {
  return x.id - y.id;
}
//降序
function desc(x, y) {
  return y.id - x.id;
}

//降序
function sortList(data) {
  return y.numberPeople - x.numberPeople;
}
findUserLogMes(params).then((res) => {
  userLogMesSimple.length = 0;
  userLogMesAll.length = 0;
  if (res.status == 1) {
    userLastLogin.value = res.lastLogin;
    userLastSim.value = res.lastSim;
    userLogMes = res.logMes;
    userLogMes.sort(desc);
    for (let i = 0; i < userLogMes.length; i++) {
      if (i < 5) {
        userLogMesSimple.push(userLogMes[i]);
      }
      userLogMesAll.push(userLogMes[i]);
    }
  } else {
    ElMessage.error("日志错误:" + res.status);
  }
});

//获取当前用户
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fcf9;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.textTop {
  width: 100%;
  text-align: left;
  color: rgba(39, 39, 39, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.textBton {
  width: 100%;
  text-align: left;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 25px;
  line-height: 31px;
}
.content {
  width: 100%;
  height: 370px;
}
.logMes {
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgba(39, 39, 39, 0.45);
}
.leftMes {
  height: 50%;
  width: 100%;
  font-size: 18px;
  line-height: 35px;
  text-align: left;
}
.leftMesb1 {
  float: left;
  height: 100%;
  width: 80%;
  font-size: 15px;
  line-height: 24px;
  text-align: left;
  color: rgba(39, 39, 39, 0.45);
}
.leftMesb2 {
  float: left;
  height: 100%;
  width: 20%;
  font-size: 15px;
  line-height: 24px;
  text-align: left;
  color: rgba(39, 39, 39, 0.45);
}
</style>

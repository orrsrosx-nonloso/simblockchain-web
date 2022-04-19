<template>
  <!-- 手机端 -->
  <div>
    <div class="phoneTop">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="点击开启菜单栏"
        placement="bottom"
      >
        <div id="leftMenuGuide" @click="openDrawer" class="openClose">
          <el-icon><Grid /></el-icon>
        </div>
      </el-tooltip>
      <div class="logo">SBC</div>
      <div class="topUser">
        <user></user>
      </div>
    </div>
    <!-- 手机导航栏 -->
    <el-drawer v-model="state.drawer" direction="ltr" size="20%" title="SBC MENU">
      <navMenu mode="vertical"></navMenu>
    </el-drawer>
  </div>
</template>

<script setup>
import navMenu from "./navMenu.vue";
import { onMounted, reactive } from "vue";
import { Grid } from "@element-plus/icons";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import user from "./user.vue";
import { useStore } from "vuex";

import { needGuide } from "../api/apis";
const store = useStore();
const userName = store.getters.authGetter;

const state = reactive({
  drawer: false,
});

function openDrawer() {
  console.log(state.drawer);
  state.drawer = true;
  console.log(state.drawer);
}
let driver = null;
function guides() {
  const steps = [
    {
      element: "#leftMenuGuide",
      popover: {
        title: "Tip",
        description: "点击此处开启菜单栏",
        position: "bottom", //top
      },
    },
  ];
  driver = new Driver({
    doneBtnText: "完成", // 结束按钮的文字
    animate: true, // 动画
    opacity: 0.55, // 遮罩层不透明度（0表示仅弹出且不覆盖）
    stageBackground: "#ffffff", // 突出显示元素的背景颜色
    nextBtnText: "下一步", // 下一步按钮的文字
    prevBtnText: "上一步", // 上一步按钮的文字
    closeBtnText: "关闭", // 关闭按钮的文字
  });
  driver.defineSteps(steps);
  driver.start();
}
//s标识表示simblock页面
let params = {
  auth: userName,
  guide: "m",
};
needGuide(params).then((res) => {
  if (res == true) {
    console.log("start guide!!");
    guides();
  }
});
</script>
<style lang="scss" scoped>
.phoneTop {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-sizing: border-box;
  background-color: rgb(246, 255, 255);
  .openClose {
    width: 2rem;
    height: 2rem;
    background-color: rgb(214, 221, 217);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>

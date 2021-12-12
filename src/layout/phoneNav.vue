<template>
<!-- 手机端 -->
  <div>
    <div class="phoneTop">
      <div class="logo">SimBlockchain</div>
      <div class="openClose">
        <i
          class="el-icon-s-fold"
          @click="openDrawer"
        ></i>
      </div>
    </div>
    <!-- 手机导航栏 -->
    <el-drawer
      v-model="state.drawer"
      direction="rtl"
      size="50%"
    >
      <navMenu mode="vertical"></navMenu>
    </el-drawer>
  </div>
</template>

<script setup>
import navMenu from "./navMenu.vue";
import { onMounted, reactive } from "vue";

const state = reactive({
  drawer: false,
});

function openDrawer() {
  console.log(state.drawer);
  state.drawer = true;
  console.log(state.drawer);
}
</script>
<style lang='scss' scoped>
.phoneTop {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-sizing: border-box;
  .openClose {
    width: 2rem;
    height: 2rem;
    background-color: #fff;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
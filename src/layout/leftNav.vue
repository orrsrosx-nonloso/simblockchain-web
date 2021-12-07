<template>
  <!-- 侧边菜单 -->
  <div :class="state.isCollapse ? 'leftNav collapse' : 'leftNav notCollapse'">
    <div class="logo">LOGO</div>
    <div class="nav">
      <navMenu
        mode="vertical"
        :isCollapse="state.isCollapse"
      ></navMenu>
    </div>
    <div class="toolbar">
      <i
        v-if="!state.isCollapse"
        class="el-icon-s-fold"
        @click="setCollapse(true)"
      ></i>
      <i
        v-if="state.isCollapse"
        class="el-icon-s-unfold"
        @click="setCollapse(false)"
      ></i>
    </div>
    <!-- 用户信息，面包屑 -->
    <div :class="state.isCollapse ? 'topUser leftCollapse' : 'topUser leftNotCollapse'">
      <div class="topUserMain">
        <div class="crumbs">
          <crumbs></crumbs>
        </div>
        <user></user>
      </div>
    </div>
  </div>
</template>

<script setup>
import navMenu from "./navMenu.vue";
import user from "./user.vue";
import crumbs from "./crumbs.vue";
import { reactive } from "vue";

const state = reactive({
  isCollapse: false,
});

const emit = defineEmits(['changeCollapse'])

function setCollapse(bol) {
  state.isCollapse = bol;
  emit('changeCollapse', {
    isCollapse: state.isCollapse
  })
}
</script>

<style lang="scss" scoped>
@import "../assets/css/layout.scss";
.notCollapse {
  width: $leftnav;
}
.collapse {
  width: $collapse;
}
.leftNav {
  transition: $collapseTransition;
  transition-delay: $collapseTransitionDelay;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .leftNotCollapse {
    padding-left: $leftnav;
  }
  .leftCollapse {
    padding-left: $collapse;
  }
  .topUser {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: $leftnavTop;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    z-index: -1;
    box-sizing: border-box;
    transition: $collapseTransition;
    transition-delay: $collapseTransitionDelay;
    .topUserMain {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .logo {
    width: 100%;
    height: $leftnavTop;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .nav {
    flex: 1;
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
  }
  .toolbar {
    width: 100%;
    height: 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 25px;
      cursor: pointer;
    }
  }
}
</style>
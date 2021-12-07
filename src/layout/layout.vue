<template>
  <div class="main">
    <!-- 顶部导航 -->
    <topNav v-if="state.navType == 'horizontal' && !isPhone"></topNav>
    <!-- 侧边导航 -->
    <leftNav
      @changeCollapse="changeCollapse"
      v-if="state.navType == 'vertical' && !isPhone"
    ></leftNav>
    <!-- 手机导航 -->
    <phoneNav v-if="isPhone"></phoneNav>
    <!-- 内容区 -->
    <div
      :class="isPhone ? 'isPhone' : (state.navType == 'horizontal' ? 'horizontalContent' : ( state.leftNavCollapse  ? 'verticalContent navCollapse' : 'verticalContent navNotCollapse'))"
    >
      <div
        class="crumbs"
        v-if="state.navType == 'horizontal' && !isPhone"
      >
        <crumbs />
      </div>
      <router-view v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </router-view>
      <!-- <transition name="slide">
        <router-view></router-view>
      </transition> -->
    </div>
  </div>
</template>

<script setup>
import phoneNav from "./phoneNav.vue";
import topNav from "./topNav.vue";
import leftNav from "./leftNav.vue";
import crumbs from "./crumbs.vue";

import { useStore } from "vuex";
import { reactive, computed } from "vue";

const state = reactive({
  navType: import.meta.env.VITE_LAYOUT_TYPE,
  leftNavCollapse: false,
});

const store = useStore();
const isPhone = computed(() => {
  return store.getters.getIsPhone;
});

function changeCollapse(e) {
  state.leftNavCollapse = e.isCollapse;
}
</script>

<style scoped lang="scss">
@import "../assets/css/layout.scss";
.main {
  background-color: #eeeeee;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .crumbs {
    margin-bottom: 20px;
  }
  .navCollapse {
    width: calc(100vw - 40px - #{$collapse});
    margin-left: calc(20px + #{$collapse});
  }
  .navNotCollapse {
    width: calc(100vw - 40px - #{$leftnav});
    margin-left: calc(20px + #{$leftnav});
  }
  .horizontalContent {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: relative;
  }
  .verticalContent {
    height: calc(100vh - 100px);
    margin-top: 80px;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    transition: $collapseTransition;
    transition-delay: $collapseTransitionDelay;
    position: relative;
  }
  .isPhone {
    width: 100vw;
    height: calc(100vh - 48px);
    overflow-y: auto;
    background-color: #fff;
    position: relative;
  }
}
</style>
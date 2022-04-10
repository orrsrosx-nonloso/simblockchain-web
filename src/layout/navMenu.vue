<template>
  <!-- 一级菜单 -->
  <el-menu
    :default-active="state.activeIndex"
    v-bind="$attrs"
    @select="handleSelect"
    :collapse="props.isCollapse"
  >
    <template
      :index="'/layout/' + menu.path"
      v-for="(menu, index) in state.menu"
      :key="index"
    >
      <template v-if="menu.children">
        <submenu :menu="menu" :parentRoute="'/layout/' + menu.path + '/'" />
      </template>
      <el-menu-item :index="'/layout/' + menu.path" v-else>
        <template #title>
          <el-icon v-if="menu.title == `主界面`"><icon-menu /></el-icon>
          <el-icon v-if="menu.title == `用户权限`"><UserFilled /></el-icon>
          <el-icon v-if="menu.title == `用户管理`"><User /></el-icon>
          <el-icon v-if="menu.title == `地图`"><MapLocation /></el-icon>
          <el-icon v-if="menu.title == `单流程仿真`"><Coordinate /></el-icon>
          <el-icon v-if="menu.title == `全流程仿真`"><Connection /></el-icon>
          <span>{{ menu.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import submenu from "./submenu.vue";
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  UserFilled,
  Menu as IconMenu,
  User,
  MapLocation,
  Coordinate,
  Connection,
} from "@element-plus/icons";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  isCollapse: Boolean,
});

const emit = defineEmits(["changeCollapse"]);

function setCollapse(bol) {
  props.isCollapse = bol;
  emit("changeCollapse", {
    isCollapse: props.isCollapse,
  });
}

const routes = router.getRoutes();

const state = reactive({
  activeIndex: route.path,
  menu: [],
});

onMounted(() => {
  state.menu = getMenu(routes);
});

function handleSelect(route) {
  state.activeIndex = route;
  if (route.indexOf("singleSim") != -1 || route.indexOf("wholeSim") != -1) {
    props.isCollapse = true;
    emit("changeCollapse", {
      isCollapse: props.isCollapse,
    });
  }
  router.push(route);
}

function getMenu(routes) {
  let menu = [];
  routes.map((layout) => {
    if (layout.name === "layout") {
      menu = layout.children;
    }
  });
  return menu;
}
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
.backBtn {
  position: absolute;
  height: 20px;
  left: 0px;
}

@font-face {
  font-family: "iconfont"; /* Project id 3114720 */
  src: url("//at.alicdn.com/t/font_3114720_5ql72fsa49o.woff2?t=1641209428578")
      format("woff2"),
    url("//at.alicdn.com/t/font_3114720_5ql72fsa49o.woff?t=1641209428578") format("woff"),
    url("//at.alicdn.com/t/font_3114720_5ql72fsa49o.ttf?t=1641209428578")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.back {
  width: 30%;
  left: 0;
  padding-bottom: 15px;
  padding-top: 15px;
  i {
    font-size: 15px;
    cursor: pointer;
  }
}
</style>

<template>
<!-- 一级菜单 -->
  <el-menu v-if="state.thisModelSim === '0'"
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
      <el-menu-item
        :index="'/layout/' + menu.path"
        v-else
      >
        <i :class="menu.meta.icon ? menu.meta.icon: 'el-icon-menu'"></i>
        <template #title>{{menu.title}}</template>
      </el-menu-item>
    </template>
  </el-menu>
 
</template>

<script setup>
import submenu from "./submenu.vue";
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {modelSim, setsingle ,setsingle0,setsingle2} from "./menu.js";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  isCollapse: Boolean,
});

const emit = defineEmits(['changeCollapse'])

function setCollapse(bol) {
  props.isCollapse = bol;
  emit('changeCollapse', {
    isCollapse: props.isCollapse
  })
}

const routes = router.getRoutes();

const state = reactive({
  activeIndex: route.path,
  menu: [],
  thisModelSim: '0'
});

onMounted(() => {
  state.menu = getMenu(routes);
});

function handleSelect(route) {
  state.activeIndex = route
  router.push(route)
}

function setSingle1(){
    setsingle();
    state.thisModelSim = modelSim;
    console.log("what is "+modelSim);
}
function setSingle0(){
    setsingle0();
    state.thisModelSim = modelSim;
    console.log("what is "+modelSim);
}

function setSingle2(){
    setsingle2();
    state.thisModelSim = modelSim;
    console.log("what is "+modelSim);
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

<style lang='scss' scoped>
.el-menu {
  border: none;
}
.backBtn{
  position:absolute;
  height: 20px;
  left: 0px;
}


@font-face {
  font-family: 'iconfont';  /* Project id 3114720 */
  src: url('//at.alicdn.com/t/font_3114720_5ql72fsa49o.woff2?t=1641209428578') format('woff2'),
       url('//at.alicdn.com/t/font_3114720_5ql72fsa49o.woff?t=1641209428578') format('woff'),
       url('//at.alicdn.com/t/font_3114720_5ql72fsa49o.ttf?t=1641209428578') format('truetype');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
.back{
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
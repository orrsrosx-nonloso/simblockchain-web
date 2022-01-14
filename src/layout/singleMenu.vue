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
      <el-menu-item
        :index="'/layout/' + menu.path"
        v-else
      >
        <i :class="menu.meta.icon ? menu.meta.icon: 'el-icon-menu'">ss</i>
        <template #title>{{menu.title}}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import submenu from "./submenu.vue";
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  isCollapse: Boolean,
});

const routes = router.getRoutes();

const state = reactive({
  activeIndex: route.path,
  menu: [],
});

onMounted(() => {
  state.menu = getMenu(routes);
});

function handleSelect(route) {
  state.activeIndex = route
  router.push(route)
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
</style>
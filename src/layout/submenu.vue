<template>
      <!-- 二级菜单start -->
  <el-submenu :index="parentRoute + menu.path">
    <template #title>
      <i :class="props.menu.meta.icon ? props.menu.meta.icon: 'el-icon-menu'"></i>
      <span>{{menu.title}}</span>
    </template>
    <el-menu-item-group>
      <template
        :index="parentRoute + menuTwo.path"
        v-for="(menuTwo, indexTwo) in props.menu.children"
        :key="indexTwo"
      >
        <template v-if="menuTwo.children">
          <submenu :menu="menuTwo" :parentRoute="parentRoute + menuTwo.path + '/'"/>
        </template>
        <el-menu-item
          :index="parentRoute + menuTwo.path"
          v-else
        >
          <i :class="menuTwo.meta.icon ? menuTwo.meta.icon: 'el-icon-menu'"></i>
          <template #title>{{menuTwo.title}}</template>
        </el-menu-item>
      </template>
      <!-- 二级菜单end -->
    </el-menu-item-group>
  </el-submenu>
</template>

<script setup>
import submenu from "./submenu.vue";

const props = defineProps({
    menu: {
        type: Object,
        default() {
            return {}
        }
    },
    parentRoute: {
        type: String,
        default() {
            return ""
        }
    }
})
</script>
<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      :to="{ path: crumb.path }"
      v-for="(crumb, index) in crumbs.value"
      :key="index"
    >{{crumb.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const routes = useRoute();

const allRoutes = useStore().state.route.routes;

const crumbs = reactive({
  value: [],
});

watchEffect(() => {
  let routePath = routes.fullPath.split("/layout")[1];
  if (routePath) {
    let routePathArr = routePath.split("/");
    routePathArr = routePathArr.splice(1, routePathArr.length);
    crumbs.value = getCrumbs(routePathArr, allRoutes);
  }
});

function getCrumbs(routePathArr, allRoutes) {
  let crumbs = [];
  routePathArr.map((my) => {
    allRoutes.map((cpa) => {
      if (my === cpa.name) {
        crumbs.push({
          path: cpa.path,
          title: cpa.title,
        });
        return false;
      } else {
        if (cpa.children) {
          let childCrumbs = getCrumbs([my], cpa.children);
          if (childCrumbs.length) {
            crumbs.push({
              path: childCrumbs[0].path,
              title: childCrumbs[0].title,
            });
            return false;
          }
        }
      }
    });
  });
  return crumbs;
}
</script>
<style lang='css' scoped>
</style>
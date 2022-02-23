<template>
  <el-row class="mb-4">
    <el-button>Default</el-button>
  </el-row>

</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { computed } from 'vue';
const store = useStore();
const auth = computed(() => {
  return store.getters.authGetter;
});
const userName = auth.value;
console.log(userName);
let i=1;

</script>

<style>
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-error: #f56c6c;
  --el-color-info: #909399;
}
</style>
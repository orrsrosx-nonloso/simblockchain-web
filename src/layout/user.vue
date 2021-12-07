<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item> JustTwo</el-dropdown-item>
        <el-dropdown-item
          divided
          @click="logOut"
        >退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function logOut() {
  router.replace('/login')
}
</script>
<style lang='css' scoped>
</style>
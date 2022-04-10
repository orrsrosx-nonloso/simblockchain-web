<template>
  <div>
    <h1>页面不存在，请先登录</h1>
    <el-button @click="backLogin" type="primary" plain>返回登录</el-button>
  </div>
</template>

<script>
import router from '../router/index.js'
export default {
  data() {
    function backLogin() {
      router.replace("/login");
    }
    return { backLogin };
  },
  components: {},
  computed: {},
  methods: {},
};
</script>
<style lang="css" scoped></style>

<template>
  <div>
    <h1>请于PC端访问此页面</h1>
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

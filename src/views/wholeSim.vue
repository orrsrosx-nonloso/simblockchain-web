<template>
  <div class="demo-progress">
 
    <el-progress
      :percentage="100"
      :status= "format"
      :indeterminate="true"
      :duration="5"
      id="loadFindBlock"
    />
   
  </div>
</template>

<script lang="ts" setup>
let format = "";

let i=1;
</script>
<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
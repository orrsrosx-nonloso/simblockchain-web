<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="标题:">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="信息内容:">
      <el-input :rows="4" v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { insertToBugOrder } from "../api/apis";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

const store = useStore();
const userName = store.getters.authGetter;

// do not use same name with ref
const form = reactive({
  title: "",
  desc: "",
});

const onSubmit = () => {
  let targetEnd = {
    bugTitle: form.title,
    bugContent: form.desc,
    auth: userName,
    mes: "",
    status: 0,
  };
  insertToBugOrder(targetEnd).then((res) => {
    if (res.status == 1) {
      form.title = "";
      form.desc = "";
      ElMessage({
        message: "提交状态：" + res.mes,
        type: "success",
      });
    }
    else{
       ElMessage.error('提交失败');
    }
  });
  console.log("submit!");
};
</script>
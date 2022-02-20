<template>
  <div>
    交易对象:
    <el-select v-model="valueTrans1"  placeholder="Select">
      <el-option
        v-for="item in NodeTrans"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  =>
    <el-select
      v-model="valueTrans2"
      collapse-tags
      style="margin-left: 20px"
      placeholder="Select"
    >
      <el-option
        v-for="item in NodeTrans"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
  <div>交易金额:<el-input-number v-model="numTrans" :min="1"   /></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const numTrans = ref(1)
const valueTrans1 = ref([]);
const valueTrans2 = ref([]);
const NodeTrans = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
];
</script>

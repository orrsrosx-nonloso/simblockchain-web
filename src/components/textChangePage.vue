<template>
  <div class="common-layout">
    <el-container>
      <el-header><div class="heaher">文本快捷修改器</div></el-header>
      <el-main>
        <el-row>
          <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
          <el-col :span="16"
            ><div class="grid-content ep-bg-purple-light" />
            <el-form :model="form" label-width="120px">
              <!-- <el-form-item label="标题:">
                <el-input v-model="form.title" />
              </el-form-item> -->
              <el-form-item label="信息内容:">
                <el-input :rows="4" v-model="form.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="textEdit">开始编辑</el-button>
              </el-form-item>
            </el-form>
            <el-form :model="form" label-width="120px">
              <!-- <el-form-item label="标题:">
                <el-input v-model="form.title" />
              </el-form-item> -->
              <el-form-item label="修改内容:">
                <el-input
                  :rows="4"
                  ref="inputText"
                  v-model="form.copyCon"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @mousedown="clickCopy"
                  >一键复制</el-button
                >
              </el-form-item>
            </el-form>
            <!-- <el-form-item label="修改内容:">
              <el-input
                :rows="4"
                ref="inputText"
                v-model="form.copyCon"
                type="textarea"
              />
            </el-form-item>

            <button @mousedown="clickCopy">一键复制</button> -->
          </el-col>
          <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { insertToBugOrder } from "../api/apis";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { textEditFun } from "../utils/utils.js";
const form = reactive({
  title: "",
  desc: "",
  copyCon: "",
});
const inputText = ref({} as unknown);
const clickCopy = () => {
  console.log(form.copyCon);
  (inputText.value as HTMLInputElement).select();
  document.execCommand("copy");
  //复制之后自动修改内容
  let editText = form.title.split("\n");
  let endText = editText[0] + textEditFun();
  for (let j = 1; j < editText.length; j++) {
    endText = endText + "\n" + editText[j];
  }
  form.copyCon = endText;
};
const textEdit = () => {
  let editText = form.desc.split("\n");
  form.title = form.desc; //历史值保留
  let endText = editText[0] + textEditFun();
  for (let j = 1; j < editText.length; j++) {
    endText = endText + "\n" + editText[j];
  }
  form.copyCon = endText;
};
</script>
<style lang="css" scoped>
.heaher {
  font-size: 35px;
  margin-top: 20px;
  text-align: center;
  line-height: 100%;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
</style>

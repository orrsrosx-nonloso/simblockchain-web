<template>
  <div class="wholeSimSlider">
    <el-slider
      :max="maxSloderValue"
      class="sliderbox"
      v-model="wholeSimSliderValue"
    />
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";

const wholeSimSliderValue = ref(0);
const maxSloderValue = ref(40000);
maxSloderValue.value = 1000;
for (var j = 1; j <= maxSloderValue.value; j++) {
  setTimeout(() => {
    wholeSimSliderValue.value++;
  }, j * 100);
}
</script>

<style scoped>
.wholeSimSlider {
  position: absolute;
  margin-left: 8%;
  padding: 0 2%;
  height: 10%;
  width: 80%;
  bottom: 10px;
  background-color: rgb(255, 255, 255);
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  z-index: 998;
}
.sliderbox {
  padding-top: 2%;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
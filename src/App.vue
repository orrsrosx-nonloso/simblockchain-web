<template>
  <router-view></router-view>
</template>

<script setup>
import { useStore } from "vuex";
import {onMounted} from 'vue'

const store = useStore()

onMounted(() => {
  getScreenWidth();
  window.onresize = () => {
    getScreenWidth();
  };
});

function getScreenWidth() {
  let screenWidth = document.body.clientWidth;
  let minSize = 1366;
  if (screenWidth < minSize) {
    // console.log('setIsPhone', true)
    store.commit('setIsPhone', true)
  } else {
    // console.log('setIsPhone', false)
    store.commit('setIsPhone', false)
  }
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
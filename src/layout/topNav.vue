<template>
  <!-- 顶部菜单 -->
  <div class="navBox">
    <div class="logo">LOGO</div>
    <div class="nav">
      <navMenu mode="horizontal"></navMenu>
    </div>
    <div class="topUser">
      <user></user>
    </div>
  </div>
</template>

<script setup>
import navMenu from "./navMenu.vue";
import user from "./user.vue";

</script>

<style lang="scss" scoped>
@import "../assets/css/layout.scss";
.navBox {
  width: 100%;
  height: $topnav;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .logo {
    width: 240px;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    font-weight: 600;
  }
  .nav {
    flex: 1;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .topUser {
    width: 240px;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    font-weight: 600;
  }
}
</style>
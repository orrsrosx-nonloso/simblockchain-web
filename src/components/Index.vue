<template>
  <el-container style="width: 100vw; height: 100vh">
    <el-header>
      <el-menu  mode="horizontal">
        <!-- :default-active="1" -->
        <el-menu-item>
          <img
            src="../assets/logopage.png"
            style="width: 320px; height: 62px"
          />
        </el-menu-item>

        <el-menu-item style="margin-left: auto; font-weight: bold">
          <el-button
            @click="LoginWithP"
            style="color: #1e1e1e"
            type="text"
            plain
            >开始仿真实验</el-button
          >
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <slot name="main">
        <el-carousel indicator-position="outside" height="55vh" arrow="never">
          <!-- 临时列表 -->
          <el-carousel-item v-for="item in 1" :key="item">
            <div class="boxContent">
              <div class="boxText">
                <div class="textShow">SIMBLOCKCHAIN</div>
                <div class="textShow">区块链虚拟仿真实验平台</div>
                <div class="textCo">
                  基于多流程化的区块链虚拟仿真实验平台，
                  为区块链学习与科研者提供单流程与全流程仿真等多样仿真模块，
                  并提供丰富的数据和学习资源，服务课程学习、科研实验等场景，
                  并面向高校提供在线教学、科研开发的一站式解决方案
                </div>
                <div class="textButton">
                  <el-button
                    class="buttons"
                    color="#626aef"
                    size="large"
                    @click="LoginWithP"
                    >开始仿真实验</el-button
                  >
                    <!-- :dark="isDark" -->
                </div>
              </div>
              <div class="boxPage">
                <img src="../assets/study.png" alt="" style="width: 460px" />
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </slot>
    </el-main>
    <el-footer height="40px" style="color: #909399; text-align: center"
      >MayCopyright © 2022 || 推荐PC端使用(Google Chrome/Microsoft
      Edge)</el-footer
    >
  </el-container>
</template>

<script>
import router from "../router/index.js";
import { computed } from "vue";
import { useStore } from "vuex";
// import { useRouter } from "vue-router";
// const router = useRouter();

import { insertToVisitor } from "../api/apis.js";

export default {
  data() {
    const store = useStore();
    const authoritys = computed(() => {
      return store.getters.authGetter;
    });
    const getAuth = () => {
      return authoritys.value;
    };
    function LoginWithSub() {
      let j = getAuth();
      if (j != null) {
        router.replace("/layout/tree");
      } else {
        router.replace("/login");
      }
    }
    function LoginWithP() {
      let screenWidth = document.body.clientWidth;
      let minSize = 1200;
      if (screenWidth < minSize) {
        router.push("/needUserPc");
      }
      else
      {
        let j = getAuth();
        if (j != null) {
          router.replace("/layout/tree");
        } else {
          router.replace("/login");
        }
      }
    }
    return { LoginWithP, LoginWithSub };
  },
  created() {
    insertToVisitor(null);
  },
  components: {},

  computed: {},
  methods: {},
};
</script>
<style scoped>
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(n) {
  background-color: #fbfdff;
}
.boxContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  width: 85%;
  height: 100%;
  margin: 0px auto;
}
.boxText {
  width: 45%;
  height: 70%;
  margin: 0px auto;
  text-align: left;
}
.boxPage {
  width: 460px;
  height: 216px;
  margin: 0px auto;
}
.textShow {
  padding-top: 1%;
  font-size: 42px;
}
.textCo {
  padding-top: 2%;
  font-size: 16px;
}
.textButton {
  padding-top: 5%;
}
.buttons {
  color: rgb(255, 255, 255);
}
.buttons:hover {
  color: rgb(227, 251, 255);
}
</style>

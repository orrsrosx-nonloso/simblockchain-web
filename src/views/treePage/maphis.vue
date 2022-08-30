<template>
  <div class="map-content">
    <div id="map"></div>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="(items, index) in mapData"
        :key="index"
        :label="items.name"
        :value="items.name"
      ></el-option>
    </el-select>
  </div>
  <el-dialog
    v-model="dialogWholeSimVisible"
    title="WholeSim Seting"
    width="80%"
    :close-on-click-modal="false"
    center
  >
    <el-card>
      <el-steps
        style="display: flex; justify-content: center"
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="节点配置"></el-step>
        <el-step title="区块配置"></el-step>
        <el-step title="完成配置"></el-step>
      </el-steps>
      <div class="cardContent">
        <div class="mesBox" v-show="activeIndex == 0">
          <div v-show="activeIndex == 0">
            <h2>
              Before starting the simulation, you need to configure the relevant
              parameters of the simulation. During the simulation, you can't
              operate the relevant modules, but you can view the data
              information of the relevant block nodes until the end of the
              simulation.
            </h2>
          </div>
        </div>
        <div class="cardSeting" v-show="activeIndex != 0">
          <div v-show="activeIndex == 1">
            <el-form
              :model="WholeSimData"
              class="demo-form-inline"
            >
              <el-form-item label="Approved by">
                <el-input v-model="WholeSimData.numOfNode" placeholder="Approved by" />
              </el-form-item>
              <el-form-item label="Approved by">
                <el-input v-model="WholeSimData.numOfMaxOutBound" placeholder="Approved by" />
              </el-form-item>
            </el-form>
          </div>
          <div v-show="activeIndex == 2">
            午餐补助：
            <el-input
              placeholder="请输入午餐补助..."
              size="mini"
              style="width: 200px"
              type="number"
            >
            </el-input>
          </div>
          <div v-show="activeIndex == 3">
            奖金：
            <el-input
              placeholder="请输入奖金..."
              size="mini"
              style="width: 200px"
              type="number"
            >
            </el-input>
          </div>
        </div>
        <div class="cardSeting" v-show="activeIndex != 0"></div>
      </div>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="activeIndex != 0" @click="activeIndex--"
          >Previous step</el-button
        >
        <el-button
          type="primary"
          @click="next"
          v-text="activeIndex == 3 ? 'Create' : 'Next Step'"
        ></el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
// 如需扩展更多省市,在此处引入对应的地图JSON数据
import world from "../assets/mapRow/world.json";
import china from "../assets/mapRow/china.json";
import nameMap from "../utils/nameMap.js";

import echarts from "echarts";

import { ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";

export default {
  data() {
    let WholeSimData = reactive({
      numOfNode: 100,
      numOfMaxOutBound: 4,
      normalBlockTime:100,
    });
    const dialogWholeSimVisible = ref(false);
    let activeIndex = ref(0);
    const next = () => {
      if (activeIndex.value == 3) {
        dialogWholeSimVisible.value = false;
      } else {
        activeIndex.value++;
      }
    };
    const setWholeSimVis = (value) => {
      dialogWholeSimVisible.value = value;
    };
    return {
      WholeSimData,
      setWholeSimVis,
      dialogWholeSimVisible,
      activeIndex,
      next,
      value: "world", //初始化为世界地图
      myChart: null, //初始化地图渲染器
      //   注册地图json
      jsonMap: {
        world: world,
        中国: china,
      },
      // 下拉框
      mapData: [
        { name: "world", value: 10 },
        { name: "中国", value: 20 },
      ],
      //准备数据
      jiangbeiData: [
        {
          name: "江北区",
          value: 80,
        },
      ],
    };
  },
  created() {
    //   循环注册地图
    for (let index in this.jsonMap) {
      echarts.registerMap(index, this.jsonMap[index]);
    }
    // this.setWholeSimVis(true);
  },
  mounted() {
    //    初始化地图
    this.chinaConfigure(this.value);
  },
  //   更新数据
  watch: {
    value(newVal) {
      this.myChart.dispose();
      this.chinaConfigure(this.value);
    },
  },
  //销毁地图实例
  beforeDestroy() {
    if (!this.myChart) {
      return;
    }
    this.myChart.dispose();
    this.myChart = null;
  },
  methods: {
    chinaConfigure(area) {
      this.myChart = echarts.init(document.getElementById("map")); //这里是为了获得容器所在位置
      window.onresize = this.myChart.resize;
      let option = {
        // 进行相关配置
        backgroundColor: "#02AFDB",
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        visualMap: {
          // max: 110,
          calculable: true,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
        },
        series: [
          {
            type: "map",
            map: area,
            data:
              area == "world"
                ? nameMap.worldData
                : area == "中国"
                ? nameMap.chinaData
                : [],
            nameMap: area == "world" ? nameMap.nameMap : {},
          },
        ],
      };
      this.myChart.setOption(option, true);
      // this.myChart.on('click', params => { // 点击函数
      // this.value=params.name
      // this.myChart.setOption(option,true);
      // })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-content {
  position: relative;
  width: 100%;
  height: 100%;
}
.el-select {
  position: absolute;
  left: 20px;
  top: 20px;
}
#map {
  position: absolute;
  width: 100%;
  height: 100%;
}
.cardContent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
}
.cardSeting {
  margin-left: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 49%;
  height: auto;
}
.mesBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: auto;
}
</style>

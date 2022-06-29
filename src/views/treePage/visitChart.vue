<template>
 <!-- <div class="card-header-statistics">
    <el-menu
      :default-active="activeIndexss"
      class="el-menu-demo"
      mode="horizontal"
      @select="callback"
    >
      <el-menu-item index="1">访问数据统计</el-menu-item>
      <el-menu-item v-if="authorityGet == 0" index="2"
        >用户注册统计</el-menu-item
      >
      <el-menu-item v-if="authorityGet == 0" index="3"
        >用户仿真统计</el-menu-item
      >
    </el-menu>
  </div>
  <div class="tab-box">
    <div id="chart"></div>
  </div> -->
</template>
<script setup>
// import echarts from "echarts";
// import { reactive, ref } from "vue";
// import { computed } from "vue";
// import { useStore } from "vuex";
// import { getLogMesData } from "../../api/apis.js";
// import { getDataStringDay, getseparateDays } from "../../utils/utils.js";

// let dayData = reactive(["周一", "周二", "周三", "周四", "周五", "周六", "周s日"]);
// const setDayData = (dayDataArray) => {
//   for (let i = 0; i <= 6; i++) {
//     dayData[i] = dayDataArray[i];
//   }
// };
// let statistics1 = reactive([120, 132, 101, 134, 90, 230, 210]);
// const setStatistics1 = (dayDataArray) => {
//   for (let i = 0; i <= 6; i++) {
//     statistics1[i] = dayDataArray[i];
//   }
// };
// let statistics2 = reactive([120, 132, 101, 134, 90, 230, 21]);
// const setStatistics2 = (dayDataArray) => {
//   for (let i = 0; i <= 6; i++) {
//     statistics2[i] = dayDataArray[i];
//   }
// };
// let statistics3 = reactive([120, 132, 101, 134, 90, 230, 10]);
// const setStatistics3 = (dayDataArray) => {
//   for (let i = 0; i <= 6; i++) {
//     statistics3[i] = dayDataArray[i];
//   }
// };
// const storess = useStore();

// const authoritysss = computed(() => {
//   return storess.getters.authorityGetter;
// });
// const getAuthss = () => {
//   return authoritysss.value;
// };
// let authorityGet = getAuthss();
// let activeIndexss = ref("1");

// let option = [];
// let option1 = {
//   // 去掉动画效果
//   animation: false,
//   color: ["#FF0087"],
//   title: {
//     text: "",
//   },
//   tooltip: {
//     trigger: "axis",
//   },
//   legend: {
//     data: ["系统访问数据ss"],
//   },
//   grid: {
//     left: "3%",
//     right: "4%",
//     bottom: "3%",
//     containLabel: true,
//   },
//   toolbox: {
//     feature: {
//       saveAsImage: {},
//     },
//   },
//   xAxis: {
//     type: "category",
//     boundaryGap: false,
//     data: dayData,
//   },
//   yAxis: {
//     type: "value",
//   },
//   series: [
//     {
//       name: "系统访问数据ss",
//       type: "line",
//       stack: "量",
//       data: statistics1,
//       smooth: true,
//     },
//   ],
// };
// let option2 = {
//   // 去掉动画效果
//   animation: false,
//   color: ["#FFBF00"],
//   title: {
//     text: "",
//   },
//   tooltip: {
//     trigger: "axis",
//   },
//   legend: {
//     data: ["用户注册统计"],
//   },
//   grid: {
//     left: "3%",
//     right: "4%",
//     bottom: "3%",
//     containLabel: true,
//   },
//   toolbox: {
//     feature: {
//       saveAsImage: {},
//     },
//   },
//   xAxis: {
//     type: "category",
//     boundaryGap: false,
//     data: dayData,
//   },
//   yAxis: {
//     type: "value",
//   },
//   series: [
//     {
//       name: "用户注册统计",
//       type: "line",
//       stack: "量",
//       data: statistics2,
//       smooth: true,
//     },
//   ],
// };
// let option3 = {
//   // 去掉动画效果
//   animation: false,
//   color: ["#00DDFF"],
//   title: {
//     text: "",
//   },
//   tooltip: {
//     trigger: "axis",
//     axisPointer: {
//       type: "cross",
//       label: {
//         backgroundColor: "#6a7985",
//       },
//     },
//   },
//   legend: {
//     data: ["用户仿真统计"],
//   },
//   toolbox: {
//     feature: {
//       saveAsImage: {},
//     },
//   },
//   grid: {
//     left: "3%",
//     right: "4%",
//     bottom: "3%",
//     containLabel: true,
//   },
//   xAxis: [
//     {
//       type: "category",
//       boundaryGap: false,
//       data: dayData,
//     },
//   ],
//   yAxis: [
//     {
//       type: "value",
//     },
//   ],
//   series: [
//     {
//       name: "用户仿真统计",
//       type: "line",
//       stack: "总量",
//       smooth: true,
//       lineStyle: {
//         width: 0,
//       },
//       showSymbol: false,
//       areaStyle: {
//         opacity: 0.8,
//         color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: "rgba(128, 255, 165)",
//           },
//           {
//             offset: 1,
//             color: "rgba(1, 191, 236)",
//           },
//         ]),
//       },
//       emphasis: {
//         focus: "series",
//       },
//       data: statistics3,
//     },
//   ],
// };
// option = [option1, option2, option3];
// let accountInput = reactive({
//   accountName: "",
//   auth: "",
//   nodeId: null,
//   account: null,
// });
// getLogMesData(accountInput).then((res) => {
//   let targetDay = reactive([]);
//   let targetData1 = reactive([]);
//   let targetData2 = reactive([]);
//   let targetData3 = reactive([]);
//   let dataDay = res.logMesData;
//   for (let i = 0; i < 7; i++) {
//     let day = getDataStringDay(i);
//     if (day == dataDay[i].data) {
//       let dayss = getseparateDays(day);
//       targetDay.unshift(dayss);
//       targetData1.unshift(dataDay[i].visitor);
//       targetData2.unshift(dataDay[i].register);
//       targetData3.unshift(dataDay[i].simblocks);
//     } else {
//       let dayss = getseparateDays(day);
//       targetDay.unshift(dayss);
//       targetData1.unshift(0);
//       targetData2.unshift(0);
//       targetData3.unshift(0);
//     }
//   }
//   setDayData(targetDay);
//   setStatistics1(targetData1);
//   setStatistics2(targetData2);
//   setStatistics3(targetData3);
// });
// setTimeout(() => {
//   drawEcharts(option[0]);
// }, 100);

// function callback(key, keyPath) {
//   console.log(key);
//   drawEcharts(option[key - 1]);
// }
// function drawEcharts(option) {
//   // 基于准备好的dom，初始化echarts实例
//   var myChart = echarts.init(document.getElementById("chart"));
//   // 使用刚指定的配置项和数据显示图表。
//   myChart.clear();
//   option && myChart.setOption(option);
// }
</script>
<style>
/* .tab-box {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 100%;
  height: 65%;
  margin: auto 10px 10px auto;
  border: 1px solid #e4e7ed;
  padding-top: 20px;
}
.tab {
  height: 30px;
  width: 30px;
}
#chart {
  width: 92%;
  height: 90%;
  padding-left: 10px;
}
.card-header-statistics {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  width: 99%;
  height: 55px;
  justify-content: space-between;
  align-items: center;
} */
</style>

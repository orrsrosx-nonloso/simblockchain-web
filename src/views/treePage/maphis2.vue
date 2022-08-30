<template>
  <div style="width: 100%; height: 100%">
    <el-button @click="redrsad">ssadadada</el-button>
    <div id="china-map" style="width: 100%; height: 112%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import JSON from "../assets/mapRow/world.json";
export default {
  data() {
    return {
      mapOption: {},
    };
  },
  mounted() {
    let mapPointData = [];
    mapPointData.push({
      name: "六安",
      value: [216.5, 31.75],
    });
    mapPointData.push({
      name: "马鞍山",
      value: [118.51, 31.68],
    });

    let lineData = [];
    lineData.push({
      point: ["六安", "马鞍山"],
      coords: [
        [216.5, 31.75],
        [118.51, 31.68],
      ],
    });

    this.initMap(mapPointData, lineData);
    this.drawMap()
  },
  methods: {
    redrsad() {
      let mapPointData = [];
      mapPointData.push({
        name: "六安",
        value: [216.5, 31.75],
      });
      mapPointData.push({
        name: "马鞍山",
        value: [118.51, 31.68],
      });
      mapPointData.push({
        name: "宿州",
        value: [116.98, 33.63],
      });

      let lineData = [];
      lineData.push({
        point: ["六安", "马鞍山"],
        coords: [
          [216.5, 31.75],
          [118.51, 31.68],
        ],
      });
      lineData.push({
        point: ["宿州", "马鞍山"],
        coords: [
          [116.98, 33.63],
          [118.51, 31.68],
        ],
      });
      lineData.push({
        point: ["宿州", "六安"],
        coords: [
          [116.98, 33.63],
          [216.5, 31.75],
        ],
      });

      this.changeMapOption(mapPointData, lineData);
      this.reDrawMaps();
    },
    drawMap() {
      echarts.registerMap("world", JSON, {});
      const myChart = echarts.init(document.getElementById("china-map"));
      myChart.setOption(this.mapOption);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    reDrawMaps() {
      const myChart = echarts.getInstanceByDom(document.getElementById("china-map"));
      myChart.setOption(this.mapOption);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    changeMapOption(dataGeo, lineData){
      this.mapOption.series[0].data = dataGeo;
      this.mapOption.series[1].data = lineData;
    },
    initMap(dataGeo, lineData) {
      this.mapOption = {
        color: ["#5470c6"],
        tooltip: {
          trigger: "item",
          renderMode: "html",
          // 触发方式
          triggerOn: "click",
          enterable: true,
          backgroundColor: "#fff",
          padding: 0,
          textStyle: {
            color: "#000",
            fontSize: "12",
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        dispatchAction: {
          type: "downplay",
        },
        roam: false,
        roamController: {
          show: true,
          x: "right",
          mapTypeControl: {
            china: true,
          },
        },
        series: [
          {
            name: "",
            type: "scatter",
            coordinateSystem: "geo",
            color: ["#000"],
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                // console.log(d);
                return `<div style="padding: 5px 10px;">【${d.data.name}】</div>`;
              },
            },
            data: dataGeo,
          },
          {
            name: "",
            type: "lines",
            zlevel: 6,
            lineStyle: {
              type: "solid",
              width: 1,
              opacity: 1,
              curveness: 0,
              orient: "horizontal",
              color: "#000",
            },
            show: true,
            data: lineData,
            tooltip: {
              position: "right",
              color: "#000",
              formatter(d) {
                // console.log(d);
                return `<div style="padding: 5px 10px;"> 【${d.data.point[0]}】< ---- >【${d.data.point[1]}】</div>`;
              },
            },
          },
        ],
        geo: {
          show: true,
          map: "world",
          type: "map",
          mapType: "world",
          roam: false,
          label: {
            normal: {
              // 显示省份标签
              show: false,
              textStyle: {
                color: "#fff",
                fontSize: 10,
              },
            },
            emphasis: {
              // 对应的鼠标悬浮效果
              show: true,
              // 选中后的字体样式
              textStyle: {
                color: "#000",
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            color: "#ddb926",
            normal: {
              areaColor: "#8abcd1",
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              borderWidth: 0.5,
              borderColor: "#8abcd1",
              areaColor: "#fff",
            },
          },
          emphasis: {
            label: {
              show: false,
            },
          },
        },
      };
    },
  },
};
</script>

<style>
</style>

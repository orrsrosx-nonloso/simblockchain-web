 <template>
   <div class="map-content">
      <div id="map"></div>
    <el-select v-model="value" placeholder="请选择">
  <el-option
    v-for="(items,index) in mapData"
    :key="index"
    :label="items.name"
    :value="items.name"
  ></el-option>
</el-select>

</div>
</template>
<script>
// 如需扩展更多省市,在此处引入对应的地图JSON数据
import world from '../assets/mapRow/world.json'
import china from '../assets/mapRow/china.json'
import nameMap from '../utils/nameMap.js'


import echarts from "echarts"
export default {
  name: "mapContent", 
  data() {
return {
  value: "world", //初始化为世界地图
  myChart:null,  //初始化地图渲染器
 //   注册地图json
   jsonMap: {
    'world':world,
    '中国':china
    },
        // 下拉框
  mapData: [
        { name: "world", value: 10 },
        { name: "中国", value: 20 },
    ] ,
//准备数据
jiangbeiData:[{
  name:'江北区',value:80
 }],
};
  },
  created(){
//   循环注册地图
for (let index in this.jsonMap) {
    echarts.registerMap(index, this.jsonMap[index])
    }; 
},
   mounted(){
//    初始化地图
 this.chinaConfigure(this.value);
 },
  //   更新数据
 watch:{
value(newVal){
  this.myChart.dispose();
  this.chinaConfigure(this.value);
}
 },
 //销毁地图实例
  beforeDestroy() {
if (!this.myChart) {
  return;
}
this.myChart.dispose();
this.myChart = null;
 },
 methods:{
chinaConfigure(area) {
     this.myChart = echarts.init(document.getElementById("map")); //这里是为了获得容器所在位置        
     window.onresize = this.myChart.resize;
     let option={ // 进行相关配置
      backgroundColor: "#02AFDB",
      tooltip: {}, // 鼠标移到图里面的浮动提示框
      visualMap: {
        // max: 110,
        calculable: true,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
              },
    series: [{
    type: 'map',
    map: area,
    data: area=='world'?nameMap.worldData:area=='中国'?nameMap.chinaData:area=='重庆'?nameMap.chongqingData:area=='北京'?nameMap.beijingData:area=='上海'?nameMap.shanghaiData:area=='天津'?nameMap.tianjinData:area=='江北区'?nameMap.jiangbeiData:[],
    nameMap: area=='world'?nameMap.nameMap:{}
}]
    }
    this.myChart.setOption(option,true);
    // this.myChart.on('click', params => { // 点击函数
    // this.value=params.name
    // this.myChart.setOption(option,true);
    // }) 
  },
 }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-content {
 position: relative;
 width: 100%;
 height: 100%;
}
.el-select{
 position: absolute;
 left: 20px;
 top:20px;
  }
 #map{
position: absolute;
width: 100%;
height: 100%;
}
</style>
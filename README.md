## 介绍
本项目为构建区块链仿真工具创建
## 软件架构
[vite 2.0.1](https://cn.vitejs.dev/guide/)  
[vue 3.0.5](https://vue3js.cn/docs/zh/)  
[element-plus 1.0.2-beta.32](https://element-plus.gitee.io/#/zh-CN)  
vue-route 4.0.4  
vue-i18n 9.0.0  
axios 0.21.1  
vuex 4.0.0-beta.2  

## 环境依赖
node v12.18.3  

## 安装教程

#### 1. git clone ssh
#### 2. cd vite-vue-elementplus-admin  
#### 3. npm install  
#### 4. npm run dev:dev  

## 使用说明

#### 1. 访问路径必须为localhost:3000才可以登录
#### 2. 用户名：（admin）（user）密码：（111111）

## 参与贡献

JustTwo

## 项目结构
```
├── public           #静态资源
├── src              #前端项目源码目录
│   ├───—api         #接口文件目录
│   ├───—assets      #静态资源资源目录
│   ├───—common      #公用文件目录
│   ├───—components  #公共组件目录
│   ├───—language    #国际化语言目录
│   ├───—layout      #项目模式配置组件目录
│   ├───—router      #路由目录
│   ├───—store       #状态管理目录
│   ├───—utils       #常用方法目录
│   ├───—views       #视图文件目录
│   ├───—App.vue     #项目入口文件
│   └────main.js     #项目的核心配置文件
├── vite.config.js   #vite配置文件
├── .env.development #开发环境下配置文件
├── .env.production  #正式环境下配置文件
├── index.html       #首页入口文件
├── package.json     #项目依赖列表文件
├── LICENSE          #开源凭证
└── README.md        #项目的说明文档
```

## V1.0.0 版本功能
### 0. 三种不同模式 PC横向导航 PC垂直导航 手机导航  
    在.env中自行配置：VITE_LAYOUT_TYPE
### 1. 国际化 
    /src/language/en.js 和 /src/language/zh_cn.js 填写对应的语言  
    引用 import { useI18n } from "vue-i18n";  
    使用 const { t } = useI18n();   
    视图中 {{t('regist')}}  
    可在登录页查看具体用法
### 2. 动态路由和路由鉴权（菜单管理和权限管理未完善）
    结合vuex,cookie,localstorage使用  
### 3. 二次封装element_table组件: /src/components/table.vue
#### 引用表格组件
```vue
<table-box
      :tableData="state.tableData"
      :tableColumn="tableColumn"
      :selection="true"
      :selectedData="selectedData"
      :routeRoles="route.meta.roles"
      @actionClick="actionClick"
    >
      <!-- 自定义列 -->
  <template
    v-slot:status="{row}"
  >
    <i
      class="el-icon-circle-check"
      v-if="row.status"
    ></i>
    <i
      class="el-icon-circle-close"
      v-else
    ></i>
  </template>
</table-box>
```
#### 表格数据
```javascript
tableData: [
    {
      id: 3,
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路1518弄",
      status: false,
    },
  ],
```
#### 需要展示的表格字段和表格操作
```javascript
const tableColumn = [
  {
    type: "index",
    label: "序号",
  },
  {
    prop: "status", // 字段关键字
    label: "状态",  // 字段描述
    width: "150",   // 列宽
    slot: true,    // 是否需要插槽自定义
  },
  {
    type: "action", // 识别操作类型的关键字段
    label: "操作", // 字段描述
    width: "150",   // 列宽
    actionBtn: [
      // 操作列表
      // 如果要做权限，这里的funName需要和路由菜单中meta的auth一致
      {
        funName: "detail", // 自定义操作方法名
        title: "详情",     // 自定义操作标题
        color: "orange",   // 操作按钮颜色，如需其他颜色可在组件中自行添加
      },
      {
        funName: "edit",
        color: "orange",
        title: "编辑",
      },
      {
        funName: "del",
        color: "red",
        title: "删除",
      },
    ],
  },
];
```
#### 表格行操作
```javascript
function actionClick(e) {
  console.log(e.funName); // 表格行操作方法名
  console.log(e.data);    // 表格行数据
}
```

### 4. 封装检索条件组件:  /src/components/retrival.vue
#### 引用检索组件
```vue
<retrieval
      :retrievalList="retrievalList"
      :retrievalActionBtn="retrievalActionBtn"
      @retrievalAction="retrievalAction"
    >
     <!-- 插槽式添加自定义检索 -->
  <template
    v-slot:custom="{form, props, slotChange}"
  >
    <el-input v-model="form[props]" placeholder="自定义检索" @change="slotChange"></el-input>
  </template>
</retrieval>
```
#### retrievalList 检索列表
```javascript
const retrievalList = [
  {
    props: "input",  // 关键字
    label: "输入框", // 标题
    type: "input",  // 检索类型 目前支持 input select DatePicker，需要更多其它类型可在retrieval组件中添加或者slot插槽模式自定义
    default: "111", // 默认值
    options: [{     // 检索类型为select时添加的下拉列表
        label: "全部",
        value: "",
      },
      {
        label: "值1",
        value: "1",
      },
      {
        label: "值2",
        value: "2",
      }],    
  },
];
```
#### retrievalActionBtn 右侧按钮列表
```javascript
const retrievalActionBtn = ["add", "retrieval"]; // add新增 retrieval查询 reset重置 download导出 需要更多按钮可在retrieval组件中自行配置添加
```
#### retrievalAction 右侧按钮点击方法
```javascript
function retrievalAction(e) {
  console.log(e.type) // 点击的按钮类型
  console.log(e.form) // 检索数据列表
}
```

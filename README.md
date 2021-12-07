<!--
 * @Author: your name
 * @Date: 2021-01-07 09:49:49
 * @LastEditTime: 2021-08-05 14:55:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\README.md
-->

项目使用了最新的**vue3 全家桶**+**element-plus**+**mockjs**+**axios**+**eChart5**.项目继成了**mockServe**,可脱离后端自主开发测试
对**axios**深度封装,采用动态路由,路由配置更简单,**mockServe**独立开发测试时可在 nodework 直观查看接口数据  
基于 node 实现自动化开发

## 环境依赖

**node 14+**, **vueCli 4+**

## 部署步骤

**npm i**
**npm run serve**

## 目录结构描述

```
│  .browserslistrc			浏览器兼容配置
│  .eslintrc.js				eslint配置文件
│  .gitignore				git配置文件
│  babel.config.js			babel配置文件
│  jsconfig.json 			js配置文件
│  LICENSE 					开源认证
│  package-lock.json
│  package.json
│  README.md				项目说明
│  vue.config.js 			vue配置文件
│
├─.vscode					vscode配置文件
│      settings.json
│
├─node_modules
├─public
│      favicon.ico
│      index.html
│
└─src
    │  App.vue
    │  main.js
    │  config.js
    │
    ├─api					api管理模块
    │  │  index.js			api管理入口文件
    │  │  mock-server.js	mock服务配置文件
    │  │
    │  └─modules			api分模块管理
    │          system.js	模块api文件
    │
    ├─assets				静态文件
    │      logo.png
    │
    ├─components			公共组件目录
    │  │  Common.vue
    │  │  FunctionPage.vue
    │  │
    │  ├─dashboard
    │  │      LiveChart.vue
    │  │      Shortcuts.vue
    │  │
    │  └─layout
    │      │  NavigateBar.vue
    │      │  SideBar.vue
    │      │
    │      └─components
    │              Breadcrumb.vue
    │              Hamburger.vue
    │              Logo.vue
    │              Personal.vue
    │              SlideMenu.vue
    │
    ├─directives			自定义指令目录
    │  │  index.js			自定义指令入口文件
    │  │
    │  └─modules 			自定义指令模块目录
    │          permission.js
    │          resize.js
    │
    ├─plugins				插件目录
    │      axios.js
    │      element.js
    │      mock.js
    │      permission.js
    │
    ├─router 				router目录
    │      globalRoutes.js
    │      index.js
    │      mainRoutes.js
    │
    ├─store 				vuex目录
    │  │  getters.js
    │  │  index.js
    │  │
    │  └─modules			vuex模块目录
    │          app.js
    │
    ├─styles 				样式目录
    │      common.scss
    │      variables.scss.js
    │
    ├─utils					公共方法
    │      index.js
    │      validate.js
    │
    └─views
        │  404.vue
        │  AppMain.vue
        │  Home.vue
        │  IFrame.vue
        │  Login.vue
        │
        └─layoutpages
            │  common.js
            │
            ├─leisure
            │      Game.vue
            │
            └─system
                │  Menus.vue
                │  Roles.vue
                │  Users.vue
                │
                └─components
                        MenuEdit.vue
                        RoleEdit.vue
                        UsersEdit.vue
                        UsersEditRoute.vue
```

## 使用文档

### 自定义指令

**v-permission="[array]"**
自定义权限指令,参数为一个数组,数组元素为按钮所对应的 key 值

```js
<el-button
    v-permission="['add']"
    size="mini"
    type="primary"
    @click="handleEdit(menus.add.name)"
    >{{ menus.add.name }}
</el-button>
```

**v-resize="myChart"**
监听 echart 容器的自定义指令,参数为 echart 实例

```js
<div
    v-resize="myChart"
    style="height:400px;margin-top:20px"
    ref="liveChart"
></div>
```

### 动态路由

动态路由的配置可查看 [src\plugins\permission.js](src\plugins\permission.js)  
主要原理就是根据后端接口返回的树形菜单数据,动态生成路由表并挂载.具体需求字段可在[src\plugins\permission.js](src\plugins\permission.js)中的**fnAddDynamicMenuRoutes**方法中进行配置修改

```js
let route = {
    path: menuList[i].url.replace(/\//g, "-") + `-${menuList[i].id}`,
    component: null,
    name: menuList[i].url.replace(/\//g, "-") + `-${menuList[i].id}`
    // meta: {
    // }
};
// url以http[s]://开头, 通过iframe展示
if (menuList[i].iframe == 1) {
    route["path"] = `i-${menuList[i].id}`;
    route["name"] = `i-${menuList[i].id}`;
    route["props"] = { url: menuList[i].url };
    route["component"] = () => import("@/views/IFrame.vue");
} else {
    const l = "views/layoutpages/" + menuList[i].url;
    route["component"] = () => import("@/" + l + ".vue");
}
routes.push(route);
```

根据需求可以添加更多路由配置或定制化字段,如路由别名等

### 接口配置

项目中对 axios 做了封装配置中添加**Global**字段用来控制是否显示全屏 load,默认为 true,如需修改添加 axios 配置可在[src\plugins\axios.js](src\plugins\axios.js)中进行

#### 添加接口

本项目对 mock 做了深度集成,在使用其他项目时,mock 接口和项目接口往往都是分开维护很不方便.所以就放在了一起.只用在一处添加即可.接口目录为[src\api\modules](src\api\modules)**不要修改此目录名称**.在该目录下添加对应的接口文件.

```js
module.exports = {
    login: {
        //接口名称  必须
        url: "/login", //接口地址  必须
        type: "post", //请求类型  必须
        mock: true, //mock细粒度控制开关,非必须,不填则为false
        response: opt => {
            //启用mock时的返回数据  opt为请求数据头
            const {
                body: { userName, pwd }
            } = opt;
            let data = {
                code: "00",
                message: "登录成功!",
                token: new Date().getTime(),
                uname: userName
            };
            if (userName == "Administrator") {
                if (pwd != "123456") {
                    data = {
                        code: "01",
                        message: "密码错误"
                    };
                }
            }
            return data;
        }
    }
};
```

必须使用**module.exports**导出

#### 接口的使用

项目中已将封装后 axios 实例挂载到自定义字段 window.VE_API 上.调用方式为:

```js
VE_API [ fileName ][ portName ] (params,[config])   //有全局loading
VE_API [ fileName ][ portName ] (params,{Global:false)   //没有全局loading
```

### 菜单配置

项目中的菜单时根据后端返回的树形结构数据动态生成,具体可查看[src\components\layout\components\SlideMenu.vue](src\components\layout\components\SlideMenu.vue)

## 声明

个人开发维护! 欢迎交流学习!

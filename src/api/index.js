import axios from 'axios'
import { getCookie } from '../utils/cookie'
import router from '../router/index.js'
import { ElMessageBox } from "element-plus";
import  store  from "../store/index.js";




const base_url = import.meta.env.VITE_BASE_URL;

//创建axios的一个实例 
const http = axios.create({
    baseURL: base_url, //接口统一域名
    timeout: 60000      //设置超时
})


//------------------- 一、请求拦截器 忽略
http.interceptors.request.use(function (config) {

    if (config.url.indexOf("route") == -1 && config.url.indexOf("getLogin") == -1 
    && config.url.indexOf("loginOut") == -1 && config.url.indexOf("checkLogin") == -1 && config.url.indexOf("findAllUser") == -1
    && config.url.indexOf("registerUser") == -1 && config.url.indexOf("findUserPage") == -1
    && config.url.indexOf("deleteUser") == -1 && config.url.indexOf("insertToVisitor") == -1) {
        config.data.token = getCookie('token');
        config.headers['auth'] = config.data.auth;
        config.headers['token'] = getCookie('token');
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//----------------- 二、响应拦截器 忽略
http.interceptors.response.use(function (response) {
    const status = response.status
    const data = response.data;
    if (data.status == 8) {
        let stores = store;
        //用户登出时将用户名制空，仿止二次访问
        stores.commit('updataUsername', null);
        router.replace("/login");
        ElMessageBox.alert("当前用户已登出！", "WARING", {
            confirmButtonText: "OK",
        });
    }
    else {
        return data;
    }

}, function (error) {
    // 对响应错误做点什么
    console.log('拦截器报错');
    return Promise.reject(error);
});

/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下：
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数 orrsrosx
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */
export default function (method, url, data = null) {
    method = method.toLowerCase();
    if (method == 'post') {
        return http.post(url, data)
    } else if (method == 'get') {
        return http.get(url, { params: data })
    } else if (method == 'delete') {
        return http.delete(url, { params: data })
    } else if (method == 'put') {
        return http.put(url, data)
    } else {
        console.error('未知的方法 : ' + method)
        return false
    }
}
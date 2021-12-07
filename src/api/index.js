import axios from 'axios'
const base_url = import.meta.env.VITE_BASE_URL;

//创建axios的一个实例 
const http = axios.create({
    baseURL:    base_url, //接口统一域名
    timeout:    6000      //设置超时
})
 
 
//------------------- 一、请求拦截器 忽略
http.interceptors.request.use(function (config) {
 
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
 
//----------------- 二、响应拦截器 忽略
http.interceptors.response.use(function (response) {
    const status = response.status
    const data = response.data;
    if (status === 200) { // 接口请求成功
        
    }
    return data;
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
 * @param {Object} data    请求的参数 JustTwo
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
    }else if(method == 'put'){
        return http.put(url,data)
    }else{
        console.error('未知的方法 : '+method)
        return false
    }
}
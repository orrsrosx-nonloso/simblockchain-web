import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import './assets/css/theme.scss'
import store from './store'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import i18n from './language/i18n'
import echarts from 'echarts'

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {locale});
app.use(i18n);
app.use(store);
app.mount('#app');


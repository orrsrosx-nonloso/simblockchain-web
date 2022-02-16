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
import {SuperFlow} from 'vue3-super-flow'
import CScrollbar from 'c-scrollbar';
import 'vue3-super-flow/dist/style.css'

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {locale});
app.use(i18n);
app.use(store);
app.use(SuperFlow);
app.use(CScrollbar);
app.mount('#app');


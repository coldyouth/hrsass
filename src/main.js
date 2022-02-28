import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Print from 'vue-print-nb'

import '@/icons' // icon
import '@/permission' // permission control

import * as directives from '@/directives'
import * as filters from '@/filters'
import Components from '@/components'
import checkPermission from './mixin/checkPermission'

// 挂载所有的自定义全局组件
Vue.use(Components)

// 打印插件
Vue.use(Print)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册过滤器
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局混入
Vue.mixin(checkPermission)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

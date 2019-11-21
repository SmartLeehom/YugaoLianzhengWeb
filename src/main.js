// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

import { Loading, Message, MessageBox } from 'element-ui'
Vue.use(Loading.directive);

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import Echarts from 'echarts'
Vue.prototype.echarts = Echarts
Vue.use(Echarts)

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

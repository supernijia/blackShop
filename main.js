import Vue from 'vue'
import App from './App'
//导入网络请求包
import { $http } from '@escook/request-miniprogram'
//导入store实例对象
import store from '@/store/store.js'

Vue.config.productionTip = false
uni.$http = $http
//默认请求路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'
//请求拦截器
$http.beforeRequest = function (options) {
  // do somethimg...
  console.log(options);
  uni.showLoading({
	  title : '数据加载中...'
  })
}
//响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}
//封装弹框方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500, icon = 'error') {
	uni.showToast({
		title,
		duration,
		icon
	})
}
App.mpType = 'app'

const app = new Vue({
    ...App,
	//store挂载到vue实例上
	store
})
app.$mount()

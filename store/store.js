//导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
//导入购物车的Vuex模块
import moduleCart from './cart.js'
//导入用户信息的Vuex模块
import moduleUser from './user.js'

//将vuex安装为vue插件
Vue.use(Vuex)

//创建store的实例对象
const store = new Vuex.Store({
	//挂载store模块
	modules: {
		m_cart:moduleCart,
		m_user:moduleUser
	}
})

//导出store实例对象
export default store
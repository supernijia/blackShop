export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	// 模块的 mutations 方法
	mutations: {
		addToCart(state, goods) {
			//根据商品id，查询购物车中是否存在这件商品
			//如果不存在，加入购物车，存在修改对应的数量
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (!findResult) {
				//没有此商品，直接添加
				state.cart.push(goods)
				// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
				this.commit('m_cart/saveToStorage')
				return
			}
			//修改对应商品数量
			findResult.goods_count++
			// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		//更新商品选中状态（购物车）
		updateGoodsState(state,goods) {
			//根据goods_id查询购物车中对应的商品信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult) {
				//修改商品选中状态
				findResult.goods_state = goods.goods_state
				//持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		//更新购物车中商品的数量
		updateGoodsCount(state,goods) {
			//根据商品id查询购物车中对应的商品信息
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult) {
				findResult.goods_count = goods.goods_count
				//持久存储本地
				this.commit('m_cart/saveToStorage')
			}
		},
		//删除购物车中的物品
		removeGoodsById(state, goods_is) {
			//调用数组filter方法过滤
			const arr = state.cart.filter(x => x.goods_id !== goods_is)
			console.log(arr);
			state.cart = [...arr]
			//持久存储本地
			this.commit('m_cart/saveToStorage')
		},
		//更新所有商品的选中状态
		updateAllGoodsState(state,newState) {
			//循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			//持久存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},

	// 模块的 getters 属性
	getters: {
		//统计购物车中商品的总数量
		total(state) {
			let c = 0
			//循环统计商品数量累加到c
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		//勾选商品的总数
		checkedCount(state) {
			//先用filter方法过滤购物车中的已经选中的商品
			//再用reduce方法将已勾选的商品数量进行累加
			//reduce（）的返回值就是已勾选商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0)
		},
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
		  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
		  // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
		  // reduce() 的返回值就是已勾选的商品的总价
		  // 最后调用 toFixed(2) 方法，保留两位小数
		  return state.cart.filter(x => x.goods_state)
		                   .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
		                   .toFixed(2)
		}
	},
}

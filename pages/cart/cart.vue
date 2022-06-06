<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>

		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 循环渲染购物车中的商品信息 -->
		<uni-swipe-action>
			<!-- <block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block> -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item>
					<view class="content-box">
						<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
							@num-change="numberChangeHandler"></my-goods>
					</view>
					<!--使用右插槽-->
					<template v-slot:right>
						<view class="slot-button" @click="swipeItemClickHandler(goods)"><text
								class="slot-button-text">删除</text></view>
					</template>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<!-- 结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 空白购物车区域 -->
	  <view class="empty-cart" v-else>
	    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
	    <text class="tip-text">空空如也~</text>
	  </view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: 'cart',
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart']),
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}],
				timer: null
			};
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(goods) {
				//删除商品使用防抖
				clearTimeout(this.timer)

				this.timer = setTimeout(() => {
					this.removeGoodsById(goods.goods_id)
				},500)

			},
		},
	}
</script>

<style lang="scss">
	.cart-container {
		padding-bottom: 50px;
		
		.cart-title {
			height: 40px;
			display: flex;
			align-items: center;
			padding-left: 5px;
			border-bottom: 1px solid #EFEFEF;
		
			.cart-title-text {
				font-size: 14px;
				margin-left: 10px;
			}
		}
		
		.slot-button {
			/* #ifndef APP-NVUE */
			display: flex;
			height: 100%;
			/* #endif */
			flex: 1;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
			background-color: #ff5a5f;
		}
		
		.slot-button-text {
			color: #ffffff;
			font-size: 14px;
		}
	}
	
	.empty-cart {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 150px;
	
	  .empty-img {
	    width: 90px;
	    height: 90px;
	  }
	
	  .tip-text {
	    font-size: 12px;
	    color: gray;
	    margin-top: 15px;
	  }
	}
</style>

<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodslist" :key="i" @click="gotoDetail(goods)">
				<!-- <view class="goods-item"> -->
					<!-- 商品左侧图片区域 -->
					<!-- <view class="goods-item-left"> -->
						<!-- <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image> -->
					<!-- </view> -->
					<!-- 商品右侧信息区域 -->
					<!-- <view class="goods-item-right"> -->
						<!-- 商品标题 -->
						<!-- <view class="goods-name">{{goods.goods_name}}</view> -->
						<!-- <view class="goods-info-box"> -->
							<!-- 商品价格 -->
							<!-- <view class="goods-price">￥{{goods.goods_price}}</view> -->
						<!-- </view> -->
					<!-- </view> -->
				<!-- </view> -->
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//默认图片
				// defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				goodslist:[],
				queryObj: {
					//查询关键词
					query:'',
					//商品分类id
					cid:'',
					//页码值
					pagenum:1,
					//每页10条数据
					pagesize:10,
					//总页数
					total:0
				},
				//数据节流
				isloading:false
			};
		},
		onLoad(options) {
			//将页面参数转存到queryObj对象
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			this.getGoodsList()
		},
		methods: {
			//数据请求
			async getGoodsList(callback) {
				//打开节流阀
				this.isloading = true
				//发起请求
				const {data : res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				//关闭节流阀
				this.isloading = false
				//数据请求完毕，立即按需调用callback回调函数
				callback && callback()
				if(res.meta.status !== 200) return uni.$showMsg();
				this.goodslist = [...this.goodslist,...res.message.goods]
				this.total = res.message.total
			},
			//跳转详情
			gotoDetail(item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		//上拉触底
		onReachBottom() {
			//判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！',1500,'success')
			//判断是否正在请求数据，如果是，不发起额外请求
			if(this.isloading) return
			//页码自增
			this.queryObj.pagenum += 1
			//重新获取列表数据
			this.getGoodsList()
		},
		//下拉刷新
		onPullDownRefresh() {
			//重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodslist = []
			
			//重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
// .goods-item {
//   display: flex;
//   padding: 10px 5px;
//   border-bottom: 1px solid #f0f0f0;

//   .goods-item-left {
//     margin-right: 5px;

//     .goods-pic {
//       width: 100px;
//       height: 100px;
//       display: block;
//     }
//   }

//   .goods-item-right {
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;

//     .goods-name {
//       font-size: 13px;
//     }

//     .goods-price {
//       font-size: 16px;
//       color: #c00000;
//     }
//   }
// }
</style>

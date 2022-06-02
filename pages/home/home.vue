<template>
	<view>
		<!-- 搜素组件 -->
		<view class="search-area">
			<search @click='gotoSearch'></search>
		</view>
		<!-- 轮播图的区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in swiperLiset" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类 导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!--左侧图片 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧图片 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperLiset: [],
				navList: [],
				floorList: []
			};
		},
		onLoad() {
			this.getSwiperList(),
				this.getNavList(),
				this.getFloorList()
		},
		methods: {
			//请求轮播图
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				//请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperLiset = res.message
				uni.$showMsg('数据请求成功！', 1000, 'success')
			},
			//请求导航菜单
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			//跳转对应菜单页
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			//请求楼层数据
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')

				if (res.meta.status !== 200) return uni.$showMsg()
				//数据处理
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			//跳转搜素
			gotoSearch() {
				uni.navigateTo({
					url:'/subpkg/searchData/searchData'
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-area {
		position: sticky;
		top: 0;
		z-index: 999;
	}
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-list {
		.floor-item {
			margin-bottom: 20px;
		}

		.floor-title {
			width: 100%;
			height: 60rpx;
		}

		.floor-img-box {
			display: flex;
			padding-left: 10rpx;
		}

		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
</style>

<template>
	<view>
		<!-- 使用搜素组件 -->
		<search @click='gotoSearch'></search>
		<view class="scroll-view-container">
			<scroll-view scroll-y="true" class="left-scroll-view" :style="{height : he + 'px'}">
				<block v-for="(item,i) in cateList" :key="i">
					<view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="changeActive(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<scroll-view scroll-y="true" :style="{height: he + 'px'}" :scroll-top="screenTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<!-- 二级分类的标题 -->
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 当前二级分类下的三级分类列表 -->
					<view class="cate-lv3-list">
						<!-- 三级分类的Item项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 三级分类的图片 -->
							<image :src="item3.img_src"></image>
							<!-- 三级分类的文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//导入自己封装的minin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				he: 0,
				cateList: [],
				active: 0,
				//二级分类列表
				cateLevel2: [],
				screenTop: 0
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.he = sysInfo.windowHeight - 50,
				this.getCateList()
		},
		methods: {
			//请求菜单列表数据
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message

				//二级菜单
				this.cateLevel2 = res.message[0].children
				this.cateLevel2.map(item => {
					item.children.map(item1 => {
						let arr = item1.cat_icon.split('.')
						arr.splice(0, 1, 'https://api-ugo-web')
						arr.join(',')
						item1.img_src = arr.join('.')
					})
				})
			},
			//选中菜单项
			changeActive(i) {
				this.active = i
				//更新二级分类菜单
				this.cateLevel2 = this.cateList[i].children
				this.cateLevel2.map(item => {
					item.children ?
						item.children.map(item1 => {
							let arr = item1.cat_icon.split('.')
							arr.splice(0, 1, 'https://api-ugo-web')
							arr.join(',')
							item1.img_src = arr.join('.')
						}) : ''
				})
				//返回顶部菜单
				this.screenTop = this.screenTop === 0 ? 1 : 0
			},
			//跳转详情列表页
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			},
			//
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/searchData/searchData'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				background-color: #F7F7F7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #C00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>

<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetali(item)">
				<!-- <view class="emptyValue" v-show="searchResults.length === 0">暂无此类商品</view> -->
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="forward" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in history" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw:'',
				//搜素结果列表
				searchResults:[],
				//搜素历史数组
				historyList:[],
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			//input输入事件
			input(e) {
				clearTimeout(this.timer)
				
				this.timer = setTimeout(() => {
					this.kw = e
					this.getSearchList()
				},500)
			},
			//请求搜索结果
			async getSearchList() {
				if(this.kw === '') {
					this.searchResults = []
					return
				}
				//请求数据
				const { data : res } = await uni.$http.get('/api/public/v1/goods/search',{query:this.kw})
				if(res.meta.status !== 200) return uni.$showMsg()
				if(res.message.goods.length === 0) {
					uni.$showMsg('搜索错误，请重新输入关键字！',1500)
					return
				}
				this.searchResults = res.message.goods
				this.saveSearchHistory()
			},
			//跳转商品详情
			gotoDetali(item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			//保存搜索结果内容
			saveSearchHistory() {
				// this.historyList.push(this.kw)
				const reulst = this.historyList.find(item => item === this.kw)
				if(!reulst) {
					this.historyList.push(this.kw)
					//搜索结果持久化
					uni.setStorageSync('kw', JSON.stringify(this.historyList))
					return
				}
				//将搜索结果提到最前方
				this.historyList.forEach((item,index) => {
					console.log(reulst);
					if(item === reulst) {
						this.historyList.splice(index,1)
						this.historyList.push(reulst)
					} 
				})
				//搜索结果持久化
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			//清空搜索历史记录
			cleanHistory() {
				this.historyList = []
				uni.setStorageSync('kw','[]')
			},
			//点击历史搜索跳转
			gotoGoodsList(item) {
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query=' + item
				})
			}
		},
		computed: {
			//反转数组
			history() {
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list {
	padding: 0 5px;
	.sugg-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}
.history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
		background-color: #efefef;
		color: #000;
		border: none;
      }
    }
  }
</style>

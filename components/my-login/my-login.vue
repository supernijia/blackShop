<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
		<text class="tips-text">登录后尽享更多权益</text>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'

	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 用户授权之后，获取用户的基本信息
			async getUserInfo() {

				      // if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
					  const [err, res] = await uni.getUserProfile({desc:'点击授权登录'})
					
					console.log(res);

				      this.updateUserInfo(res.userInfo)

				this.getToken(res)

			},
			async getToken(info) {
				// 获取 code 对应的值
				const [err, res] = await uni.login().catch(err => err)
				console.log(res);
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

				// 准备参数
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				
				console.log(query);
				
				uni.$http.baseUrl = 'http://localhost:8888'
				const {
					data: loginResult
				} = await uni.$http.post('/login',query)
				console.log(loginResult);
				if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')

				// 直接把 token 保存到 vuex 中
				this.updateToken(loginResult.message.token)
				this.navigateBack()
			},
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;

		&::after {
			content: ' ';
			display: block;
			width: 100%;
			height: 40px;
			background-color: white;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>

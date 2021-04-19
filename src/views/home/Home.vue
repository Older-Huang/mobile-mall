<template>
	<div class="home">
		<van-nav-bar title="精选" class="nav_border" fixed>
			<template #left>
				<van-icon name="location-o" />
				<span>深圳市</span>
			</template>
			<template #right>
				<van-icon name="search" />
			</template>
		</van-nav-bar>
		<main class="mainContent pContent" @scroll="scrollLoding" ref="main">
			<div class="pItem" v-for="item in pDataList" :key="item.id" @click="pItemContent(item.id)">
				<img :src="item.cover" @error.once="imgErr($event)" alt="">
				<!-- 指令解决图片加载 显示默认图片 -->
				<!-- <img :src="item.cover" v-default-img="imgUrl" alt=""> -->
				<div class="bottom">
					<h3>{{item.name}}</h3>
					<span>{{item.price}}</span>
				</div>
			</div>
		</main>
		<van-icon name="upgrade" class="backTop" @click="backTop" v-show="showBackTop" />
	</div>
</template>

<script>
	import {
		Loading
	} from 'element-ui';
	import {
		reqHomeData
	} from 'network/api'
	export default {
		name: 'Home',
		data() {
			return {
				pDataList: [], //商品数据列表
				totalPages: 0, //总页数
				page: 1, //当前页数
				flag: false, //是否加载下一页
				imgUrl: require('../../assets/img/phone1.jpg'), //图片加载失败
				showBackTop: false //隐藏backTop
			}
		},
		created() {
			this.getHomeData(this.page)
		},
		methods: {
			//点击跳转详情页
			pItemContent(id){
				this.$router.push({
					path:"/detial",
					query:{id}
				})
			},
			//返回顶部
			backTop() {
				let {
					scrollTop
				} = this.$refs.main
				const interId = setInterval((_) => {
					this.$refs.main.scrollTop -= scrollTop / 30
					if (this.$refs.main.scrollTop <= 0) {
						clearInterval(interId)
					}
				}, 10)

			},

			//滚动加载事件
			scrollLoding() {
				//ref 对dom元素进行访问 通过ref 拿取main的属性
				let {
					scrollHeight,
					scrollTop,
					offsetHeight
				} = this.$refs.main
				this.showBackTop = scrollTop > 1500
				//数据一页一页加载，等当前页面加载完成才可以再次请求下一页数据
				if (this.flag) return
				if (scrollHeight - offsetHeight <= scrollTop + 2) {
					this.page++
					//到底部了
					if (this.page > this.totalPages) {
						return this.$toast('没有更多数据')
					}
					//加载事件
					let loadingInstance = Loading.service({
						text: '拼命加载中'
					});
					this.getHomeData(this.page)
					setTimeout(_ => {
						this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
							loadingInstance.close();
						});
					}, 1000)
				}
			},
			//图片加载失败 显示默认的图片
			imgErr(e) {
				e.currentTarget.src = this.imgUrl
			},
			//请求商品数据
			async getHomeData(page) {
				this.flag = true
				//取出请求的数据
				let {
					data
				} = await reqHomeData(page)
				//将商品数据依次添加到数据列表中
				// this.pDataList = this.pDataList.concat(data.data)
				this.pDataList = [...this.pDataList, ...data.data]
				//商品总页数
				this.totalPages = data.totalPages
				this.flag = false
			}
		}

	}
</script>

<style lang="less" scoped>
	.van-nav-bar {
		.van-icon {
			font-size: .36rem;
		}
	}

	.pContent {
		padding: 4px;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		overflow-y: scroll;

		.pItem {
			width: 48%;
			padding: 0.3vw 0.3vw 50px 0;
			box-sizing: border-box;
			box-shadow: 0 0 3px rgba(100, 100, 100, 80%);
			margin-bottom: 10px;
			border-radius: 5px;
			position: relative;

			img {
				width: 100%;
			}

			.bottom {
				padding: 3px;
				box-sizing: border-box;
				position: absolute;
				bottom: 3px;
				left: 0;
				right: 0;

				h3 {
					font-size: 14px;
					white-space: nowrap;
					overflow-x: hidden;
					text-overflow: ellipsis;
					line-height: 30px;
				}

				span {
					color: #f50;
				}
			}
		}
	}

	.backTop {
		position: fixed;
		bottom: 1.4rem;
		right: .4rem;
		font-size: .8rem;
		color: rgba(100, 100, 100, .5)
	}
</style>

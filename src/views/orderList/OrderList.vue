<template>
	<!-- 订单页 -->
	<div class="orderList">
		<van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="$router.back()" fixed class="nav-border" />
		<main class="mainContent" @scroll="mainScroll" ref="main">
			<van-cell-group v-for="item in orderList" :key="item.id">
				<van-cell 
				  class="tcell" 
				  :title="'订单ID:'+item.id" 
				  is-link 
				  :to="{path:'/orderInfo',query:{id:item.id}}" 
				/>
				<van-cell class="citemcell" v-for="citem in item.orderProducts" :title="citem.name"
					:value="citem.count+'件'" :label="citem.price | formatPrice" :icon="citem.cover" />
			</van-cell-group>
		</main>
	</div>
</template>

<script>
	import {
		reqOrderList
	} from 'network/api'
	export default {
		name: 'OrderList',
		data() {
			return {
				orderList: [],
				page: 1,
				flag: false,
				totalPages: 0, //总页数
			}
		},
		created() {
			this.getOrderList(this.page)
		},
		methods: {
			//滚动加载

			mainScroll() {
				let {
					scrollHeight,
					scrollTop,
					offsetHeight
				} = this.$refs.main
				this.showBakcTop = scrollTop > 1500
				if (this.flag) {
					return
				}
				if (scrollHeight - offsetHeight <= scrollTop + 2) {
					this.page++
					if (this.page > this.totalPages) return this.$toast('没有更多数据')
					this.getOrderList(this.page)
				}
			},

			//获取订单列表
			async getOrderList() {
				const { status } = this.$route.query;
				const {
					data,
					errcode
				} = await reqOrderList(this.page, status)
				if (errcode !== 0) return;
				this.orderList = [...this.orderList, ...(data?.data || [])];
				this.totalPages = data.totalPages
				this.flag = false
			}
		}
	}
</script>

<style lang="less" scoped>
	main {
		height: calc(100vh - .92rem);
		overflow-y: scroll;

		.tcell {
			border-top: .2rem solid #f4f4f4;
		}

		.citemcell {
			.van-icon {
				width: 1rem;
				height: 1rem;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.van-cell__title {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

		}
	}
</style>

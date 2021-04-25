<template>
	<div class="orderInfo">
		<!-- navbar -->
		<van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="leftClick" fixed>
		</van-nav-bar>
		<!-- 状态 -->
		<van-steps :active="this.orderInfo.order_status">
			<van-step>未付款</van-step>
			<van-step>已付款</van-step>
			<van-step>已发货</van-step>
			<van-step>交易完成</van-step>
		</van-steps>
		<!-- 地址 -->
		<div class="address">
			<van-cell-group>
				<van-cell :title="AddrTitle" :label="AddrDetail" />
			</van-cell-group>
		</div>
		<!-- 商品列表 -->
		<div class="product">
			<van-cell-group>
				<van-cell v-for="item in orderInfo.orderProducts" :key="item.product_id"
					:title="item.name.split(' ')[0]" :value="item.count + '件'" :label="item.price | formatPrice"
					:icon="item.cover" />
			</van-cell-group>
		</div>
		<!-- 底部 -->
		<van-cell-group class="footer tab_border">
			<van-cell v-if="this.orderInfo.order_status ===0">
				<template #title>
					<div>
						合计：<span>{{totalPrice | formatPrice}}</span>
					</div>
				</template>
				<template #default>
					<van-button type="primary" @click="payClick">付款</van-button>
				</template>
			</van-cell>
			<van-cell v-else="this.orderInfo.order_status===1">
				<template #title>
					<div>
						合计：<span>{{totalPrice | formatPrice}}</span>
					</div>
				</template>
				<template #default>
					<van-button type="info" disabled @click="payClick">等待商家发货</van-button>
				</template>
			</van-cell>
		</van-cell-group>
		<PasswordInput ref="PasswordInput" :orderId="$route.query.id"></PasswordInput>
	</div>
</template>
<script>
	import PasswordInput from 'components/passwordInput/PasswordInput'
	import {
		reqOrderInfo
	} from 'network/api'
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'OrderInfo',
		components: {
			PasswordInput
		},
		data() {
			return {
				id: this.$route.query.id, //订单id
				orderInfo: {}, //订单列表
			}
		},
		created() {
			this.getOrderInfo();
		},
		
		methods: {
			//
			leftClick() {
				if(this.$route.query.from === 'paySuccess')return this.$router.replace('/home')
				return this.$router.back()
				
			},
			//点击付款
			payClick() {
				this.$refs.PasswordInput.popShow = true
			},
			//请求订单详情
			async getOrderInfo() {
				//请求订单
				// const res = await reqOrderInfo(this.id)
				// console.log(res)
				//取出状态码 订单数据
				const {
					errcode,
					data
				} = await reqOrderInfo(this.id)
				if (errcode !== 0) return this.$toast.fail("请求失败")
				this.orderInfo = data
			}
		},
		computed: {
			//总价
			totalPrice() {
				if (!this.orderInfo.orderProducts) return
				return this.orderInfo.orderProducts.reduce(
					(p, c) => p + c.price * c.count,
					0
				)
			},
			//选择地址的详细地址
			AddrDetail() {
				if (!this.orderInfo.userAddress) return
				const {
					province,
					city,
					country,
					detail
				} = this.orderInfo.userAddress
				return `${province} ${city} ${country} ${detail}`
			},
			//选择地址标题
			AddrTitle() {
				if (!this.orderInfo.userAddress) return
				const {
					name,
					mobile
				} = this.orderInfo.userAddress
				return `${name}，${mobile}`
			},
		}
	}
</script>
<style lang="less" scoped>
	.van-steps {
		margin-top: .92rem;
	}

	.address {
		.van-cell {
			border-top: .2rem solid #f4f4f4;
			border-bottom: .2rem solid #f4f4f4;
		}
	}

	.product {
		height: calc(100% - 4.76rem);
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;

		.van-cell__left-icon {
			font-size: 1rem;
		}

		.van-cell__title {
			display: block;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}

	.footer {
		height: 1rem;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;

		.van-cell {
			height: 100%;
			padding: 0 .2rem;
			justify-content: space-between;
			align-items: center;
		}

		.van-button {
			width: 70%;
		}

		.van-cell__title span {
			color: #f50;
		}
	}
</style>

<template>
	<!-- 确认订单 -->
	<div class="orderConfirm">
		<van-nav-bar title="确认订单" left-text="返回" left-arrow @click-left="$router.back()" class="nav_border" />
		<van-cell :title="selAddrTitle" is-link :to="{path:'/addressList',query:{from:'prderConfirm'}}"
			:label="selAddrDetail" class="address" />

		<van-cell-group>
			<van-cell v-for="item in orderList" :key="item.product_id" :title="item.name" :value="item.count+'件'"
				:label="item.price | formatPrice" :icon="item.cover" />
		</van-cell-group>
		<van-submit-bar button-text="付款" :disabled=isFlag :price="totalPrice" class="tab_border" @submit="buySubmit">
			共计：{{totalCount}}件
		</van-submit-bar>
		<PasswordInput ref="PasswordInput" :orderId="order_id"></PasswordInput>
	</div>

</template>

<script>
	import PasswordInput from 'components/passwordInput/PasswordInput'
	import {
		mapState
	} from 'vuex'
	import {reqCreateOrder} from 'network/api'
	import storage from 'utils/storage'
	export default {
		name: 'OrderConfirm',
		components: {
			PasswordInput
		},
		data() {
			return {
				orderList: [], //订单列表
				flag: 'false',
				selectAddress: {}, //收货地址
				order_id:''//订单id
			}
		},
		created() {
			this.selectAddress = storage.session.get("selectAddress") || {}
			this.orderList = storage.session.get('orderList')
		},
		methods: {
			//点击付款
			async buySubmit() {
				//判断是否有收货地址
				if(!this.hasAddress)return this.$toast("请选择收货地址")
				//下单 需要 用户的订单id 和 商品列表
				// console.log(this.selectAddress)
				// console.log(this)
				const {id:user_address_id} = this.selectAddress
				const {orderList:orderProductList} = this
				//发送下单请求
				// const res = await reqCreateOrder({user_address_id,orderProductList})
				// console.log(res)
				//请求成功 拿到状态码 和 数据 data
				const {errcode,data} = await reqCreateOrder({user_address_id,orderProductList})
				//判断下单是否成功
				if(errcode !== 0) return this.$toast("下单失败")
				//将订单id 传给子组件 弹出 弹出层
				this.order_id = data.id
				this.$refs.PasswordInput.popShow=true
				// console.log(this.orderList)
			}
		},
		computed: {
			...mapState(["userInfo"]),
			//地址标题
			selAddrTitle() {
				return this.hasAddress ? this.selectAddress.name + ',' + this.selectAddress.tel : '请确认收货地址'
			},
			//详细地址
			selAddrDetail() {
				return this.hasAddress ? this.selectAddress.address : ''
			},
			//判断是否有地址
			hasAddress() {
				//通过判断selectAddress是否有id 或者name 来判断是否有地址
				return !!(this.selectAddress.id || this.selectAddress.name)
			},
			//商品总价格
			totalPrice() {
				if (!this.orderList) return 0
				return this.orderList.reduce((p, c) => {
					return p + c.count * c.price
				}, 0) * 100
			},
			//商品总件数
			totalCount() {
				if (!this.orderList) return 0
				return this.orderList.reduce((p, c) => {
					return p + c.count
				}, 0)
			},
			//是否禁用按钮 
			isFlag() {
				if (!this.orderList) return
				if (this.orderList.length > 0) return false
				return true
			}
		}
	}
</script>

<style lang="less" scoped>
	.address {
		border-top: .2rem solid #f4f4f4;
		border-bottom: .2rem solid #f4f4f4;
	}

	.van-cell__left-icon {
		font-size: 50px;
	}

	.van-cell__title {
		width: 70%;

		span {
			display: block;
			white-space: nowrap;
			overflow-x: hidden;
			text-overflow: ellipsis;
		}
	}

	.van-cell-group {
		height: calc(100vh - 160px);
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;

		.van-cell__label {
			color: #f50;
		}
	}
</style>

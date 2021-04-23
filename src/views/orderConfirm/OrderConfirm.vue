<template>
	<!-- 确认订单 -->
	<div class="orderConfirm">
		<van-nav-bar title="确认订单" left-text="返回" left-arrow @click-left="$router.back()" class="nav_border" />
		<van-cell :title="selAddrTitle" is-link :to="{path:'/addressList',query:{from:'prderConfirm'}}" :label="selAddrDetail" class="address" />
		
		<van-cell-group>
			<van-cell 
			v-for="item in orderList"
			:key="item.product_id" 
			:title="item.name" 
			:value="item.count+'件'"
			:label="item.price | formatPrice"
			:icon="item.cover" />
		</van-cell-group>
		<van-submit-bar button-text="付款" :disabled=isFlag :price="totalPrice" class="tab_border" @submit="buySubmit">
			共计：{{totalCount}}件
		</van-submit-bar>
		<Password-input></Password-input>
	</div>
		
</template>

<script>
	import PasswordInput from 'components/passwordInput/PasswordInput'
	import {
		mapState
	} from 'vuex'
	import storage from 'utils/storage'
	export default {
		name: 'OrderConfirm',
		components:{PasswordInput},
		data() {
			return {
				orderList:[] ,//订单列表
				flag:'false',
				selectAddress:{}//收货地址
			}
		},
		created() {
			this.selectAddress = storage.session.get("selectAddress") || {}
			this.orderList = storage.session.get('orderList')
			console.log(this.selectAddress)
		},
		methods: {
			//点击付款
			buySubmit(){
				console.log(1)
			}
		},
		computed: {
			...mapState(["userInfo"]),
			//地址标题
			selAddrTitle(){
				return this.hasAddress ?  this.selectAddress.name +',' +this.selectAddress.tel : '请确认收货地址' 
			},
			//详细地址
			selAddrDetail(){
				return this.hasAddress ?this.selectAddress.address:''
			},
			//判断是否有地址
			hasAddress(){
				//通过判断selectAddress是否有id 或者name 来判断是否有地址
				return !!(this.selectAddress.id || this.selectAddress.name)
			},
			//商品总价格
			totalPrice(){
				if(!this.orderList) return 0
				return this.orderList.reduce((p,c) =>{
					return p+c.count*c.price
				},0)*100
			},
			//商品总件数
			totalCount(){
				if(!this.orderList) return 0
				return this.orderList.reduce((p,c) =>{
					return p+c.count
				},0)
			},
			//是否禁用按钮 
			isFlag(){
				if(!this.orderList)return
				if(this.orderList.length >0)return false
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
		.van-cell__label{
			color:#f50;
		}
	}
</style>

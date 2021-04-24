<template>
	<div class="paySuccess">
		<van-icon name="passed" />
		<p>支付成功</p>
		<van-button type="primary" size="large" @click="successBtn">查看订单详情</van-button>
	</div>
</template>

<script>
	export default {
		name: 'PaySuccess',
		data() {
			return {
				id:''
			}
		},
		methods: {
			//跳转到订单详情页面
			successBtn(){
				// this.id = this.$route.query.id
				// console.log(this.$route.query)
				return this.$router.push({path:'/orderInfo',query:{id:this.$route.query.id}})
			}
		},
	}
</script>

<style lang="less" scoped>
	.van-icon {
		position: relative;
		left: 50%;
		margin-top: 50%;
		transform: translate(-50%);
		font-size: 25vw;
		color: springgreen;
	}
	p{
		margin-top:.2rem;
		font-size: .64rem;
		font-weight: bold;
		font-family: '楷体';
		color: springgreen;
		text-align: center;
	}
	.van-button {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>

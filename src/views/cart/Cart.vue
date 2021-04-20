<template>
	<div class="cart">
		<van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main></main>
		<van-submit-bar :price="sum" button-text="提交订单" disabled @submit="onSubmit" class="tab_border">
			共计：{{proNum}}件
		</van-submit-bar>
	</div>
</template>

<script>
	export default {
		name: 'Cart',
		data() {
			return {
				proNum:0,
				sum:0
			}
		},
		methods:{
			onSubmit(){},
			onClickEditAddress(){}
		}
	}
</script>

<style lang="less" scoped>
</style>

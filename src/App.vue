<template>
	<div id="app">
		<!-- 缓存 -->
		<keep-alive include="Home">
			<router-view />
		</keep-alive >
		<van-tabbar  v-model="active" route v-if="isActive" class="tab_border">
			<van-tabbar-item icon="star-o" to="/home">精选</van-tabbar-item>
			<van-tabbar-item icon="cart-o" to="/cart">购物车</van-tabbar-item>
			<van-tabbar-item icon="user-o" to="/me">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	export default {
		name: 'App',
		data() {
			return {
			  active: 0,
			}
		},
		computed:{
		  isActive(){
		    return !!this.$route.meta.showTabbar
		  }
		}
	}
</script>
<style lang="less">
	.van-icon-like{
		color: #f50 !important;
	}
	
</style>

<template>
	<div class="likeList">
		<van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="$router.back()" fixed class="nav_border"/>
		<main class="mainContent">
			<van-cell 
			v-for="item in likeList"
			:key = "item.id"
			:title="item.name" 
			is-link 
			:icon="item.cover"
			:label="item.price | formatPrice"
			:to="{path:'/detial',query:{id:item.id}}" />
		</main>
	</div>
</template>

<script>
	import {reqLikeList} from 'network/api'
	export default {
		name: "LikeList",
		data() {
			return {
				likeList:[] //收藏列表
			}
		},
		created(){
			this.getLikeList()
		},
		methods: {
			//请求收藏列表
			async getLikeList() {
				// const res = await reqLikeList()
				// console.log(res)
				const {errcode,data} = await reqLikeList()
				if(errcode !==0)return
				this.likeList = data
			}
		}
	}
</script>

<style lang="less" scoped>
	.mainContent{
		height: calc(100% - .92rem);
		.van-cell{
			border-bottom: 1px solid #f8f8f8;
		}
		.van-cell__left-icon{
			width: 1rem;
			height: 1rem;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.van-cell__title{
			width: 70%;
			overflow:hidden ;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.van-cell__right-icon{
			width: 10%;
			text-align: right;
		}
	}
</style>

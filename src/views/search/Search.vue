<template>
	<div class="search">
		<van-nav-bar
		  left-text="返回"
		  left-arrow
		  @click-left="$router.back()"
		  class="nav_border"
		  fixed
		>
		  <template #title>
		    <van-search v-model="searchKey" placeholder="请输入搜索关键词" @input="debounce(searchInput)" :clearable="false"/>
		  </template>
		</van-nav-bar>
		<main class="mainContent pContent" ref="main">
			<div class="pItem" v-for="item in pDataList" :key="item.id" @click="pItemContent(item.id)">
				<img :src="item.cover" @error.once="imgErr($event)" alt="">
				<!-- 指令解决图片加载 显示默认图片 -->
				<!-- <img :src="item.cover" v-default-img="imgUrl" alt=""> -->
				<div class="bottom">
					<h3>{{item.name}}</h3>
					<span>{{item.price | formatPrice}}</span>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
	import {reqSearchProducts} from 'network/api'
	export default{
		name:"Search",
		data() {
			return{
				searchKey:'',
				timeoutId:'',
				pDataList:[]
			}
		},
		methods:{
			//点击跳转详情页
			pItemContent(id){
				this.$router.push({
					path:"/detial",
					query:{id}
				})
			},
			//输入内容发请求
			async searchInput(){
			  const {data} = await reqSearchProducts(this.searchKey)
			  this.pDataList = data.data
			},
			//防抖函数
			debounce(fun){
				clearTimeout(this.timeoutId)
				this.timeoutId = setTimeout((_)=>{
					fun()
				},1000)
			}
		}
	}
</script>

<style lang="less" scoped>
	.van-nav-bar__content{
		.van-search{
			padding: 0 .24rem;
		}
	}
		
	.pContent {
		height: calc(100vh - .92rem);
		padding: .16rem .08rem;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		overflow-y: scroll;
	
		.pItem {
			width: 48%;
			padding: 0.3vw 0.3vw 1rem 0;
			box-sizing: border-box;
			box-shadow: 0 0 3px rgba(100, 100, 100, 80%);
			margin-bottom: .2rem;
			border-radius: .1rem;
			position: relative;
	
			img {
				width: 100%;
			}
	
			.bottom {
				padding: .06rem;
				box-sizing: border-box;
				position: absolute;
				bottom: .06rem;
				left: 0;
				right: 0;
	
				h3 {
					font-size: .28rem;
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
	
</style>

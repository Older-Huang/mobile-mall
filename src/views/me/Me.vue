<template>
	<div class="me">
		<header>
			<!-- 没有登录 就展示默认，登录就展示用户的信息 -->
			<template v-if = "isLogin">
				<img :src="isImg" alt="">
				<span >{{userInfo.nickName}}</span>
			</template>
			<template v-else>
				<img src="~assets/img/profile.png" alt="">
				<span @click="$router.push('/login')">登录 / 注册</span>
			</template>
		</header>
		<main>
			<van-grid>
				<van-grid-item icon="paid" text="待付款" is-link to='/orderList?status=0' />
				<van-grid-item icon="free-postage" text="待发货" is-link to='/orderList?status=1' />
				<van-grid-item icon="tosend" text="已发货" is-link to='/orderList?status=2' />
				<van-grid-item icon="logistics" text="已完成" is-link to='/orderList?status=3' />
			</van-grid>
			<van-cell-group>
				<van-cell title="我的订单" icon="records" is-link to='/orderList'/>
				<van-cell title="我的收藏" icon="like-o" is-link to='/likeList'/>
				<!-- from 表示从哪里来的 -->
				<van-cell title="收货地址" icon="location-o" is-link 
				:to="{path:'/addressList',query:{from:'me'}}"
				/>
				<van-cell title="用户设置" icon="setting-o" is-link to='/setting'/>
			</van-cell-group>
		</main>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { IMGURl } from 'network/api'
	export default {
		name: 'Me',
		data() {
			return {
			}
		},
		methods:{},
		computed:{
			...mapState(["userInfo"]),
			//用户头像
			isImg(){
				//取出图片的地址
				const {avatar} = this.userInfo
				//如果没有头像 则用本地默认的头像
				return avatar || require('../../assets/img/touxiang.png');
			},
			//用户是否登录
			isLogin(){
				//取出用户的id和用户的用户名
				const {name,id} = this.userInfo
				return !!(name || id)
			}
		}
	}
</script>

<style lang="less" scoped>
	.me {
		header {
			width: 100%;
			height: 1.6rem;
			display: flex;
			align-items: center;
			background: rgba(255, 170, 0, 0.8);

			img {
				width: 15vw;
				height: 15vw;
				margin: 0 .2rem 0 .4rem;
				border-radius: 50%;
				box-shadow: 0 0 0px 2px rgba(244, 234, 234, 0.5);
			}

			span {
				color: #fff;
				font-size: .32rem;
			}
		}
	}
</style>

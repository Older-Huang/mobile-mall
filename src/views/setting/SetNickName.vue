<template>
	<div class="">
		<van-nav-bar 
		title="修改昵称" 
		left-text="返回" 
		left-arrow 
		@click-left="backClick" 
		class="nav_border" 
		/>
		 <van-field v-model="nickName" label="昵称" placeholder="请输入用户名" ref="field"/>
		<van-button type="primary" size="large" @click="settingClick">确认修改</van-button>
	</div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {reqSeetingNickname} from 'network/api'
	export default {
		name: '',
		data() {
			return {
				nickname:''
			}
		},
		created() {
			this.nickname = this.userInfo.nickName
		},
		methods:{
			//点击 修改默认昵称
			...mapMutations(["changeNickName"]),
			//点击返回
			backClick(){
			  this.changeNickName(this.currNickName)
			  this.$router.back()
			},
			//修改昵称
			async settingClick(){
			 const { errcode } = await reqSeetingNickname(this.userInfo.nickName)
			 if(errcode !== 0) return this.$toast("修改失败")
			 this.$router.push("/me")
			}
		},
		computed:{
			...mapState(["userInfo"]),
			nickName:{
			  set(newVlaue){
			    this.changeNickName(newVlaue)
			  },
			  get(){
			    return this.userInfo.nickName
			  }
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

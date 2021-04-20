<template>
	<div class="login">
		<van-nav-bar title="登录/注册" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main class="mainContent">
			<!-- 输入表单 -->
			<van-form @submit="onSubmit">
				<van-field v-model="userInfo.name" name="username" label="用户名" placeholder="用户名" 
				:rules="rules.username" 
				/>
				<!-- :rules="[{ required: true, message: '请填写用户名' }]" -->
				<van-field v-model="userInfo.password" type="password" name="password" label="密码" placeholder="密码" 
				:rules="rules.password"
				/>
				<!-- :rules="[{ required: true, message: '请填写密码' }]" -->
				<div style="margin: 16px;">
					<van-button round block type="info" native-type="submit">登录/注册</van-button>
				</div>
			</van-form>
		</main>
	</div>
</template>

<script>
	import {Toast} from 'vant';
	// import {reqLogin} from 'network/api'
	import {mapActions} from 'vuex'
	export default {
		name: 'Login',
		data() {
			return {
				userInfo:{
					name:'',
					password:''
				},
				rules:{
					username:[{
						 required: true, message: '请填写用户名'
					},{
						pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
						massage:'用户名必须是数字和字母,最小6位'
					}
					],
					password:[{
						 required: true, message: '请输入密码'
					},{
						pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
						massage:'密码必须是数字和字母,最小6位'
					}
					]
					
				}
			}
			
		},
		methods: {
			//映射 方法
			...mapActions(['userLogin']),
			//点击登录
			onSubmit() {
				//执行vuex的方法
				this.userLogin(this.userInfo)
			//登录之后的信息，要保存到一个公共的存放数据的地方 vuex
			// const res =	await reqLogin(this.userInfo)
			// console.log(res)
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

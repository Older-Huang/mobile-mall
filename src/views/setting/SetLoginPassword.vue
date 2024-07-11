<template>
	<div class="">
		<van-nav-bar title="修改登录密码" left-text="返回" left-arrow @click-left="$router.back()" class="nav_border" />
		<van-form @submit="onSubmit">
			<van-field v-model="password" name="password" label="旧密码" placeholder="旧密码" :rules="rules.password" />
			<van-field v-model="newPassword" name="newPassword" label="新密码" placeholder="新密码" :rules="rules.password" />
			<div>
				<van-button type="primary" size="large" native-type="submit">确认修改</van-button>
			</div>
		</van-form>
	</div>
</template>

<script>
	import { reqUpdatePassword } from 'network/api'
	import {mapMutations} from 'vuex'
	export default {
		name: '',
		data() {
			return {
				password: '',
				newPassword: '',
				rules: {
					password: [{
							required: true,
							message: '请填写密码'
						},
						{
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
							message: '必须包含数字和字母,密码不能低于6位',
						},
					],
				},
			}
		},
		methods: {
			...mapMutations(["changeLoginUser"]),
			//确定修改登录密码
			async onSubmit() {
				//判断旧密码与新密码
				if(this.password === this.newPassword){
					this.password = this.newPassword = ''
					return this.$toast("新密码不能与旧密码相同")
				}
				
				//发送修改请求
				const { errcode, message } = await reqUpdatePassword(
				  this.password,
				  this.newPassword
				)
				if(errcode !== 0) return this.$toast(`修改密码失败${message ? '，' + message : ''}`);
				//清空输入框
				 this.password = this.newPassword = ''
				 //清楚本地存储的token
				 window.sessionStorage.clear()
				 //修改vuex中的数据
				 this.changeLoginUser({})
				 this.$router.replace('/home')
				 
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

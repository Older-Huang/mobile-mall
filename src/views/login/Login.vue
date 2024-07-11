<template>
	<div class="login">
		<van-nav-bar title="登录/注册" left-text="返回" left-arrow @click-left="$router.back()" class="nav-border" fixed />
		<main class="mainContent">
			<!-- 输入表单 -->
			<van-form @submit="onSubmit">
				<van-field
				  v-model="userInfo.name"
				  name="username"
				  label="用户名"
				  placeholder="用户名"
				  required
				  :error-message="userNameErrorMsg"
				/>
				<van-field
				  v-model="userInfo.password"
				  type="password"
				  name="password"
				  label="密码"
				  placeholder="密码"
				  required
				  :error-message="passwordErrorMsg"
				/>
				<div style="margin: 16px;">
					<van-button round block type="info" native-type="submit">登录/注册</van-button>
				</div>
			</van-form>
		</main>
	</div>
</template>

<script>
	import {Toast} from 'vant';
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
					username: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
					password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
				},
			}
		},
		methods: {
			//映射 方法
			...mapActions(['userLogin']),

			//点击登录
			onSubmit() {
				//执行vuex的方法
				if (this.userNameErrorMsg || this.passwordErrorMsg) {
					return Toast('请输出正确用户名与密码后再试');
				}
				this.userLogin(this.userInfo);
			}
		},
		computed: {
			userNameErrorMsg() {
				const userName = this.userInfo.name?.trim();
				if (!userName) {
					return '请填写用户名';
				}

				return this.rules.username.test(userName) ? '' : '用户名必须是数字和字母,最小6位';
			},

			passwordErrorMsg() {
				const password = this.userInfo.password?.trim();
				if (!password) {
					return '请填写密码';
				}

				return this.rules.password.test(password) ? '' : '密码必须是数字和字母,最小6位';
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

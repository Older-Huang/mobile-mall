<template>
	<div class="">
		<van-nav-bar title="修改支付密码" left-text="返回" left-arrow @click-left="$router.back()"
			class="nav_border" />
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
	import {
		reqUpdatePayPassword
	} from 'network/api'
	import {
		mapMutations
	} from 'vuex'
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
					}],
				},
			}
		},
		methods: {
			...mapMutations(["changePayPassword"]),
			//修改支付密码
			async onSubmit() {
				if (this.password === this.newPassword) {
					this.password = this.newPassword = ''
					return this.$toast("新旧密码不能相同")
				}
				const {
					errcode,
					errmsg
				} = await reqUpdatePayPassword(this.password, this.newPassword)
				if(errcode !== 0) return this.$toast("修改支付密码失败")
				this.$toast('密码修改成功')
				this.changePayPassword(this.newPassword)
				this.password = this.newPassword = ''
				this.$router.replace('/home')
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

<template>
	<div class="PasswordInput">
		<van-popup v-model="popShow" position="bottom" :style="{ height: '70%' }" :close-on-click-overlay="false">
			<van-nav-bar title="付款" left-text="返回" left-arrow @click-left="clear">
				<template #left>
					<van-icon name="cross" />
				</template>
			</van-nav-bar>

			<!-- 密码输入框 -->
			<van-password-input :value="pay_passwrod" />
			<!-- 数字键盘 -->
			<van-number-keyboard v-model="pay_passwrod" :show="true" @input="onInput" />
		</van-popup>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		reqOrderPay
	} from 'network/api'
	export default {
		name: "PasswordInput",
		props: ["orderId"],
		data() {
			return {
				pay_passwrod: '',
				popShow: false,
			}
		},
		methods: {
			//关闭密码框，订单生成 跳转到订单详情
			clear() {
				this.$router.push({
					path: '/orderInfo',
					query: {
						id: this.orderId
					}
				})
				this.popShow = false
			},
			//输入密码
			onInput() {
				//获取父组件传过来的订单id
				const order_id = this.orderId
				//这拿到的是更新后 数据没有改变的内容 而我们要的是更新后的改变了的数据的内容 
				//this.$nextTick() 获取更新后的输入框的内容
				this.$nextTick(async (_) => {
					//获取到支付密码后 便下单请求了
					//发送下单请求 需要两个参数:订单id 和支付密码
					//支付密码 默认为 123456
					if (this.pay_passwrod.length >= 6) {
						//取出状态码 和 状态信息
						const {errcode,errmsg} = await reqOrderPay(order_id, this.pay_passwrod)
						//支付不成功 清空输入框 和错误信息
						if(errcode !== 0) {
							this.pay_passwrod=''
							this.$toast(errmsg)
							return
						}
						//成功 便跳转到支付成功页面
						this.$toast.success("支付成功")
						this.pay_passwrod = ''
						this.$router.push({path:'paySuccess',query:{id:order_id}})
					}
				})
			}
		},
		computed: {
			...mapState(["userInfo"]),
			showKeyboard() {
				return false
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

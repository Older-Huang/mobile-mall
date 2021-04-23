<template>
  <div class="PasswordInput">
    <van-popup
      v-model="popShow"
      position="bottom"
      :style="{ height: '70%' }"
      :close-on-click-overlay="false"
    >
      <van-nav-bar title="付款" left-text="返回" left-arrow @click-left="clear">
        <template #left>
          <van-icon name="cross" />
        </template>
      </van-nav-bar>

      <!-- 密码输入框 -->
      <van-password-input :value="pay_passwrod" />
      <!-- 数字键盘 -->
      <van-number-keyboard
        v-model="pay_passwrod"
        :show="true"
        @input="onInput"
      />
    </van-popup>
  </div>
</template>

<script>
	export default{
		name:"PasswordInput",
		data(){
			return{
				pay_passwrod: '',
				popShow: false,
			}
		},
		computed:{
			showKeyboard(){
				return false
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

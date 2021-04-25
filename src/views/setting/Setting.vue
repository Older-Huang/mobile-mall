<template>
	<div class="setting">
		<van-nav-bar title="用户设置" left-text="返回" left-arrow @click-left="$router.back()" class="nav_border" />
		<van-cell-group title="基本信息">
		  <van-cell title="修改昵称" is-link icon="setting-o" to='/SetNickName'/>
		  <van-cell title="修改头像" is-link icon="setting-o" to='/setAvatar'/>
		</van-cell-group>
		<van-cell-group title="安全">
		  <van-cell title="修改账号密码" is-link icon="setting-o" to='/setLoginPassword'/>
		  <van-cell title="修改支付密码" is-link icon="setting-o" to='/setPayPassword'/>
		</van-cell-group>
	</div>
</template>

<script>
	export default{
		name:'setting',
		data(){
			return{}
		}
	}
</script>

<style>
</style>

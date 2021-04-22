<template>
	<div class="addressEdit">
		<van-nav-bar
		:title="fromAdd" 
		left-text="返回" 
		left-arrow 
		@click-left="$router.back()" 
		class="nav_border" />
		<!-- 地址内容 -->
	<van-address-edit
		:area-list="areaList"
		:show-delete="!fromAdd"
		show-set-default
		:address-info="addressInfo"
	/>
	</div>
</template>

<script>
	import {areaList} from '@vant/area-data'
	import {mapState} from 'vuex'
	export default {
		name: 'AddressEdit',
		data() {
			return {
				areaList,
				addressInfo:{}
			}
		},
		methods: {},
		computed:{
			...mapState(["userInfo"])
			//判断是新增地址 还算编辑地址
			fromAdd(){
				return this.$route.query.id == 0 ? '新增地址' : '保存地址'
			}
			//默认初始值
			addressInfo(){
				//取出地址列表
				const { AddressList} = this.userInfo
				addressList.forEach()
				this.$route.query.id
				return {}
			}
		}
	}
</script>

<style lang="less" scoped>

</style>

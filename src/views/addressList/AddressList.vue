<template>
	<!-- 地址列表 -->
	<div class="addressList">
		<van-nav-bar 
		:title="addressTitle" 
		left-text="返回" 
		left-arrow 
		@click-left="$router.back()" 
		class="nav_border" />
		<van-address-list
			:list="addressList" :switchable="!addressTitle"
			@edit="edieAddress" @add="edieAddress({id:0})"
		/>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import storage from 'utils/storage'
	export default {
		data() {
			return {

			}
		},
		methods:{
			//点击编辑地址
			edieAddress(item){
				//传点击的地址id
				this.$router.push({path:"/addressEdit",query:{id:item.id}})
			}
		},
		computed:{
			//从公共数据中获取地址信息
			...mapState(["userInfo"]),
			//地址列表属性
			addressList(){
				//结构出地址列表出数组
				const { addressList } = this.userInfo
				let addrList =[]
				addressList.forEach((item) =>{
					//取出地址需要的信息
					const {id,mobile:tel,name,province,city,country,detail} = item
					//往地址数组中添加 
					addrList.push({id,tel,name,address:`${province} ${city} ${country} ${detail}`})
				})
				return addrList
			},
			
			//地址标题 判断从哪里来的
			addressTitle(){
			return this.$route.query.from ==='me' ? '我的收货地址' :'请选择收货地址'
			}
		}
	};
</script>

<style lang="less" scoped>

</style>

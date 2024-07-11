<template>
	<div class="addressEdit">
		<van-nav-bar :title="fromAdd ? '新增地址' : '保存地址'" left-text="返回" left-arrow @click-left="$router.back()" class="nav_border" />
		<!-- 地址内容 -->
		<van-address-edit
		  :area-list="areaList"
		  :show-delete="!fromAdd"
		  show-set-default
		  :address-info="addressInfo"
		  @save="saveAddressClick"
		  @delete="deleteAddress"
		/>
	</div>
</template>

<script>
	import {
		areaList
	} from '@vant/area-data'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		reqCreateAddress,
		reqUpdateAddress,
		reqDeteleAddress
	} from 'network/api'
	export default {
		name: 'AddressEdit',
		data() {
			return {
				areaList
			}
		},
		methods: {
			...mapMutations(["changeAddressList"]),
			//删除地址
			async deleteAddress(content){
				//删除的地址id
				const {errcode} = await reqDeteleAddress(content.id)
				if(errcode !== 0) return this.$toast("删除失败")
				//删除完之后返回
				this.$router.back()
				//删除vuex中的那一项
				this.changeAddressList({data:content.id,type:'del'})
			},
			
			//地址编辑
			async saveAddressClick(content) {
				//content 是vant框架 地址列表事件 自带的参数 指地址
				//查看地址
				//console.log(contont)
				// addressDetail: "312313"
				// areaCode: "110101"
				// city: "北京市"
				// country: ""
				// county: "东城区"
				// isDefault: false
				// name: "13123"
				// postalCode: ""
				// province: "北京市"
				// tel: "13221445321"
				//取出地址需要的信息
				const {
					name, //姓名
					province, //省份
					city, //城市
					county: country, //区县
					addressDetail: detail, //详细地址
					tel: mobile, //电话
					areaCode: code, //地区编码
					isDefault,
				} = content;
				//default:0
				//配置地址参数，新建地址所要的参数
				const saveAddrParams = {
					name,
					province,
					city,
					country,
					detail,
					mobile,
					code,
					default: isDefault,
				}

				//新建地址
				if (this.fromAdd) {
					//查看新建地址
					//结构出状态码，和地址信息
					const {
						errcode,
						data
					} = await reqCreateAddress(saveAddrParams);
					if (errcode !== 0) return this.$toast('修改地址失败')
					//将新增的数据保存到vuex,传两个参数，一个 类型，一个 对象 data
					this.changeAddressList({
						data,
						type: 'add'
					});
				} else {
					//编辑地址
					//两个参数， 一个点击的地址id 一个地址
					const {
						errcode,
						data
					} = await reqUpdateAddress(this.$route.query.id, saveAddrParams)
					if (errcode !== 0) return this.$toast('修改地址失败')
					//将编辑完成的
					saveAddrParams.id = this.$route.query.id
					this.changeAddressList({data:saveAddrParams,type:'edit'})
				}
				this.$router.back()
			}
		},
		computed: {
			...mapState(["userInfo"]),
			//判断是新增地址 还算编辑地址
			fromAdd() {
				return this.$route.query.id == 0 
			},
			//默认初始值
			addressInfo() {
				//取出地址列表
				const {
					addressList
				} = this.userInfo
				//异步请求 如果地址列表为空则返回
				if (!addressList) return
				//查找对应的地址id
				let addrItem = addressList.find((item) => {
					return item.id == this.$route.query.id
				})
				//如果没有 则返回
				if (!addrItem) return
				//结构需要的属性
				let {
					id,
					name,
					mobile: tel,
					province,
					city,
					country: county,
					detail: addressDetail,
					code: areaCode,
					default: isDefault,
				} = addrItem;
				return {
					id,
					name,
					tel,
					province,
					city,
					county,
					addressDetail,
					areaCode,
					isDefault,
				}
			}
		}
	}
</script>

<style lang="less" scoped>

</style>

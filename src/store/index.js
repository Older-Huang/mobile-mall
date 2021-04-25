import Vue from 'vue'
import Vuex from 'vuex'
import {
	reqLocation
} from 'network/api'
import {
	reqLogin,
	reqUserInfo
} from 'network/api'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		//用户信息的信息
		userInfo: {},
		//城市信息
		loactionCity: '定位中...'
	},
	mutations: {
		//修改城市地址
		changeLoactionCity(state, city) {
			state.loactionCity = city
		},
		//改变头像
		changeAvatar(state, avatar) {
			state.userInfo.avatar = avatar
		},
		//改变支付密码
		changePayPassword(state, pay_password) {
			state.userInfo.payPassword = pay_password
		},
		//改变昵称
		changeNickName(state, nickname) {
			state.userInfo.nickname = nickname
		},
		//修改userInfo里面的地址
		changeAddressList(state, msg) {
			let {
				type,
				data
			} = msg
			if (type === "add") {
				//新增
				state.userInfo.addressList.unshift(data)
			} else if (type === "edit") {
				//编辑地址
				let index = state.userInfo.addressList.findIndex(item => item.id == data.id)
				state.userInfo.addressList.splice(index, 1, data)
			} else if (type === "del") {
				//删除地址
				let index = state.userInfo.addressList.findIndex(item => item.id == data)
				state.userInfo.addressList.splice(index, 1)
			}
			// let index = state.userInfo.addressList.findIndex(item => item.id == data.id)
			// if (index >= 0){
			//   //编辑地址
			//   state.userInfo.addressList.splice(index,1,data)
			// }else{
			//   //添加地址
			//   state.userInfo.addressList.unshift(data)
			// }
		},
		// 改变likelist
		changeLikeList(state, data) {
			let {
				likeList
			} = state.userInfo
			//判断收藏的是否为对象，是则添加到收藏队列里
			if (typeof data === "object") return likeList.push(data)
			let index = likeList.findIndex(item => item.product_id == data)
			likeList.splice(index, 1)
			//
			// state.userInfo.likeList = likeList.filter(item => item.product_id != data)

		},
		//当数据发生改变 赋值给userinfo
		changeLoginUser(state, userInfo) {
			state.userInfo = userInfo
		}
	},
	actions: {
		// 登录
		async userLogin(context, userInfo) {
			//发送登录请求
			const {
				data
			} = await reqLogin(userInfo)
			//取出token 并保存到本地存储
			const {
				token
			} = data
			sessionStorage.setItem("token", token)
			context.commit("changeLoginUser", data)
			router.back()
		},
		//获取用户信息
		async getUserInfo(context) {
			if (sessionStorage.getItem("token")) {
				const {
					data
				} = await reqUserInfo()
				context.commit("changeLoginUser", data)
			}
		},
		//获取地理定位
		getLoaction(context) {
			window.navigator.geolocation.getCurrentPosition(async postition => {
				const {
					latitude,
					longitude
				} = postition.coords
				const res = await reqLocation(latitude, longitude)
				const {
					city
				} = res.result.addressComponent
				context.commit("changeLoactionCity", city)
			})
		}
	},
	modules: {}
})

// import Vue from 'vue'
// import Vuex from 'vuex'
// import {reqLogin,reqUserInfo} from 'network/api'
// import router from '../router'
// Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//     userInfo:{}
//   },
//   mutations: {
//     // 改变likelist
//     changeLikeList(state,data){
//       let {likeList} = state.userInfo
//       if(typeof data === "object") return likeList.push(data)
//       // let index = likeList.findIndex(item => item.product_id == data)
//       // likeList.splice(index,1)
//       state.userInfo.likeList = likeList.filter(item => item.product_id != data)

//     },
//     //赋值userInfo
//     changeUserInfo(state,userInfo){
//       state.userInfo = userInfo
//     }
//   },
//   actions: {
//     // 登录
//     async userLogin(context,userInfo){
//       const {data} = await reqLogin(userInfo)
//       const {token} = data
//       sessionStorage.setItem("token",token)
//       context.commit("changeUserInfo",data)
//       router.back()
//     },
//     //获取用户信息
//     async getUserInfo(context){
//       if(sessionStorage.getItem("token")){
//         const {data} = await reqUserInfo()
//         context.commit("changeUserInfo",data)
//       }
//     }
//   },
//   modules: {
//   }
// })

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
import { Toast } from 'vant'

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
			state.userInfo.nickName = nickname;
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
		},
		// 改变likelist
		changeLikeList(state, data) {
			let {
				likeList
			} = state.userInfo
			//判断收藏的是否为对象，是则添加到收藏队列里
			if (typeof data === "object") return likeList.push(data)
			let index = likeList.findIndex(item => item.product_id == data)
			likeList.splice(index, 1);
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
				code,
				data,
				message
			} = await reqLogin(userInfo);
			if (code !== 200) {
				return Toast(`用户信息获取失败，请重新登录${message ? '，' + message : ''}`);
			}
			//取出token 并保存到本地存储
			const {
				token
			} = data;
			message && Toast(message);
			sessionStorage.setItem("token", token)
			context.commit("changeLoginUser", data)
			router.back()
		},
		//获取用户信息
		async getUserInfo(context) {
			if (sessionStorage.getItem("token")) {
				const { data } = await reqUserInfo();
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

import Vue from 'vue'
import Vuex from 'vuex'
import {
	reqLogin,
	reqUserInfo
} from 'network/api'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		//登录的信息
		userInfo: {}
	},
	mutations: {
		// 改变likelist
		changeLikeList(state, data) {
			let {
				likeList
			} = state.userInfo
			//判断收藏的是否为对象，是则添加到收藏队列里
			if (typeof data === "object") return likeList.push(data)
			let index = likeList.findIndex(item => item.product_id == data)
			likeList.splice(index,1)
			//
			// state.userInfo.likeList = likeList.filter(item => item.product_id != data)

		},
		//当数据发生改变 赋值给userinfo
		changeLoginUser(state, userInfo) {
			state.userInfo = userInfo
		}
	},
	actions: {
		//异步执行
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
		//
		async getUserInfo(context) {
			if (sessionStorage.getItem("token")) {
				const {
					data
				} = await reqUserInfo()
				context.commit("changeLoginUser", data)
			}
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

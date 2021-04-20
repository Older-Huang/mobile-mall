import axios from 'axios'
import {
	Toast
} from 'vant'
import router from '../router'
export const request = config => {
	const inst = axios.create({
		baseURL: '/api/v4',
		timeout: 10000
	})
	// 请求拦截
	inst.interceptors.request.use(config => {
		Toast.loading({
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
			duration: 0
		});
		//每次请求都是带token的请求，就不用在重新登录
		config.headers.Authorization = window.sessionStorage.getItem("token")
		return config
	})
	//响应拦截
	inst.interceptors.response.use(data => {
		//跳转到登录界面
		if (data.data.errcode === 90101) {
			router.push("/login")
		}
		Toast.clear()
		return data.data

	})
	return inst(config).catch(err => {
		Toast('请检查网络');
	})
}

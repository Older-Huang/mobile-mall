import axios from 'axios'
import {
	Toast
} from 'vant'
import router from '../router';
import cookie from 'cookie';

export const request = config => {
	const inst = axios.create({
		baseURL: '/api',
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

		const { headers } = config;
		const cookies = cookie.parse(document.cookie);
		//每次请求都是带token的请求，就不用在重新登录
		headers.Authorization = window.sessionStorage.getItem("token");
		headers['x-csrf-token'] = cookies.csrfToken;
		return config
	})
	//响应拦截
	inst.interceptors.response.use(data => {
		//跳转到登录界面
		if (data.data.errcode === 90101 || data.data.errcode === 9001) {
			router.push("/login")
		}
		Toast.clear()
		return data.data

	})
	return inst(config).catch(err => {
		Toast('请检查网络');
	})
}

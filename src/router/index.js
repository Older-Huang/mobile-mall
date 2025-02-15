import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Me = () => import('views/me/Me')
const Detial = () => import('views/detial/Detial')
const Login = () => import('views/login/Login')
const OrderList = () => import('views/orderList/OrderList')
const OrderConfirm = () => import('views/orderConfirm/OrderConfirm')
const AddressList = () => import('views/addressList/AddressList')
const AddressEdit = () => import('views/addressEdit/AddressEdit')
const OrderInfo = () => import('views/orderInfo/OrderInfo')
const PaySuccess = () => import('views/paySuccess/PaySuccess')
const LikeList = () => import('views/likeList/LikeList')
const Search = () => import('views/search/Search')
const CitySelect = () => import('views/citySelect/CitySelect')

const Setting = () => import('views/setting/Setting')
const SetAvatar = () => import('views/setting/SetAvatar')
const SetNickName = () => import('views/setting/SetNickName')
const SetLoginPassword = () => import('views/setting/SetLoginPassword')
const SetPayPassword = () => import('views/setting/SetPayPassword')

const routes = [{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/CitySelect',
		name: 'CitySelect',
		component: CitySelect,
	},
	{
		path: '/search',
		name: 'Search',
		component: Search,
	},
	{
		path: '/setAvatar',
		name: 'SetAvatar',
		component: SetAvatar,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/setNickName',
		name: 'SetNickName',
		component: SetNickName,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/setLoginPassword',
		name: 'SetLoginPassword',
		component: SetLoginPassword,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/setPayPassword',
		name: 'SetPayPassword',
		component: SetPayPassword,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/likeList',
		name: 'LikeList',
		component: LikeList,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/paySuccess',
		name: 'PaySuccess',
		component: PaySuccess,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/orderInfo',
		name: 'OrderInfo',
		component: OrderInfo,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/setting',
		name: 'Setting',
		component: Setting,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/orderList',
		name: 'OrderList',
		component: OrderList,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/orderConfirm',
		name: 'OrderConfirm',
		component: OrderConfirm,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/addressEdit',
		name: 'AddressEdit',
		component: AddressEdit,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/addressList',
		name: 'AddressList',
		component: AddressList,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			showTabbar: true
		}
	},
	{
		path: '/cart',
		name: 'Cart',
		component: Cart,
		meta: {
			isLogin: true
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/me',
		name: 'Me',
		component: Me,
		meta: {
			showTabbar: true
		}
	},
	{
		path: '/detial',
		name: 'Detial',
		component: Detial
	}


]

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
	if (to.meta.isLogin) {
		//需要判断是否已经登录
		if (sessionStorage.getItem("token")) {
			//已经登陆
			next()
		} else {
			next("/login")
		}
	} else {
		next()
	}

})


export default router

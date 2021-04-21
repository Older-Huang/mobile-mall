import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Me = () => import('views/me/Me')
const Detial = () => import('views/detial/Detial')
const Login = () => import('views/login/Login')

const routes = [{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta:{
			showTabbar:true
		}
	},
	{
		path: '/cart',
		name: 'Cart',
		component: Cart,
		meta:{
		  isLogin:true
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
		meta:{
			showTabbar:true
		}
	},
	{
		path: '/detial',
		name: 'Detial',
		component: Detial
	}


]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  if(to.meta.isLogin){
    //需要判断是否已经登录
    if(sessionStorage.getItem("token")){
      //已经登陆
      next()
    }else{
      next("/login")
    }
  }else{
    next()
  }
 
})


export default router

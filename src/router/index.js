import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Me = () => import('views/me/Me')
const Detial = () => import('views/detial/Detial')

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
		component: Cart
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

export default router

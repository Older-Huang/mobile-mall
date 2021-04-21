//请求数据的api接口
import {request} from './request'

//图片的公共路径
export const IMGURl = "http://192.168.0.129:8360"

//获取首页分页数据 /product/pagination
export const reqHomeData = (page,size=10) => request({url:'/product/pagination',params:{page,size}})

//获取商品详情数据 /product
export const reqDetailData = (id) => request({url:'/product',params:{id}}) 

//收藏商品  /product_like/create
export const reqLikePro = (product_id) => request({url:'/product_like/create',method:'post',data:{product_id}})

//取消收藏 /product_like/delete
export const reqDelLike = (product_id) => request({url:'/product_like/delete',params:{product_id}})

//登录 /user/signin
export const reqLogin = (data) => request({url:'/user/signin',method:'post',data})

//获取用户信息 /user/info
export const reqUserInfo = () => request({ url:'/user/info'})

//加入购物车/cart/update
export const reqUpdateCart = (data) => request({ url: '/cart/update', method: 'post', data })

//获取购物车数据 /cart/all
export const reqCartAll = () => request({ url: '/cart/all' })

//删除购物车数据 /cart/delete
export const reqDelCart = (product_id) => request({ url: '/cart/delete', params: { product_id } })
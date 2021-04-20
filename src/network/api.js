//请求数据的api接口
import {request} from './request'
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
//请求数据的api接口
import {request} from './request'
//获取首页分页数据 /product/pagination
export const reqHomeData = (page,size=10) => request({url:'/product/pagination',params:{page,size}})

//获取商品详情数据 /product
export const reqDetailData = (id) => request({url:'/product',params:{id}}) 
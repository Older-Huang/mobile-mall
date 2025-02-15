//请求数据的api接口
import {request} from './request'
import Vue from "vue"
import { VueJsonp } from 'vue-jsonp';
Vue.use(VueJsonp)

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
export const reqUserInfo = () => request({ url:'/user/info'});

//加入购物车/cart/update
export const reqUpdateCart = (data) => request({ url: '/cart/update', method: 'post', data });

//获取购物车数据 /cart/all
export const reqCartAll = () => request({ url: '/cart/all' })

//删除购物车数据 /cart/delete
export const reqDelCart = (product_id) => request({ url: '/cart/delete', params: { product_id } })

//新增用户收货地址 /user_address/create
export const reqCreateAddress = (data) => request({ url: '/user_address/create', method: 'post', data })

//修改用户收获地址 /user_address/update
export const reqUpdateAddress = (id, data) => request({ url: '/user_address/update?id=' + id, method: 'post', data })

//删除用户地址   /user_address/delete
export const reqDeteleAddress = (id) => request({ url: '/user_address/delete' , params:{id} })

//下单  /order/create
export const reqCreateOrder = (data) => request({ url: '/order/create', method: 'post', data })

//付款 /order/pay
export const reqOrderPay = (order_id, pay_password) => request({ url: '/order/pay?order_id=' + order_id, method: 'post', data: { pay_password } })


//获取单个订单详情 /order
export const reqOrderInfo = (id) => request({ url: '/order',params:{id}})

//获取订单列表 /order/pagination
export const reqOrderList = (page, status) => request({ url: '/order/pagination',params:{page, status}})

//获取收藏列表 /product_like/all
export const reqLikeList = () => request({url:'/product_like/all'}) 

//修改昵称 /user/setting
export const reqSeetingNickname = (nickname) =>  request({url:'/user/setting',method:'post',data:{nickname}}) 

//修改登录密码 /user/updatePassword 
export const reqUpdatePassword = (password, newPassword) => request({ url: '/user/updatePassword ', method: 'post', data: { password, newPassword } })

//修改支付密码 /user/updatePayPassword
export const reqUpdatePayPassword = (password, newPassword) => request({ url: '/user/updatePayPassword', method: 'post', data: { password, newPassword } })

//上传头像 /user/avatar
export const reqUploadAvatar = (avatar) => request({ url: '/user/avatar', method: 'post', data: avatar })

//搜索商品 /product/pagination
export const reqSearchProducts = (key) => request({ url: '/product/pagination', params: { page:1, size:10, key } })

//地理定位
export const reqLocation = (latitude,longitude) => Vue.prototype.$jsonp('http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location='+latitude+','+longitude+'&output=json&pois=0')

//获取带字母的城市列表 /data/city
export const reqCityAll = () => request({url:'/data/city'});

import Vue from 'vue'
//注册全局过滤器 过滤价格
Vue.filter("formatPrice",(price)=> {
  price = +price
  if(!price) return
  return `￥${price.toFixed(2)}`
})

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入公共样式
import 'assets/css/reset.css'
import 'assets/css/border.css'
Vue.config.productionTip = false

//引入价格过滤器
import formatPrice from 'utils/filter'

//引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


//每次刷新获取用户信息
// if(sessionStorage.getItem(token)){
// 	reqUserInfo().then(data=>{
// 		console.log(data)
// 	})
// }
//
//调用store中的请求 重新获取用户信息
store.dispatch("getUserInfo")

//引入图片加载失败指令
import defaultImg from './directive/defaultImg';
Vue.use(defaultImg);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

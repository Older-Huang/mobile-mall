import axios from 'axios'
import { Toast } from 'vant';
export const request = config => {
  const inst = axios.create({
    baseURL: '/api/v4',
    timeout: 10000
  })
  // 请求拦截
  inst.interceptors.request.use(config => {
    return config
  })
  //响应拦截
  inst.interceptors.response.use(data => {
    if(data.data.errcode !== 0){
      Toast("加载失败")
    }
    return data.data
  })
  return inst(config).catch(err => {
    Toast('请检查网络');
  })
}
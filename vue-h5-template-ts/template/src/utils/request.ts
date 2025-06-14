import axios from 'axios'
import { /*showToast,*/ showFailToast } from 'vant'
import { setLocal } from '@/common/js/utils'
import router from '../router'

console.log('import.meta.env', import.meta.env)

axios.defaults.baseURL = import.meta.env.MODE == 'development' ? '/api/v1' : '/api/v1'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    showFailToast('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.resultCode != 200) {
    if (res.data.message) showFailToast(res.data.message)
    if (res.data.resultCode == 416) {
      router.push({ path: '/login' })
    }
    if (res.data.data && window.location.hash == '#/login') {
      setLocal('token', res.data.data)
      axios.defaults.headers['token'] = res.data.data
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios

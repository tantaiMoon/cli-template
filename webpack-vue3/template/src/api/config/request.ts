import axios from 'axios'
import { getToken, refreshToken } from '@/utils/auth.ts'
// import { useGlobalStore } from '@/stores/global.ts'

const config = {
  baseURL: process.env.APP_API_URI,
  timeout: 30000
}

const service = axios.create(config)

function showErrorMessage(message: string = '') {
  ElMessage({
    duration: 3000,
    message: message,
    type: 'error'
  })
}

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    showErrorMessage(err.message)
    return Promise.reject(err)
  }
)

service.interceptors.response.use(
  async (response) => {
    if (response.config.responseType === 'blob') {
      return response.data
    }
    const { code, message } = response.data
    if (code !== 0) {
      showErrorMessage(message)
      return Promise.reject({ code, message })
    }
    return response.data
  },
  async (err) => {
    const response = err.response
    if (response.status === 401) {
      // const store = useGlobalStore()
      // await store.logout()
      await refreshToken()
      window.location.reload()
      return false
    }
    showErrorMessage(response.data?.message || response?.statusText)
    return Promise.reject(err)
  }
)

export default service

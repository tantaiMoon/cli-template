import axios, { InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { getToken } from '@/utils/auth.ts'

type Fn = (data: any) => unknown

interface IAnyObj {
  [index: string]: unknown
}

function handleNetworkError(error: any) {
  let errmsg = '无法连接到服务器'
  if (error.status) {
    switch (error.status) {
      case 400:
        errmsg = '请求错误'
        break
      case 401:
        errmsg = error.message ?? '未授权，请重新登录'
        break
      case 403:
        errmsg = error.message ?? '拒绝访问'
        break
      case 404:
        errmsg = error.message ?? '请求错误，未找到资源'
        break
      case 405:
        errmsg = error.message ?? '请求方法未被允许'
        break
      case 408:
        errmsg = error.message ?? '请求超时'
        break
      case 500:
        errmsg = error.message ?? '服务器出现错误'
        break
      case 501:
        errmsg = error.message ?? '网络为实现'
        break
      case 502:
        errmsg = error.message ?? '网关错误（Bad Gateway）'
        break
      case 503:
        errmsg = error.message ?? '服务不可用'
        break
      case 504:
        errmsg = error.message ?? '网络超时'
        break
      case 505:
        errmsg = error.message ?? 'http版本不支持请求'
        break
      default:
        errmsg = error.message ?? '位置错误'
        break
    }
  }
  message.error({
    content: errmsg,
    duration: 3000
  })
}

const handleRequestConfig = (config: InternalAxiosRequestConfig) => {
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  config.headers['Authorization'] = `Bearer ` + getToken()
  return config
}

function handleAuthError(code: number) {
  const authErrorMap: { [key: number]: string } = {
    40001: '登录失效，请重新登录',
    40002: '令牌已过期，请重新登录',
    40003: '账号未绑定角色，请联系管理员',
    40004: '未找到该用户，请先注册',
    40005: 'code 无法获取第三方普通用户',
    40006: '账号已失效'
  }
  if (Object.prototype.hasOwnProperty.call(authErrorMap, code)) {
    message.error(authErrorMap[code])
    return false
  }
  return true
}

function handleGeneralError(code: number, errmsg: string) {
  if (code !== 0) {
    message.error({
      content: errmsg,
      duration: 3000
    })
    return false
  }
  return true
}

axios.defaults.timeout = 60 * 1000
axios.defaults.baseURL = import.meta.env.PROD ? '/' : import.meta.env.VITE_APP_API_URL
axios.interceptors.request.use((config) => {
  config = handleRequestConfig(config)
  return config
})

axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) return Promise.reject(response.data)
    if (response.config.headers?.responseType === 'blob') return response
    handleAuthError(response.data.code)
    handleGeneralError(response.data.code, response.data.message)
    return response.data
  },
  (error) => {
    handleNetworkError(error)
    if (error.status === 401) {
      window.location.href = '/login'
      return
    }
    return Promise.reject(error)
  }
)

export const Get = <T>(
  url: string,
  configs: IAnyObj = {},
  clearFn?: Fn
): Promise<[any, T | undefined]> => {
  return new Promise((resolve) => {
    axios
      .get(url, configs)
      .then((response) => {
        let res: T = response.data
        if (clearFn) {
          res = clearFn(res) as T
        }
        resolve([null, res])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const Post = <T>(
  url: string,
  data: IAnyObj,
  config: IAnyObj = {}
): Promise<[any, T | undefined]> => {
  return new Promise((resolve) => {
    axios
      .post(url, data, config)
      .then((response) => {
        resolve([null, response.data as T])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const Put = <T>(
  url: string,
  data: IAnyObj,
  configs: IAnyObj = {}
): Promise<[any, T | undefined]> => {
  return new Promise((resolve) => {
    axios
      .put(url, data, configs)
      .then((response) => {
        resolve([null, response.data as T])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const Patch = <T>(
  url: string,
  data: IAnyObj,
  configs: IAnyObj = {}
): Promise<[any, T | undefined]> => {
  return new Promise((resolve) => {
    axios
      .patch(url, data, configs)
      .then((response) => {
        resolve([null, response.data as T])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const Delete = <T>(url: string, configs: IAnyObj = {}): Promise<[any, T | undefined]> => {
  return new Promise((resolve) => {
    axios
      .delete(url, configs)
      .then((response) => {
        resolve([null, response.data as T])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

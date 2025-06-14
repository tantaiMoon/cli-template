import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import FileSaver from 'file-saver'
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken
} from '@/utils/auth.ts'
import { history } from '@/router'

const NO_ENCRYPT_URL: string[] = []

const request = axios.create({
  timeout: 100000,
  // baseURL: '/api',
  headers: {
    post: { 'Content-Type': 'application/json' }
  }
})

export type ResultData<T = any> = {
  message?: string
  msg?: string
  code: number
  data: T
}

const handleError = (response: AxiosResponse) => {
  const { code } = response.data
  switch (code) {
    case 403:
  }
}

function handleBlob(data: AxiosResponse) {
  // @ts-ignore
  if (data.config.download) {
    try {
      const fileName = decodeURIComponent(data.headers['content-disposition']).split("utf-8''")[1]

      FileSaver.saveAs(data.data, fileName)
      return { fileName }
    } catch (e) {
      // message.error('下载失败')
      return Promise.reject({
        code: 500,
        msg: '下载失败'
      })
    }
  }
  return data
}

function encryptRequestData(config: InternalAxiosRequestConfig) {
  const { method, url } = config
  // 请求数据加密逻辑
  if (method!.toLowerCase() === 'get') {
    //
  }
  config.url = url
}

function decryptRequestData(response: AxiosResponse<ResultData<any>>) {
  const { data } = response.data
  // 数据解密逻辑
  response.data.data = data
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['auth'] = `${token}`
    }
    const isSafe = window._SAFE_ ?? false
    if (isSafe && !NO_ENCRYPT_URL.includes(config.url!)) {
      encryptRequestData(config)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ResultData>) => {
    const isSafe = window._SAFE_ ?? false
    if (isSafe && !NO_ENCRYPT_URL.includes(response.config.url!)) {
      decryptRequestData(response)
    }
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    if (response.data.code !== 0) {
      if (response.data) {
        return response
      }
      handleError(response)
      return Promise.reject(response)
    }
    if (response.data instanceof Blob) {
      handleBlob(response)
    }
    return response
  },
  (error) => {
    // 响应的状态码是 401 ，token 过期或者不存在
    if (error.response && error.response.status === 401) {
      removeToken()
      removeRefreshToken()
      // retry： true 表示为再次重试。 判断是否为重试，如果还是返回 401就跳转到 login
      if (!error.config.retry) {
        error.config.retry = true
        return refreshToken(error.config)
      } else {
        history.push('/login')
        return window.location.reload()
      }
    }
    handleError(error)
    return Promise.reject(error)
  }
)

const refreshToken = async (config: InternalAxiosRequestConfig) => {
  const refreshToken = getRefreshToken()
  // 没有刷新token
  if (!refreshToken) {
    // 其他错误处理
    history.push('/login')
    return window.location.reload()
  }

  // 使用原始的 axios，避免出现死循环 ，如果使用封装的 request ，会再次进入拦截器，出现死循环
  // 如果刷新 token 存在
  try {
    // TODO
    const response = await axios.post(
      '通过refreshToken 获取token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    )
    const { token, refreshToken: newRefreshToken } = response.data.data
    if (token) {
      setToken(token)
      setRefreshToken(newRefreshToken)
      // 刷新得到最新的 token 后，可以重新发送原来失败的请求
      // 把原来的请求认证 token 改变味刷新得到的
      config.headers['Authorization'] = `Bearer ${token}`
      return request(config)
    } else {
      return Promise.reject(response.data)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export default request

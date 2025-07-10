interface IRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
  params: Record<string, any>
  data: Record<string, any>
}

export const httpRequest = async (url: string, opts = {} as IRequestOptions) => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const { method = 'GET', params, data, ...others } = opts
  return await useFetch(url, {
    baseURL: (config.public.baseUrl as string) ?? '/',
    timeout: 60000,
    method,
    params,
    body: data,
    onRequest({ options }) {
      //   全局请求拦截器
      const { token } = useAppStore()
      options.headers = {
        Authorization: `Bearer ${token}`,
        ...options.headers
      } as any
    },
    onResponse({ response }) {
      //   全局响应拦截器
      console.log('>----🚀 http.ts ~ line: 24 ~ var: http result -----> :', response._data)
      if (response.status >= 200 && response.status < 300) {
        if (response._data.code !== 0) {
          if (import.meta.client) {
            // notify infomation
          } else {
            // server 服务端渲染失败才跳转到 my-error 错误页
            nuxtApp.runWithContext(() => {
              navigateTo({
                path: '/my-error',
                query: {
                  code: response._data.code,
                  message: response._data.message
                }
              })
            })
          }
        }
      }
      return response._data
    },
    onResponseError({ response }) {
      if (import.meta.client) {
        // notify infomation
      } else {
        // server服务端渲染失败才跳转到 my-error 错误页
        nuxtApp.runWithContext(() => {
          navigateTo({
            path: '/my-error',
            query: {
              code: response._data.code,
              message: response._data.message
            }
          })
        })
      }
    },
    ...(others ?? {})
  }).then((res) => res.data.value)
}

export const useHTTPGet = async (
  url: string,
  params?: Record<string, any>,
  config?: Record<string, any>
) => {
  return await httpRequest(url, {
    method: 'GET',
    params,
    ...config
  } as IRequestOptions)
}

export const useHTTPPost = async (
  url: string,
  data?: Record<string, any>,
  config?: Record<string, any>
) => {
  return await httpRequest(url, {
    method: 'POST',
    data,
    ...config
  } as IRequestOptions)
}

export const useHTTPut = async (
  url: string,
  data?: Record<string, any>,
  config?: Record<string, any>
) => {
  return await httpRequest(url, {
    method: 'PUT',
    data,
    ...config
  } as IRequestOptions)
}

export const useHTTPDelete = async (
  url: string,
  data?: Record<string, any>,
  config?: Record<string, any>
) => {
  return await httpRequest(url, {
    method: 'DELETE',
    data,
    ...config
  } as IRequestOptions)
}

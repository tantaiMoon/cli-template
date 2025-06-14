declare global {
  export interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    _SAFE_: boolean
  }

  import {
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosRequestConfig,
    AxiosInstance
  } from 'axios'
  export type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosInstance }
}

declare module 'axios' {
  import {
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosRequestConfig,
    AxiosInstance
  } from 'axios'
  export type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosInstance }
}
export {}

import axios from '@/utils/request'

export interface IUserItem {
}

export function getUserInfo() {
  return axios.get('/user/info')
}

export function EditUserInfo(params: IUserItem) {
  return axios.put('/user/info', params)
}

export function login(params: IUserItem) {
  return axios.post('/user/login', params)
}

export function logout() {
  return axios.post('/user/logout')
}

export function register(params: IUserItem) {
  return axios.post('/user/register', params)
}


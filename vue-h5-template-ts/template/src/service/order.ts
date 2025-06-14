import axios from '@/utils/request'

export interface IOrderItem {
}

export function createOrder(params: IOrderItem) {
  return axios.post('/saveOrder', params)
}

export function getOrderList(params: IOrderItem) {
  return axios.get('/order', { params })
}

export function getOrderDetail(id: number | string) {
  return axios.get(`/order/${ id }`)
}

export function cancelOrder(id: number | string) {
  return axios.put(`/order/${ id }/cancel`)
}

export function confirmOrder(id: number | string) {
  return axios.put(`/order/${ id }/finish`)
}

export function payOrder(params: IOrderItem) {
  return axios.get('/paySuccess', { params })
}





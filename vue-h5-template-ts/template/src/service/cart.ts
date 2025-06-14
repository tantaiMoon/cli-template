import axios from '@/utils/request'

export interface CartItem {

}

export function addCart(params: CartItem) {
  return axios.post('/shop-cart', params)
}

export function modifyCart(params: CartItem) {
  return axios.put('/shop-cart', params)
}

export function getCart(params: CartItem) {
  return axios.get('/shop-cart', { params })
}

export function deleteCartItem(id: number | string) {
  return axios.delete(`/shop-cart/${ id }`)
}

export function getByCartItemIds(params: CartItem) {
  return axios.get('/shop-cart/settle', { params })
}


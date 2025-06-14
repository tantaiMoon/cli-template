import request from '@/utils/request'

export function addAddress(params) {
  return request.post('/address', params);
}

export function EditAddress(params) {
  return request.put('/address', params);
}

export function DeleteAddress(id) {
  return request.delete(`/address/${id}`);
}

export function getDefaultAddress() {
  return request.get('/address/default');
}

export function getAddressList() {
  return request.get('/address', { pageNumber: 1, pageSize: 1000 })
}

export function getAddressDetail(id) {
  return request.get(`/address/${id}`)
}



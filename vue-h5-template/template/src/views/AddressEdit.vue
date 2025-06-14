<template>
  <div class="address-edit-box">
    <s-header :name="`${state.type == 'add' ? '新增地址' : '编辑地址'}`"></s-header>
    <van-address-edit
      class="edit"
      :area-list="state.areaList"
      :address-info="state.addressInfo"
      :show-delete="state.type == 'edit'"
      show-set-default
      show-search-result
      :search-result="state.searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import sHeader from '@/components/SimpleHeader.vue'
import { addAddress, EditAddress, DeleteAddress, getAddressDetail } from '@/service/address'
import { tdist } from '@/common/js/utils'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const state = reactive({
  areaList: {
    province_list: {},
    city_list: {},
    county_list: {}
  },
  searchResult: [],
  type: 'add',
  addressId: '',
  addressInfo: {},
  from: route.query.from
})

onMounted(async () => {
  // 省市区列表构造
  let _province_list = {}
  let _city_list = {}
  let _county_list = {}
  tdist.getLev1().forEach(p => {
    _province_list[p.id] = p.text
    tdist.getLev2(p.id).forEach(c => {
      _city_list[c.id] = c.text
      tdist.getLev3(c.id).forEach(q => _county_list[q.id] = q.text)
    })
  })
  state.areaList.province_list = _province_list
  state.areaList.city_list = _city_list
  state.areaList.county_list = _county_list

  const { addressId, type, from } = route.query
  state.addressId = addressId
  state.type = type
  state.from = from || ''
  if (type == 'edit') {
    const { data: addressDetail } = await getAddressDetail(addressId)
    let _areaCode = ''
    const province = tdist.getLev1()
    Object.entries(state.areaList.county_list).forEach(([id, text]) => {
      // 先找出当前对应的区
      if (text == addressDetail.regionName) {
        // 找到区对应的几个省份
        const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
        // 找到区对应的几个市区
        // eslint-disable-next-line no-unused-vars
        const cityItem = Object.entries(state.areaList.city_list).filter(([cityId, cityName]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
        // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
        if (province[provinceIndex].text == addressDetail.provinceName && cityItem[1] == addressDetail.cityName) {
          _areaCode = id
        }
      }
    })
    state.addressInfo = {
      id: addressDetail.addressId,
      name: addressDetail.userName,
      tel: addressDetail.userPhone,
      province: addressDetail.provinceName,
      city: addressDetail.cityName,
      county: addressDetail.regionName,
      addressDetail: addressDetail.detailAddress,
      areaCode: _areaCode,
      isDefault: !!addressDetail.defaultFlag
    }
  }
})

const onSave = async (content) => {
  const params = {
    userName: content.name,
    userPhone: content.tel,
    provinceName: content.province,
    cityName: content.city,
    regionName: content.county,
    detailAddress: content.addressDetail,
    defaultFlag: content.isDefault ? 1 : 0,
  }
  if (state.type == 'edit') {
    params['addressId'] = state.addressId
  }
  await state.type == 'add' ? addAddress(params) : EditAddress(params)
  showToast('保存成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}

const onDelete = async () => {
  await DeleteAddress(state.addressId)
  showToast('删除成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}
</script>

<style lang="scss">
  @use '../common/style/mixin' as *;
  .edit {
    .van-field__body {
      textarea {
        height: 26px!important;
      }
    }
  }
  .address-edit-box {
    .van-address-edit {
      .van-button--danger {
        background: $primary;
        border-color: $primary;
      }
      .van-switch--on {
        background: $primary;
      }
    }
  }
</style>

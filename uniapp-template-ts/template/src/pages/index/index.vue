<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
<!--      <button open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button>-->
      <button open-type="getUserInfo" @getuserinfo="getUserInfo">完整服务</button>

    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')

const getUserInfo = async (info: any) => {
  try {
    console.log(info)
    const {encryptedData, iv} = await uni.getUserInfo()
    const { code } = await uni.login()
    const result = await uni.request({
      url: 'http://localhost:4100/api/auth/p/login',
      method: 'POST',
      dataType: 'json',
      responseType: 'json',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv
      }
    })
    console.log(result)
  } catch(e) {
    console.log(e)
  }
}

const decryptPhoneNumber = (info: any) => {
  console.log(info)
  uni.login({
    success: result => {
      console.log(result, 'login')
      if (result?.code) {
        uni.request({
          url: 'http://localhost:4100/api/auth/p/login',
          method: 'POST',
          dataType: 'json',
          responseType: 'json',
          data: {
            code: result.code
          }
        })
      }
    }
  })
  uni.authorize({
    scope: 'scope.userInfo',
    success: result => {
      console.log(result)
    },
    fail: err => {
      console.log('>----🚀 index.vue ~ line: 24 ~ var: err -----> :', err)
    }
  })
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>

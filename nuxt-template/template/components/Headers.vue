<script setup lang="ts">
import {
  ExpandSharp,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'

function renderIcon(icon: Component, props: any = null) {
  return () => {
    return h(NIcon, props, {
      default: () => h(icon)
    })
  }
}

const { user, setUser } = useSystemUser()
const logout = () => {
  setUser({
    isLogin: false
  })
  removeToken()
  navigateTo('/login')
}

const handleSelect = (key: string) => {
  if (key === 'logout') {
    logout()
  }
}
const options = [
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon(UserIcon, {})
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon, {
      onClick: logout
    })
  }
]
</script>

<template>
  <header box-border f-center justify-between px-10px py-4px w-full>
    <div class="header-left">left</div>
    <div f-center>
      <n-icon size="30" mr-5px>
        <ExpandSharp />
      </n-icon>
      <n-dropdown :options="options" ml-5px @select="handleSelect">
        <n-button text>{{ user.username || '个人中心' }}</n-button>
      </n-dropdown>
    </div>
  </header>
</template>

<style scoped></style>

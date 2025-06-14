<script setup lang="ts">
import {
  ExpandSharp,
  // Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import Sidebar from '~/components/Sidebar.vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const options = [
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon(UserIcon)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon)
  }
]
</script>

<template>
  <div box-border w-full h-full flex min-w-1000px bg-gray-100 min-h-screen>
    <aside>
      aside
      <Sidebar />
      <NuxtLink to="/home">Home</NuxtLink>
      <NuxtLink to="/">Index</NuxtLink>
      <NuxtLink to="/article">Article</NuxtLink>
      <NuxtLink to="/article/123">Article detail</NuxtLink>
    </aside>
    <main box-border flex-auto class="main">
      <header box-border f-center justify-between px-10px py-4px w-full>
        <div class="header-left">left</div>
        <div f-center>
          <n-icon size="30" mr-5px>
            <ExpandSharp />
          </n-icon>
          <n-dropdown :options="options" ml-5px>
            <n-button text>个人中心</n-button>
          </n-dropdown>
        </div>
      </header>
      <section p-10px>
        <NuxtLoadingIndicator />
        <slot></slot>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.header-left {
  color: $themeColor;
}

.main {
  background: $bgColor;
}
</style>

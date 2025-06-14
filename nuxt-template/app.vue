<script setup lang="ts">
// 设置应用程序head头信息
import { dateZhCN, zhCN } from 'naive-ui'
useHead({
  title: 'Nuxt Admin'
})
// 设置应用程序的 SEO
useSeoMeta({
  title: '',
  ogTitle: 'Nuxt Admin',
  description: '',
  ogDescription: '',
  ogImage: ''
})

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCN : null))
</script>
<template>
  <nuxt-error-boundary>
    <n-config-provider
      inline-theme-disabled
      size="large"
      :locale="locale"
      :date-locale="language === 'zh-cn' ? dateZhCN : null"
    >
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-config-provider>
  </nuxt-error-boundary>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

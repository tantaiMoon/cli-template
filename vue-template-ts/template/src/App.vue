<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.ts'
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useGenerateTheme } from '@/hooks/useGenerateTheme.ts'

const { sidebar } = useGlobalStore()
useGenerateTheme()

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
</script>

<template>
  <el-config-provider :size="sidebar.size" :locale="locale.value">
    <RouterView></RouterView>
  </el-config-provider>
</template>

<style lang="scss">
* {
  @apply box-border;
}

body,
html {
  @apply p0;
  @apply m0;
  @apply w-full;
  @apply h-full;
}
</style>

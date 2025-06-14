<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.ts'

const { cacheViews } = useGlobalStore()
console.log(cacheViews)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="views" mode="out-in">
      <!--    使用 include 缓存组件时，必须在组件内使用 defineOptions 定义组件名称， defineOptions({
        name: 'Dashboard'
      })   -->
      <keep-alive :include="cacheViews as string[]">
        <component :is="Component" :key="$route.fullPath"></component>
      </keep-alive>
    </transition>
  </RouterView>
</template>

<style scoped lang="scss">
.views-enter-active,
.views-leave-active {
  @apply transition-all duration-500;
}

.views-enter-from {
  @apply opacity-0 translate-x-[50px];
}

.views-leave-to {
  @apply opacity-0 translate-x-[-50px];
}
</style>

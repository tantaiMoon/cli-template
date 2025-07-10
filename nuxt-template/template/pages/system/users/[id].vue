<script setup lang="ts">
import { useRoute, navigateTo, definePageMeta } from '#imports'
definePageMeta({
  // 页面权限中间件
  middleware: [
    (to) => {
      if (to.params.id === '/2') {
        // return abortNavigation('error') // 终止导航
        return navigateTo('/')
      }
    }
  ]
})
const route = useRoute()
</script>

<template>
  <div>user details: {{ route.params?.id }}</div>
</template>

<style scoped></style>

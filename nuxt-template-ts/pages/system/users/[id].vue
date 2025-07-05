<script setup lang="ts">
definePageMeta({
  // 页面权限中间件
  middleware: [
    (to, from) => {
      if (to.params.id === '/2') {
        // return abortNavigation('error') // 终止导航
        return navigateTo('/')
      }
    },
    'auth'
  ]
})
const route = useRoute()

</script>

<template>
  <div>
    user details: {{ route.params?.id }}
  </div>
</template>

<style scoped>

</style>

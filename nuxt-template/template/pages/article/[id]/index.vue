<script setup lang="ts">
import { useRoute } from '#imports'
definePageMeta({
  // 验证器
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

const route = useRoute()
</script>

<template>
  <div>article id {{ route.params.id }}</div>
</template>

<style scoped></style>

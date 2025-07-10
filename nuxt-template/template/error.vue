<script setup lang="ts">
defineProps<{
  error: Error
}>()
</script>

<template>
  <div text-center mt-100px>
    <h3>错误信息：</h3>
    <p>{{ error.message }}</p>
    <n-button type="primary" ghost>回到首页</n-button>
  </div>
</template>

<style scoped></style>

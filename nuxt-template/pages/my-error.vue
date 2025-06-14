<script setup lang="ts">
onMounted(() => {
  const route = useRoute()
  switch (route.query.code) {
    case '404':
      break
    case '500':
      break
    case '401':
      removeToken()
      break
    default:
    // notify
  }
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>

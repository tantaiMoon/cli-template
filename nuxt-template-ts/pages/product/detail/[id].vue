<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
Product detail : {{ route.params?.id }}
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { useRoute } from '#imports'

const route = useRoute()
</script>

<template>
  <div>
    user id:
    {{ route.params.id }}
  </div>
</template>

<style scoped></style>

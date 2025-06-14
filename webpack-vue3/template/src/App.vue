<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useGenerateTheme } from '@/hooks/useGenerateTheme'

useGenerateTheme()
</script>

<style scoped></style>

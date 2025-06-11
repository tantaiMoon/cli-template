<script setup lang="ts">
import { computed } from 'vue'
import { isExternal } from '@/utils/validate.ts'

const { to } = defineProps<{
  to: string
}>()

const isLink = computed(() => isExternal(to))
const componentType = computed(() => {
  return isLink.value ? 'a' : 'router-link'
})
const componentProps = computed(() => {
  if (isLink.value) {
    return {
      href: to,
      target: '_blank'
    }
  }
  return {
    to
  }
})
</script>

<template>
  <component :is="componentType" v-bind="componentProps">
    <slot></slot>
  </component>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import type { DrawerProps } from 'element-plus'

const { title = '', direction = 'rtl' } = defineProps<{
  modelValue: boolean
  direction?: DrawerProps['direction']
  title?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-drawer :model-value="modelValue" :title="title" :direction="direction" @close="handleClose">
    <slot></slot>
  </el-drawer>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { useSettingStore } from '@/stores/setting'
import { ref, watch } from 'vue'

const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71581'
]

const settingStore = useSettingStore()
const theme = ref(settingStore.settings.theme)

watch(theme, () => {
  settingStore.changeSetting({ key: 'theme', value: theme.value })
})
</script>

<template>
  <el-color-picker v-model="theme" :predefine="predefineColors"></el-color-picker>
</template>

<style scoped lang="scss"></style>

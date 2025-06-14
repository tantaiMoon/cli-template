<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import screenfull from 'screenfull'

const isFull = ref(false)
const { proxy } = getCurrentInstance()
const handleScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  } else {
    proxy.$message('浏览器不支持全屏')
  }
}

const updateFullScreen = () => {
  isFull.value = screenfull.isFullscreen
}
onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', updateFullScreen)
  }
})
onBeforeUnmount(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', updateFullScreen)
  }
})
</script>

<template>
  <SvgIcon
    class="w1.5em h1.5em"
    :icon-name="`ant-design:${!isFull ? 'fullscreen-outlined' : 'fullscreen-exit-outlined'}`"
    @click="handleScreen"
  ></SvgIcon>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.ts'

const { sidebar, toggleMenu } = useGlobalStore()

const handleClick = () => {
  toggleMenu()
}
</script>

<template>
  <div class="hamburger-container" @click="handleClick">
    <SvgIcon
      icon-name="ant-design:bars-outlined"
      custom-class="hambutger"
      :class="{ 'rotate-180': !sidebar.opened }"
    ></SvgIcon>
  </div>
</template>

<style scoped lang="scss">
.hamburger-container {
  @apply leading-[50px] float-left cursor-pointer px-10px hover:(bg-black/5);
}

.hambutger {
  @apply w-20px h-20px transition-transform duration-300;
}
</style>

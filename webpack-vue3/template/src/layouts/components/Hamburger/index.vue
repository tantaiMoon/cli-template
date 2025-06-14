<script setup lang="ts">
import { useGlobalStore } from '@/stores/global'
import SvgIcon from '@/components/SvgIcon/index.vue'

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
  float: left;
  padding: 0 10px;
  cursor: pointer;

  &:hover {
    //background-color: rgba(0, 0, 0, 0.5);
  }

  @apply leading-[50px] float-left cursor-pointer px-10px hover:(bg-black/5);
}

.hambutger {
  width: 20px;
  height: 20px;
  transition: transform 300ms;

  &.rotate-180 {
    transform: rotate(-180deg);
  }
}
</style>

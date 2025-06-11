<script setup lang="ts">
const emit = defineEmits<{
  (e: 'show-setting', isShow: boolean): void
}>()

const openSetting = () => {
  emit('show-setting', true)
}
</script>

<template>
  <div class="navbar" flex>
    <Hamburger></Hamburger>
    <Breadcrumb></Breadcrumb>
    <div flex justify-end items-center flex-1 mr-10px>
      <ScreenIcon mr-10px cursor-pointer />
      <el-tooltip content="切换组件大小" trigger="hover">
        <SizeChange cursor-pointer />
      </el-tooltip>
      <SvgIcon
        icon-name="ant-design:setting-outlined"
        size-1.5em
        ml-10px
        @click.stop="openSetting"
      ></SvgIcon>
      <Avatar ml10px></Avatar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  @apply h-[var(--navbar-height)];
}
</style>

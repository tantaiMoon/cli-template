<script setup lang="ts">
import Hamburger from './Hamburger/index.vue'
import Breadcrumb from './Breadcrumb/index.vue'
import Avatar from './Avatar/index.vue'
import ScreenIcon from '@/components/ScreenIcon/index.vue'
import SizeChange from '@/components/SizeChange/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const emit = defineEmits<{
  (e: 'show-setting', isShow: boolean): void
}>()

const openSetting = () => {
  emit('show-setting', true)
}
</script>

<template>
  <div class="navbar">
    <Hamburger></Hamburger>
    <Breadcrumb></Breadcrumb>
    <div class="navbar-content">
      <ScreenIcon
        style="margin-right: 10px; width: 1.5em; height: 1.5em; cursor: pointer"
        cursor-pointer
      />
      <el-tooltip content="切换组件大小" trigger="hover">
        <SizeChange style="cursor: pointer" />
      </el-tooltip>
      <SvgIcon
        icon-name="ant-design:setting-outlined"
        style="margin-left: 10px; width: 1.5em; height: 1.5em"
        @click.stop="openSetting"
      ></SvgIcon>
      <Avatar ml10px></Avatar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  height: var(--navbar-height);
  //background-color: var(--menu-bg);
  //color: white;
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    margin-right: 10px;
  }
}
</style>

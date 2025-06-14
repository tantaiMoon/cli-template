<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import variables from '@/styles/variables.module.scss'
import { useGlobalStore } from '@/stores/global'
import { useSettingStore } from '@/stores/setting.ts'

const route = useRoute()
const { sidebar, menuTree } = useGlobalStore()
const settingStore = useSettingStore()
const theme = computed(() => settingStore.settings.theme)
// 计算当前激活的菜单，通过 当前页面路由计算
const defaultActive = computed(() => route.path)
console.log(menuTree)
watchEffect(() => {
  document.title = route.meta?.title as string
})
</script>

<template>
  <Logo v-if="settingStore.settings.sidebarLogo" :collapse="!sidebar.opened" />
  <el-menu
    class="sidebar-container-menu h-full"
    border-none
    :default-active="defaultActive"
    :background-color="variables.menuBg"
    :active-text-color="theme"
    :text-color="variables.menuText"
    :collapse="!sidebar.opened"
  >
    <SidebarItem :item="menu" v-for="menu in menuTree" :key="menu.url"></SidebarItem>
  </el-menu>
</template>

<style scoped lang="scss"></style>

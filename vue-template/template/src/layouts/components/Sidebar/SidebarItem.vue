<script setup lang="ts">
import { computed } from 'vue'
import { IMenu } from '@/api/menu'

const { item } = defineProps<{
  item: IMenu
}>()
// 过滤是否有子路由需要渲染
const filterChildren = computed(() => (item.children || []).filter((child) => !child.meta?.hidden))
// 要渲染的路由
const singleChildRoute = computed(() =>
  filterChildren.value.length === 1 && !item.meta?.alwaysShow
    ? filterChildren.value[0]
    : { ...item }
)
// 计算渲染图标
const iconName = computed(() => singleChildRoute.value.meta?.icon)
// 路径拼接
const resolvePath = (url: string = '') => url
</script>

<template>
  <template v-if="!item.meta?.hidden">
    <SidebarItemLink
      :to="resolvePath(singleChildRoute.url)"
      v-if="filterChildren.length <= 1 && !item.meta?.alwaysShow"
    >
      <el-menu-item :index="resolvePath(singleChildRoute.url)">
        <el-icon v-if="iconName">
          <SvgIcon :icon-name="iconName" />
        </el-icon>
        <template #title> {{ singleChildRoute.meta?.title }}</template>
      </el-menu-item>
    </SidebarItemLink>
    <el-sub-menu v-else :index="resolvePath(item.url)">
      <template #title>
        <el-icon v-if="iconName">
          <SvgIcon :icon-name="iconName" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarItem :item="child" v-for="child of filterChildren" :key="child.url" />
    </el-sub-menu>
  </template>
</template>

<style scoped lang="scss"></style>

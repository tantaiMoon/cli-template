<script setup lang="ts">
import { useGlobalStore } from '@/stores/global'

const store = useGlobalStore()
const handleLogout = async () => {
  await store.logout()
  window.location.reload()
}
</script>

<template>
  <el-dropdown class="avatar">
    <span class="el-dropdown-link">
      <el-avatar></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <RouterLink to="/">
          <el-dropdown-item> 首页</el-dropdown-item>
        </RouterLink>
        <RouterLink to="/profile">
          <el-dropdown-item> 个人中心</el-dropdown-item>
        </RouterLink>
        <el-dropdown-item divided @click="handleLogout"> 退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
.avatar {
  margin-left: 10px;
}
</style>

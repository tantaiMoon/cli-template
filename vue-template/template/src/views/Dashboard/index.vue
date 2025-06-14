<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

defineOptions({
  name: 'Dashboard'
})

const { proxy } = getCurrentInstance()!

const value = ref('')
const handleClick = (e: MouseEvent) => {
  proxy?.$message('message')
}
</script>

<template>
  <div>
    <div class="dashboard">Dashboard</div>
    <el-button type="primary" @click="handleClick">tags</el-button>
    <div i-ant-design:apple-filled icon></div>
    <svg-icon icon-name="token-branded:1art" />
    <el-input v-model="value"></el-input>
  </div>
</template>

<style scoped></style>

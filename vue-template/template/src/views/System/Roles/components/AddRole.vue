<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { IRole } from '@/api/role.ts'

const defaultValue = {
  roleName: '',
  description: '',
  status: false,
  roleCode: ''
}
const emit = defineEmits<{
  (e: 'submit', data: IRole): void
}>()
const { data = {}, type } = defineProps<{
  data?: IRole
  type: number
}>()
// if (type ?? '') {
//   throw new Error('type must be number')
// }
const roleForm = ref<IRole>({
  ...defaultValue
})
const onSubmit = () => {
  emit('submit', roleForm.value)
}
const onCancel = () => {
  roleForm.value = { ...defaultValue, ...data }
}

watchEffect(() => {
  roleForm.value = { ...defaultValue, ...data }
})
</script>

<template>
  <el-form :model="roleForm" label-width="120px" max-w600px>
    <el-form-item label="角色名称">
      <el-input v-model="roleForm.roleName" />
    </el-form-item>
    <el-form-item label="角色编码">
      <el-input v-model="roleForm.roleCode" />
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="roleForm.description" />
    </el-form-item>
    <el-form-item label="是否激活">
      <el-switch v-model="roleForm.status" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>

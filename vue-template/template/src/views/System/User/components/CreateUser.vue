<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import type { IProfile } from '@/api/user'
import { useRoleStore } from '@/stores/roles'

const roleStore = useRoleStore()

const defaultValue = {
  username: '',
  description: '',
  status: false,
  name: '',
  email: '',
  mobile: ''
}
const emit = defineEmits<{
  (e: 'submit', data: IProfile): void
}>()
const { data = {}, type } = defineProps<{
  data?: IProfile
  type: number
}>()

const userForm = ref<IProfile>({
  ...defaultValue
})
const onSubmit = () => {
  emit('submit', userForm.value)
}
const onCancel = () => {
  userForm.value = { ...defaultValue, ...data }
}

watchEffect(() => {
  userForm.value = { ...defaultValue, ...data }
})
</script>

<template>
  <el-form :model="userForm" label-width="120px" max-w600px>
    <el-form-item label="用户名">
      <el-input v-model="userForm.username" :disabled="type === 0" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="userForm.name" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="userForm.email" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="userForm.mobile" />
    </el-form-item>
    <el-form-item label="用户描述">
      <el-input v-model="userForm.description" />
    </el-form-item>
    <el-form-item label="是否激活">
      <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>

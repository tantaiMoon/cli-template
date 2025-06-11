<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { IMenu } from '@/api/menu'

const rules = {
  title: [{ required: true, message: '不能为空' }],
  code: [{ required: true, message: '不能为空' }],
  name: [{ required: true, message: '路由名称不能为空' }],
  type: [{ required: true, message: '不能为空' }]
}
const menuType = [
  { label: '模块', value: 'module' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
  { label: 'feature', value: 'feature' }
]
const defaultValue = {
  title: '',
  name: '',
  description: '',
  url: '',
  component: '',
  componentPath: '',
  // description: '',
  status: false,
  code: ''
} as IMenu
const emit = defineEmits<{
  (e: 'submit', data: IMenu): void
}>()
const { data = {}, type } = defineProps<{
  data?: IMenu
  type: number
}>()
// if (type ?? '') {
//   throw new Error('type must be number')
// }
const menuForm = ref<IMenu>({
  ...defaultValue
})
const onSubmit = () => {
  emit('submit', menuForm.value)
}
const onCancel = () => {
  menuForm.value = { ...defaultValue, ...data }
}

watchEffect(() => {
  menuForm.value = { ...defaultValue, ...data }
})
</script>

<template>
  <div class="editor-container">
    <el-form :model="menuForm" :rules="rules" label-width="140px" max-w600px>
      <el-form-item label="菜单（权限）名称" prop="title">
        <el-input v-model="menuForm.title" />
      </el-form-item>
      <el-form-item label="菜单（权限）编码" prop="code">
        <el-input v-model="menuForm.code" />
      </el-form-item>
      <el-form-item label="权限类型" prop="type">
        <el-select v-model="menuForm.type" placeholder="请选择权限类型">
          <el-option
            v-for="item in menuType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="url（菜单路径）" :required="menuForm.type === 'menu'">
        <el-input v-model="menuForm.url" />
      </el-form-item>
      <el-form-item label="name（路由名称）" prop="name" :required="menuForm.type === 'menu'">
        <el-input v-model="menuForm.name" />
      </el-form-item>
      <el-form-item label="组件名称" :required="menuForm.type === 'menu'">
        <el-input v-model="menuForm.component" />
      </el-form-item>
      <el-form-item label="组件路径">
        <el-input v-model="menuForm.componentPath" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="menuForm.icon" />
      </el-form-item>
      <el-form-item
        label="父级菜单"
        :required="menuForm.type === 'button' || menuForm.type === 'feature'"
      >
        <el-input v-model="menuForm.parentId" />
      </el-form-item>
      <el-form-item label="排序号">
        <el-input v-model="menuForm.sort" />
      </el-form-item>
      <el-form-item label="菜单描述">
        <el-input type="textarea" maxlength="200" show-word-limit v-model="menuForm.description" />
      </el-form-item>
      <el-form-item label="是否激活">
        <el-switch v-model="menuForm.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>

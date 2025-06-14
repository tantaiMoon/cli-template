<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import RightPanelDrawer from '@/layouts/components/RightPanelDrawer.vue'
import { useUserHelpers } from '@/views/System/User/userHelpers'
import CreateUser from '@/views/System/User/components/CreateUser.vue'
import { useRoleStore } from '@/stores/roles.ts'
import { ElTree } from 'element-plus'
import { IRole } from '@/api/role.ts'
import { IProfile } from '@/api/user.ts'

const userStore = useUserStore()
const roleStore = useRoleStore()
const roles = computed(() => roleStore.state.roles)
const users = computed(() => userStore.state.users)
const count = computed(() => userStore.state.count)
const pageNum = ref(1)
const pageSize = ref(10)
const {
  editData,
  visible,
  userTitle,
  editType,
  visibleRole,
  checkedKeys,
  handleModifyUser,
  handleAddUser,
  handleRemoveUser,
  handleSubmit,
  changeUserStatus,
  handleSetRole,
  relationRoles
} = useUserHelpers({ pageSize, pageNum })

const menuTreeRef = ref<InstanceType<typeof ElTree> | null>(null)

// 分页页面/条数改变
const handleChangeSize = (size: number) => {
  pageSize.value = size
}
const handleChangePage = (page: number) => {
  pageNum.value = page
}
const handleSubmitMenu = () => {
  const tree = menuTreeRef.value!
  const keys = tree.getCheckedKeys(false)
  const halfKeys = tree.getHalfCheckedKeys()
  const checkedKeys = [...keys, ...halfKeys] as number[]
  relationRoles(checkedKeys)
}
const handleRole = (row: IProfile) => {
  handleSetRole(row)
  menuTreeRef.value?.setCheckedKeys(checkedKeys.value, true)
  menuTreeRef.value?.setCheckedKeys(checkedKeys.value, false)
}
onMounted(() => {
  userStore.getUsers({
    page: pageNum.value,
    size: pageSize.value
  })
  roleStore.getRoles()
})
</script>

<template>
  <div>
    <h2 px-20px pb-20px m0>用户管理</h2>
    <el-button type="primary" mb10px @click="handleAddUser">添加用户</el-button>
    <el-table :data="users">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="description" label="用户描述"></el-table-column>
      <el-table-column
        prop="isSuper"
        label="超级管理员"
        :formatter="
          (row, column, cellValue, index) => {
            return row.isSuper ? '是' : '否'
          }
        "
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'" @click.stop="changeUserStatus(row)">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column prop="updatedTime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleModifyUser(row)" link>修改</el-button>
          <el-button @click="handleRemoveUser(row)" link>删除</el-button>
          <el-button @click="handleRole(row)" link>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="count"
      @size-change="handleChangeSize"
      @current-change="handleChangePage"
      :page-size="pageSize"
      layout="prev, pager, next, size, total"
    ></el-pagination>

    <RightPanelDrawer v-model="visible" :title="userTitle">
      <CreateUser :type="editType" :data="editData" @submit="handleSubmit" />
    </RightPanelDrawer>
    <el-dialog v-model="visibleRole" title="分配角色" width="400px">
      <el-tree
        :data="roles"
        :default-checked-keys="checkedKeys"
        show-checkbox
        check-strictly
        node-key="id"
        ref="menuTreeRef"
      >
        <template #default="{ data }">
          <span>{{ data.roleName }}</span>
        </template>
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="handleSubmitMenu">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

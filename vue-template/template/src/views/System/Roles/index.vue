<script setup lang="ts">
import { useRoleStore } from '@/stores/roles'
import { ElTree } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import RightPanelDrawer from '@/layouts/components/RightPanelDrawer.vue'
import { useRoleHelpers } from '@/views/System/Roles/roleHelpers'
import { useMenuStore } from '@/stores/menus.ts'
import Node from 'element-plus/es/components/tree/src/model/node'
import { IRole } from '@/api/role.ts'

const roleStore = useRoleStore()
const menuStore = useMenuStore()
const menuTree = computed(() => menuStore.state.menuTree)
const roles = computed(() => roleStore.state.roles)
const count = computed(() => roleStore.state.count)

const pageNum = ref(1)
const isCheckedAll = ref(false)
const checkStrictly = ref(false)
const menuTreeRef = ref<InstanceType<typeof ElTree> | null>(null)
const pageSize = ref(10)
const {
  editData,
  visible,
  roleTitle,
  editType,
  visibleAccess,
  checkedKeys,
  handleModifyRole,
  handleAddRole,
  handleRemoveRole,
  handleSubmit,
  handleAllocationAccess,
  relationAccess
} = useRoleHelpers({ pageSize, pageNum })

const handleQuery = () => {
  roleStore.getRoles({
    page: pageNum.value,
    size: pageSize.value
  })
}
// 分页页面/条数改变
const handleChangeSize = (size: number) => {
  pageSize.value = size
  handleQuery()
}
const handleChangePage = (page: number) => {
  pageNum.value = page
  handleQuery()
}

const handleCheckedAll = () => {
  if (!isCheckedAll.value) {
    menuTreeRef.value?.setCheckedNodes(menuTree.value as unknown as Node[], false)
  } else {
    menuTreeRef.value?.setCheckedNodes([], false)
  }
  isCheckedAll.value = !isCheckedAll.value
}
const handleSubmitMenu = () => {
  const tree = menuTreeRef.value!
  const keys = tree.getCheckedKeys(false)
  const halfKeys = tree.getHalfCheckedKeys()
  const checkedKeys = [...keys, ...halfKeys] as number[]
  relationAccess(checkedKeys)
}

const handleAccess = (row: IRole) => {
  handleAllocationAccess(row)
  checkStrictly.value = true
  menuTreeRef.value?.setCheckedKeys(checkedKeys.value)
  setTimeout(() => {
    checkStrictly.value = false
  }, 300)
}

onMounted(() => {
  handleQuery()
  menuStore.getTree()
})
</script>

<template>
  <div>
    <h2 px-20px pb-20px m0>角色管理</h2>
    <el-button type="primary" mb10px @click="handleAddRole">添加角色</el-button>
    <el-table :data="roles">
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="description" label="角色描述"></el-table-column>
      <el-table-column prop="status" label="是否可用">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column prop="updatedTime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click.stop="handleModifyRole(row)" link>修改</el-button>
          <el-button @click="handleRemoveRole(row)" link>删除</el-button>
          <el-button @click="handleAccess(row)" link>分配权限</el-button>
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

    <RightPanelDrawer v-model="visible" :title="roleTitle">
      <AddRole :type="editType" :data="editData" @submit="handleSubmit" />
    </RightPanelDrawer>
    <el-dialog v-model="visibleAccess" title="分配菜单权限">
      <el-tree
        :data="menuTree"
        :default-checked-keys="checkedKeys"
        show-checkbox
        :check-strictly="checkStrictly"
        default-expand-all
        node-key="id"
        ref="menuTreeRef"
      >
        <template #default="{ data }">
          <span>{{ data.title }}</span>
        </template>
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="handleCheckedAll">全部选择</el-button>
        <el-button type="warning" @click="handleSubmitMenu">确认分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

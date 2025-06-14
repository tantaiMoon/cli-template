import { IRole } from '@/api/role'
import { computed, getCurrentInstance, Ref, ref, watchEffect } from 'vue'
import { useRoleStore } from '@/stores/roles'

/**
 * description:角色列表操作帮助方法
 * @params {
 *   pageNum, 分页页码
 *   pageSize 分页条数
 * }
 * @returns {Object<any>}
 */
export const useRoleHelpers = ({
  pageNum,
  pageSize
}: {
  pageNum: Ref<number>
  pageSize: Ref<number>
}) => {
  const { proxy } = getCurrentInstance()!
  // 新增/编辑界面类型 1 为新增， 0 为 修改
  const editType = ref(-1)
  // 当前修改数据，新增时为 undefined
  const editData = ref<IRole | undefined>()
  // 编辑/新增弹窗面包是否展示
  const visible = ref(false)
  const visibleAccess = ref(false)
  const checkedKeys = ref<number[]>([])
  // 弹窗或面板标题
  const roleTitle = computed(() => (editType.value === 1 ? '新增角色' : '编辑角色'))

  // 角色 pinia 仓库
  const roleStore = useRoleStore()

  // 角色列表编辑一条数据
  const handleModifyRole = (row: IRole) => {
    editType.value = 0
    editData.value = { ...row }
    visible.value = true
  }
  const handleAllocationAccess = (row: IRole) => {
    editData.value = { ...row }
    checkedKeys.value = row.accesses?.map((v) => v.id) as number[]
    visibleAccess.value = true
  }
  // 新增角色按钮
  const handleAddRole = () => {
    editType.value = 1
    editData.value = undefined
    visible.value = true
  }
  // 角色列表删除一条数据
  const handleRemoveRole = async (row: IRole) => {
    try {
      await proxy?.$confirm('你确定删除' + row.roleName + '角色吗？', { type: 'warning' })
      await roleStore.removeRole({ ...row, page: pageNum.value, size: pageSize.value })
      proxy?.$message.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  // 新增角色提交数据到服务端
  const addNewRole = async (role: IRole) => {
    await roleStore.addRole({ ...role, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('新增成功')
    visible.value = false
    editData.value = undefined
  }
  // 修改角色提交数据到服务端
  const editRoleRow = async (role: IRole) => {
    await roleStore.updateRole({ ...role, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('编辑成功')
    visible.value = false
    editData.value = undefined
  }
  const relationAccess = async (ids: number[]) => {
    await roleStore.relationAccess(
      { ...editData.value!, page: pageNum.value, size: pageSize.value },
      ids
    )
    proxy?.$message.success('权限分配成功')
    visibleAccess.value = false
    editData.value = undefined
    checkedKeys.value = []
  }

  // 新增或修改界面提交/保存调用 按钮方法
  const handleSubmit = async (role: IRole) => {
    console.log(role)
    if (editType.value === 1) {
      // add
      addNewRole(role)
    } else {
      // modify
      editRoleRow(role)
    }
  }
  watchEffect(() => {
    if (!visible.value) {
      editData.value = undefined
    }
  })
  return {
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
  }
}

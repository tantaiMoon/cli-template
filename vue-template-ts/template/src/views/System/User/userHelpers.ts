import { computed, getCurrentInstance, Ref, ref, watchEffect } from 'vue'
import { IProfile } from '@/api/user'
import { useUserStore } from '@/stores/user'

/**
 * description:角色列表操作帮助方法
 * @params {
 *   pageNum, 分页页码
 *   pageSize 分页条数
 * }
 * @returns {Object<any>}
 */
export const useUserHelpers = ({
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
  const editData = ref<IProfile | undefined>()
  // 编辑/新增弹窗面包是否展示
  const visible = ref(false)
  const visibleRole = ref(false)
  const checkedKeys = ref<number[]>([])
  // 弹窗或面板标题
  const userTitle = computed(() => (editType.value === 1 ? '新增角色' : '编辑角色'))

  // 角色 pinia 仓库
  const userStore = useUserStore()

  // 角色列表编辑一条数据
  const handleModifyUser = (row: IProfile) => {
    editType.value = 0
    editData.value = { ...row }
    visible.value = true
  }
  // 新增角色按钮
  const handleAddUser = () => {
    editType.value = 1
    editData.value = undefined
    visible.value = true
  }
  const handleSetRole = (row: IProfile) => {
    editData.value = { ...row }
    checkedKeys.value = row.roles?.map((v) => v.id) as number[]
    visibleRole.value = true
  }
  // 角色列表删除一条数据
  const handleRemoveUser = async (row: IProfile) => {
    try {
      await proxy?.$confirm('你确定删除' + row.name + '角色吗？', { type: 'warning' })
      await userStore.removeUser({ ...row, page: pageNum.value, size: pageSize.value })
      proxy?.$message.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  // 新增角色提交数据到服务端
  const addNewUser = async (user: IProfile) => {
    await userStore.addUser({ ...user, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('新增成功')
    visible.value = false
    editData.value = undefined
  }
  // 修改角色提交数据到服务端
  const editUserRow = async (user: IProfile) => {
    await userStore.updateUser({ ...user, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('编辑成功')
    visible.value = false
    editData.value = undefined
  }
  const changeUserStatus = async (user: IProfile) => {
    await proxy?.$confirm('确定要' + !user.status ? '启用' : '禁用' + `用户${user.username}吗？`, {
      type: 'warning'
    })
    await userStore.updateUser({
      id: user.id,
      status: !user.status,
      page: pageNum.value,
      size: pageSize.value
    })
    proxy?.$message.success(!user.status ? '启用' : '禁用' + '用户成功')
  }

  // 新增或修改界面提交/保存调用 按钮方法
  const handleSubmit = async (user: IProfile) => {
    console.log(user)
    if (editType.value === 1) {
      // add
      addNewUser(user)
    } else {
      // modify
      editUserRow(user)
    }
  }

  const relationRoles = async (ids: number[]) => {
    await userStore.relationRole(
      { ...editData.value!, page: pageNum.value, size: pageSize.value },
      ids
    )
    proxy?.$message.success('角色分配成功')
    visibleRole.value = false
    editData.value = undefined
    checkedKeys.value = []
  }
  watchEffect(() => {
    if (!visible.value) {
      editData.value = undefined
    }
  })
  return {
    editData,
    visible,
    visibleRole,
    userTitle,
    editType,
    checkedKeys,
    relationRoles,
    handleModifyUser,
    handleAddUser,
    handleRemoveUser,
    handleSubmit,
    changeUserStatus,
    handleSetRole
  }
}

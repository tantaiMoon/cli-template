import type { IMenu } from '@/api/menu'
import { computed, getCurrentInstance, Ref, ref, watchEffect } from 'vue'
import { useMenuStore } from '@/stores/menus'

/**
 * description:权限菜单列表操作帮助方法
 * @params {
 *   pageNum, 分页页码
 *   pageSize 分页条数
 * }
 * @returns {Object<any>}
 */
export const useMenuHelpers = ({
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
  const editData = ref<IMenu | undefined>()
  // 编辑/新增弹窗面包是否展示
  const visible = ref(false)
  // 弹窗或面板标题
  const accessTitle = computed(() => (editType.value === 1 ? '新增权限菜单' : '编辑权限菜单'))

  // 权限菜单 pinia 仓库
  const menuStore = useMenuStore()

  // 权限菜单列表编辑一条数据
  const handleModifyMenu = (row: IMenu) => {
    console.log(row)
    editType.value = 0
    editData.value = { ...row, children: undefined }
  }
  // 新增权限菜单按钮
  const handleAddMenu = (data?: IMenu) => {
    editType.value = 1
    editData.value = data ? ({ parentId: data.id, parent: data } as IMenu) : undefined
    visible.value = true
  }
  // 权限菜单列表删除一条数据
  const handleRemoveMenu = async (row: IMenu) => {
    try {
      await proxy?.$confirm('你确定删除' + row.title + '权限菜单吗？', { type: 'warning' })
      await menuStore.removeMenu({ ...row, page: pageNum.value, size: pageSize.value })
      proxy?.$message.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  // 新增权限菜单提交数据到服务端
  const addNewMenu = async (menu: IMenu) => {
    await menuStore.addMenu({ ...menu, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('新增成功')
    visible.value = false
    editData.value = undefined
  }
  // 修改权限菜单提交数据到服务端
  const editMenuRow = async (menu: IMenu) => {
    await menuStore.updateMenu({ ...menu, page: pageNum.value, size: pageSize.value })
    proxy?.$message.success('编辑成功')
    visible.value = false
    editData.value = undefined
  }

  // 新增或修改界面提交/保存调用 按钮方法
  const handleSubmit = async (menu: IMenu) => {
    console.log(menu, menu.parentId ? 'ziji' : 'root')
    if (editType.value === 1) {
      // add
      await addNewMenu(menu)
    } else {
      // modify
      await editMenuRow(menu)
    }
    editData.value = undefined
  }
  watchEffect(() => {
    if (!visible.value) {
      editData.value = undefined
    }
  })
  return {
    editData,
    visible,
    accessTitle,
    editType,
    handleModifyMenu,
    handleAddMenu,
    handleRemoveMenu,
    handleSubmit
  }
}

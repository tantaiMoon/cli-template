import { defineStore } from 'pinia'
import { reactive } from 'vue'
import {
  addMenuApi,
  getMenusApi,
  getMenuTreeApi,
  IMenu,
  IMenuParams,
  removeMenuApi,
  updateBulkMenuApi,
  updateMenuApi
} from '@/api/menu'

export interface IMenuState {
  menus: IMenu[]
  menuTree: IMenu[]
  count: number
}

type WithMenuParams = IMenu & IMenuParams
export const useMenuStore = defineStore('menu', () => {
  const state = reactive<IMenuState>({
    menus: [],
    menuTree: [],
    count: 0
  })

  // 获取菜单列表
  const getMenus = async (params?: IMenuParams) => {
    try {
      const result = await getMenusApi(params)
      state.menus = result.data.records
      state.count = result.data.pages.total
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 获取菜单树
  const getTree = async (params?: IMenuParams) => {
    try {
      const result = await getMenuTreeApi(params)
      state.menuTree = result.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 新增菜单数据
  const addMenu = async (data: WithMenuParams) => {
    try {
      const { ...menu } = data
      const result = await addMenuApi(menu)
      console.log(result.data)
      if (result.code === 0) {
        if (menu.parentId) {
          menu.parent!.children = menu.parent!.children || []
          menu.parent!.children!.push(result.data)
        } else {
          state.menuTree.push(result.data)
        }
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 更新菜单数据
  const updateMenu = async (data: WithMenuParams) => {
    try {
      const { size, page, ...menu } = data
      const result = await updateMenuApi(menu.id!, menu)
      console.log(result.data)
      if (result.code === 0) {
        await getTree({ page, size })
        return true
        /*if (menu.parentId) {
         menu.parent!.children = menu.parent!.children || []
         menu.parent!.children!.forEach((c) => {
         if (c.id === menu.id) {
         c.status = menu.status
         }
         })
         } else {
         state.menuTree = state.menuTree.map((c) => {
         if (c.id === menu.id) {
         c.status = menu.status
         }
         return c
         })
         }*/
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 批量更新
  const updateBulkMenu = async (data: any) => {
    try {
      const { size, page, ...menus } = data
      const result = await updateBulkMenuApi(menus)
      console.log(result.data)
      if (result.code === 0) {
        await getTree({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  // 删除菜单
  const removeMenu = async (data: WithMenuParams) => {
    try {
      const { size, page, ...menu } = data
      const result = await removeMenuApi(menu.id!)
      console.log(result.data)
      if (result.code === 0) {
        await getMenus({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    state,
    getMenus,
    addMenu,
    updateMenu,
    removeMenu,
    getTree,
    updateBulkMenu
  }
})

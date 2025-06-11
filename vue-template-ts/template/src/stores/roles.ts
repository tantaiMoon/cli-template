import { defineStore } from 'pinia'
import { reactive } from 'vue'
import {
  addRoleApi,
  getRolesApi,
  IRole,
  IRoleParams,
  IRoleState,
  relationRoleAndAccessApi,
  removeRoleApi,
  updateRoleApi
} from '@/api/role'

type WithRoleParams = IRole & IRoleParams
export const useRoleStore = defineStore('role', () => {
  const state = reactive<IRoleState>({
    roles: [],
    count: 0
  })

  const getRoles = async (params?: IRoleParams) => {
    try {
      const result = await getRolesApi(params)
      state.roles = result.data.records
      state.count = result.data.pages.total
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const addRole = async (data: WithRoleParams) => {
    try {
      const { size, page, ...role } = data
      const result = await addRoleApi(role)
      console.log(result.data)
      if (result.code === 0) {
        await getRoles({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const updateRole = async (data: WithRoleParams) => {
    try {
      const { size, page, ...role } = data
      const result = await updateRoleApi(role.id!, role)
      console.log(result.data)
      if (result.code === 0) {
        await getRoles({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const removeRole = async (data: WithRoleParams) => {
    try {
      const { size, page, ...role } = data
      const result = await removeRoleApi(role.id!)
      console.log(result.data)
      if (result.code === 0) {
        await getRoles({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const relationAccess = async (data: WithRoleParams, accessIds: number[]) => {
    try {
      const { size, page, ...menu } = data
      const result = await relationRoleAndAccessApi(menu.id!, accessIds)
      console.log(result.data)
      if (result.code === 0) {
        await getRoles({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    state,
    getRoles,
    addRole,
    updateRole,
    removeRole,
    relationAccess
  }
})

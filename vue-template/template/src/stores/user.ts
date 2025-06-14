import { defineStore } from 'pinia'
import { reactive } from 'vue'
import {
  addUserApi,
  getUsersApi,
  IProfile,
  IUserQuery,
  IUserState,
  relationRoleApi,
  removeUserApi,
  updateUserApi
} from '@/api/user'

type WithUserParams = IProfile & {
  page?: number
  size?: number
}
export const useUserStore = defineStore('user', () => {
  const state = reactive<IUserState>({
    users: [],
    count: 0
  })

  const getUsers = async (params?: IUserQuery) => {
    try {
      const result = await getUsersApi(params)
      state.users = result.data.records
      state.count = result.data.pages.total
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const addUser = async (data: WithUserParams) => {
    try {
      const { size, page, ...user } = data
      const result = await addUserApi(user)
      console.log(result.data)
      if (result.code === 0) {
        await getUsers({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const updateUser = async (data: WithUserParams) => {
    try {
      const { size, page, ...user } = data
      const result = await updateUserApi(user.id!, user)
      console.log(result.data)
      if (result.code === 0) {
        await getUsers({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const removeUser = async (data: WithUserParams) => {
    try {
      const { size, page, ...user } = data
      const result = await removeUserApi(user.id!)
      console.log(result.data)
      if (result.code === 0) {
        await getUsers({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  const relationRole = async (data: WithUserParams, roleIds: number[]) => {
    try {
      const { size, page, ...user } = data
      const result = await relationRoleApi(user.id!, roleIds)
      console.log(result.data)
      if (result.code === 0) {
        await getUsers({ page, size })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    state,
    getUsers,
    addUser,
    updateUser,
    removeUser,
    relationRole
  }
})

import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { Size } from '@/plugins/element'
import type { RouteLocationNormalizedGeneric, RouteRecordNameGeneric } from 'vue-router'
import { IProfile, loginApi, UserLoginData } from '@/api/user'
import { removeRefreshToken, removeToken, setRefreshToken, setToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import type { IMenu } from '@/api/menu'
import type { IRole } from '@/api/role'
import { getPermissionApi } from '@/api/roleAccess'
import { generateTree } from '@/utils/generateTree'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const state = reactive({
      sidebar: {
        opened: true,
        size: 'default' as Size
      },
      system: {
        menuTree: [] as IMenu[],
        menuList: [] as IMenu[],
        permissions: [] as string[],
        roles: [] as IRole[]
      },
      tagsView: [] as RouteLocationNormalizedGeneric[],
      cacheViews: [] as RouteRecordNameGeneric[],
      userInfo: null as unknown as IProfile,
      token: ''
    })
    const sidebar = computed(() => state.sidebar)
    const tagsView = computed(() => state.tagsView)
    const cacheViews = computed(() => state.cacheViews)
    const menuTree = computed(() => state.system.menuTree)
    const menuList = computed(() => state.system.menuList)
    const roles = computed(() => state.system.roles)
    const permissions = computed(() => state.system.permissions)

    const toggleMenu = () => {
      state.sidebar.opened = !state.sidebar.opened
    }
    const setSize = (size: Size) => {
      state.sidebar.size = size
    }

    const addCacheView = (view: RouteLocationNormalizedGeneric) => {
      if (state.cacheViews.includes(view.name)) return
      if (view.meta?.cache) {
        // 需要缓存的组件
        state.cacheViews.push(view.name)
      }
    }
    const delCacheView = (view: RouteLocationNormalizedGeneric) => {
      const index = state.cacheViews.indexOf(view.name)
      if (index > -1) state.cacheViews.splice(index, 1)
    }
    const addView = (view: RouteLocationNormalizedGeneric) => {
      const isSome = state.tagsView.some((item) => item.path === view.path)
      addCacheView(view)
      if (isSome) return
      const newView = {
        ...view,
        title: view.meta.title
      }
      state.tagsView.push(newView)
    }
    const delView = (view: RouteLocationNormalizedGeneric) => {
      const index = state.tagsView.findIndex((item) => item.path === view.path)
      if (index > -1) state.tagsView.splice(index, 1)
      delCacheView(view)
    }
    const delAllViews = () => {
      state.tagsView = state.tagsView.filter((tag) => tag.meta?.affix)
      state.cacheViews = []
    }
    const delOtherViews = (view: RouteLocationNormalizedGeneric) => {
      state.tagsView = state.tagsView.filter((tag) => tag.path === view.path || tag.meta?.affix)
      state.cacheViews = state.cacheViews.filter((name) => name === view.name)
    }

    const userInfo = computed(() => state.userInfo)
    const token = computed(() => state.token)
    const login = async (user: UserLoginData) => {
      try {
        const { data } = await loginApi(user)
        setToken(data?.token.access_token)
        setRefreshToken(data?.token.refresh_token)
        state.token = data?.token.access_token
        state.userInfo = data?.user
        ElMessage.success('登录成功')
        return data
      } catch (e) {
        console.log(e)
        throw e
      }
    }
    const logout = async () => {
      state.userInfo = null as unknown as IProfile
      state.token = ''
      removeToken()
      removeRefreshToken()
      state.system.permissions = []
      state.system.menuTree = []
      delAllViews()
      ElMessage.success('退出成功')
    }

    // 获取菜单树
    const getPermissions = async () => {
      try {
        const result = await getPermissionApi()
        if (result.data.roles?.length === 0) {
          ElMessage.error('该账号无权限，请联系管理员')
          removeToken()
          removeRefreshToken()
          return
        }
        state.system.menuTree = generateTree(result.data.menus as IMenu[], true)
        state.system.menuList = result.data.menus
        state.system.permissions = result.data.permissions
        state.system.roles = result.data.roles
      } catch (e) {
        console.log(e)
        throw e
      }
    }

    return {
      toggleMenu,
      setSize,
      login,
      logout,
      addView,
      delView,
      delAllViews,
      delOtherViews,
      delCacheView,
      getPermissions,
      cacheViews,
      tagsView,
      permissions,
      menuTree,
      menuList,
      roles,
      userInfo,
      token,
      sidebar,
      state
    }
  },
  {
    persist: {
      // 配置持久化
      storage: window.localStorage,
      // 需要存储的状态  , 'state.system.menuTree'
      pick: []
      // pick: [
      //   'state.sidebar',
      //   'state.userInfo',
      //   'state.system.menuList',
      //   'state.system.menuTree',
      //   'state.system.permissions'
      // ]
    }
  }
)

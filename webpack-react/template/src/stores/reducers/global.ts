import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getMenusApi } from '@/api'
import routes from '@/router'
import { MenuItem, MenuTag } from '@/types/menu'
import { Locale } from 'antd/es/locale'
import enUS from 'antd/locale/en_US'
import type { ConfigProviderProps } from 'antd'
import { User } from '@/types'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO } from '@/constants'

export type SizeType = ConfigProviderProps['componentSize']

// 定义状态接口类型
export interface GlobalState {
  menuCollapsed: boolean
  menuList: MenuItem[]
  locale: Locale
  componentSize: SizeType
  user: User
  menuTags: MenuTag[]
}

// 定义初始化数据
const initialState = {
  menuCollapsed: false,
  menuList: [],
  locale: enUS,
  componentSize: 'middle',
  user: {},
  menuTags: []
} satisfies GlobalState as GlobalState

// 定义一个 异步请求
export const menusAction = createAsyncThunk('global/menus', async () => {
  try {
    // const result: any[] = await getMenusApi()
    // return result
    return routes
  } catch (e) {
    return routes
  }
})

export const logoutAction = createAsyncThunk('global/logout', async () => {
  try {
    // const result: any[] = await getMenusApi()
    // return result
    return true
  } catch (e) {
    console.warn(e)
  }
})

// 定义一个切片
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // 同步的 reducers
    setMenuCollapsed(state, action: PayloadAction<boolean>) {
      state.menuCollapsed = action.payload
    },
    toggleMenuCollapse(state) {
      state.menuCollapsed = !state.menuCollapsed
    },
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload
    },
    setComponentSize(state, action: PayloadAction<SizeType>) {
      state.componentSize = action.payload
    },
    addMenuTag(state, action: PayloadAction<MenuTag | MenuTag[]>) {
      const tags = action.payload
      if (Array.isArray(tags)) {
        for (const tag of tags) {
          const isSome = state.menuTags.some((v) => v.path === tag.path)
          if (!isSome) {
            state.menuTags.push(tag)
          }
        }
      } else {
        state.menuTags.push(tags)
      }
    },
    delMenuTag(state, action: PayloadAction<MenuTag>) {
      const index = state.menuTags.findIndex((v) => action.payload.path === v.path)
      if (index > -1) state.menuTags.splice(index, 1)
    },
    delAllMenuTag(state) {
      state.menuTags = state.menuTags.filter((v) => v?.affix)
    },
    delOtherMenuTag(state, action: PayloadAction<MenuTag>) {
      state.menuTags = state.menuTags.filter(
        (tag) => tag.path === action.payload.path || action.payload?.affix
      )
    }
  },
  extraReducers: (builder) => {
    builder.addCase(menusAction.pending, (state, action) => {
      // 异步请求未返回
    })
    builder.addCase(menusAction.rejected, (state, action) => {
      // 异步请求失败
    })
    builder.addCase(menusAction.fulfilled, (state, { payload }) => {
      // 异步请求成功
      state.menuList = payload as any[]
    })
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.user = {}
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      localStorage.removeItem(USER_INFO)
    })
  }
})
// 导出 action
export const {
  setMenuCollapsed,
  toggleMenuCollapse,
  setLocale,
  setComponentSize,
  delMenuTag,
  delOtherMenuTag,
  delAllMenuTag,
  addMenuTag
} = globalSlice.actions
// 默认导出，导出的文件在 store 的入口中引入
const globalReducer = globalSlice.reducer
export default globalReducer

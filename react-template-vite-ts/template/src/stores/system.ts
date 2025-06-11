import { CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RouteObject } from 'react-router-dom'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { IProfile, loginApi } from '@/api/user'
import { setRefreshToken, setToken } from '@/utils/auth'

interface ISystemState {
  sidebar: boolean
  themeMode: boolean
  theme: string
  originalTheme: string
  activeMenu: string[]
  componentSize: SizeType
  userInfo: IProfile | null
  roles: any[]
  menuList: Array<any>
  permissions: string[]
  tagsView: RouteObject[]
}

const setThemeValue: CaseReducer<ISystemState, PayloadAction<string>> = (state, action) => {
  state.theme = action.payload
}
const setOriginalThemeValue: CaseReducer<ISystemState, PayloadAction<string>> = (state, action) => {
  state.originalTheme = action.payload
}

const initialState: ISystemState = {
  sidebar: false,
  themeMode: false,
  theme: '#1a8fef',
  originalTheme: '',
  activeMenu: [],
  componentSize: 'middle',
  userInfo: null,
  roles: [],
  menuList: [],
  permissions: [],
  tagsView: []
} satisfies ISystemState as ISystemState

export const userLogin = createAsyncThunk('global/userLogin', async (data: any) => {
  const [err, result] = await loginApi(data)
  if (err) return null
  setToken(result?.token.access_token as string)
  setRefreshToken(result?.token.refresh_token as string)
  return result
})

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<IProfile>) {
      state.userInfo = action.payload
    },
    setRoles(state, action: PayloadAction<any[]>) {
      state.roles = action.payload
    },
    setTheme: setThemeValue,
    setOriginalTheme: setOriginalThemeValue,
    setSidebar: (state: ISystemState, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload
    },
    setThemeMode: (state: ISystemState, action: PayloadAction<boolean>) => {
      state.themeMode = action.payload
    },
    setComponentSize: (state: ISystemState, action: PayloadAction<SizeType>) => {
      state.componentSize = action.payload
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload
    },
    setActiveMenu(state, action: PayloadAction<string[]>) {
      state.activeMenu = action.payload
    },
    setMenuList(state, action: PayloadAction<any[]>) {
      state.menuList = action.payload
    },
    setTagsView(state, action: PayloadAction<RouteObject>) {
      console.log(state.tagsView)
      state.tagsView.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      console.log(action.payload)
      state.userInfo = action.payload?.user
    })
  }
})

export const {
  setTheme,
  setSidebar,
  setComponentSize,
  setOriginalTheme,
  setThemeMode,
  setUserInfo,
  setRoles,
  setPermissions,
  setMenuList,
  setActiveMenu,
  setTagsView
} = systemSlice.actions

export default systemSlice.reducer

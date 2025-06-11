import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGlobalState {
  menuList: Array<any>
  permissions: string[]
}

const initialState: IGlobalState = {
  menuList: [],
  permissions: []
} satisfies IGlobalState as IGlobalState

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload
    },
    setMenuList(state, action: PayloadAction<any[]>) {
      state.menuList = action.payload
    }
  }
})

export const { setPermissions, setMenuList } = globalSlice.actions

export default globalSlice.reducer

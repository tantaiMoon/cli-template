import { configureStore } from '@reduxjs/toolkit'
import globalReducer from '@/stores/reducers/global'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

export const store = configureStore({
  reducer: {
    global: globalReducer
  }
})

// Infer the RootState and Dispatch types
export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
// export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import systemReducer from '@/stores/system'
import globalReducer from '@/stores/global'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

// 修正拼写错误：'presitConfig' 改为 'persistConfig'
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['system']
}

const reducers = combineReducers({
  system: systemReducer,
  global: globalReducer
})

const persistedReducers = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 关闭 redux 序列化检测
      serializableCheck: false
    })
})

export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)
export default store

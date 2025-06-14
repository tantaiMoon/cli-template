import storage from 'redux-persist/lib/storage'
import { thunk } from 'redux-thunk'
import user, { UserActionType } from './user/reducer'
import permission, { AuthActionType } from './permission/reducer'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { persistReducer } from 'redux-persist'

// redux 持久化配置

const persistConfig = {
  key: 'redux-state',
  blacklist: [],
  storage
}

type RootAction = UserActionType | AuthActionType
// @ts-expect-error
type RootReducer = Reducer<RootState, RootAction, RootState>
// 创建 reducer
const reducer = combineReducers({
  user,
  permission
} as RootReducer)

// 创建一个新的 redux 状态 reducer
const persistReducerConfig = persistReducer<RootReducer>(persistConfig, reducer)

// 开启 redutools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// 使用 redux-thunk
const middlewares = applyMiddleware(thunk)

// 创建 store
export const store = createStore<RootState, RootAction>(
  persistReducerConfig,
  composeEnhancers(middlewares)
)

// 持久化 store
// @ts-ignore
// export const persistor = persistStore(store as Store<RootState>)

export {}

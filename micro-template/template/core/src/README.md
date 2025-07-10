# usage

注册并开启微前端框架

pnpm add @moyi.rk/micro-core

```ts
// 主应用
import { start, registerMicroApps, createStore } from '@moyi.rk/micro-core'
// 框架全局 store
const store = createStore()
const storeData = store.getStore()
store.subscribe((oldValue, newValue) => {
  console.log(oldValue, newValue)
})
window.store = store

registerMicroApps([
    {
        name: 'react16',
        entry: '//localhost:3000',
        container: '#micro_container',
        activeRule: '/react16',
      props: {
        name: 'react16',
        toggleHeader: () => {}
      }
    },
    {
        name: 'vue3',
        entry: '//localhost:3001',
        container: '#micro_container',
        activeRule: '/vue3',
    },
], {
    bootstrap: [
        app => {
            console.log('before load', app)
        }
    ],
    mounted: [
        app => {
            console.log('before mount', app)
        }
    ],
    unmounted: 
        app => {
            console.log('before unmount', app)
        }
    
})
start()
```

子应用

子应用创建保存 app 实例的方法
```ts
let main = null
export const setMain = (props) => (main = props)
export const getMain = () => main
```

```typescript jsx
const render = () => {
  console.log('render')
  ReactDOM.createRoot(document.getElementById('root'))
    .render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
}
if (!window.__MOYI_MICRO_WEB__) {
  render()
}

export const bootstrap = () => {
  console.log('bootstrap')
}
export const mount = (app) => {
  console.log('mount')
  setMain(app)
  const storeData = window.store.getStore()
  window.store.update({
    ...storeData,
    name: 'vue3-store-update'
  })
  render()
}
export const unmount = (app) => {
  setMain(null)
  console.log('unmount')
}
```

需要隐藏的子应用页面
```typescript jsx
import {getMain} from '@utils/main'

// vue
// props
onMounted(() => {
    getMain().props.toggleHeader(true)
})
onUmounted(() => {
    getMain().props.toggleHeader(false)
})

// customevent
window.custom.emit('test', {
  toggleHeader
})

// react
useEffect(() => {
    getMain().props.toggleHeader(true)
    return () => {
        getMain().props.toggleHeader(false)
    }
}, [])
```

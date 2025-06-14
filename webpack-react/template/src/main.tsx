import React from 'react'
import { createRoot } from 'react-dom/client'
import 'uno.css'
import { Provider } from 'react-redux'
import App from './App'
import store from '@/stores'
import '@/assets/style/index.scss'

const rootElement = document.getElementById('root')!

const root = createRoot(rootElement)
console.log(root)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

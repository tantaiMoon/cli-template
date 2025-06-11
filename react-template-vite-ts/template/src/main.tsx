import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'uno.css'
import '@/assets/styles/index.scss'
import App from '@/App.tsx'
import { Provider } from 'react-redux'
import stores, { persistor } from '@/stores'
import { PersistGate } from 'redux-persist/integration/react'

console.log(import.meta.env, navigator.language)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={stores}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)

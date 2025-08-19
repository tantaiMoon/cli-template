import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import 'uno.css'
import '@/assets/styles/index.scss'
import App from '@/App.tsx'
import { configure } from 'mobx'

const isDEV = import.meta.env.DEV
configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: isDEV
})


console.log(import.meta.env, navigator.language)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <App />
  </StrictMode>
)

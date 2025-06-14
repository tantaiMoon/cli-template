import { BrowserRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import AppErrorBoundary from '@/components/AppErrorBoundy'
import { ConfigProvider } from 'antd'
import AppRoutes from '@/router'
import { store /*, persistor*/ } from '@/store'
import { Provider } from 'react-redux'

function App() {
  const { i18n } = useTranslation()
  return (
    <AppErrorBoundary>
      {/*持久化*/}
      {/*<PersistGate persistor={persistor}>*/}
      <Provider store={store}>
        <ConfigProvider locale={i18n.language === 'en' ? enUS : zhCN}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
      {/*</PersistGate>*/}
    </AppErrorBoundary>
  )
}

export default App

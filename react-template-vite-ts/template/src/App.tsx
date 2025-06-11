import { ErrorBoundary } from 'react-error-boundary'
import { AppRoutes } from '@/routers'
import zhCn from 'antd/locale/zh_CN'
import en from 'antd/locale/en_US'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { useAppSelector } from '@/hooks/useAppStore.ts'
import { useGenerateTheme } from '@/hooks/useGenerateTheme.ts'
import { filterAsyncRoutes } from '@/utils/generateTree.ts'
import { asyncRoutes } from '@/routers/routes.tsx'

function App() {
  useGenerateTheme()
  const lang = navigator.language
  const componentSize = useAppSelector((state) => state.system.componentSize)
  const theme = useAppSelector((state) => state.system.theme)
  const menuList = useAppSelector((state) => state.global.menuList)
  const FallbackComponent = ({
    error,
    resetErrorBoundary
  }: {
    error: Error
    resetErrorBoundary: any
  }) => {
    console.log(error)
    return (
      <div>
        <p>出错啦！</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>点击重试</button>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallbackRender={FallbackComponent}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
        console.log(details)
      }}
    >
      <ConfigProvider
        componentSize={componentSize}
        theme={{
          cssVar: true,
          token: {
            colorPrimary: theme,
            colorPrimaryBorder: theme,
            colorPrimaryHover: theme,
            colorPrimaryBgHover: theme,
            colorLink: theme,
            colorLinkHover: theme,
            colorLinkActive: theme
          }
        }}
        locale={lang.includes('zh') ? zhCn : en}
      >
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App

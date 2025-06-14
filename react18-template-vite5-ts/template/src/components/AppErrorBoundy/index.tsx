import { ErrorBoundary } from 'react-error-boundary'
import { ReactNode, Suspense } from 'react'

type AppProviderProps = {
  children: ReactNode
}

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div>
      <h2>页面发生错误...</h2>
      <p>{JSON.stringify(error.message)}</p>
      <p>{JSON.stringify(error.stack)}</p>
    </div>
  )
}

const AppErrorBoundary = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
    </Suspense>
  )
}
export default AppErrorBoundary

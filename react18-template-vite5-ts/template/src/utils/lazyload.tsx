import { LazyExoticComponent, Suspense } from 'react'
import { Spin } from 'antd'

export default function lazyload(Comp: LazyExoticComponent<any>): React.ReactNode {
  return (
    <Suspense
      fallback={
        <Spin
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
          size="large"
        ></Spin>
      }
    >
      <Comp />
    </Suspense>
  )
}

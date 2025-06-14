import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { AppRoutes } from '@/router'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'

import 'dayjs/locale/zh-cn'
import { useAppDispatch, useAppSelector } from '@/stores'
import { setLocale } from '@/stores/reducers/global'

// dayjs.locale('en')

export default function App() {
  const { locale, componentSize } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setLocale(navigator.language === 'en' ? enUS : zhCN))
    dayjs.locale(navigator.language === 'en' ? 'en' : 'zh-cn')
  })
  return (
    <ConfigProvider locale={locale} componentSize={componentSize}>
      <BrowserRouter>
        <AppRoutes></AppRoutes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

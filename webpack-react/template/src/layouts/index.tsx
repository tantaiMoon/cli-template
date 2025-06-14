import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Menus from '@/layouts/components/Menus'
import { useAppSelector } from '@/stores'
import Navbar from '@/layouts/components/Navbar'
import MenuTags from '@/layouts/components/MenuTags'
import './index.scss'

const Layouts = () => {
  const { menuCollapsed } = useAppSelector((state) => state.global)
  return (
    <Layout h-full overflow-hidden>
      <Layout.Sider collapsed={menuCollapsed}>
        <Menus></Menus>
      </Layout.Sider>
      <Layout>
        <Layout.Header pl-5px pr-10px className="headers">
          <Navbar />
        </Layout.Header>
        <Layout.Content>
          <MenuTags></MenuTags>
          <div className="app-content">
            <Outlet px-15px />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Layouts

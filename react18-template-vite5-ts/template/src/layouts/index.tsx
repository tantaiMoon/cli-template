import { FunctionComponent } from 'react'
import { Layout, Space } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import LeftMenu from './components/Menu.tsx'
import { setCollapsed } from '@/store/permission/action.ts'
import { useDispatch, useSelector } from 'react-redux'

// interface LayoutsProps {}

const Layouts: FunctionComponent<any> = () => {
  const permissionStore = useSelector((state: RootState) => state.permission)
  const userStore = useSelector((state: RootState) => state.user)
  const { collapsed, menuList } = permissionStore
  const { currentMenuKey } = userStore
  const dispatch = useDispatch()
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider
        trigger={null}
        collapsed={collapsed}
        collapsible
      >
        <div className="logo"></div>
        <LeftMenu
          menus={menuList as any}
          currentKey={currentMenuKey}
          key={'left-menu'}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          {collapsed ? (
            <MenuUnfoldOutlined
              className="trigger"
              onClick={() => dispatch(setCollapsed(!collapsed))}
            />
          ) : (
            <MenuFoldOutlined
              className="trigger"
              onClick={() => dispatch(setCollapsed(!collapsed))}
            />
          )}
          <Space>
            <Outlet />
          </Space>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Layouts

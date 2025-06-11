import { Layout, Space, Tag } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/layouts/components/Sidebar'
import { useAppSelector } from '@/hooks/useAppStore'
import Navbar from '@/layouts/components/Navbar'

export default function Layouts() {
  const collapsed = useAppSelector((state) => state.system.sidebar)
  const systemState = useAppSelector((state) => state.system)
  return (
    <Layout h-full>
      <Layout.Sider collapsed={collapsed}>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header px-10px>
          <Navbar />
        </Layout.Header>
        <Layout.Content p-10px>
          <Space>
            {systemState.tagsView?.map((tag, i) => {
              return (
                <Tag title={tag.meta!.title} key={i} closeIcon cursor-pointer>
                  {tag.meta!.title}
                </Tag>
              )
            })}
          </Space>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

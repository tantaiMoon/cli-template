import { Layout, Space, Tag } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/layouts/components/Sidebar'
import { useStores } from '@/hooks/useAppStore'
import Navbar from '@/layouts/components/Navbar'

const Layouts = observer(function () {
  const { globalStore } = useStores()
  const collapsed = globalStore.sidebar
  const tagsView = globalStore.tagsView
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
            {tagsView?.map((tag, i) => {
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
})
export default Layouts

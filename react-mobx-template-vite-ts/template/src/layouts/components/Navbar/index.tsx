import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, ColorPicker, Drawer, Select } from 'antd'
import { useStores } from '@/hooks/useAppStore'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71581'
]

const Navbar: React.FC = observer(() => {
  const [open, setOpen] = useState(false)
  const {globalStore} = useStores()
  const collapsed = globalStore.sidebar
  const componentSize = globalStore.componentSize
  // const activeMenu = useAppSelector((state) => state.system.activeMenu)
  const theme = globalStore.theme
  const onClose = () => {
    setOpen(false)
  }
  return (
    <>
      <div f-c pt-10px>
        <Button px-10px onClick={() => globalStore.setSidebar(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Breadcrumb
          ml-15px
          text-white
          items={[
            {
              className: 'text-white!',
              href: '/home',
              title: <HomeOutlined />
            }
            // ...activeMenu
            //   .map((v) => ({
            //     className: 'text-white!',
            //     href: v,
            //     title: v
            //   }))
            //   .reverse()
          ]}
        />
        <div f-c flex-1 justify-end>
          <SettingOutlined
            className="mr-10px fs-20px  text-white cursor-pointer"
            onClick={() => setOpen(true)}
          />
          <Avatar size={40} bg-gray-4 />
        </div>
      </div>
      <Drawer title="系统设置" onClose={onClose} open={open}>
        <div f-c mb-10px>
          <span mr-10px>主题色</span>
          <ColorPicker
            onChange={(_, color) => globalStore.setTheme(color)}
            defaultValue={theme}
            presets={[{ label: null, colors: predefineColors }]}
          />
        </div>
        <div>
          <span mr-10px>组件大小</span>
          <Select
            onChange={(val) => globalStore.setComponentSize(val)}
            defaultValue={componentSize}
          >
            <Select.Option value="large">large</Select.Option>
            <Select.Option value="middle">default</Select.Option>
            <Select.Option value="small">small</Select.Option>
          </Select>
        </div>
      </Drawer>
    </>
  )
})

export default Navbar

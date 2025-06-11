import { setSidebar, setComponentSize, setTheme } from '@/stores/system.ts'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, ColorPicker, Drawer, Select } from 'antd'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
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

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false)
  const collapsed = useAppSelector((state) => state.system.sidebar)
  const componentSize = useAppSelector((state) => state.system.componentSize)
  const activeMenu = useAppSelector((state) => state.system.activeMenu)
  const theme = useAppSelector((state) => state.system.theme)
  const dispatch = useAppDispatch()
  const onClose = () => {
    setOpen(false)
  }
  return (
    <>
      <div f-c pt-10px>
        <Button px-10px onClick={() => dispatch(setSidebar(!collapsed))}>
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
            mr-10px
            fs-20px
            text-white
            cursor-pointer
            onClick={() => setOpen(true)}
          />
          <Avatar size={40} bg-gray-4 />
        </div>
      </div>
      <Drawer title="系统设置" onClose={onClose} open={open}>
        <div f-c mb-10px>
          <span mr-10px>主题色</span>
          <ColorPicker
            onChange={(_, color) => dispatch(setTheme(color))}
            defaultValue={theme}
            presets={[{ label: null, colors: predefineColors }]}
          />
        </div>
        <div>
          <span mr-10px>组件大小</span>
          <Select onChange={(val) => dispatch(setComponentSize(val))} defaultValue={componentSize}>
            <Select.Option value="large">large</Select.Option>
            <Select.Option value="middle">default</Select.Option>
            <Select.Option value="small">small</Select.Option>
          </Select>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar

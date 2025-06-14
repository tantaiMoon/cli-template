import React from 'react'
import { Button, Divider, Dropdown, MenuProps, Space, Avatar } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAppDispatch } from '@/stores'
import { logoutAction } from '@/stores/reducers/global'
import { useNavigate } from 'react-router-dom'

export default function AvatarItem() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const menuStyle: React.CSSProperties = {
    boxShadow: 'none'
  }
  const avatarList: MenuProps['items'] = [
    {
      label: '首页',
      key: 'home'
    },
    {
      label: 'Large',
      key: 'large'
    }
  ]
  const handleAvatarClick = ({ key }: { key: string }) => {
    if (key === 'home') {
      navigate('/')
    }
  }
  const handleLogout = () => {
    dispatch(logoutAction())
      .unwrap()
      .then(() => {
        navigate('/login')
      })
  }
  return (
    <Dropdown
      menu={{
        items: avatarList,
        onClick: handleAvatarClick
      }}
      trigger={['click']}
      dropdownRender={(menu) => (
        <>
          {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
          <Divider style={{ margin: 0 }} />
          <Space p-8px bg-white rd-b-8px>
            <Button type="text" hover:bg-transparent onClick={handleLogout}>
              <LogoutOutlined />
              退出登录
            </Button>
          </Space>
        </>
      )}
    >
      <Avatar text-white w-40px h-40px size={30} />
    </Dropdown>
  )
}

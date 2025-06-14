import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Flex, MenuProps, Space } from 'antd'
import { FontSizeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/stores'
import { setComponentSize, SizeType, toggleMenuCollapse } from '@/stores/reducers/global'
import AvatarItem from '@/layouts/components/Avatar'
import './navbar.scss'

export default function Navbar() {
  const { menuCollapsed, componentSize } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const sizeList: MenuProps['items'] = [
    {
      label: 'Small',
      key: 'small'
    },
    {
      label: 'Middle',
      key: 'middle'
    },
    {
      label: 'Large',
      key: 'large'
    }
  ]

  const handleSizeClick = ({ key }: { key: string }) => {
    dispatch(setComponentSize(key as SizeType))
  }

  useEffect(() => {
    console.log(location)
  }, [location])

  return (
    <Flex className="navbar">
      <Space>
        <Button px-8px onClick={() => dispatch(toggleMenuCollapse())}>
          {menuCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </Button>
        <Breadcrumb separator="/" items={[]}></Breadcrumb>
      </Space>
      <Space>
        <Dropdown
          menu={{
            items: sizeList,
            onClick: handleSizeClick,
            selectable: true,
            defaultSelectedKeys: [componentSize!]
          }}
          trigger={['click']}
        >
          <FontSizeOutlined text-white fs-24 />
        </Dropdown>
        <AvatarItem />
      </Space>
    </Flex>
  )
}

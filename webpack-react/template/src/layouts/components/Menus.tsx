import { Menu } from 'antd'
import { useAppSelector } from '@/stores'
import React from 'react'

export default function Menus() {
  const { menuList} = useAppSelector(state => state.global);
  return (
    <Menu items={menuList} mode="inline" key='path'>
      
    </Menu>
  )
}

import React from 'react'
import type { MenuProps } from 'antd'

declare global {
  type MenuItemProps = MenuProps['items']['number'] & {
    id: string | number
    // 基础属性
    key: string // 唯一标识，通常对应路由路径
    label: React.ReactNode // 菜单项显示的文本
    icon?: React.ReactNode // 菜单图标
    path?: string // 路由路径
    redirect?: string // 重定向路径
    parent?: MenuItemProps
    parentId?: string | number

    // 菜单项状态
    disabled?: boolean // 是否禁用
    hidden?: boolean // 是否隐藏
    danger?: boolean // 是否显示错误状态样式

    // 子菜单相关
    children?: MenuItemProps[] // 子菜单项
    type?: 'group' | 'divider' // 菜单项类型

    // 权限控制
    roles?: string[] // 可访问的角色
    permission?: string // 权限标识

    // 元数据
    meta?: {
      title?: string // 菜单标题
      icon?: string | ReactNode // 菜单图标
      target?: '_blank' | '_self' | '_parent' | '_top' // 链接打开方式
      keepAlive?: boolean // 是否缓存
      hiddenInMenu?: boolean // 是否在菜单中隐藏
      hideChildrenInMenu?: boolean // 是否隐藏子菜单
      authority?: string[] // 权限控制
      // eslint-disable-next-line
      [key: string]: any // 其他自定义属性
    }

    // 事件处理
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
  }

  interface RoleProps {
    id?: string
    name: string
    isAdmin?: boolean
  }

  interface GlobalStateProps {
    menuList: MenuItemProps[]
    permissions: string[]
  }

  interface LoginFieldType {
    username?: string
    password?: string
    captcha?: string
  }

  interface UserInfoProps {
    id?: number
    name?: string
    username: string
    password?: string
    mobile?: string
    gender?: number
    avatar?: string
    email?: string
    status?: boolean
    description?: string
    roles?: any[]
    roleIds?: number[]
  }
}

export {}

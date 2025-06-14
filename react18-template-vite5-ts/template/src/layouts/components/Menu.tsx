import { MenuItemType } from 'antd/es/menu/interface'
import { Menu, MenuProps } from 'antd'
import * as Icons from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setMenuKey } from '@/store/user/action.ts'

interface IMenuProps {
  menus: MenuItemType[]
  currentKey: string
}

const LeftMenu = (props: IMenuProps) => {
  const { menus, currentKey } = props
  const dispatch = useDispatch()

  const transformMenu = (menus: any[]) => {
    const arr: any[] = []
    menus.forEach((item) => {
      // console.log(Icons)
      const MenuIcon = (Icons as any)[item.icon as string]
      const route = {
        key: `${item.path}`,
        // icon: <MenuIcon />,
        label: item.label
      }
      // console.log(Icons, item.icon)
      if (item.icon) {
        // @ts-ignore
        route['icon'] = <MenuIcon />
      }
      if (item.children && item.children.length > 0) {
        // @ts-ignore
        route['children'] = transformMenu(item.children)
      } else {
        route['label'] = <Link to={item.path}>{item.label}</Link>
      }
      arr.push(route)
    })
    return arr
  }
  const setCurrent: MenuProps['onClick'] = (e) => {
    console.log(e)
    dispatch(setMenuKey(e.key))
  }
  const findParent = () => {
    const current = menus.find((v) => v.path === currentKey)!
    const parent = menus.find((v) => current && v.id === current.parent_id)!
    return parent?.path || ''
  }
  return (
    <>
      <Menu
        items={transformMenu(menus)}
        mode="inline"
        theme={'dark'}
        defaultSelectedKeys={[currentKey]}
        defaultOpenKeys={[findParent()]}
        onClick={setCurrent}
      />
    </>
  )
}
// const LeftMenu = IMenu
export default LeftMenu

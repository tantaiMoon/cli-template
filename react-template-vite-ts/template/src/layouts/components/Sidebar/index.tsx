import { Menu } from 'antd'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { NavLink, useNavigate } from 'react-router-dom'
import { generateTree } from '@/utils/generateTree'
import { setActiveMenu, setTagsView } from '@/stores/system'

const Sidebar = () => {
  const items = useAppSelector((state) => state.system.menuList)
  const collapsed = useAppSelector((state) => state.system.sidebar)
  const activeMenu = useAppSelector((state) => state.system.activeMenu)
  const navigate = useNavigate()
  const selectedkeys = [activeMenu?.[0] ?? '']
  const openkeys = activeMenu?.slice(1) ?? []
  const dispatch = useAppDispatch()
  const handleMenu = ({ item, key, keyPath }: { item: any; key: string; keyPath: string[] }) => {
    if (selectedkeys.includes(key)) {
      return
    }
    console.log(item.props)
    dispatch(setActiveMenu(keyPath))
    dispatch(
      setTagsView({
        ...item.props,
        icon: '',
        children: []
      })
    )
    navigate(key)
  }
  console.log(generateTree(items, true))
  return (
    <>
      <div f-c h-64px fs-20px>
        <NavLink to="/" f-c justify-center w-full>
          <img src="../../../assets/logo.png" alt="" mr-5px w-40px h-40px />
          {!collapsed ? <span>React Admin</span> : null}
        </NavLink>
      </div>
      <Menu
        defaultSelectedKeys={selectedkeys}
        defaultOpenKeys={openkeys}
        onClick={handleMenu}
        mode="inline"
        theme="dark"
        items={generateTree(items, true)}
      />
    </>
  )
}
export default Sidebar

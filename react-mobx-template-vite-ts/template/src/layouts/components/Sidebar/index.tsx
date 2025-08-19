import { Menu } from 'antd'
import { useStores } from '@/hooks/useAppStore'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { NavLink, useNavigate } from 'react-router-dom'
import { generateTree } from '@/utils/generateTree'

const Sidebar = observer(() => {
  const { globalStore } = useStores()
  const items = toJS(globalStore.menuList)
  const collapsed = toJS(globalStore.sidebar)
  const activeMenu = globalStore.activeMenu
  const navigate = useNavigate()
  const selectedkeys = [activeMenu?.[0] ?? '']
  const openkeys = activeMenu?.slice(1) ?? []
  const handleMenu = ({
    item,
    key,
    keyPath
  }: {
    item: MenuItemProps
    key: string
    keyPath: string[]
  }) => {
    if (selectedkeys.includes(key)) {
      return
    }
    console.log(item.props)
    globalStore.setActiveMenu(keyPath)
    globalStore.setTagsView({
      ...item.props,
      icon: '',
      children: []
    })
    navigate(key)
  }
  return (
    <>
      <div className="f-c h-64px fs-20px">
        <NavLink to="/" f-c justify-center w-full>
          <img src="../../../assets/logo.png" alt="" mr-5px w-40px h-40px />
          {!collapsed ? <span>MRK React Admin</span> : null}
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
})
export default Sidebar

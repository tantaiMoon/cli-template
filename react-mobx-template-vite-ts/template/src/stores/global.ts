import { loginApi } from '@/api/user.ts'
import { setRefreshToken, setToken } from '@/utils/auth.ts'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import { makeAutoObservable, autorun } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export class GlobalStore {
  menuList: MenuItemProps[] = []
  permissions: GlobalStateProps['permissions'] = []
  sidebar: boolean = false
  themeMode: boolean = false
  theme: string = '#1a8fef'
  originalTheme: string = ''
  activeMenu: Array<string> = []
  componentSize: SizeType = 'middle'
  userInfo: UserInfoProps | null = null
  roles: RoleProps[] = []
  tagsView: MenuItemProps[] = []

  constructor() {
    makeAutoObservable(this, {})
    void makePersistable(this, {
      name: 'GlobalStore',
      properties: ['sidebar', 'theme', 'tagsView', 'componentSize'],
      storage: window.localStorage,
      expireIn: 1000 * 60 * 60 * 24 * 7, // 7day
      debugMode: import.meta.env.DEV,
      removeOnExpiration: true
    })
    autorun(() => {})
  }

  async getUserInfo(data: LoginFieldType) {
    const [err, result] = await loginApi(data)
    if (err) return null
    setToken(result?.token.access_token as string)
    setRefreshToken(result?.token.refresh_token as string)
    return result
  }

  setUserInfo(user: UserInfoProps) {
    this.userInfo = user
  }
  setRoles(roles: RoleProps[]) {
    this.roles = roles
  }
  setTheme(theme: string) {
    this.theme = theme
  }
  setOriginalTheme(theme: string) {
    this.originalTheme = theme
  }
  setSidebar(sidebar: boolean) {
    this.sidebar = sidebar
  }
  setThemeMode(mode: boolean) {
    this.themeMode = mode
  }
  setComponentSize(size: SizeType) {
    this.componentSize = size
  }
  setActiveMenu(menu: string[]) {
    this.activeMenu = menu
  }
  setTagsView(item: MenuItemProps[]) {
    this.tagsView.push(item)
  }
  get computedMenuCount() {
    return this.menuList.length
  }

  setPermissions(permissions: string[]) {
    this.permissions = permissions
  }

  setMenuList(menus: MenuItemProps[]) {
    this.menuList = menus
  }
}

const globalStore = new GlobalStore()
export default globalStore

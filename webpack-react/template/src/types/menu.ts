export interface MenuItem {
  id?: string
  label: string
  icon?: string
  children?: MenuItem[]
  title?: string
  name?: string
  path: string
  key: string
  meta?: {
    label?: string
    affix?: boolean
    hidden?: boolean
    icon?: string
  }
}

export interface MenuTag {
  id?: string
  path: string
  name?: string
  label?: string
  title?: string
  affix?: boolean
  meta?: {
    label?: string
    title?: string
    affix?: boolean
    hidden?: boolean
  }
}

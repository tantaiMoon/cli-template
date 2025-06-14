import React, { useEffect } from 'react'
import { Flex, Tag } from 'antd'
import { useLocation } from 'react-router-dom'
import path from 'path-browserify'
import { useAppDispatch, useAppSelector } from '@/stores'
import { MenuTag } from '@/types'
import './menu_tag.scss'
import routes, { IRouteObject } from '@/router'
import { addMenuTag } from '@/stores/reducers/global'

export default function MenuTags() {
  const { menuTags } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    function filterAffix(routes: IRouteObject[], basePath = '/') {
      const tags = [] as any[]

      for (const item of routes) {
        if (item.meta?.affix) {
          tags.push({
            ...item,
            path: path.posix.join(basePath, item.path ?? ''),
            title: item.meta?.title ?? ''
          } as never)
        }
        if (item.children) {
          tags.push(...filterAffix(item.children, item.path ?? ''))
        }
      }
      return tags
    }

    const tags = filterAffix(routes)
    console.log(tags)
    dispatch(addMenuTag(tags))
  }, [])
  return (
    <Flex wrap={false} w-full className={'tags-view'}>
      {menuTags.map((item: MenuTag) => {
        return (
          <Tag
            closable={!item.meta?.affix}
            key={item.path}
            px-8px
            h-28px
            lh-26px
            className={item.path === location.pathname ? 'active' : ''}
          >
            <span mr-5px inline-block w-8px h-8px rd-8px bg-cyan></span>
            <span>{item.meta?.title}</span>
          </Tag>
        )
      })}
      <div w-10000px h-20px></div>
    </Flex>
  )
}

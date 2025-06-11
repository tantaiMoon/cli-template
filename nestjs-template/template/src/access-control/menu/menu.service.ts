import { CreateMenuDto } from '@/access-control/menu/dto/create-menu.dto'
import { UpdateMenuDto } from '@/access-control/menu/dto/update-menu.dto'
import { PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS } from '@/database/prisma/prisma.constants'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClient } from 'prisma/client/mysql'

@Injectable()
export class MenuService {
  constructor(
    @Inject(PRISMA_CONNECTION_NAME) private prismaService: PrismaClient,
    @Inject(PRISMA_CONNECTIONS) private connectionProvider: Record<string, PrismaClient>
  ) {
    // super()
  }

  private async _createNested(dto: CreateMenuDto, prismaClient: PrismaClient, parentId?: number) {
    const { meta, children = [], ...rest } = dto
    const menu = {
      parentId,
      ...rest,
      meta: {
        create: meta
      }
    }
    const parent = await prismaClient.menu.create({
      data: menu as any
    })
    if (children?.length > 0) {
      const childData = await Promise.all(
        children?.map(async (child) => this._createNested(child, prismaClient, parent.id as number))
      )
      parent['children'] = childData
    }
    return parent
  }

  async create(data: CreateMenuDto) {
    // return this.prismaService.$transaction(async (prisma: PrismaClient) => {
    //   const menuData = await this._createNested(data, prisma)
    // })
    const menuData = await this._createNested(data, this.prismaService)
    console.log('>-----------(menu.service.ts:42) var is menuData:', menuData)
    return this.prismaService.menu.findUnique({
      where: { id: menuData.id },
      include: {
        meta: true,
        children: {
          include: {
            meta: true,
            children: true
          }
        }
      }
    })
  }
  async createRelation(data: CreateMenuDto) {
    const menuData = await this._createNested(data, this.prismaService)
    return this.prismaService.menu.findUnique({
      where: { id: menuData.id },
      include: {
        meta: true,
        children: {
          include: {
            meta: true,
            children: true
          }
        }
      }
    })
  }

  private async _connectMenuIds(id: number) {
    const menuIds: number[] = []
    menuIds.push(id)
    const menu = await this.prismaService.menu.findUnique({
      where: { id: id },
      include: {
        children: true
      }
    })
    if (!menu) {
      throw new NotFoundException(`数据不存在`)
    }
    if (menu?.children?.length > 0) {
      const childmenus = await Promise.all(
        menu.children.map((child) => this._connectMenuIds(child.id))
      )
      for (const chilIds of childmenus) {
        menuIds.push(...chilIds)
      }
    }
    return menuIds
  }

  async delete(id: number) {
    const idsToDel = await this._connectMenuIds(+id)
    return this.prismaService.$transaction(async (prisma) => {
      // 删除关联表 Meta 数据
      await prisma.menuMeta.deleteMany({
        where: {
          menuId: {
            in: idsToDel
          }
        }
      })
      // 删除children
      const res = await prisma.menu.deleteMany({
        where: {
          id: {
            in: idsToDel
          }
        }
      })
      return !!res.count
    })
  }

  async find(page: number, limit: number, args: any = {}) {
    const skip = (page - 1) * limit
    const includeArg = {
      meta: true,
      children: {
        include: {
          meta: true,
          children: true
        }
      },
      ...args
    }
    let pagenation: any = {
      skip,
      take: limit
    }
    if (limit === -1) {
      pagenation = {}
    }
    const count = await this.prismaService.menu.count({
      where: args
    })
    const data = await this.prismaService.menu.findMany({
      where: args,
      ...pagenation,
      include: {
        ...includeArg
      }
    })
    return {
      records: data,
      pagination: {
        total: count,
        current: page,
        size: limit,
        pages: Math.ceil(count / limit)
      }
    }
  }

  findTree(skip: number, limit: number, args: any = {}) {
    const includeArg = {
      meta: true,
      children: {
        include: {
          meta: true,
          children: true
        }
      },
      ...args
    }
    let pagenation: any = {
      skip,
      take: limit
    }
    if (limit === -1) {
      pagenation = {}
    }
    return this.prismaService.menu.findMany({
      where: {
        parentId: null
      },
      ...pagenation,
      include: {
        ...includeArg
      }
    })
  }

  findOne(id: number) {
    return this.prismaService.menu.findUnique({
      where: { id: +id },
      include: {
        meta: true,
        children: {
          include: {
            meta: true,
            children: true
          }
        }
      }
    })
  }

  findAllByIds(ids: number[]) {
    return this.prismaService.menu.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        children: true,
        parent: true
      }
    })
  }

  async update(id: number, updateData: UpdateMenuDto) {
    const { children = [], meta, ...restData } = updateData
    return this.prismaService.$transaction(async (prisma: PrismaClient) => {
      // 有新增、有删除、有修改
      // 先更新父级
      const data = await prisma.menu.update({
        where: { id: +id },
        data: {
          ...restData
          // meta: {
          //   update: meta
          // }
        } as any
      })
      if (meta) {
        await prisma.menuMeta.upsert({
          where: { menuId: +id },
          create: { ...meta, menuId: +id },
          update: meta
        })
      }
      // 是否有children
      if (children?.length > 0) {
        // 获取旧子菜单 id
        const menuIds = (await this._connectMenuIds(+id)).filter((o) => o !== id)
        // 删除旧子菜单 meta 数据
        await prisma.menuMeta.deleteMany({
          where: {
            menuId: {
              in: menuIds
            }
          }
        })
        // 删除旧的 子菜单
        await prisma.menu.deleteMany({
          where: {
            parentId: data.id
          }
        })
        // 重新创建新的子菜单
        await Promise.all(children.map(async (child) => this._createNested(child, prisma, data.id)))
      }
      return prisma.menu.findUnique({
        where: {
          id: data.id
        },
        include: {
          meta: true,
          children: {
            include: {
              meta: true,
              children: true
            }
          }
        }
      })
    })
  }
}

import { UpdateRoleDto } from '@/access-control/role/dto/update-role.dto'
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS } from '@/database/prisma/prisma.constants'
import { Inject, Injectable } from '@nestjs/common'
import { Menu, PrismaClient } from 'prisma/client/mysql'
import { UpdateRolePolicyDto } from './dto/update-role-policy.dto'
import { CreateRoleRelationsDto } from './dto/create-role-relations.dto'
import type { UpdateRolePermissionDto } from './dto/update-role-permission.dto'

@Injectable()
export class RoleService {
  constructor(
    @Inject(PRISMA_CONNECTION_NAME) private readonly prismaClient: PrismaClient,
    @Inject(PRISMA_CONNECTIONS) private connectionProvider: Record<string, PrismaClient>
  ) {
    // super()
  }

  async create(data: CreateRoleDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { ...restData } = data
      return prisma.role.create({
        data: {
          ...restData
        },
        include: {
          rolePolicies: {
            include: { policy: true }
          },
          rolePermissions: {
            include: { permission: true }
          },
          roleMenus: {
            include: { menu: true }
          }
        }
      })
    })
  }

  private async calculationRealtions(dto: CreateRoleRelationsDto | UpdateRoleDto) {
    const { permissions = [], policies = [], menus = [], ...restData } = dto
    const rolePermissions = {
      deleteMany: {},
      create: this._createPermissions(permissions)
    }
    const rolePolicies = {
      deleteMany: {},
      create: await this._createPolicies(policies)
    }
    const roleMenus = {
      deleteMany: {},
      create: await this._createMenus(menus)
    }
    const data = {
      ...restData
    }
    if (permissions.length > 0) {
      data['rolePermissions'] = rolePermissions
    }
    if (policies.length > 0) {
      data['rolePolicies'] = rolePolicies
    }
    if (menus.length > 0) {
      data['roleMenus'] = roleMenus
    }
    return data
  }

  async createAndRelations(dto: CreateRoleRelationsDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const data = (await this.calculationRealtions(dto)) as CreateRoleRelationsDto
      return prisma.role.create({
        data,
        include: {
          rolePolicies: {
            include: { policy: true }
          },
          rolePermissions: {
            include: { permission: true }
          },
          roleMenus: {
            include: { menu: true }
          }
        }
      })
    })
  }

  async delete(id: number) {
    return this.prismaClient.$transaction(async (prisma) => {
      // 删除相关关联表数据
      await prisma.role.update({
        where: { id: id },
        data: {
          rolePermissions: {
            deleteMany: {}
          },
          rolePolicies: {
            deleteMany: {}
          },
          roleMenus: {
            deleteMany: {}
          }
        }
      })
      //   删除 role
      const result = await prisma.role.delete({ where: { id: id } })
      return !!result
    })
  }

  async find(page: number, limit: number) {
    const skip = (page - 1) * limit
    const count = await this.prismaClient.role.count({})
    const data = await this.prismaClient.role.findMany({
      skip,
      take: limit,
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        rolePolicies: {
          include: {
            policy: true
          }
        },
        roleMenus: {
          include: {
            menu: true
          }
        }
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

  async findOne(id: number) {
    return this.prismaClient.role.findUnique({
      where: { id: id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        rolePolicies: {
          include: { policy: true }
        },
        roleMenus: {
          include: { menu: true }
        }
      }
    })
  }

  findAllByIds(ids: number[]) {
    return this.prismaClient.role.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        rolePolicies: {
          include: {
            policy: true
          }
        },
        roleMenus: {
          include: {
            menu: true
          }
        }
      }
    })
  }

  update(id: number, dto: UpdateRoleDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const data = await this.calculationRealtions(dto)
      return prisma.role.update({
        where: { id: +id },
        data: data,
        include: {
          rolePolicies: {
            include: {
              policy: true
            }
          },
          rolePermissions: {
            include: {
              permission: true
            }
          },
          roleMenus: {
            include: {
              menu: true
            }
          }
        }
      })
    })
  }

  updateRoleMenus(id: number, dto: UpdateRoleMenuDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { menuIds = [] } = dto
      await prisma.roleMenu.deleteMany({
        where: {
          roleId: id
        }
      })
      const validMenuIds: number[] = []
      for (const menuId of menuIds) {
        const menu = await prisma.menu.findUnique({
          where: {
            id: menuId
          }
        })
        if (menu) {
          validMenuIds.push(menuId)
        }
      }
      return prisma.roleMenu.createMany({
        data: validMenuIds.map((menuId) => ({
          roleId: id,
          menuId
        }))
      })
    })
  }

  updateRolePolicy(id: number, dto: UpdateRolePolicyDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { policyIds = [] } = dto
      await prisma.rolePolicy.deleteMany({
        where: {
          roleId: id
        }
      })
      const validIds: number[] = []
      for (const policyId of policyIds) {
        const policy = await prisma.policy.findUnique({
          where: {
            id: policyId
          }
        })
        if (policy) {
          validIds.push(policyId)
        }
      }
      return prisma.rolePolicy.createMany({
        data: validIds.map((policyId) => ({
          roleId: id,
          policyId
        }))
      })
    })
  }

  updateRolePermissions(id: number, dto: UpdateRolePermissionDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { permissionIds = [] } = dto
      await prisma.rolePermissions.deleteMany({
        where: {
          roleId: id
        }
      })
      const validIds: number[] = []
      for (const permissionId of permissionIds) {
        const permission = await prisma.permission.findUnique({
          where: {
            id: permissionId
          }
        })
        if (permission) {
          validIds.push(permissionId)
        }
      }
      return prisma.rolePermissions.createMany({
        data: validIds.map((permissionId) => ({
          roleId: id,
          permissionId
        }))
      })
    })
  }

  private _createPermissions(permissions: any[]) {
    return permissions?.map((permission) => ({
      permission: {
        // connectOrCreate 查询或者创建
        connectOrCreate: {
          // 查询是否存在
          where: { name: permission.name },
          // 查询 permission.name 不存在时
          create: {
            ...permission
          }
        }
      }
    }))
  }

  private async _createPolicies(policies: any[]) {
    const createArr: any[] = []
    if (policies && policies.length > 0) {
      for (const policy of policies) {
        let whereCond
        let data = policy
        if (policy.id) {
          whereCond = { id: policy.id }
          const policyData = await this.prismaClient.policy.findUnique({
            where: { id: policy.id }
          })
          data = policyData
        } else {
          const encode = Buffer.from(JSON.stringify(policy)).toString('base64')
          whereCond = { encode }
          policy.encode = encode
        }
        if (data) {
          createArr.push({
            policy: {
              connectOrCreate: {
                where: whereCond,
                create: {
                  ...data
                }
              }
            }
          })
        }
      }

      // role Policies更新
    }
    return createArr
  }

  private async _createMenus(menus: Menu[]) {
    const createArr: any[] = []
    if (menus && menus.length > 0) {
      for (const menu of menus) {
        const whereCond = menu?.id
          ? { id: menu.id }
          : {
              name: menu.name
            }
        createArr.push({
          menu: {
            connect: {
              ...whereCond
            }
          }
        })
      }

      // role Policies更新
    }
    return createArr
  }
}

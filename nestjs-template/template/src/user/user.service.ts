import { PRISMA_CONNECTION_NAME } from '@/database/prisma/prisma.constants'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { PrismaClient, Prisma } from 'prisma/client/postgresql'

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(PRISMA_CONNECTION_NAME) private readonly prismaClient: PrismaClient
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { roleIds = [], password, ...restData } = createUserDto
    // 利用事务 $transaction 创建 user，并创建 userRole，保证数据的一致性
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const validRoleIds: number[] = []
      for (const roleId of roleIds) {
        const role = await prisma.role.findUnique({
          where: {
            id: roleId
          }
        })
        if (role) {
          validRoleIds.push(roleId)
        }
      }
      return prisma.user.create({
        data: {
          ...restData,
          password: password!,
          roles: {
            create: validRoleIds.map((roleId) => ({ roleId }))
          }
        }
      })
    })
  }

  async findAll(conditional: Prisma.UserFindManyArgs) {
    const count = await this.prismaClient.user.count(conditional as any)
    const data = await this.prismaClient.user.findMany({
      ...conditional,
      include: {
        roles: true
      }
    })
    return {
      records: data,
      pagination: {
        total: count,
        size: conditional.take,
        current: conditional!.skip! / conditional.take! + 1,
        pages: Math.ceil(count / conditional.take!)
      }
    }
  }

  async findOne(id: number) {
    return this.prismaClient.user.findUnique({
      where: {
        id
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  findOneBy(keyworkd: string, field = 'username') {
    return this.prismaClient.user.findUnique({
      where: {
        [field]: keyworkd
      } as any,
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { roleIds = [], ...restData } = updateUserDto
      // const user = await prisma.user.findUnique({
      //   where: {
      //     id
      //   }
      // })
      // if (!user) {
      //   return new BadRequestException('用户不存在')
      // }
      await prisma.userRole.deleteMany({
        where: {
          userId: id
        }
      })
      const validRoleIds: number[] = []
      for (const roleId of roleIds) {
        const role = await prisma.role.findUnique({
          where: {
            id: roleId
          }
        })
        if (role) {
          validRoleIds.push(roleId)
        } else {
          return new BadRequestException('角色不存在')
        }
      }
      return prisma.user.update({
        where: {
          id
        },
        include: {
          roles: true
        },
        data: {
          ...restData,
          roles: {
            create: validRoleIds.map((roleId) => ({ roleId }))
          }
        }
      })
    })
  }

  updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { roleIds = [] } = updateUserRoleDto
      await prisma.userRole.deleteMany({
        where: {
          userId: id
        }
      })
      const validRoleIds: number[] = []
      for (const roleId of roleIds) {
        const role = await prisma.role.findUnique({
          where: {
            id: roleId
          }
        })
        if (role) {
          validRoleIds.push(roleId)
        } else {
          return new BadRequestException('角色不存在')
        }
      }
      await prisma.userRole.createMany({
        data: validRoleIds.map((roleId) => ({
          userId: id,
          roleId
        }))
      })
      return prisma.user.findUnique({
        where: {
          id
        },
        include: {
          roles: true
        }
      })
    })
  }

  remove(id: number) {
    return this.prismaClient.user.delete({
      where: {
        id
      }
    })
  }
}

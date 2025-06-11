import { PRISMA_CONNECTION_NAME } from '@/database/prisma/prisma.constants'
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { PERMISSION_KEY } from '@/common/decorators/role-permission.decorator'
import { ConfigurationService } from '@/common/configuration/configuration.service'
import { ConfigEnum } from '@/common/enums/config.enum'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(PRISMA_CONNECTION_NAME) private prismaClient: PrismaClient,
    private configService: ConfigurationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取路由上的权限信息 string[] | string, example: ['create', 'delete']
    const handlePermission: string[] | string = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler()
    )
    const methodPermission =
      handlePermission instanceof Array ? handlePermission.join('') : handlePermission
    // 获取类上的权限信息 string[] | string, example: ['user']
    const classPermission: string[] | string = this.reflector.get(
      PERMISSION_KEY,
      context.getClass()
    )
    const clsPermission =
      classPermission instanceof Array ? classPermission.join('') : classPermission
    const req: Request = context.switchToHttp().getRequest()
    const { id } = req.user
    // 查询用户的角色信息
    const user = await this.prismaClient.user.findUnique({
      where: { id: id },
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
    console.log('>-----------(role-permission.guard.ts:33) var is user:', user)
    if (!user) {
      return false
    }
    // 获取用户的角色信息
    const roleIds = user.roles?.map((role) => role.roleId) ?? []
    // console.log('>-----------(role-permission.guard.ts:31) var is roleIds:', roleIds)
    // 如果是 roleWhiteList 中的用户对应的 roleId ，直接返回 true
    const roleWhiteList = this.configService.getKey(ConfigEnum.ROLE_WHITELIST)
    if (roleWhiteList) {
      const whiteListArr = roleWhiteList.split(',')?.map(Number)
      if (whiteListArr.some((w) => roleIds?.includes(w))) {
        return true
      }
    }
    // 查询角色的权限信息
    // 1. 查询角色的权限信息
    const rolePermissions = await this.prismaClient.role.findMany({
      where: {
        id: {
          in: roleIds
        }
      },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })
    const permissions = rolePermissions
      ?.map((p) => p.rolePermissions.map((o) => o.permission.name))
      .reduce((acc, cur) => {
        return [...new Set([...acc, ...cur])]
      }, [])
    // 2. 拼接权限信息，判断是否有权限
    const right = `${clsPermission}:${methodPermission}`
    // console.log('>-----------(role-permission.guard.ts:93) var is right:', right, permissions)
    // 3. 判断是否有权限
    return permissions.some((p) => p === right)
  }
}

import { ConfigEnum } from '@/common/enums/config.enum'
import { PRISMA_CONNECTION_NAME } from '@/database/prisma/prisma.constants'
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { CaslAbilityService, IPolicy } from '@/access-control/policy/casl-ability.service'
import { PERMISSION_KEY } from '@/common/decorators/role-permission.decorator'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { User } from './user.entity'

const mapSubjectToClass = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'user':
      return User
    default:
      return subject
  }
}

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly caslAbilityService: CaslAbilityService,
    private readonly reflector: Reflector,
    private configService: ConfigService,
    @Inject(PRISMA_CONNECTION_NAME) private readonly prismaService: PrismaClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //  获取权限信息
    // 1.1 从方法上获取 permission.name
    const handlePermission = this.reflector.get(PERMISSION_KEY, context.getHandler())
    const methodPermission =
      handlePermission instanceof Array ? handlePermission.join('') : handlePermission
    // 1.2 从控制器类上获取 permission.name
    const classPermission = this.reflector.get(PERMISSION_KEY, context.getClass())
    const clsPermission =
      classPermission instanceof Array ? classPermission.join('') : classPermission
    // 1. Guard -> 装饰器的 handle & class 上获取 permission.name
    const right = `${clsPermission}:${methodPermission}`
    const req: Request = context.switchToHttp().getRequest()
    const { username, id } = req.user
    if (!id || !username) {
      return false
    }
    // 2. permission -> policy 需要访问接口的数据权限
    const permission = await this.prismaService.permission.findUnique({
      where: {
        name: right
      },
      include: {
        permissionPolicies: {
          include: {
            policy: true
          }
        }
      }
    })
    console.log('>-----------(policy.guard.ts:38) var is right:', right, permission)
    // 3. policy -> subjects -> 缩小 RolePolicy 的查询范围
    const subjects = permission?.permissionPolicies?.map((policy) => {
      return policy.policy.subject
    })
    console.log('>-----------(policy.guard.ts:49) var is subjects:', subjects)

    // 4. userid -> User -> Role -> Policy & subjects 用户已分配的接口权限
    const user = await this.prismaService.user.findUnique({
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
    if (!user) {
      return false
    }
    const roleIds = user.roles?.map((role) => role.roleId) ?? []
    // const roles = await this.roleRepository.findAllByIds(roleIds)
    const roles = await this.prismaService.role.findMany({
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
        },
        rolePolicies: {
          include: {
            policy: true,
            role: true
          }
        }
      }
    })
    // TODO判断是是白名单
    const roleWhiteList = this.configService.get<string>(ConfigEnum.ROLE_WHITELIST)
    if (roleWhiteList) {
      const whiteListArr = roleWhiteList.split(',')?.map(Number)
      if (whiteListArr.some((w) => roleIds?.includes(w))) {
        return true
      }
    }
    const policies: IPolicy[] = roles.reduce((acc, cur) => {
      const rolePolicy = cur.rolePolicies?.filter((policy) => {
        return subjects?.includes(policy.policy.subject)
      })
      acc.push(...rolePolicy.map((r) => r.policy))
      return acc
    }, [] as any[])
    // const policies: IPolicy[] = rolePolicyFilterBySubjects.map((r) => r.policy) ?? []
    // @ts-expect-error
    delete user.password
    ;(user as any).rolePolicies = roles
    ;(user as any).policies = policies
    ;(user as any).roleIds = roleIds
    ;(user as any).permissions = user.roles?.reduce((acc, cur) => {
      return [...acc, ...cur.role.rolePermissions]
    }, [])

    // const map = {}
    // caslAbilityService 获取用户已有权限，通过 can cannot 判断当前用户是否有权限访问
    // 接口权限， Policy 进行关联，读取数据库中接口关联的 Policy 与上面的 ability 之间进行逻辑判断，从而对数据库实现数据权限控制
    const abilities = await this.caslAbilityService.buildAbility(policies, [
      user,
      req,
      this.reflector
    ])

    if (policies.length === 0) {
      return true
    }

    let allPermissionsGranted = true
    const tempPermissionPolicy = [...permission!.permissionPolicies]
    for (const policy of [...tempPermissionPolicy]) {
      const { action, subject, fields } = policy.policy
      let permissionGranted = false
      for (const ability of abilities) {
        // console.log('>-----------(policy.guard.ts:108) var is ability:', fields, ability.rules)
        // const subjectObj = await this.sharedRepository.getSubject(subject, user)
        const subjectObj = await this.prismaService[subject].findUnique({
          where: {
            id: user.id
          }
        })
        const subjectTmp = mapSubjectToClass(subject)
        const subjetIns =
          typeof subjectTmp === 'string' ? subjectTmp : plainToInstance(subjectTmp, subjectObj)

        if (fields) {
          if ((fields as any)?.length > 0 && Array.isArray(fields)) {
            permissionGranted = fields.every((field) => {
              return ability.can(action, subjetIns, field as string)
            })
            console.log(
              '>-----------(policy.guard.ts:117) var is permissionGranted:',
              permissionGranted
            )
          } else if (fields['data']) {
            permissionGranted = fields['data'].every((field) =>
              ability.can(action, subjetIns, field)
            )
          }
        } else {
          permissionGranted = ability.can(action, subjetIns)
        }
        if (permissionGranted) {
          break
        }
      }
      if (permissionGranted) {
        const idx = tempPermissionPolicy.indexOf(policy)
        if (idx >= 0) {
          tempPermissionPolicy.splice(idx, 1)
        }
      }
    }
    if (tempPermissionPolicy.length !== 0) {
      allPermissionsGranted = false
    }
    // console.log('>-----------(policy.guard.ts:70) var is user:', user)
    // console.log('>-----------(policy.guard.ts:24) var is flag:', flag)
    return allPermissionsGranted
  }
}

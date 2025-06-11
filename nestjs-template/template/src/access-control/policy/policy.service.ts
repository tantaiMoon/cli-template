import { buildWhereClause } from '@/utils/build-where'
import { CreatePolicyPermissionDto } from './dto/create-policy-permission.dto'
import { CreatePolicyDto } from './dto/create-policy.dto'
import { UpdatePolicyPermissionDto } from './dto/update-policy-permission.dto'
import { PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS } from '@/database/prisma/prisma.constants'
import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from 'prisma/client/mysql'

@Injectable()
export class PolicyService {
  constructor(
    @Inject(PRISMA_CONNECTION_NAME) private readonly prismaClient: PrismaClient,
    @Inject(PRISMA_CONNECTIONS) private connectionProvider: Record<string, PrismaClient>
  ) {}

  async create(data: CreatePolicyDto) {
    const encode = Buffer.from(JSON.stringify(data)).toString('base64')
    return this.prismaClient.policy.create({
      data: { ...data, encode } as any
    })
  }

  async createBatch(data: CreatePolicyDto[]) {
    const result = await this.prismaClient.policy.createMany({
      data: data.map((p) => ({
        ...p,
        encode: Buffer.from(JSON.stringify(p)).toString('base64')
      }))
    })
    return result.count > 0
  }

  async createAndPermission(data: CreatePolicyPermissionDto) {
    const encode = Buffer.from(JSON.stringify(data)).toString('base64')
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { permissions = [], id, ...restData } = data
      const policyPermissions = {
        create: this._createPermissions(permissions)
      }
      console.log('>-----------(policy.service.ts:29) var is policyPermissions:', policyPermissions)
      return prisma.policy.create({
        data: {
          ...restData,
          encode,
          // 一对多，没有该 permission 时会创建这个数据
          permissionPolicies: policyPermissions
        } as any,
        include: {
          permissionPolicies: true
          // permissions: true
        }
      })
    })
  }

  delete(id: number) {
    return Promise.resolve(this.prismaClient.policy.delete({ where: { id: +id } }))
  }

  async find(
    page: number,
    limit: number,
    { action = '', effect = '', subject }: { action?: string; effect?: string; subject?: string }
  ) {
    const skip = (page - 1) * limit
    const whereCond = {
      ...buildWhereClause({ action, effect }),
      subject: subject
        ? {
            contains: subject
          }
        : {}
    }
    const count = await this.prismaClient.policy.count({
      where: whereCond
    })
    const policies = await this.prismaClient.policy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      where: whereCond,
      include: { permissionPolicies: true, rolePolicies: true }
    })
    return {
      records: policies,
      pagination: {
        total: count,
        current: page,
        size: limit,
        pages: Math.ceil(count / limit)
      }
    }
  }

  findOne(id: number) {
    return this.prismaClient.policy.findUnique({
      where: { id: id },
      include: { permissionPolicies: true, rolePolicies: true }
    })
  }

  update(id: number, data: any) {
    return this.prismaClient.policy.update({
      where: { id: +id },
      data
    })
  }

  updatePermission(id: number, data: UpdatePolicyPermissionDto) {
    const { permissionIds = [] } = data
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      await prisma.permissionPolicy.deleteMany({
        where: { policyId: id }
      })
      const validPermissionIds: number[] = []
      for (const permissionId of permissionIds) {
        const permission = await prisma.permission.findUnique({
          where: { id: permissionId }
        })
        if (permission) {
          validPermissionIds.push(permissionId)
        }
      }
      await prisma.permissionPolicy.createMany({
        data: validPermissionIds.map((permissionId) => ({
          permissionId,
          policyId: id
        }))
      })
      return prisma.policy.findUnique({ where: { id }, include: { permissionPolicies: true } })
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
}

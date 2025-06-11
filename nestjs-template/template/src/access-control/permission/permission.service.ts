import { PRISMA_CONNECTION_NAME, PRISMA_CONNECTIONS } from '@/database/prisma/prisma.constants'
import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from 'prisma/client/mysql'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { CreatePermissionPolicyDto } from './dto/create-permission-policy.dto'

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PRISMA_CONNECTION_NAME) private prismaService: PrismaClient,
    @Inject(PRISMA_CONNECTIONS) private connectionProvider: Record<string, PrismaClient>
  ) {}

  async create(data: CreatePermissionDto) {
    return this.prismaService.$transaction(async (prisma) => {
      const { ...restPermission } = data
      return prisma.permission.create({
        data: {
          ...restPermission
        }
      })
    })
  }

  async createBatch(data: CreatePermissionDto[]) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      return prisma.permission.createMany({
        data
      })
    })
    return result.count > 0
  }

  async createAndPolicy(data: CreatePermissionPolicyDto) {
    return this.prismaService.$transaction(async (prisma) => {
      const { policies = [], ...restPermission } = data
      return prisma.permission.create({
        data: {
          ...restPermission,
          permissionPolicies: {
            create: this._createPolicies(policies)
          }
        }
      })
    })
  }

  async delete(id: number) {
    const result = await this.prismaService.permission.delete({
      where: { id: id },
      include: {
        permissionPolicies: {
          // deleteMany: {}
        }
      }
    })
    return !!result
  }

  async find(page: number, limit: number) {
    const skip = (page - 1) * limit
    const count = await this.prismaService.permission.count({})
    const data = await this.prismaService.permission.findMany({
      skip,
      take: limit
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

  findOne(id: string | number) {
    return this.prismaService.permission.findUnique({
      where: { id: +id },
      include: {
        permissionPolicies: {
          include: {
            policy: true
          }
        }
      }
    })
  }

  findByName(name: string) {
    return this.prismaService.permission.findUnique({
      where: { name },
      include: {
        permissionPolicies: {
          include: {
            policy: true
          }
        }
      }
    })
  }

  update(id: number, data: UpdatePermissionDto) {
    return this.prismaService.$transaction(async (prisma: PrismaClient) => {
      const { policies = [], policyIds = [], ...restData } = data
      console.log('>-----------(permission.service.ts:89) var is restData:', restData)
      await prisma.permissionPolicy.deleteMany({
        where: { permissionId: id }
      })
      const validPolicyIds: number[] = []
      for (const policyId of policyIds) {
        const policy = await prisma.policy.findUnique({
          where: { id: policyId }
        })
        if (policy) {
          validPolicyIds.push(policyId)
        }
      }
      await prisma.permissionPolicy.createMany({
        data: validPolicyIds.map((policyId) => ({
          permissionId: id,
          policyId
        }))
      })
      return prisma.permission.update({
        where: { id: id },
        data: {
          ...restData,
          permissionPolicies: {
            deleteMany: {}, // 删除 permission_policies 中的关联关系
            create: this._createPolicies(policies)
          }
        },
        include: {
          permissionPolicies: {
            include: {
              policy: true
            }
          }
        }
      })
    })
  }

  updatePolicy(id: number, policyIds: number[]) {
    return this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await prisma.permissionPolicy.deleteMany({
        where: { permissionId: id }
      })
      const validIds: number[] = []
      for (const policyId of policyIds) {
        const policy = await prisma.policy.findUnique({
          where: { id: policyId }
        })
        if (policy) {
          validIds.push(policyId)
        }
      }
      await prisma.permissionPolicy.createMany({
        data: validIds.map((policyId) => ({
          permissionId: id,
          policyId
        }))
      })
      return prisma.permission.findUnique({
        where: { id },
        include: {
          permissionPolicies: {
            include: {
              policy: true
            }
          }
        }
      })
    })
  }

  private _createPolicies(policies: any[]) {
    return policies?.map((policy) => {
      let whereCond
      if (policy.id) {
        whereCond = { id: policy.id }
      } else {
        const encode = Buffer.from(JSON.stringify(policy)).toString('base64')
        whereCond = { encode }
        policy.encode = encode
      }
      return {
        policy: {
          connectOrCreate: {
            where: whereCond,
            create: { ...policy }
          }
        }
      }
    })
  }
}

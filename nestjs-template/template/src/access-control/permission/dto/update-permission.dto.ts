import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import type { Policy } from 'prisma/client/mysql'
import { CreatePermissionDto } from './create-permission.dto'

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiPropertyOptional({ description: '策略 id 列表', example: [], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  policyIds?: number[]

  @ApiPropertyOptional({ description: '权限关联的策略' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePolicyDto)
  policies?: Policy[]
}

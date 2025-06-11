import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { Type } from 'class-transformer'
import type { Policy } from 'prisma/client/mysql'
import { CreatePermissionDto } from './create-permission.dto'

export class CreatePermissionPolicyDto extends CreatePermissionDto {
  @ApiProperty({ description: '权限关联的策略' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePolicyDto)
  policies?: Policy[]
}

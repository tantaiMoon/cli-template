import { CreatePolicyDto } from './create-policy.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'
import type { Permission } from 'prisma/client/mysql'

export class CreatePolicyPermissionDto extends CreatePolicyDto {
  @ApiProperty({
    description: '权限 id 列表',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNotEmpty()
  // @IsNumber({}, { each: true })
  // @Transform(({ value }) => value.map(Number))
  permissions: Permission[]
}

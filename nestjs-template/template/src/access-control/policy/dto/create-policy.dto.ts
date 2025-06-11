import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { PermissionPolicy, RolePolicy } from 'prisma-mysql'

type FieldType = string | string[] | Record<string, any>

export class CreatePolicyDto {
  @IsOptional()
  @IsInt()
  id?: number

  @IsNotEmpty()
  @IsNumber()
  type: number

  @IsNotEmpty()
  @IsString()
  @IsIn(['can', 'cannot'])
  effect: 'can' | 'cannot'

  @IsNotEmpty()
  @IsString()
  action: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsOptional()
  fields?: FieldType

  @IsOptional()
  conditions?: FieldType

  @IsOptional()
  args?: FieldType

  @IsOptional()
  rolePolicies?: RolePolicy[]

  @IsOptional()
  permissionPolicies?: PermissionPolicy[]
}

import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePolicyPermissionDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @IsArray()
  permissionIds: number[]
}

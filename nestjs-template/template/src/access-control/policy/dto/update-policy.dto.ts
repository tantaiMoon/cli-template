import { PartialType } from '@nestjs/mapped-types'
import { CreatePolicyDto } from './create-policy.dto'
import { IsOptional } from 'class-validator'

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {
  @IsOptional()
  id: number
}

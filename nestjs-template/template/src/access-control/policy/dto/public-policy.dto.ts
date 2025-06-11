import { CreatePolicyDto } from '@/access-control/policy/dto/create-policy.dto'
import { Exclude } from 'class-transformer'

export class PublicPolicDto extends CreatePolicyDto {
  @Exclude()
  encode: string
}

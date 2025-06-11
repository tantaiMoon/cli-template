import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsNumber } from 'class-validator'

export class UpdateUserRoleDto {
  @ApiProperty({
    description: '角色id',
    type: [Number]
  })
  @IsArray()
  @IsNumber(
    {},
    {
      each: true // 用户角色嵌套数据参数都为 number 类型
    }
  )
  @Transform(({ value }) => {
    return value.map(Number)
  })
  roleIds: number[]
}

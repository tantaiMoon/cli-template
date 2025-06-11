import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateRoleMenuDto {
  @ApiProperty({
    description: '菜单ID列表',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  menuIds: number[]
}

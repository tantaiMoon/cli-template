import {
  Permission,
  PermissionCreate,
  PermissionDelete,
  PermissionRead,
  PermissionUpdate
} from '@/common/decorators/role-permission.decorator'
import { Serialize } from '@/common/decorators/serialze.decorator'
import { AdminGuard } from '@/common/guards/admin.guard'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { PolicyGuard } from '@/common/guards/policy.guard'
import { RolePermissionGuard } from '@/common/guards/role-permission.guard'
import { FieldUniqueValidationPipe } from '@/common/pipes/unique-validation.pipe'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import argon2 from 'argon2'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { PublicUserDto } from './dto/public-user.dto'

@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard, AdminGuard, RolePermissionGuard, PolicyGuard)
@Permission('user')
@UsePipes(FieldUniqueValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CreateUserDto
  })
  @Post()
  @Serialize(PublicUserDto)
  @PermissionCreate()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, ...restData } = createUserDto
    return this.userService.create({
      ...restData,
      password: await argon2.hash(password!)
    })
  }

  @Get()
  @Serialize(PublicUserDto)
  @PermissionRead()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) limit: number,
    @Query('username') username?: string
  ) {
    const skip = (page - 1) * limit
    return this.userService.findAll({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'asc'
      },
      where: username
        ? {
            username: {
              contains: `${username}`
            }
          }
        : {}
    })
  }

  @Get(':id')
  @Serialize(PublicUserDto)
  @PermissionRead()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @Serialize(PublicUserDto)
  @PermissionUpdate()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Put(':id/role')
  @Serialize(PublicUserDto)
  @PermissionUpdate()
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateRole(id, updateUserRoleDto)
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id)
  }
}

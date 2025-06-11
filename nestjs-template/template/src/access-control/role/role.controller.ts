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
  Optional,
  UseGuards,
  Query,
  ParseIntPipe,
  Put,
  UsePipes
} from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleService } from './role.service'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { AdminGuard } from '@/common/guards/admin.guard'
import {
  Permission,
  PermissionCreate,
  PermissionDelete,
  PermissionRead,
  PermissionUpdate
} from '@/common/decorators/role-permission.decorator'
import { Serialize } from '@/common/decorators/serialze.decorator'
import { PublicRoleDto } from './dto/public-role.dto'
import { PublicUpdateRoleDto } from './dto/public-update-role.dto'
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto'
import { UpdateRolePolicyDto } from './dto/update-role-policy.dto'
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto'
import { CreateRoleRelationsDto } from './dto/create-role-relations.dto'

@Controller('role')
@UseGuards(JwtGuard, AdminGuard, RolePermissionGuard, PolicyGuard)
@Permission('role')
@UsePipes(FieldUniqueValidationPipe)
export class RoleController {
  constructor(@Optional() private roleService: RoleService) {}

  @Post()
  @PermissionCreate()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Post('/relation')
  @PermissionCreate()
  createRelation(@Body() createRoleDto: CreateRoleRelationsDto) {
    return this.roleService.createAndRelations(createRoleDto)
  }

  @Get()
  @PermissionRead()
  @Serialize(PublicRoleDto) // 序列化
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10
  ) {
    return this.roleService.find(page, size)
  }

  @Get(':id')
  @PermissionRead()
  @Serialize(PublicRoleDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id)
  }

  @Patch(':id')
  @PermissionUpdate()
  @Serialize(PublicUpdateRoleDto)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @Put(':id/menu')
  @PermissionUpdate()
  @Serialize(PublicUpdateRoleDto)
  updateRoleMenu(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleMenuDto) {
    return this.roleService.updateRoleMenus(id, updateRoleDto)
  }

  @Put(':id/policy')
  @PermissionUpdate()
  @Serialize(PublicUpdateRoleDto)
  updateRolePolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRolePolicyDto
  ) {
    return this.roleService.updateRolePolicy(id, updateRoleDto)
  }

  @Put(':id/permission')
  @PermissionUpdate()
  @Serialize(PublicUpdateRoleDto)
  async updateRolePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRolePermissionDto
  ) {
    const result = await this.roleService.updateRolePermissions(id, updateRoleDto)
    return result.count
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id)
  }
}

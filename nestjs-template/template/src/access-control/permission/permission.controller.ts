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
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PermissionService } from './permission.service'
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
import { CreatePermissionPolicyDto } from './dto/create-permission-policy.dto'
import { PublicUpdatePermissionDto } from './dto/public-update-permission.dto'

@Controller('permission')
@UseGuards(JwtGuard, AdminGuard, RolePermissionGuard, PolicyGuard) // Jwt 鉴权
@Permission('permission') // Policy 策略鉴权
@UsePipes(FieldUniqueValidationPipe)
export class PermissionController {
  constructor(@Optional() private permissionService: PermissionService) {}

  @Post()
  @PermissionCreate()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto)
  }

  @Post('batch')
  @PermissionCreate()
  createBatch(@Body() createPermissionDto: CreatePermissionDto[]) {
    return this.permissionService.createBatch(createPermissionDto)
  }

  @Post('policy')
  @PermissionCreate()
  createAndPolicy(@Body() createPermissionDto: CreatePermissionPolicyDto) {
    return this.permissionService.createAndPolicy(createPermissionDto)
  }

  @Get()
  @PermissionRead()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10
  ) {
    return this.permissionService.find(page, size)
  }

  @Get(':id')
  @PermissionRead()
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id)
  }

  @Patch(':id')
  @PermissionUpdate()
  @Serialize(PublicUpdatePermissionDto)
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto)
  }

  @Put(':id/policy')
  @PermissionUpdate()
  @Serialize(PublicUpdatePermissionDto)
  updatePolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionService.updatePolicy(id, updatePermissionDto.policyIds!)
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id)
  }
}

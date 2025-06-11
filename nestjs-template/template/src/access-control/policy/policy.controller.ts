import { AdminGuard } from '@/common/guards/admin.guard'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { PolicyGuard } from '@/common/guards/policy.guard'
import { RolePermissionGuard } from '@/common/guards/role-permission.guard'
import { FieldUniqueValidationPipe } from '@/common/pipes/unique-validation.pipe'
import { CreatePolicyPermissionDto } from './dto/create-policy-permission.dto'
import { UpdatePolicyPermissionDto } from './dto/update-policy-permission.dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Optional,
  Put,
  UsePipes,
  UseGuards
} from '@nestjs/common'
import { CreatePolicyDto } from './dto/create-policy.dto'
import { UpdatePolicyDto } from './dto/update-policy.dto'
import { PolicyService } from 'src/access-control/policy/policy.service'
import { PublicPolicDto } from './dto/public-policy.dto'
import { Serialize } from '@/common/decorators/serialze.decorator'
import {
  Permission,
  PermissionCreate,
  PermissionDelete,
  PermissionRead,
  PermissionUpdate
} from '@/common/decorators/role-permission.decorator'

@Controller('policy')
@UseGuards(JwtGuard, AdminGuard, RolePermissionGuard, PolicyGuard)
@UsePipes(FieldUniqueValidationPipe)
@Permission('policy')
export class PolicyController {
  constructor(@Optional() private readonly policyService: PolicyService) {}

  @Post()
  @PermissionCreate()
  create(@Body() createPolicyDto: CreatePolicyDto) {
    console.log('>-----------(policy.controller.ts:22) var is createPolicyDto:', createPolicyDto)
    return this.policyService.create(createPolicyDto)
  }

  @Post('batch')
  @PermissionCreate()
  createBatch(@Body() createPolicyDto: CreatePolicyDto[]) {
    return this.policyService.createBatch(createPolicyDto)
  }

  @Post('permission')
  @PermissionCreate()
  createAndPermission(@Body() createPolicyDto: CreatePolicyPermissionDto) {
    console.log('>-----------(policy.controller.ts:22) var is createPolicyDto:', createPolicyDto)
    return this.policyService.createAndPermission(createPolicyDto)
  }

  @Get()
  @Serialize(PublicPolicDto)
  @PermissionRead()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
    @Query('action') action: string,
    @Query('effect') effect: string,
    @Query('subject') subject: string
  ) {
    return this.policyService.find(page, size, {
      action,
      effect,
      subject
    })
  }

  @Get(':id')
  @Serialize(PublicPolicDto)
  @PermissionRead()
  findOne(@Param('id') id: number) {
    return this.policyService.findOne(id)
  }

  @Patch(':id')
  @PermissionUpdate()
  update(@Param('id') id: number, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policyService.update(id, updatePolicyDto)
  }

  @Put(':id/permission')
  @PermissionUpdate()
  updatePermission(@Param('id') id: number, @Body() updatePolicyDto: UpdatePolicyPermissionDto) {
    return this.policyService.updatePermission(id, updatePolicyDto)
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id') id: number) {
    return this.policyService.delete(id)
  }
}

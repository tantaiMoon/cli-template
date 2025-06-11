import {
  Permission,
  PermissionCreate,
  PermissionDelete,
  PermissionRead,
  PermissionUpdate
} from '@/common/decorators/role-permission.decorator'
import { AdminGuard } from '@/common/guards/admin.guard'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { PolicyGuard } from '@/common/guards/policy.guard'
import { RolePermissionGuard } from '@/common/guards/role-permission.guard'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UsePipes
} from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { MenuService } from 'src/access-control/menu/menu.service'
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe'
import { FieldUniqueValidationPipe } from '@/common/pipes/unique-validation.pipe'

@Controller('menu')
@UseGuards(JwtGuard, AdminGuard, RolePermissionGuard, PolicyGuard)
@Permission('menu')
@UsePipes(FieldUniqueValidationPipe)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @PermissionCreate()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }

  @Post('relation')
  @PermissionCreate()
  createRelation(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createRelation(createMenuDto)
  }

  @Get()
  @PermissionRead()
  findAll(
    @Query('page', new CustomParseIntPipe({ defaultValue: 1 })) page: number,
    @Query('size', new CustomParseIntPipe({ defaultValue: 10 })) size: number,
    @Query('args') args: any = '{}'
  ) {
    let parseArg
    // eslint-disable-next-line no-useless-catch
    try {
      parseArg = JSON.parse(args)
    } catch (e) {
      throw e
    }
    return this.menuService.find(page, size, parseArg)
  }

  @Get('/tree')
  @PermissionRead()
  findTree(
    @Query('page', new CustomParseIntPipe({ defaultValue: 1 })) page: number,
    @Query('size', new CustomParseIntPipe({ defaultValue: 10 })) size: number
  ) {
    return this.menuService.findTree(page, size)
  }

  @Get(':id')
  @PermissionRead()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id)
  }

  @Patch(':id')
  @PermissionUpdate()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto)
  }

  @Delete(':id')
  @PermissionDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id)
  }
}

import { Module } from '@nestjs/common'
import { MenuController } from './menu.controller'
import { MenuService } from '../menu/menu.service'

@Module({
  imports: [],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {}

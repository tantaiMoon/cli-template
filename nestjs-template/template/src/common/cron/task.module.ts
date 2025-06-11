import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TaskService } from '@/common/cron/task.service'
import { CronProviders } from './'

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService, ...CronProviders],
  exports: [TaskService, ...CronProviders]
})
export class TaskModule {}

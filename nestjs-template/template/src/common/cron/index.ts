import { Provider } from '@nestjs/common'
import { LogDbCronService } from './tasks/log-db-cron.service'

// export const CronProviders: Provider[] = []
export const CronProviders: Provider[] = [LogDbCronService]

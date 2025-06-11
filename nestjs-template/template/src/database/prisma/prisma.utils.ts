import { Logger } from '@nestjs/common'
import { catchError, retry, throwError, timer } from 'rxjs'

export const protocal_reg = /^(.*?):\/\//

export function getDbType(url: string) {
  const match = url.match(protocal_reg)
  if (match) {
    return match[1]
  }
  return 'sqlite'
}

export function handleRetry(retryAttempts: number, retryDelay: number) {
  const logger = new Logger('PrismaModule')
  return (source: any) =>
    source.pipe(
      retry({
        count: retryAttempts < 0 ? Infinity : retryAttempts,
        delay: (err, count) => {
          const attmpts = retryAttempts < 0 ? Infinity : retryAttempts
          if (count <= attmpts) {
            logger.error(`Unable to connect to the database. Retrying... (${count})`)
            return timer(retryDelay)
          } else {
            return throwError('Reached max retry attempts')
          }
        }
      }),
      catchError((err) => {
        logger.error(
          `Failed to connect to the database. after ${retryAttempts} retries`,
          err.stack || err
        )
        return throwError(() => err)
      })
    )
}

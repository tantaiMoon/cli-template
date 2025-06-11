import DailyRotateFile from 'winston-daily-rotate-file'
import * as winston from 'winston'
import { utilities } from 'nest-winston'

export function createDailyRotateTransport(level: string, fileName: string) {
  return new DailyRotateFile({
    level: level,
    filename: `logs/${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    dirname: `logs`,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
      // utilities.format.nestLike('Moyi-be Winston', { prettyPrint: true })
    )
  })
}

export const consoleTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('Moyi-be Winston Log', { prettyPrint: true })
  )
})

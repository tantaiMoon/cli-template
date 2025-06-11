import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

// 周期性任务： 每天、每小时、每周
// 简单任务，不需要持久化 系统状态 接状态
// 轻量级的任务 （反例： 大量高并发 task queue 实现）
@Injectable()
export class TaskService {
  logger = new Logger(TaskService.name)

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // 添加定时任务
  addCronJob(name: string, cronTime: string, cb: () => void): void {
    const job = new CronJob(cronTime, cb)
    this.schedulerRegistry.addCronJob(name, job)
    job.start()
    this.logger.log(`Job ${name} add and started`)
  }

  // 删除定时任务
  deleteCronJob(name: string): void {
    this.schedulerRegistry.deleteCronJob(name)
    this.logger.warn(`Job ${name} removed`)
  }

  // 获取所有定时任务状态
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs()
    const jobsList = []
    jobs.forEach((value, key, map) => {
      jobsList.push({
        name: key,
        next: value.nextDate().toJSDate(),
        code: value.running ? 0 : 1
      })
      this.logger.log(`Job ${key} -> next: ${value.nextDate().toJSDate()}`)
    })
    return jobsList
  }

  addInterval(name: string, ms: number): void {
    const cb = () => {
      this.logger.log(`Job ${name} add interval`)
    }
    const interval = setInterval(cb, ms)
    this.schedulerRegistry.addInterval(name, interval)
    this.logger.log(`Interval ${name} add`)
  }

  deleteInterval(name: string): void {
    this.schedulerRegistry.deleteInterval(name)
    this.logger.warn(`Interval ${name} removed`)
  }

  getIntervals() {
    const jobs = this.schedulerRegistry.getIntervals()
    const jobsList = []
    jobs.forEach((value, key, map) => {
      jobsList.push(value)
      this.logger.log(`interval ${value} `)
    })
    return jobsList
  }

  addTimeout(name: string, ms: number): void {
    const cb = () => {
      this.logger.log(`Job ${name} add timeout`)
    }
    const timeout = setTimeout(cb, ms)
    this.schedulerRegistry.addTimeout(name, timeout)
    this.logger.log(`timeout ${name} add`)
  }

  deleteTimeout(name: string): void {
    this.schedulerRegistry.deleteTimeout(name)
    this.logger.warn(`Job timeout ${name} removed`)
  }

  getTimeouts() {
    const jobs = this.schedulerRegistry.getTimeouts()
    const jobsList = []
    jobs.forEach((value, key, map) => {
      jobsList.push(value)
      this.logger.log(`timeout ${value} `)
    })
    return jobsList
  }
}

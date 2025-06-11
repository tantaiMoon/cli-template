import { Inject, Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SSHService } from '@/utils/ssh/ssh.service'

@Injectable()
export class LogDbCronService {
  constructor(@Inject('ubuntu:SSH') private readonly sshService: SSHService) {}

  // 每秒执行
  @Cron('* * * * 1 *', { name: 'logdb_cron' })
  async handleCron() {
    const containerName = 'cdfdca944eeb'
    const uri = 'mongodb://root:backend-logs@localhost:27018/backend-logs'
    const collectionMame = 'log'
    const now = new Date()
    const outputPath = `/tmp/logs-${now.getTime()}`
    const hostBackupPath = '/srv/logs'
    const cmd = `docker exec -i ${containerName} mongodump --uri=${uri} --collection=${collectionMame} --out=${outputPath}`
    const cpCmd = `docker cp ${containerName}:${outputPath} ${hostBackupPath}`
    const res = await this.sshService.exec(`${cmd} && ${cpCmd}`).catch((err) => err)
    console.log('>-----------(task.service.ts:27) var is res:', res)
    const res1 = await this.sshService.exec(`ls -la ${hostBackupPath}`)
    console.log('>-----------(task.service.ts:29) var is res1:', res1)
    // -mmin +1 一分钟之前的文件
    // -mtime +7 7天之前的文件
    const delCmd = `find ${hostBackupPath} -type d -mtime +7 -exec rm -rf {} \\;`
    await this.sshService.exec(delCmd)
    const res2 = await this.sshService.exec(`ls -la ${hostBackupPath}`)
    console.log('>-----------(task.service.ts:29) var is res2:', res2)
  }
}

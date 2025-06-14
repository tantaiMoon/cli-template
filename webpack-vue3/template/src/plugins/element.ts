import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { App } from 'vue'

export default (app: App) => {
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$prompt = ElMessageBox.prompt
}

export type Size = 'large' | 'default' | 'small'

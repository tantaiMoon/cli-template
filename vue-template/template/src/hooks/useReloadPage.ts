import { getCurrentInstance } from 'vue'

export const useReloadPage = () => {
  const { proxy } = getCurrentInstance()!
  const reloadPage = async ({ title = '是否刷新', message = '确定' } = {}) => {
    try {
      await proxy?.$confirm(title, message)
      window.location.reload()
    } catch {
      proxy?.$message.warning('')
    }
  }
  return { reloadPage }
}

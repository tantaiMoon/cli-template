export const useeGlobalStore = defineStore('global', () => {
  const systemInfo = reactive<{
    isLogin: boolean
    user: UserProps | null
  }>({
    isLogin: false,
    user: null
  })

  return {
    systemInfo
  }
})

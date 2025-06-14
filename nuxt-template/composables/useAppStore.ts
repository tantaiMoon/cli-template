export const useAppStore = defineStore(
  'store',
  () => {
    const state = reactive({
      token: ''
    })

    const token = computed(() => state.token)

    return {
      token,
      state
    }
  },
  {
    presist: {
      storage: import.meta.client ? localStorage : null,
      pick: ['state.token']
    }
  }
)

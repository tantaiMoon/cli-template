import { createDiscreteApi } from 'naive-ui'
import type { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'

export default defineNuxtPlugin((nuxtApp) => {
  const bar = ref<LoadingBarInst | null>(null)
  nuxtApp.hook('app:mounted', () => {
    if (!bar.value) {
      const { loadingBar } = createDiscreteApi(['loadingBar'])
      bar.value = loadingBar
    }
  })
  nuxtApp.hook('app:error', () => {
    if (import.meta.client) {
      setTimeout(() => {
        bar.value?.finish()
      }, 150)
    }
  })
  nuxtApp.hook('page:start', () => {
    bar.value?.start()
  })
  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      bar.value?.finish()
    }, 150)
  })
})

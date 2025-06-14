import { computed, watchEffect } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { generateColors, setColors } from '@/utils/color'

export const useGenerateTheme = () => {
  // 1. 监控主题变化，更新到 store
  // 2. 生成更新的主题

  const store = useSettingStore()

  const theme = computed(() => store.settings.theme)
  const originalTheme = computed(() => store.settings.originalTheme)

  watchEffect(() => {
    if (theme.value !== originalTheme.value) {
      const colors = {
        primary: theme.value,
        ...generateColors(theme.value)
      }
      setColors(colors)
      store.changeSetting({ key: 'originalTheme', value: theme.value })
    }
  })
}

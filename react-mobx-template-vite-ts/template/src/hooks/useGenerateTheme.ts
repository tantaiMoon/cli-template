import { runInAction } from 'mobx'
import { useEffect } from 'react'
import { useStores } from '@/hooks/useAppStore.ts'
import { generateColors, setColors } from '@/utils/colors.ts'

export const useGenerateTheme = () => {
  const { globalStore } = useStores()
  const theme = globalStore.theme
  const originalTheme = globalStore.originalTheme
  useEffect(() => {
    runInAction(() => {
      if (theme !== originalTheme) {
        const colors = {
          primary: theme,
          ...generateColors(theme)
        }
        setColors(colors)
        globalStore.setOriginalTheme(theme)
      }
    })
  }, [globalStore, originalTheme, theme])
}

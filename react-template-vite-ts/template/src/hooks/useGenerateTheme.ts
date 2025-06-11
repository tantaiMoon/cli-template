import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore.ts'
import { generateColors, setColors } from '@/utils/colors.ts'
import { setOriginalTheme } from '@/stores/system.ts'

export const useGenerateTheme = () => {
  const dispath = useAppDispatch()
  const theme = useAppSelector((state) => state.system.theme)
  const originalTheme = useAppSelector((state) => state.system.originalTheme)
  useEffect(() => {
    if (theme !== originalTheme) {
      const colors = {
        primary: theme,
        ...generateColors(theme)
      }
      setColors(colors)
      dispath(setOriginalTheme(theme))
    }
  }, [originalTheme, theme])
}

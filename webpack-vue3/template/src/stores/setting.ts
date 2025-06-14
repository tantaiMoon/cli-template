import { defineStore } from 'pinia'
import { reactive } from 'vue'
import variables from '@/styles/variables.module.scss'

console.log(variables)
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    // variables
    // current color
    // select color
    const settings = reactive({
      theme: variables.theme,
      originalTheme: '',
      showTagsView: true,
      sidebarLogo: true
    })
    type IsSetting = typeof settings
    const changeSetting = <T extends keyof IsSetting>({
      key,
      value
    }: {
      key: T
      value: IsSetting[T]
    }) => {
      settings[key] = value
    }
    return {
      changeSetting,
      settings
    }
  },
  {
    persist: {
      storage: window.localStorage,
      pick: ['settings.theme', 'settings.showTagsView', 'settings.sidebarLogo']
    }
  }
)

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting'
import ThemePicker from '@/components/ThemePicker/index.vue'

const store = useSettingStore()
const isShow = computed(() => store.settings.showTagsView)
const sidebarLogo = computed(() => store.settings.sidebarLogo)
const tagsView = computed({
  get: () => isShow.value,
  set: (val: boolean) => {
    store.changeSetting({ key: 'showTagsView', value: val })
  }
})
const isShowLogo = computed({
  get: () => sidebarLogo.value,
  set: (val: boolean) => {
    store.changeSetting({ key: 'sidebarLogo', value: val })
  }
})
</script>

<template>
  <div class="drawer-item">
    <span mr-5px>主题色</span>
    <ThemePicker></ThemePicker>
  </div>
  <div class="drawer-item">
    <span mr-5px>展示TagsView</span>
    <el-switch v-model="tagsView"></el-switch>
  </div>
  <div class="drawer-item">
    <span mr-5px>是否展示logo</span>
    <el-switch v-model="isShowLogo"></el-switch>
  </div>
</template>

<style scoped lang="scss"></style>

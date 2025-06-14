<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingStore } from '@/stores/setting.ts'
import variables from '@/styles/variables.module.scss'

const store = useSettingStore()
const showTagsView = computed(() => store.settings.showTagsView)

const outerheight = computed(() => {
  return (
    (showTagsView.value
      ? parseInt(variables.navbarHeight, 10) + parseInt(variables.tagsViewheight)
      : parseInt(variables.navbarHeight)) + 'px'
  )
})
const settingVisible = ref(false)

const showSetting = (isShow: boolean) => {
  settingVisible.value = isShow
}
</script>

<template>
  <el-container class="app-wrap">
    <div class="sidebar-container">
      <Sidebar></Sidebar>
    </div>
    <el-container class="app-main">
      <el-header class="header">
        <Navbar @show-setting="showSetting"></Navbar>
        <TagsView class="tags-view" v-if="showTagsView"></TagsView>
      </el-header>
      <el-main class="main-content">
        <AppMain />
      </el-main>
    </el-container>
    <!--    抽屉-->

    <RightPanelDrawer v-model="settingVisible" title="设置主题色">
      <Settings />
    </RightPanelDrawer>
  </el-container>
</template>

<style scoped lang="scss">
.app-wrap {
  //  添加 unocss 样式
  @apply overflow-hidden p0 m0 h-full w-full;

  .sidebar-container {
    //@apply h-full;
    :deep(.sidebar-container-menu:not(.el-menu--collapse)) {
      @apply w-[var(--sidebar-width)];
    }
  }

  .main-content {
    @apply overflow-x-hidden bg-gray;
    min-height: calc(100vh - v-bind(outerheight));
  }

  .header {
    @apply p0;
    height: calc(v-bind(outerheight));

    .tags-view {
      @apply h-[var(--tags-view-height)];
    }
  }

  .app-main {
    @apply overflow-hidden p0;
  }
}
</style>

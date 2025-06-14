<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSettingStore } from '@/stores/setting'
import variables from '@/styles/variables.module.scss'
import Sidebar from './components/Sidebar/index.vue'
import TagsView from './components/TagsView/index.vue'
import Settings from './components/Settings/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import RightPanelDrawer from './components/RightPanelDrawer.vue'

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
        <div class="router-content">
          <AppMain />
        </div>
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
  overflow: hidden;
  display: flex;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  //  添加 unocss 样式

  .sidebar-container {
    //@apply h-full;
    :deep(.sidebar-container-menu:not(.el-menu--collapse)) {
      width: var(--sidebar-width);
    }
  }

  .main-content {
    --el-main-padding: 10px;
    min-height: calc(100vh - v-bind(outerheight));
    //background: #fff;

    .router-content {
      padding: 10px;
      width: 100%;
      height: 100%;
      background: #eaf0fb;
      border-radius: 4px;
    }
  }

  .header {
    padding: 0;
    height: calc(v-bind(outerheight));

    .tags-view {
      height: var(--tags-view-height);
    }
  }

  .app-main {
    padding: 0;
    overflow: hidden;
  }
}
</style>

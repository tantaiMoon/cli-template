<script setup lang="ts">
import { useGlobalStore } from '@/stores/global'
import { onMounted, watch, ref, computed } from 'vue'
import path from 'path-browserify'
import { RouteLocationNormalizedGeneric, RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/routes'
import { useSettingStore } from '@/stores/setting'
import SvgIcon from '@/components/SvgIcon/index.vue'

const enum CommandType {
  All = 'all',
  Other = 'other',
  Self = 'self',
  Refresh = 'refresh'
}

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()
const settingStore = useSettingStore()
const { delAllViews, delOtherViews, delView, addView, delCacheView } = store
const theme = computed(() => settingStore.settings.theme)

const dropdownRef = ref()
const handleChange = (visible: boolean, path: string) => {
  if (!visible) return
  dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
    if (item.id === path) return
    item.handleClose()
  })
}

const isActive = (to: RouteLocationNormalizedGeneric) => to.path === route.path
const addTags = () => {
  if (route.name) {
    store.addView(route)
  }
}

const toLastView = () => {
  const lastView = store.tagsView[store.tagsView.length - 1]
  if (lastView) {
    router.push(lastView.path)
  } else {
    router.push('/')
  }
}
const closeSelectedTag = (tag: RouteLocationNormalizedGeneric) => {
  delView(tag)
  if (isActive(tag)) {
    toLastView()
  }
}

function isAffix(tag: RouteLocationNormalizedGeneric) {
  return !tag.meta?.affix
}

function filterAffix(routes: RouteRecordRaw[], basePath = '/') {
  const tags = [] as RouteLocationNormalizedGeneric[]

  for (let item of routes) {
    if (item.meta?.affix) {
      tags.push({
        ...item,
        path: path.posix.resolve(basePath, item.path),
        title: item.meta?.title ?? ''
      } as never)
    }
    if (item.children) {
      tags.push(...filterAffix(item.children, item.path))
    }
  }
  return tags
}

const handleCommand = (command: CommandType, tag: RouteLocationNormalizedGeneric) => {
  switch (command) {
    case CommandType.All:
      delAllViews()
      toLastView()
      break
    case CommandType.Other:
      delOtherViews(tag!)
      if (!isActive(tag!)) {
        router.push(tag!.path)
      }
      break
    case CommandType.Refresh:
      delCacheView(tag)
      router.push('/redirect' + tag.path)
      break
    case CommandType.Self:
      closeSelectedTag(tag!)
      break
  }
}

const initTags = () => {
  const filterAffixTags = filterAffix(routes)
  filterAffixTags.forEach((tag) => {
    addView(tag)
  })
  addTags()
}

watch(
  () => route.path,
  () => {
    addTags()
  }
)
// 初始化需要固定的
onMounted(() => {
  initTags()
})
</script>

<template>
  <el-scrollbar>
    <div class="tags-view-container">
      <RouterLink
        class="tags-view-item"
        v-for="tag in store.tagsView"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        :class="{ active: isActive(tag) }"
        :style="{
          backgroundColor: isActive(tag) ? theme : ''
        }"
      >
        <el-dropdown
          trigger="contextmenu"
          :id="tag.path"
          :path="tag.path"
          @visible-change="handleChange($event, tag.path)"
          ref="dropdownRef"
          @command="(command: any) => handleCommand(command, tag)"
        >
          <span>{{ (tag as any).title }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">关闭所有</el-dropdown-item>
              <el-dropdown-item command="other">关闭其他</el-dropdown-item>
              <el-dropdown-item command="self" v-if="!tag.meta?.affix">关闭</el-dropdown-item>
              <el-dropdown-item command="refresh">刷新</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <SvgIcon
          v-if="isAffix(tag)"
          icon-name="ant-design:close-outlined"
          style="margin-left: 5px; width: 12px; height: 12px"
          ml-5px
          text-12px
          @click.prevent="closeSelectedTag(tag)"
        ></SvgIcon>
      </RouterLink>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.tags-view {
  width: 100%;
  padding: 0 3px;
}

.tags-view-container {
  display: flex;
  padding-top: 3px;
  //box-shadow: ;
  @apply flex pt3px shadow-sm shadow-gray-300
  height: var(--tags-view-height);
}

.tags-view-item {
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 28px;
  margin: 0 3px;
  padding: 0 5px;
  border-radius: 4px;
  color: rgba(128, 128, 128, 0.6);
  border: 1px solid rgba(128, 128, 128, 0.6);

  &.active {
    color: #fff;
    border: none;

    --el-text-color-regular: #fff;

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #fff;
      margin-right: 3px;
      border-radius: 8px;
    }
  }
}
</style>

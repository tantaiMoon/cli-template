<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting.ts'

const { collapse = true } = defineProps<{
  collapse: boolean
}>()
const settingStore = useSettingStore()
const theme = computed(() => settingStore.settings.theme)
</script>

<template>
  <div class="sidebar-logo" :class="{ collapse }">
    <transition name="logo-fade">
      <RouterLink to="/" :key="collapse ? 'aaa' : 'bbb'" flex items-center h-full>
        <img src="@/assets/logo.png" alt="" class="sidebar-logo-img" fill="covert" />
        <h1 v-if="!collapse" class="sidebar-logo-title">Vue Admin</h1>
      </RouterLink>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.sidebar-logo {
  // text-[v-bind(theme)]
  @apply pl-10px h-[var(--navbar-height)] w-full bg-[var(--menu-bg)];

  &-img {
    @apply mr-5px align-middle;
    height: calc(var(--navbar-height) / 1.5);
    width: calc(var(--navbar-height) / 1.5);
  }

  &-title {
    @apply inline-block m0 text-white;
  }
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  @apply transition-opacity duration-150;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  @apply opacity-0;
}
</style>

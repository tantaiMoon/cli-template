<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { isExternal } from '@/utils/validate'

const { iconName, customClass } = defineProps<{
  iconName: string
  customClass?: string
}>()

// 是否外链图标
const isExt = computed(() => isExternal(iconName))
// 组合图标类名
const svgClass = computed(() => (customClass ? `icon ${customClass}` : 'icon'))
// svg 图标以 mask 方式渲染，兼容性较差
const styleExternalIcon = computed(() => ({
  mask: `url(#${iconName}) no-repeat 50% 50%`,
  '-webkit-mask': `url(#${iconName}) no-repeat 50% 50%`,
  'mask-size': 'cover'
}))
</script>

<template>
  <IconifyIcon :icon="iconName" :class="svgClass" v-if="!isExt"></IconifyIcon>
  <template v-else>
    <!--    $attrs 将所有属性（props）绑定到元素上-->
    <div :style="styleExternalIcon" :class="svgClass" bg-current v-bind="$attrs"></div>
  </template>
</template>

<style scoped lang="scss"></style>

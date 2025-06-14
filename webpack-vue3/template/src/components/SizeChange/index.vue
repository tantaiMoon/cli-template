<script setup lang="ts">
import { ref } from 'vue'
import { Size } from '@/plugins/element'
import { useGlobalStore } from '@/stores/global'
import SvgIcon from '@/components/SvgIcon/index.vue'

const { sidebar, setSize } = useGlobalStore()
const sizeOptions = ref([
  {
    label: 'Default',
    value: 'default'
  },
  {
    label: 'Small',
    value: 'small'
  },
  {
    label: 'Large',
    value: 'large'
  }
])
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <svg-icon
        icon-name="ant-design:font-size-outlined"
        style="width: 1.5em; height: 1.5em"
        class="w1.5em h1.5em"
      ></svg-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          @click="() => setSize(item.value as Size)"
          v-for="item in sizeOptions"
          :key="item.value"
          :disabled="item.value === sidebar.size"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>

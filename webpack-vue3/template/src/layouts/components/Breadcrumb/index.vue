<script setup lang="ts">
import { RouteLocationMatched, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { compile } from 'path-to-regexp'

const route = useRoute()
const router = useRouter()
type PartialRouteLocationMatched = Partial<RouteLocationMatched>

// route.matched
const routeList = ref<PartialRouteLocationMatched[]>([])

const getBreadcrumb = () => {
  let matched = route.matched.filter((match) => match.meta.title) as PartialRouteLocationMatched[]
  // homepage
  if (matched[0]?.path !== '/dashboard') {
    matched = [
      {
        path: '/dashboard',
        meta: {
          title: 'Dashboard'
        }
      },
      ...matched
    ]
  }
  routeList.value = matched.filter((match) => match.meta?.breadcrumb !== false)
}

const compilePath = (path: string) => {
  const params = route.params
  return compile(path)(params)
}
const handleLink = (item: PartialRouteLocationMatched) => {
  const { path, redirect } = item
  if (redirect) {
    return router.push(redirect as string)
  }
  router.push(compilePath(path!))
}

watch(() => route.path, getBreadcrumb, { immediate: true })
</script>

<template>
  <el-breadcrumb class="breadcrumb" separator="/" leading-50px text-lg ml-10px inline-block>
    <el-breadcrumb-item v-for="(item, i) in routeList" :key="i" :to="{ path: item.path }">
      <span v-if="routeList.length - 1 === i">{{ item.meta?.title }}</span>
      <a v-else @click="handleLink(item)">{{ item.meta?.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.breadcrumb {
  display: inline-block;
  margin-left: 10px;
}
</style>

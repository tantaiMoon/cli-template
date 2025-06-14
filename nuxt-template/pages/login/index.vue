<script setup lang="ts">
definePageMeta({
  layout: 'no-aside',
  title: 'Login',
  // 配置页面路径和别名
  path: '/login',
  // 别名 alias
  alias: '/login',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
    // 页面过渡钩子函数
    onBeforeEnter: (el) => {
      console.log('>----🚀 index.vue ~ line: 14 ~ var: onBeforeEnter -----> :', el)
    },
    onAfterEnter: (el) => {
      console.log('>----🚀 index.vue ~ line: 14 ~ var: onAfterEnter -----> :', el)
    },
    onEnter: (el, done) => {
      console.log('>----🚀 index.vue ~ line: 14 ~ var: onEnter -----> :', el, done)
    }
  },
  // 过渡中间件
  middleware: (to) => {
    if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') {
      // 设置页面过渡名称
      to.meta.pageTransition.name = 'slide-right'
    }
  }
})
useHead({
  title: 'Login',
  meta: [
    {
      name: 'description',
      content: 'Nuxt CMS'
    }
  ]
})
console.log('page rendering')
const siteData = await $fetch('/api/site', {
  method: 'GET'
})
console.log('>----🚀 index.vue ~ line: 44 ~ var: site -----> :', siteData)
const { data } = await useAsyncData('site', () => $fetch('/api/site'))

console.log(data.value)
const getCaptcha = () => {
}

onMounted(() => {
  const route = useRoute()
  console.log('>----🚀 index.vue ~ line: 49 ~ var: route -----> :', route)
})
</script>

<template>
  <div w-600px h-500px shadow-blueGray shadow-sm text-center m-auto p-20px>
    <h3 f-center justify-center>
      <img src="~/public/logo.png" alt="" inline-block w-50px h50px mr-10px />
      Nuxt Amind
    </h3>
    <n-form>
      <n-form-item>
        <NInput placeholder="用户名" maxlength="30" />
      </n-form-item>
      <NFormItem>
        <NInput placeholder="密码" type="password" show-password maxlength="20" />
      </NFormItem>
      <NFormItem>
        <NInput placeholder="验证码" maxlength="4">
          <template #append>
            <img src="" alt="captcha" cursor-pointer @click="getCaptcha" />
          </template>
        </NInput>
      </NFormItem>
      <NFormItem>
        <NButton type="primary" w-full>Login</NButton>
      </NFormItem>
    </n-form>
  </div>
</template>

<style>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>
<style scoped></style>

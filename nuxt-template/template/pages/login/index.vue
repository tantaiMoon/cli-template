<script setup lang="ts">
import { userLoginSchema } from '~/validators/user'
import type { FormInst, FormItemRule } from 'naive-ui'

definePageMeta({
  layout: 'custom',
  title: 'Login',
  // 配置页面路径和别名
  path: '/login',
  // 别名 alias
  alias: '/login',
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
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
      content: 'Nuxt'
    }
  ]
})

const { setUser } = useSystemUser()
const formRef = ref<FormInst>()
const captcha = ref()
const formState = reactive({
  username: '',
  password: ''
})

// 将Zod规则转换为naive-ui的表单规则
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    validator: (rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const result = userLoginSchema.shape.username.safeParse(value)
        if (!result.success) {
          reject(new Error(result.error.errors[0].message))
        } else {
          resolve()
        }
      })
    }
  },
  password: {
    required: true,
    trigger: 'blur',
    validator: (rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const result = userLoginSchema.shape.password.safeParse(value)
        if (!result.success) {
          reject(new Error(result.error.errors[0].message))
        } else {
          resolve()
        }
      })
    }
  }
}

const toLogin = async (e: MouseEvent) => {
  e.preventDefault()
  try {
    // 先进行表单验证
    await formRef.value?.validate()

    // 验证通过后，再进行业务逻辑
    const { data } = await useFetch('/api/auth/login', {
      body: {
        username: formState.username,
        password: formState.password
      },
      method: 'POST'
    })
    if (!data.value) {
      return
    }

    setUser({
      ...data.value.user,
      isLogin: true
    })
    navigateTo('/')
    setToken(data.value.token)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
const getCaptcha = async () => {}
</script>

<template>
  <div w-600px h-500px shadow-blueGray shadow-sm text-center m-auto p-20px>
    <h3 f-center justify-center>
      <img src="~/public/logo.png" alt="" inline-block w-50px h50px mr-10px />
      Nuxt Amind
    </h3>
    <n-form ref="formRef" :model="formState" :rules="rules" class="text-left">
      <n-form-item path="username" label="用户名">
        <NInput v-model:value="formState.username" placeholder="用户名" maxlength="20" />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <NInput
          v-model:value="formState.password"
          placeholder="密码"
          type="password"
          show-password
          maxlength="20"
        />
      </n-form-item>
      <NFormItem>
        <NInput placeholder="验证码" maxlength="4">
          <template #suffix>
            <img :src="captcha" alt="captcha" cursor-pointer @click="getCaptcha" />
          </template>
        </NInput>
      </NFormItem>
      <div class="flex w-full items-center justify-between text-sm text-gray-500">
        No account
        <NuxtLink class="underline" to="/signup">Sign up</NuxtLink>
      </div>
      <NFormItem>
        <NButton type="primary" w-full @click="toLogin">Login</NButton>
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

<script setup lang="ts">
import type { FormInst, FormItemRule } from 'naive-ui'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { userSignupSchema } from '~/validators/user'

definePageMeta({
  layout: 'custom',
  title: 'Signup'
})
useHead({
  title: 'Signup',
  meta: [
    {
      name: 'description',
      content: 'Signup'
    }
  ]
})

const formRef = ref<FormInst>()
const formState = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 将Zod规则转换为naive-ui的表单规则
const rules = {
  username: {
    required: true,
    trigger: ['blur', 'input'],
    validator: (rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const result = userSignupSchema.shape.username.safeParse(value)
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
        const result = userSignupSchema.shape.password.safeParse(value)
        if (!result.success) {
          reject(new Error(result.error.errors[0].message))
        } else {
          resolve()
        }
      })
    }
  },
  confirmPassword: {
    required: true,
    trigger: 'blur',
    validator: (rule: FormItemRule, value: string) => {
      return new Promise<void>((resolve, reject) => {
        const result = userSignupSchema.shape.confirmPassword.safeParse(value)
        if (!result.success) {
          reject(new Error(result.error.errors[0].message))
        } else {
          resolve()
        }
      })
    }
  }
}

const callbackMessage = ref({
  isShow: false,
  isValid: true,
  message: ''
})
const captcha = ref()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(userSignupSchema)
})

const signup = handleSubmit(async (values) => {
  console.log(values)
  try {
    await $fetch('/api/auth/signup', {
      body: values,
      method: 'POST'
    })
    callbackMessage.value = {
      isShow: true,
      isValid: true,
      message: '注册成功, 2秒后跳转登录'
    }
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  } catch (e: any) {
    callbackMessage.value = {
      isShow: true,
      isValid: false,
      message: e.data.statusMessage || '注册失败'
    }
  }
})

const toSignup = async (e: MouseEvent) => {
  e.preventDefault()
  try {
    // 先进行表单验证
    await formRef.value?.validate()

    try {
      await $fetch('/api/auth/signup', {
        body: formState,
        method: 'POST'
      })
      callbackMessage.value = {
        isShow: true,
        isValid: true,
        message: '注册成功, 2秒后跳转登录'
      }
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    } catch (e: any) {
      callbackMessage.value = {
        isShow: true,
        isValid: false,
        message: e.data.statusMessage || '注册失败'
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
const getCaptcha = () => {}
</script>

<template>
  <div cLass="mx-auto max-w-screen-xL px-4 py-16 sm:px-6 Lg:px-8">
    <div class="mx-auto max-w-lg text-center">
      <h1 class="text-2xl font-bold sm:text-3x1">注册成为会员</h1>
      <p class="mt-4 口text-gray-500">输入以下信息来完成注册</p>
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
        <n-form-item path="confirmPassword" label="确认密码">
          <NInput
            v-model:value="formState.confirmPassword"
            placeholder="二次输入密码"
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
        <NFormItem>
          <div class="flex flex-1 items-center text-gray-500">
            已经有账号了？
            <NuxtLink class="underline" to="/login">去登录</NuxtLink>
          </div>
          <NButton type="primary" @click="toSignup">Signup</NButton>
        </NFormItem>
        <button @click="signup">sing</button>
      </n-form>
      <div
        v-if="callbackMessage.isShow"
        :class="{
          'border-red-500 bg-red-50 text-red-700': !callbackMessage.isValid,
          'border-green-500 bg-green-50 text-green-500': callbackMessage.isValid
        }"
      >
        {{ callbackMessage.message }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>

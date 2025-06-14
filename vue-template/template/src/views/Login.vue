<template>
  <div class="login-container">
    <el-form class="login-form" ref="loginFormRef" :rules="loginRules" :model="loginForm">
      <div class="admin-logo">
        <img class="logo" src="../../assets/vue.svg" alt="logo" size-80px />
        <h1 class="name">Vue3 Admin</h1>
      </div>
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginState.loginForm.username">
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-name="ant-design:user-outlined"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          placeholder="请输入密码"
          autocomplete="on"
          show-password
          v-model="loginState.loginForm.password"
          prop="password"
        >
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-name="ant-design:lock-outlined"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input maxlength="4" v-model="loginState.loginForm.captcha" placeholder="请输入验证码">
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-name="ant-design:captcha-outlined"></svg-icon>
            </span>
          </template>
          <template #append>
            <img
              :src="loginState.captchaImg"
              alt=""
              @click.stop="getCaptcha"
              w-100px
              h-full
              border-none
              bg-gray-3
            />
          </template>
        </el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button type="primary" @click="handleLogin" w-full mb-30px>登录</el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { FormInstance } from 'element-plus'
import { onMounted, reactive, useTemplateRef } from 'vue'
import { captchaApi } from '@/api/user'
import { useRouter } from 'vue-router'
import { useRouteQuery } from '@/hooks/useRouteQuery'

const router = useRouter()
const { redirect, otherQuery } = useRouteQuery()

const { login } = useGlobalStore()

const loginState = reactive({
  loginForm: {
    username: '',
    password: '',
    captcha: ''
  },
  captchaImg: '',
  loginRules: {
    userame: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
    password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
  }
})
const loginFormInstance = useTemplateRef<FormInstance>('loginFormRef')
const { loginForm, loginRules } = loginState

const handleLogin = () => {
  loginFormInstance.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const r = await login(loginForm)
        console.log(valid, r)
        // 解析重定向路径
        await router.push({
          path: redirect.value || '/',
          query: {
            ...otherQuery.value
          }
        })
      } catch {
        getCaptcha()
      }
    }
  })
}

const getCaptcha = () => {
  captchaApi().then((res) => {
    console.log(res)
    const b = new Blob([res as any], { type: 'image/svg+xml' })
    loginState.captchaImg = URL.createObjectURL(b)
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped lang="scss">
.login-container {
  @apply min-h-screen w-full;
  .login-form {
    @apply w-500px mx-auto py50px;
  }

  .admin-logo {
    @apply flex items-center justify-center my-20px;
  }

  :deep(.el-input-group__append) {
    @apply px-0;
  }
}
</style>

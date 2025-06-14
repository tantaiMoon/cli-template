<script setup lang="ts">
import { onBeforeMount, reactive, useTemplateRef } from 'vue'
import { captchaApi } from '@/api/user'
import { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useRouteQuery } from '@/hooks/useRouteQuery'
import { useGlobalStore } from '@/stores/global'

const loginFormInstance = useTemplateRef<FormInstance>('loginFormRef')
const router = useRouter()
const { redirect, otherQuery } = useRouteQuery()

const { login } = useGlobalStore()

const loginState = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaImg: '',
  captchaKey: ''
})
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
}

const handleLogin = () => {
  console.log('login')
  loginFormInstance.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const r = await login(loginState)
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
onBeforeMount(() => {
  console.log(' before mount')
  getCaptcha()
})
</script>
<template>
  <div class="login-container">
    <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <el-form class="login-form" :rules="loginRules" :model="loginState" ref="loginFormRef">
      <h3 w-full>Vue Admin</h3>

      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          class="login-input"
          placeholder="Email or Phone"
          id="username"
          v-model="loginState.username"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          class="login-input"
          type="password"
          placeholder="Password"
          id="password"
          v-model="loginState.password"
        />
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <el-input
          class="login-input captcha-input"
          type="text"
          maxlength="4"
          placeholder="验证码"
          id="captcha"
          v-model="loginState.captcha"
        >
          <template #append>
            <img :src="loginState.captchaImg" alt="" @click.stop="getCaptcha" class="captcha-img" />
          </template>
        </el-input>
      </el-form-item>

      <el-button class="login-button" w-full @click="handleLogin">Log In</el-button>
      <!--      <div class="social">-->
      <!--        <div class="go"><i class="fab fa-google"></i> Google</div>-->
      <!--        <div class="fb"><i class="fab fa-facebook"></i> Facebook</div>-->
      <!--      </div>-->
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  @apply w-full;
  height: 100vh;
  background-color: #0f0652;
}

.background {
  @apply w-540px h640px absolute left-50% top-50%;
  transform: translate(-50%, -50%);
}

.background .shape {
  @apply w-200px h-200px absolute rd-50%;
}

.shape:first-child {
  @apply left--80px top--80px;
  background: linear-gradient(#1845ad, #23a2f6);
}

.shape:last-child {
  @apply right--30px bottom--80px;
  background: linear-gradient(to right, #ff512f, #f09819);
}
.captcha-input {
  --el-fill-color-light: transparent;
  :deep(.el-input-group__append) {
    @apply p0 border-none;
  }
}
.captcha-img {
  @apply w-120px
  h-full
  border-none bg-gray-9;
}
.login-form {
  height: 560px;
  width: 460px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;

  .el-form-item {
    //height: 100%;
    --el-input-height: 50px;
    --el-input-bg-color: transparent;
    --el-input-border-color: transparent;
  }
}

.login-form > * {
  display: block;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}

.login-form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

:deep(.el-form-item__label) {
  display: block;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
}

.login-input {
  display: flex;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 300;
  --el-input-height: 50px;
  --el-input-bg-color: transparent;
  --el-input-border-color: transparent;
  --el-input-text-color: #fff;
}

::placeholder {
  color: #e5e5e5;
}

.login-button {
  margin-top: 30px;
  width: 100%;
  height: 50px;
  color: #333;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;

  > span {
    color: #333;
  }
}

.social {
  margin-top: 30px;
  display: flex;
}

.social div {
  background: red;
  width: 150px;
  border-radius: 3px;
  padding: 5px 10px 10px 5px;
  background-color: rgba(255, 255, 255, 0.27);
  color: #eaf0fb;
  text-align: center;
}

.social div:hover {
  background-color: rgba(255, 255, 255, 0.47);
}

.social .fb {
  margin-left: 25px;
}

.social i {
  margin-right: 4px;
}
</style>

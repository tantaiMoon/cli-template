<script setup lang="ts">
const user = useState<UserProps>('systemuser')
const login = () => {
  user.value.isLogin = true
  user.value.username = 'username'
  navigateTo('/')
}
</script>

<template>
  <div>
login page
    <br/>
    <button @click="login">login</button>
  </div>
</template>

<style scoped>

</style>

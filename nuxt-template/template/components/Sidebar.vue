<script setup lang="ts">
const { user } = useSystemUser()
</script>

<template>
  <nav>
    <ul class="px-2 space-y-2">
      <li>
        <NuxtLink to="/home">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/system/users">User</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/system/users/:id">User Detail</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/product/detail/3">product Detail</NuxtLink>
      </li>
      <li v-if="!user.isLogin">
        <NuxtLink to="/login">login</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>

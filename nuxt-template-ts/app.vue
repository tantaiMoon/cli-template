<script setup lang="ts">
import { useSystemUseer } from '~/composables/useSystemUser'

const user = useSystemUseer()
</script>
<template>
  <div>
    <header>
      <ul>
        <li><NuxtLink to="/">Dashboard</NuxtLink></li>
        <li><NuxtLink to="/home">Home</NuxtLink></li>
        <li><NuxtLink to="/system/users">User</NuxtLink></li>
        <li><NuxtLink to="/system/users/:id">User Detail</NuxtLink></li>
        <li><NuxtLink to="/product/detail/333">product Detail</NuxtLink></li>
        <li v-if="!user.isLogin"><NuxtLink to="/login">login</NuxtLink></li>
        <li v-else>
          {{ user.username }}
        </li>
      </ul>
    </header>
    <NuxtPage />
  </div>
</template>

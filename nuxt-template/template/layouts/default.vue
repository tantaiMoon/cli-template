<script setup lang="ts">
import Headers from '~/components/Headers.vue'
import Sidebar from '~/components/Sidebar.vue'
</script>

<template>
  <div box-border w-full h-full flex min-w-1000px bg-gray-100 min-h-screen>
    <aside w-sm pt-10px max-w-260px border-amber border>
      <img w-40px ml-10px src="/logo.png" alt="logo" />
      <Sidebar />
    </aside>
    <main overflow-hidden box-border flex-1 class="main">
      <Headers></Headers>
      <section w-full p-10px>
        <NuxtLoadingIndicator />
        <slot></slot>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.header-left {
  color: $themeColor;
}

.main {
  @apply border-l-gray-200 border-l-solid;
  background: $bgColor;
}
</style>

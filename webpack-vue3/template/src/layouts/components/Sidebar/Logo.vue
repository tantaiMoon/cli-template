<script setup lang="ts">
const { collapse = true } = defineProps<{
  collapse: boolean
}>()
</script>

<template>
  <div class="sidebar-logo" :class="{ collapse }">
    <transition name="logo-fade">
      <RouterLink
        to="/"
        :key="collapse ? 'aaa' : 'bbb'"
        class="logo-content"
        flex
        items-center
        h-full
      >
        <img src="" alt="" class="sidebar-logo-img" fill="covert" />
        <h1 v-if="!collapse" class="sidebar-logo-title">Vue Admin</h1>
      </RouterLink>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.sidebar-logo {
  // text-[v-bind(theme)]
  padding-left: 10px;
  width: 100%;

  height: var(--navbar-height);
  background-color: var(--menu-bg);

  .logo-content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-img {
    margin-right: 5px;
    vertical-align: middle;
    height: calc(var(--navbar-height) / 1.3);
    width: calc(var(--navbar-height) / 1.3);
  }

  &-title {
    display: inline-block;
    margin: 0;
    color: #fff;
  }
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.1s;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}
</style>

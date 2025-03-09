<script setup lang="ts">
</script>

<template>
  <SideNavHolder title="选择词典">
    <template #nav>
      <slot name="nav" />
    </template>
    <template #main>
      <slot />
    </template>
    <template #header>
      <slot name="header" />
    </template>
    <slot />
  </SideNavHolder>
</template>

<style lang="scss" scoped>
</style>

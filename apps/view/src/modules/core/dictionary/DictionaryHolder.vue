<script setup lang="ts">
import { IRefreshDone } from "~/components/page/types";

const emits = defineEmits<{
  (e: "refresh", callback: IRefreshDone): void;
}>();

function handleRefresh(fn: IRefreshDone) {
  emits("refresh", fn);
}
</script>

<template>
  <SideNavHolder
    :onrefresh="handleRefresh"
    enable-pull-refresh
    title="选择词典"
  >
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

<style lang="scss" scoped></style>

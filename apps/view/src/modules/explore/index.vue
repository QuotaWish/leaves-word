<script setup lang="ts">
import ExploreBackground from "./ExploreBackground.vue";
</script>

<template>
  <WithHeadPage class="ExplorePage">
    <template #bg>
      <ExploreBackground />
    </template>

    <template #header>
      <h1 class="title">探索</h1>
    </template>

    <div class="ExplorePage-Main p-4">
      <slot />
    </div>
  </WithHeadPage>
</template>

<style lang="scss">
.ExplorePage {
  display: flex;

  flex-direction: column;

  background-color: var(--el-fill-color);
}
</style>

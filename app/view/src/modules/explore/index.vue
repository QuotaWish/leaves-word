<script setup lang="ts">
import ExploreBackground from './ExploreBackground.vue'
</script>

<template>
  <WithPage>
    <div class="ExplorePage">
      <h1 class="title">
        探索
      </h1>

      <div class="ExplorePage-Main">
        <slot />
      </div>

      <ExploreBackground />
    </div>
  </WithPage>
</template>

<style lang="scss">
.ExplorePage {
  & > h1 {
    font-size: 24px;
    font-weight: 600;

    color: var(--el-text-color-primary);
  }

  padding: 1rem;
  display: flex;

  flex-direction: column;
}
</style>

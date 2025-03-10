<script setup lang="ts">
import ExploreBackground from './ExploreBackground.vue'
</script>

<template>
  <WithHeadPage class="ExplorePage">
    <template #bg>
      <ExploreBackground />
    </template>

    <template #header>
      <h1 class="title">
        探索
      </h1>
    </template>

    <div class="ExplorePage-Main">
      <slot />
    </div>
  </WithHeadPage>
</template>

<style lang="scss">
.ExplorePage {
  padding: 1rem;
  display: flex;

  flex-direction: column;
}
</style>

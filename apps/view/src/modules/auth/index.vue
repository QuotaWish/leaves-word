<script setup lang="ts">
import AuthBackground from './AuthBackground.vue'
import AuthCarousel from './AuthCarousel.vue'
import AuthHolder from './AuthHolder.vue'
import AuthMain from './AuthMain.vue'
import AuthWrapper from './AuthWrapper.vue'
</script>

<template>
  <AuthHolder>
    <AuthWrapper>
      <template #upper>
        <AuthCarousel />
      </template>
      <template #auth>
        <AuthBackground />
        <AuthMain />
      </template>
    </AuthWrapper>
  </AuthHolder>
</template>

<style lang="scss" scoped>
</style>

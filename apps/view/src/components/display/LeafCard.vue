<script setup lang="ts">
</script>

<template>
  <div class="LeafCard">
    <slot />
  </div>
</template>

<style lang="scss">
.LeafCard {
  position: relative;
  padding: 0.5rem 0;
  width: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--theme-color-rgb), 0.08);
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: linear-gradient(125deg, 
      rgba(var(--theme-color-rgb), 0.02) 0%, 
      rgba(var(--theme-color-rgb), 0.05) 70%,
      rgba(var(--theme-color-rgb), 0.08) 100%);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    right: -50px;
    bottom: -50px;
    border-radius: 50%;
    filter: blur(20px);
    background: radial-gradient(
      circle at 30% 30%,
      rgba(var(--theme-color-rgb), 0.15) 0%,
      rgba(var(--theme-color-rgb), 0.05) 60%,
      transparent 100%
    );
    opacity: 0.6;
    z-index: -1;
  }

  html.dark & {
    background: rgba(var(--theme-color-rgb), 0.08);
    border: 1px solid rgba(255, 255, 255, 0.05);
    
    &::before {
      background: linear-gradient(125deg, 
        rgba(var(--theme-color-rgb), 0.03) 0%, 
        rgba(var(--theme-color-rgb), 0.06) 70%,
        rgba(var(--theme-color-rgb), 0.1) 100%);
    }
    
    &::after {
      background: radial-gradient(
        circle at 30% 30%,
        rgba(var(--theme-color-rgb), 0.25) 0%,
        rgba(var(--theme-color-rgb), 0.08) 60%,
        transparent 100%
      );
    }
  }
}
</style>

<script setup lang="ts">
defineProps<{
  gradient?: boolean;
}>();
</script>

<template>
  <section class="LineArrow" :class="{ 'with-gradient': gradient }">
    <div class="leaf-decoration" />
    <div flex items-center gap-2 class="head">
      <div class="head-icon">
        <slot name="icon" />
      </div>
      <slot />
    </div>

    <div flex items-center class="end">
      <slot name="end" />
      <div i-carbon:chevron-right class="arrow-icon" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
section.LineArrow {
  position: relative;
  display: flex;
  padding: 0.25rem 1rem;

  width: 100%;
  height: 52px;
  overflow: hidden;
  user-select: none;

  justify-content: space-between;

  border-radius: 16px;
  background: var(--theme-color-light);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &.with-gradient {
    background: linear-gradient(
      135deg,
      var(--theme-color-light),
      var(--theme-color-dark)
    );
    color: white;

    .head-icon {
      background: linear-gradient(
        135deg,
        var(--theme-color-primary),
        var(--theme-color-light)
      );
      color: white;
    }

    .arrow-icon {
      color: var(--theme-color-primary);
    }
  }

  .leaf-decoration {
    position: absolute;
    right: -20px;
    bottom: -20px;
    width: 60px;
    height: 60px;
    opacity: 0.1;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    transform: rotate(45deg);
    pointer-events: none;
    color: var(--theme-color);
  }

  .head-icon {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--theme-color-light);
    color: var(--theme-color-primary);
    // background-color: #e8f5e9;
    // color: #2e7d32;
    transition: all 0.3s ease;
  }

  .end {
    height: 100%;
    min-width: 32px;
    width: max-content;
    font-size: 14px;
    // color: #66bb6a;
    color: var(--theme-color-primary);
  }

  .dark & {
    background-color: rgba(var(--theme-color-rgb), 0.05);
  }
}
</style>

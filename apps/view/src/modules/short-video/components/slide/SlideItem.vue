<template>
  <div class="slide-item">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style>
.slide-item {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  position: relative;
}
</style>

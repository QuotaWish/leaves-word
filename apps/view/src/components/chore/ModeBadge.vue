<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="mode-badge">
    {{ label }}
  </div>
</template>

<style scoped>
.mode-badge {
  background-color: #f0f7ff;
  color: #3498db;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.1);
}

@media (max-width: 480px) {
  .mode-badge {
    font-size: 12px;
    padding: 4px 10px;
  }
}
</style>

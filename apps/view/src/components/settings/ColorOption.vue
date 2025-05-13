<script setup lang="ts">
defineProps<{
  color: string;
  name: string;
  label: string;
  active: boolean;
}>();

defineEmits<{
  (e: "select", event: MouseEvent): void;
}>();
</script>

<template>
  <div
    class="color-option theme-color-transition"
    :class="{ active }"
    @click="$emit('select', $event)"
  >
    <div class="color-preview" :style="{ backgroundColor: color }">
      <div v-if="active" class="check-icon">
        <span i-carbon-checkmark />
      </div>
    </div>
    <div class="color-name">{{ label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    transform: scale(1.05);

    .color-name {
      color: var(--theme-color-primary, var(--el-color-primary));
      font-weight: 600;
    }
  }

  &:hover:not(.active) .color-preview {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.color-preview {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .check-icon {
    color: white;
    font-size: 1.5rem;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
}

.active .color-preview {
  border-color: white;
  box-shadow: 0 0 0 3px var(--theme-color-primary, var(--el-color-primary));
}

.color-name {
  font-size: 1rem;
  transition: color 0.3s ease;
  margin-top: 0.25rem;
}
</style>

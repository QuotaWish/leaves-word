<script setup lang="ts">
const props = defineProps<{
  max?: number;
  modelValue: string;
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const model = useVModel(props, "modelValue", emits);
</script>

<template>
  <div class="SettingsInput w-full">
    <input
      :placeholder="placeholder"
      w-full
      h-full
      type="text"
      v-model="model"
      :max="max"
    />
    <div class="SettingsInput-Mention">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SettingsInput {
  height: 48px;

  background-color: var(--el-fill-color-dark);
  border-bottom: 1px solid var(--el-border-color);
}
</style>

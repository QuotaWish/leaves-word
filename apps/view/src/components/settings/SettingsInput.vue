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
  <div class="SettingsInput gap-1 flex flex-col items-center w-full">
    <input
      :placeholder="placeholder"
      w-full
      h-full
      type="text"
      v-model="model"
      :maxlength="max"
    />
    <div class="SettingsInput-Mention px-2 text-sm op-75">
      <slot name="mention" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SettingsInput {
  &-Mention {
    align-self: flex-end;
  }
  input {
    padding: 0 1rem;

    height: 48px;
  }

  // background-color: var(--el-bg-color);
  // border-bottom: 1px solid var(--el-border-color);
}
</style>

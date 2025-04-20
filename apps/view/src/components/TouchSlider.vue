<script setup lang="ts" name="TouchSlider">
const props = defineProps<{
  modelValue: boolean,
  reversed?: boolean,
  title: string,
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (props.disabled) return

    emits('update:modelValue', value)

    window.navigator.vibrate(200);
  },
})
</script>

<template>
  <div :class="{ disabled, active: !reversed ? value : !value }" @click="value = !value" class="TouchSlider">
    <span class="title">{{ title }}</span>

    <span class="button" />
  </div>
</template>

<style>
.TouchSlider.disabled .button {
  opacity: .5;
  cursor: not-allowed;
}

.TouchSlider {
  padding: .25rem 0;
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.TouchSlider .button {
  position: relative;
  width: 50px;
  height: 20px;

  cursor: pointer;
  border-radius: 10px;
  background-color: #eeeeee;
}

.TouchSlider .button::before {
  content: "";
  position: absolute;

  left: 5px;
  top: 50%;

  width: 1rem;
  height: 1rem;
  border-radius: 10px;
  background-color: #33333350;
  transform: translate(0, -50%);
  transition: 0.3s ease;
}

.TouchSlider.active .button::before {
  left: calc(100% - 5px - 1rem);

  background-color: #33333380;
}

.TouchSlider .title {
  font-weight: 600;
}
</style>

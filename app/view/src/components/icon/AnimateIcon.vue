<script lang="ts" setup>
const props = defineProps<{
  active?: boolean
}>()

const emits = defineEmits(['click'])

const button = ref()
watch(() => props.active, (visible) => {
  if (!visible)
    return

  const container = button.value

  container.querySelectorAll('animate').forEach((element: any) => {
    element.beginElement()
  })
})

function handleClick() {
  const container = button.value

  container.querySelectorAll('animate').forEach((element: any) => {
    element.beginElement()
  })

  emits('click')
}
</script>

<template>
  <button ref="button" :class="{ active }" class="AnimateIcon" @click="handleClick">
    <slot />
  </button>
</template>

<style lang="scss">
.AnimateIcon {
  &.active {
    color: var(--theme-color);
  }

  svg {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    // mask-image: var(--icon);
    // mask-repeat: no-repeat;
    // mask-size: 100% 100%;
  }

  position: relative;

  width: 1.2em;
  height: 1.2em;

  color: currentColor;
}
</style>

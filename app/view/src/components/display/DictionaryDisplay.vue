<script setup lang="ts">
import type { Dictionary, IDict } from '~/composables/words'

const props = defineProps<{
  dict: Dictionary
}>()

function generateStyles(dict: IDict) {
  const obj: Record<string, string> = {
    '--color': dict.style.color,
    '--color-light': dict.style.colorLight,
  }

  const style = Object.keys(obj).reduce((acc, cur) => {
    acc += `${cur}: ${obj[cur]};`
    return acc
  }, '')

  return style
}
</script>

<template>
  <div :style="generateStyles(dict)" class="DictionaryDisplay">
    <p class="DictionaryDisplay-Title">
      {{ dict.name }}
    </p>

    <div class="icon">
      <div v-html="dict.style.icon" />
    </div>
  </div>
</template>

<style lang="scss">
.DictionaryDisplay {
  .icon {
    & > div svg {
      width: 2em;
      height: 2em;

      opacity: 0.125;
    }

    z-index: 1;
    position: absolute;

    width: 1em;
    height: 1em;

    right: 1.25em;
    bottom: 1.25em;

    mix-blend-mode: difference;
    color: var(--el-text-color-secondary);
  }

  &::before {
    content: '';
    position: absolute;

    bottom: 0px;
    right: -0px;

    width: 98%;
    height: 3px;

    border-radius: 16px 0 16px 16px;
    background-color: var(--el-fill-color);
  }

  &-Title {
    font-size: 12px;
    font-weight: 600;

    color: #000;
  }

  position: relative;
  padding: 1rem;

  width: 100%;
  height: 100%;

  flex: 1 0 120px;
  border-radius: 6px 2px 4px 8px;
  background-image: linear-gradient(to right, var(--color), var(--color-light)),
    linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
  border: 2px solid var(--color-light);
}
</style>

<script setup lang="ts">
import type { IDict } from '~/composables/words'
import { dictionaries, globalData } from '~/composables/words'

const active = computed({
  get() {
    return globalData.value.dict
  },
  set(val) {
    globalData.value.dict = val
  },
})
const el = ref<HTMLElement>()
const { isSwiping, direction } = useSwipe(el)

async function fixActive() {
  const id = `selector-item-${active.value}`
  const dom = document.querySelector(`#${id}`)

  if (!dom)
    return

  dom.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

watch(active, () => nextTick(() => fixActive()), { immediate: true })

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
  <div ref="el" :class="{ swiping: isSwiping }" class="DictSelector">
    <el-scrollbar>
      <div class="DictSelector-Wrapper">
        <div
          v-for="(dict, ind) in dictionaries" :id="`selector-item-${ind}`"
          :key="dict.id" :style="generateStyles(dict)" :class="{ active: dict.id === active }"
          class="DictSelector-Item" @click="active = dict.id"
        >
          <p class="title">
            {{ dict.name }}
          </p>

          <div class="icon">
            <div v-html="dict.style.icon" />
          </div>

          <div class="checkmark">
            <div i-carbon-checkmark />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.DictSelector {
  position: relative;
  width: 100%;
  overflow: hidden;

  &-Wrapper {
    padding: 3rem 1rem 2rem 1rem;
    display: flex;
    gap: 0.5rem;
  }

  &-Item {
    position: relative;
    padding: 1rem;
    width: 120px;
    height: 150px;
    flex: 1 0 120px;
    border-radius: 12px;
    background-color: var(--color-light);
    border: 2px solid var(--color);
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px var(--color-light);

    .icon {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .checkmark {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: var(--theme-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(0);
      transition: all 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px var(--color);
      border-color: var(--color);
      background-color: var(--color-light);
    }

    &.active {
      border: 2px solid var(--color);
      background-color: var(--color-light);
      box-shadow: 0 4px 16px var(--color);
      
      .checkmark {
        transform: scale(1);
      }
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      transition: color 0.3s ease;
    }
  }
}
</style>
<script setup lang="ts">
import TouchDialog from '~/components/dialog/TouchDialog.vue';
import type { WordAffixPart, WordTransform } from '~/composables/api/types';
import { transformpartType, type EnglishWordData } from '~/modules/words';
import { highlightKeywords } from '~/composables';

const props = defineProps<{
  word: EnglishWordData
}>()

const transform = computed(() => {
  return props.word.content?.parts
})

const options = reactive<{
  open: boolean
  data: WordAffixPart | undefined
}>({
  open: false,
  data: undefined
})

const handlePartInfo = (item: WordAffixPart) => {
  console.log(item)

  options.open = true
  options.data = item
}

function getTypeInfo(item: WordAffixPart) {
  const data = item.data as any

  return data[item.type.toLowerCase()] || data[Object.keys(data)[0]]
}

console.log(props.word.content?.parts)
</script>

<template>
  <div v-if="transform" class="WordTransformDisplayer">
    <div :class="{ single: transform.length === 1 }" v-for="item in transform" :key="item.id"
      class="WordTransformDisplayer-Item">
      <div class="WordTransformDisplayer-Item-Decorator">

      </div>
      <template v-if="item">
        <p @click="handlePartInfo(item)" cursor-pointer class="hover:color-[var(--theme-color-primary)]" flex
          items-center gap-2>
          <span>{{ item.content }}</span>
          <span class="type-badge fake-background">{{ item.description}}</span>
          <span text-sm op-75>
            <i block i-carbon-information />
          </span>
        </p>
      </template>
      <template v-else>
        -
      </template>
    </div>

    <TouchDialog targetAnimation=".WordDetailContent" v-model="options.open">
      <div v-if="options.data" class="part-dialog">
        <div class="part-header">
          <span class="type-badge">{{ options.data.type }}</span>
          <span class="part-text">{{ options.data.description }}</span>
        </div>

        <div class="part-section fake-background">
          <div class="section-title">
            <i class="section-icon" i-carbon-text-annotation></i>
            <span>{{ options.data.content }}</span>
          </div>
          <p class="section-content">
            {{ getTypeInfo(options.data) }}
          </p>
        </div>

        <LeafSpeedButton w-full>AI 搜一搜</LeafSpeedButton>

        <div class="decoration-leaf decoration-leaf-1"></div>
        <div class="decoration-leaf decoration-leaf-2"></div>
      </div>
    </TouchDialog>
  </div>
</template>

<style lang="scss" scoped>
.WordTransformDisplayer {
  .type-badge {
    &::after {
      filter: brightness(150%);
      background: linear-gradient(135deg, var(--theme-color-light), var(--theme-color-primary));
    }
    .dark &::after {
      background: linear-gradient(135deg, var(--theme-color-dark), var(--theme-color-primary));
    }
    position: relative;
    padding: 0.25rem 0.5rem;

    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;

    border-radius: 0.5rem;
  }

  &-Item {
    &-Decorator {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 150%;
        background-color: var(--theme-color-primary);
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        transform: translateY(-50%) translateY(1px);
        background-image: linear-gradient(to right, var(--theme-color-primary), #0000);
      }

      position: relative;

      width: 1rem;
      height: 100%;
    }

    &:last-child {
      .WordTransformDisplayer-Item-Decorator {
        &::before {
          opacity: 0;
        }
      }
    }

    &.single {
      .WordTransformDisplayer-Item-Decorator {
        &::before {
          opacity: 1;
          height: 50%;
        }
      }
    }

    position: relative;
    padding-left: 1rem;
    display: flex;

    width: 100%;
    height: 32px;

    gap: 0.5rem;
    align-items: center;
  }
}

.part-dialog {
  position: relative;
  padding: 1.5rem;
  max-width: 90vw;
  width: 100%;
  overflow: hidden;
  color: #333;

  .part-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding-bottom: 0.75rem;

    .type-badge {
      .dark & {
        background: linear-gradient(135deg, var(--theme-color-dark), var(--theme-color-primary));
      }

      background: linear-gradient(135deg, var(--theme-color-light), var(--theme-color-primary));
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .part-text {
      font-size: 1.25rem;
      font-weight: 600;
      background: linear-gradient(90deg, var(--el-text-color-regular), var(--theme-color-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .part-section {
    position: relative;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    color: var(--el-bg-color);
    --fake-opacity: 0.125;
    --fake-color: var(--theme-color-light);

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--el-text-color-regular);

      .section-icon {
        opacity: 0.7;
        font-size: 1.1rem;
      }
    }

    .section-content {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--el-text-color-regular);
    }

    &.frequency-section {
      .frequency-indicator {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.35rem;

        .frequency-dot {
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 50%;
          background-color: var(--el-text-color-secondary);
          transition: all 0.3s ease;

          &.active {
            background: linear-gradient(135deg, var(--theme-color-light), var(--theme-color-primary));
            box-shadow: 0 0 8px rgba(139, 195, 74, 0.6);
          }
        }
      }
    }
  }

  .example-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    --fake-color: var(--el-bg-color-extra-light);
    border-left: 3px solid var(--theme-color-primary);

    color: var(--el-text-color-regular);

    .example-content {
      font-weight: 500;
    }

    .example-part {
      font-size: 0.85rem;
    }
  }

  .decoration-leaf {
    position: absolute;
    width: 150px;
    height: 150px;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.07;
    z-index: -1;

    &.decoration-leaf-1 {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234CAF50'%3E%3Cpath d='M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z'/%3E%3C/svg%3E");
      top: -40px;
      right: -40px;
      transform: rotate(45deg);
    }

    &.decoration-leaf-2 {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234CAF50'%3E%3Cpath d='M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z'/%3E%3C/svg%3E");
      bottom: -40px;
      left: -40px;
      transform: rotate(225deg);
    }
  }
}
</style>
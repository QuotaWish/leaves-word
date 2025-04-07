<script setup lang="ts">
import TouchDialog from '~/components/dialog/TouchDialog.vue';
import { WordTranslation } from '~/composables/api/types';
import { transformDisplayType, type EnglishWordData } from '~/modules/words';
import { highlightKeywords } from '~/composables';
import PlayIcon from '~/components/icon/PlayIcon.vue';

const props = defineProps<{
  word: EnglishWordData
}>()

const translation = computed(() => {
  console.log(props.word.content?.translation)

  return props.word.content?.translation
})

const options = reactive<{
  open: boolean
  data: WordTranslation | undefined
}>({
  open: false,
  data: undefined
})

const handleTranslationInfo = (item: WordTranslation) => {
  console.log(item)

  options.open = true
  options.data = item
}
</script>

<template>
  <div v-if="translation" class="WordTranslationDisplayer">
    <div :class="{ single: translation.length === 1 }" v-for="item in translation" :key="item.id"
      class="WordTranslationDisplayer-Item">
      <div class="WordTranslationDisplayer-Item-Decorator">

      </div>
      <template v-if="item">
        <p @click="handleTranslationInfo(item)" cursor-pointer class="hover:color-[var(--theme-color-primary)]" flex
          items-center gap-2>
          <span>{{ transformDisplayType(item.type) }}.</span>
          <span>{{ item.translation }}</span>
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
      <div v-if="options.data" class="translation-dialog">
        <div class="translation-header">
          <span class="type-badge">{{ options.data.type }}</span>
          <span class="translation-text">{{ options.data.translation }}</span>
        </div>

        <div v-if="options.data.definition" class="translation-section fake-background">
          <div class="section-title">
            <i class="section-icon" i-carbon-text-annotation></i>
            <span>定义</span>
          </div>
          <p class="section-content">{{ options.data.definition }}</p>
        </div>

        <div v-if="options.data.example" class="translation-section fake-background">
          <div class="section-title">
            <i class="section-icon" i-carbon-document-sentiment></i>
            <span>例句</span>
          </div>
          <div class="example-container fake-background">
            <p class="example-content" v-html="highlightKeywords(options.data.example.sentence, options.data.example.highlight)"></p>
            <p v-if="options.data.example.translation" class="example-translation">{{ options.data.example.translation }}</p>
          </div>
        </div>

        <div v-if="options.data.phonetic" class="translation-section fake-background">
          <div class="section-title">
            <i class="section-icon" i-carbon-volume-up></i>
            <span>发音</span>
          </div>
          <p class="section-content">
          {{ options.data.phonetic }}
          </p>
        </div>

        <div v-if="options.data.frequency" class="translation-section fake-background frequency-section">
          <div class="section-title">
            <i class="section-icon" i-carbon-chart-bar></i>
            <span>频率</span>
          </div>
          <div class="frequency-indicator">
            <div
              v-for="n in 5"
              :key="n"
              class="frequency-dot"
              :class="{ active: n <= options.data.frequency }"
            ></div>
          </div>
        </div>

        <div class="decoration-leaf decoration-leaf-1"></div>
        <div class="decoration-leaf decoration-leaf-2"></div>
      </div>
    </TouchDialog>
  </div>
</template>

<style lang="scss" scoped>
.WordTranslationDisplayer {
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
      .WordTranslationDisplayer-Item-Decorator {
        &::before {
          opacity: 0;
        }
      }
    }

    &.single {
      .WordTranslationDisplayer-Item-Decorator {
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

.translation-dialog {
  position: relative;
  padding: 1.5rem;
  max-width: 90vw;
  width: 100%;
  overflow: hidden;
  color: #333;

  .translation-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
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

    .translation-text {
      font-size: 1.25rem;
      font-weight: 600;
      background: linear-gradient(90deg, var(--el-text-color-regular), var(--theme-color-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .translation-section {
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

    .example-translation {
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
<script setup lang="ts">
import { UseImage } from '@vueuse/components'

const props = withDefaults(defineProps<{
  modelValue: API.EnglishDictionary
  onlyImage?: boolean
  border?: boolean
}>(), {
  border: true,
})

const showBorder = computed(() => props.border !== false)
</script>

<template>
  <div class="DictionaryBookDisplay">
    <div :class="{ border: showBorder }" class="cover">
      <UseImage v-if="modelValue.image_url" :src="modelValue.image_url">
        <template #loading>
          <Loading />
        </template>

        <template #error>
          <div class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </template>
      </UseImage>
      <!-- <div v-if="modelValue.image_url" class="cover-wrapper absolute-layout min-h[80px] min-w[80px]">

      </div> -->
      <div v-else class="no-image">
        <span>{{ modelValue.name?.slice(0, 1) || 'D' }}</span>
      </div>
    </div>
    <div v-if="!onlyImage" class="info">
      <div class="name">
        {{ modelValue.name }}
      </div>
      <div class="description">
        {{ modelValue.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DictionaryBookDisplay {
  width: 100%;
  // height: 100%;
  min-height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .cover {
    &.border {
      border: 1px solid var(--el-border-color);
    }

    display: flex;
    flex: 1;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    align-items: center;
    justify-content: center;

    aspect-ratio: 1;
    width: 100%;
    max-height: 100%;

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color);

      span {
        font-size: 32px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .info {
    padding: 0 12px 12px;

    .name {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .description {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

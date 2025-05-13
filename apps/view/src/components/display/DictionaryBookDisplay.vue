<script setup lang="ts">
import type { EnglishDictionary } from "~/composables/api/clients/globals";
import { UseImage } from "@vueuse/components";

const props = withDefaults(
  defineProps<{
    modelValue: EnglishDictionary;
    onlyImage?: boolean;
    border?: boolean;
    active?: boolean;
  }>(),
  {
    border: true,
    active: false,
  },
);

const showBorder = computed(() => props.border !== false);
</script>

<template>
  <div :class="{ onlyImage }" class="DictionaryBookDisplay">
    <div :class="{ border: showBorder, active }" class="cover">
      <AsyncImage
        :src="modelValue.image_url ?? ''"
        :loading="!!modelValue.image_url"
        normal
        obect-fit="contain"
      />

      <!-- <div v-else class="no-image">
        <span>{{ modelValue.name?.slice(0, 1) || "D" }}</span>
      </div> -->

      <div
        v-if="active"
        class="absolute-layout flex items-center justify-center fake-background z-10 DictionaryBookDisplay-Active"
      >
        <div
          font-bold
          text-2xl
          w-10
          h-10
          flex
          items-center
          justify-center
          rounded-full
        >
          <div text-white i-carbon-checkmark />
        </div>
      </div>

      <div
        v-if="modelValue.published_words && !onlyImage"
        class="DictionaryBookDisplay-Stat z-5"
      >
        <span>{{ modelValue.published_words }}&nbsp;词</span>
      </div>
    </div>
    <div v-if="!onlyImage" class="info">
      <div my-2 class="name">
        {{ modelValue.name }}
      </div>
      <div class="description">
        {{ modelValue.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DictionaryBookDisplay-Stat {
  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  position: absolute;
  padding: 0.125rem 0.5rem;

  top: 0;
  right: 0;

  border-radius: 0.25rem 0 0.25rem 0.25rem;
  background-color: var(--el-overlay-color-light);
}

.DictionaryBookDisplay-Active {
  & > div {
    background-color: var(--theme-color-primary);
  }
  --fake-opacity: 0.75;
  --fake-color: var(--el-overlay-color);
}

.DictionaryBookDisplay {
  &.onlyImage {
    height: 100%;

    background-color: #fff;
    border-radius: 8px;
  }
  width: 100%;
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

    // :deep(img) {
    //   width: 100%;
    //   height: 100%;
    //   object-fit: contain;
    //   max-width: 100%;
    //   max-height: 100%;
    // }

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
    padding: 0 4px 4px;

    .name {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .description {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<script setup lang="ts">
import { $api } from "~/composables/api";

const data = reactive({
  poster: "",
  content: "",
  author: "",
  translation: "",
});

$api.utils.getDailyQuote().then((res: any) => {
  if (!res?.content) return;
  const { content, author, translation, origin_img_urls } = res;

  Object.assign(data, {
    content,
    author,
    translation,
    poster: origin_img_urls?.[0],
  });
});

// 根据内容长度获取基准字体大小
const baseFontSize = computed(() => {
  return data.content.length > 80 ? "1.2rem" : "1.5rem";
});
</script>

<template>
  <div class="PlanCover absolute-layout">
    <div
      v-if="data?.poster"
      class="fake-background PlanCover-Bg absolute-layout"
    >
      <AsyncImage :src="data.poster" alt="Cover" />
      <!-- <img :src="data.poster" alt="Cover" /> -->
    </div>
    <!-- Card Placeholder -->
    <!-- <div class="card-placeholder">
      <slot name="card" />
    </div> -->
    <div
      v-if="data?.content"
      class="fake-background PlanCover-Main absolute-layout"
    >
      <div
        class="PlanCover-Main-Inner transition-cubic absolute left-1/2 w-full flex flex-col items-start justify-end px-8 -translate-x-1/2"
      >
        <p class="content-text transition-cubic">
          {{ data.content }}
        </p>
        <p class="translation-text transition-cubic">
          {{ data.translation }}
        </p>
        <p v-if="data.author" class="author-text transition-cubic">
          —— {{ data.author }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PlanCover {
  &-Bg {
    &::after {
      z-index: 0;
    }

    transform: scale(1.1);
    // filter: blur(12px) brightness(0.8) saturate(140%);
    --fake-opacity: 0.05;
    transition: all 0.3s ease;
  }

  &-Main {
    z-index: 1;
    padding: 2rem;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 100%
    );

    &-Inner {
      bottom: calc(var(--footer-height) + 2rem);
    }

    .content-text {
      font-size: v-bind(baseFontSize);
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .translation-text {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .author-text {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
      align-self: flex-end;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  // .card-placeholder {
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  //   width: 366px;
  //   height: 366px;
  //   background-color: #ff0000; /* Pure red as requested */
  //   z-index: 2;
  //   border-radius: 16px;
  //   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  // }

  overflow: hidden;
  position: absolute;
  height: 100%;
}
</style>

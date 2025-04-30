<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Popup } from 'vant'

const showPoster = ref(false)
const currentPoster = ref('')

const banners = reactive([
  {
    id: 'understand',
    title: '懂你英语课程',
    desc: '英语如何学？死记单词？开不了口？',
    image: 'https://img2.quotawish.com/2024/12/21/6766dfbc685ec.png',
    poster: '/images/understand-poster.png',
  },
  {
    id: 'basic_camp',
    title: '英语基础训练营',
    desc: '每天五个小任务，从词到句到题，轻松突破，全面提升。',
    image: 'https://img2.quotawish.com/2024/12/22/6766e7d84a499.png',
    poster: '/images/basic-camp-poster.png',
  },
  {
    id: 'listening',
    title: '美剧精听，听说专练',
    desc: '无障碍看美剧、英剧，地道表达！',
    image: 'https://img2.quotawish.com/2024/12/22/6766e8482b500.png',
    poster: '/images/listening-poster.png',
  },
  {
    id: '3',
    title: '流利口语速成课',
    desc: '专业外教一对一指导，快速改善发音问题。',
    image: 'https://img2.quotawish.com/2025/03/04/67c717b7c4634.webp',
    poster: '/images/speaking-poster.png',
  },
  {
    id: '4',
    title: '写作能力进阶课',
    desc: '系统讲解写作结构与常用句式。',
    image: 'https://img2.quotawish.com/2025/03/04/67c7184aaa0f2.webp',
    poster: '/images/writing-poster.png',
  },
])

// 处理网络图片加载错误
const handleImageError = (title: string) => {
  console.error(`图片 ${title} 加载失败，请检查链接是否有效。`)
}

// 处理海报图片加载错误
const handlePosterError = () => {
  console.error('海报图片加载失败，请检查图片路径是否正确。')
}
</script>

<template>
  <div class="WordIndexBanner">
    <div v-for="(banner, ind) in banners" :key="ind" class="WordIndexBanner-Item" @click="currentPoster = banner.poster; showPoster = true">
      <div flex flex-col gap-1 class="WordIndexBanner-Item-Main">
        <span font-bold>{{ banner.title }}</span>
        <span font-size-3 op-75>{{ banner.desc }}</span>
      </div>
      <div class="WordIndexBanner-Item-Image">
        <!-- 添加错误处理 -->
        <img :src="banner.image" :alt="banner.title" @error="handleImageError(banner.title)" />
      </div>
    </div>
  </div>
  <Popup v-model:show="showPoster" class="poster-popup" position="center">
    <!-- 添加错误处理 -->
    <img :src="currentPoster" class="poster-image" @click="showPoster = false" @error="handlePosterError" />
  </Popup>
</template>

<style lang="scss">
.WordIndexBanner-Item {
  &-Image {
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: auto;
      height: 100%;
      object-fit: cover;
      border-radius: 0 18px 18px 0;
      transform: translate(-50%, -50%);
    }

    // 做遮罩
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      background-color: var(--el-fill-color);
    }

    position: absolute;
    width: 35%;
    height: 100%;
    top: 0;
    right: 0;
    border-radius: 0 16px 16px 0;
    mask: linear-gradient(90deg, transparent, var(--el-bg-color-page) 30%);
  }

  &-Main {
    max-width: 70%;
  }

  &:active {
    background-color: var(--el-fill-color);
  }

  position: relative;
  display: flex;
  padding: 1rem;

  width: 100%;
  height: 80px;

  align-items: center;
  justify-content: space-between;

  border-radius: 16px;
  background-color: var(--el-bg-color-page);
}

.WordIndexBanner {
  position: relative;
  // margin: 0 2.5%;
  display: flex;

  gap: 0.5rem;
  flex-direction: column;
}

.poster-popup {
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  .poster-image {
    max-width: 85vw;
    max-height: 72vh;
    width: auto;
    height: auto;
    object-fit: contain;
    position: absolute;
    top: 50%;
    left: 18%;
    transform: translate(-52%, -54%);
    border-radius: 0;
    box-shadow: none;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &[src] {
      opacity: 1;
    }
  }
}
</style>

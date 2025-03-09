<script setup lang="ts">
const banners = reactive([
  {
    id: 'understand',
    title: '懂你英语课程',
    desc: '英语如何学？死记单词？开不了口？',
    image: 'https://img2.quotawish.com/2024/12/21/6766dfbc685ec.png',
  },
  {
    id: 'basic_camp',
    title: '英语基础训练营',
    desc: '每天五个小任务，从词到句到题，轻松突破，全面提升。',
    image: 'https://img2.quotawish.com/2024/12/22/6766e7d84a499.png',
  },
  {
    id: 'listening',
    title: '美剧精听，听说专练',
    desc: '无障碍看美剧、英剧，地道表达！',
    image: 'https://img2.quotawish.com/2024/12/22/6766e8482b500.png',
  },
])
</script>

<template>
  <div class="WordIndexBanner">
    <div v-for="(banner, ind) in banners" :key="ind" class="WordIndexBanner-Item">
      <div flex flex-col gap-1 class="WordIndexBanner-Item-Main">
        <span font-bold>{{ banner.title }}</span>
        <span font-size-3 op-75>{{ banner.desc }}</span>
      </div>
      <div class="WordIndexBanner-Item-Image">
        <img :src="banner.image" :alt="banner.title">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.WordIndexBanner-Item {
  &-Image {
    img {
      position: absolute;

      top: 50%;
      right: 50%;

      width: 200px;
      height: 100%;

      object-fit: fill;

      border-radius: 0 18px 18px 0;
      transform: translate(50%, -50%);
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
</style>

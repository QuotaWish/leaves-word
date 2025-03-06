<script setup lang="ts" generic="T extends any, O extends any">
import DisplayIndexCourse from '~/components/display/IndexCourse.vue'

defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
</script>

<template>
  <div class="IndexPage">
    <div class="IndexPage-Header">
      <p text-2xl font-bold>
        学习
      </p>

      <div my-4 w-full flex items-center gap-4 class="IndexPage-HeaderAi">
        <img w-8 src="/ai-logo.png">
        <div flex flex-1 items-center justify-between gap-2 class="IndexPage-HeaderAi-Bubble">
          5分钟精确诊断你的英语水平...

          <div class="logo-icon">
            <div i-carbon-arrow-right />
          </div>
        </div>
      </div>
    </div>

    <div mx-auto my--8 class="IndexPage-Card w-80%" @click="router.push('/prewords')">
      <ul flex justify-between>
        <li flex flex-col items-center border-r-1 px-2>
          <p flex items-center text-3 op-75>
            今日任务 <i i-carbon-caret-right block />
          </p>

          <p mt-4 class="title">
            <span font-bold> 0/3</span> 个
          </p>
        </li>
        <li flex flex-col items-center border-r-1 px-2>
          <p flex items-center text-3 op-75>
            今日学习 <i i-carbon-caret-right block />
          </p>

          <p mt-4 class="title">
            <span font-bold> 0/10</span> 分钟
          </p>
        </li>
        <li flex flex-col items-center px-2>
          <p flex items-center text-3 op-75>
            今日任务 <i i-carbon-caret-right block />
          </p>

          <p mt-4 class="title">
            <span font-bold>0</span> 天签到
          </p>
        </li>
      </ul>
    </div>

    <DisplayIndexCourse />
    <el-empty description="None" />
  </div>
</template>

<style>
.IndexPage-Card {
  padding: 1rem;

  border-radius: 12px;
  box-shadow: var(--el-box-shadow);
  background-color: var(--bg-color);
}

.IndexPage-HeaderAi-Bubble {
  .logo-icon {
    display: flex;

    width: 24px;
    height: 24px;

    align-items: center;
    justify-content: center;

    font-weight: 600;
    border-radius: 50%;
    background-color: #fff;
  }
  padding: 0.5rem 1rem;

  color: #000;
  border-radius: 0 12px 12px 12px;
  background-color: var(--theme-color-light);
}

.IndexPage-Header {
  & > p {
    color: #000;
  }
  padding: 1rem;

  height: 40%;
  max-height: 160px;
  background-color: var(--theme-color);
}

.IndexPage {
  height: 100%;

  overflow-y: scroll;
  background-color: var(--el-bg-color);
}
</style>

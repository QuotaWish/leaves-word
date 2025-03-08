<script setup lang="ts">

const courses = [
  {
    title: '懂你英语',
    type: '综合系统课',
    img: "https://img2.quotawish.com/2024/12/22/6766e99f6bed6.png",
  },
  {
    title: '英语基础',
    type: '基础系统课',
    img: "https://img2.quotawish.com/2024/12/22/6766e9a135d89.png",
  },
  {
    title: '英语进阶',
    type: '进阶系统课',
    img: "https://img2.quotawish.com/2024/12/22/6766e99fed915.png",
  },
  {
    title: '英语阅读',
    type: '阅读系统课',
    img: "https://img2.quotawish.com/2024/12/22/6766e9a06d201.png",
  },
]
</script>

<template>
  <div class="DisplayIndexCourse">
    <div flex items-center justify-between class="DisplayIndexCourse-Header">
      <p class="title">
        精品课
      </p>
      <div flex items-center gap-1 text-sm op-75 class="end">
        已完成
        <div i-carbon-chevron-right />
      </div>
    </div>

    <div class="DisplayIndexCourse-Main">
      <el-scrollbar>
        <div h-full flex class="DisplayIndexCourse-MainInner">
          <div v-for="course in courses" :key="course.title" flex-shrink-0 class="DisplayIndexCourse-MainItem">
            <span class="badge">
              限时免费
            </span>

            <div class="DisplayIndexCourse-MainItem-Background">
              <img :src="course.img">
            </div>

            <div flex items-center justify-between p-2 class="DisplayIndexCourse-MainItem-Title">
              <p>{{ course.title }}</p>
              <p op-75>
                {{ course.type }}
              </p>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss">
.DisplayIndexCourse-MainItem-Title {
  font-size: 12px;
}

.DisplayIndexCourse-MainItem {
  .badge {
    z-index: 1;
    position: absolute;
    padding: 0.25rem 0.5rem;

    top: 1rem;
    right: 1rem;

    color: #000;

    font-size: 12px;
    border-radius: 4px 16px 4px 16px;
    background-color: #FFF2D2;
    box-shadow: -2px 2px 4px 0px #E2D2AD50;
  }

  .DisplayIndexCourse-MainItem-Background {
    img {
      position: absolute;

      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      object-fit: cover;
    }
    position: relative;

    // top: 1rem;
    // left: 1rem;

    width: 100%;
    height: 120px;

    overflow: hidden;

    border-radius: 12px;
    border: 1px solid var(--el-border-color);
  }
  position: relative;
  padding: 1rem;

  width: 70%;
  height: 100%;
}

.DisplayIndexCourse-MainInner {
  height: 200px;
}

.DisplayIndexCourse-Main {
  position: relative;

  width: 100%;
  height: 100%;
}

.DisplayIndexCourse {
  position: relative;
  padding: 0.5rem 1rem;

  // height: 200px;
}
</style>

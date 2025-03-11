<script setup>
import SlideHorizontal from "./slide/SlideHorizontal.vue";
import SlideItem from "./slide/SlideItem.vue";
import Utils from "./utils/util.js";
import SlideVertical from "./slide/SlideVertical.vue";
</script>

<template>
  <div class="SlideContainer">
    <SlideHorizontal name="父" class="content">
      <SlideItem style="width: 70%">
        <div class="page" @dragstart="(e) => Utils.$stopPropagation(e)"
          style="background: gainsboro; overflow: auto; touch-action: pan-y">
          <div v-for="i in 5">父slide</div>
          <div v-for="i in 5">第一页</div>
          <div v-for="i in 50">宽度只有70%</div>
        </div>
      </SlideItem>
      <SlideItem>
        <SlideHorizontal indicator name="子" class="content">
          <SlideItem>
            <div class="page" style="background: red">
              <div v-for="i in 5">嵌套 子slide</div>
              <div v-for="i in 5" style="font-size: 50px">1</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: orange">
              <SlideVertical indicator name="孙" class="content">
                <SlideItem v-for="(i, j) in 10">
                  <div class="page">
                    <div v-for="i in 5">嵌套 孙slide</div>
                    <div v-for="i in 5">{{ j }}，上下滑动</div>
                  </div>
                </SlideItem>
              </SlideVertical>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: yellow">
              <div v-for="i in 5">嵌套 子slide</div>
              <div v-for="i in 5" style="font-size: 50px">3</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: khaki">
              <div v-for="i in 5">嵌套 子slide</div>
              <div v-for="i in 5" style="font-size: 50px">4</div>
            </div>
          </SlideItem>
          <SlideItem>
            <div class="page" style="background: green">
              <div v-for="i in 5">嵌套 子slide</div>
              <div v-for="i in 5" style="font-size: 50px">5</div>
            </div>
          </SlideItem>
        </SlideHorizontal>
      </SlideItem>
      <SlideItem>
        <div class="page" style="background: cadetblue">
          <div v-for="i in 5">父slide</div>
          <div v-for="i in 5">第三页</div>
        </div>
      </SlideItem>
    </SlideHorizontal>
  </div>
</template>

<style>
.app-page {
  background: black;
  height: 100vh;
  width: 100vw;
}

.content {
  width: 400px;
  height: 90vh;
}

.SlideContainer {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background-color: #00ff0030;
}

.slide {
  touch-action: none;
  height: 100%;
  width: 100%;
  transition: height 0.3s;
  position: relative;
  overflow: hidden;
}

.slide-list {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
}
</style>

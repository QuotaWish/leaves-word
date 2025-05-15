<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
</script>

<template>
  <PageNavHolder immersive class="DarkHelpPage" title="暗黑模式简介">
    <section class="intro">
      <div class="intro-text">
        <h1>更舒适的视觉体验</h1>
        <p>
          暗黑模式不仅仅是“黑色界面”，它是一种更智能、更护眼、更节能的设计选择。
        </p>
      </div>
    </section>

    <section class="definition card">
      <h2>什么是暗黑模式？</h2>
      <p>
        暗黑模式（Dark
        Mode）是一种以深色背景为主的界面显示方式，特别适合在夜晚或弱光环境中使用，能够有效降低屏幕亮度对眼睛的刺激，同时也展现出更具科技感的视觉风格。
      </p>
    </section>

    <section class="benefits card">
      <h3>核心优势</h3>
      <div class="benefit-list">
        <div class="benefit-item">
          <strong>👁️ 护眼减疲劳</strong>
          <p>降低光线刺激，夜间浏览更舒适</p>
        </div>
        <div class="benefit-item">
          <strong>🔍 更强可读性</strong>
          <p>深色背景下文字对比更清晰</p>
        </div>
        <div class="benefit-item">
          <strong>🔋 省电更环保</strong>
          <p>OLED 屏幕可降低能耗</p>
        </div>
        <div class="benefit-item">
          <strong>🎨 现代科技风</strong>
          <p>简洁美观，更符合现代设计趋势</p>
        </div>
      </div>
    </section>

    <section class="summary">
      <h3>总结</h3>
      <p>
        暗黑模式是一种人性化的视觉方案，不论白天黑夜，皆可自由切换，给你带来更健康、节能、美观的使用体验。
      </p>
    </section>
  </PageNavHolder>
</template>

<style scoped lang="scss">
.DarkHelpPage {
  font-size: 15px;
  line-height: 1.7;

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  h2,
  h3 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
  }

  .card {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 10px;
  }

  .intro {
    padding: 12px 0;
    .intro-text {
      text-align: center;
      padding: 0 8px;
    }
  }

  .benefit-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .benefit-item {
    background: #ffffff;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid #eee;

    strong {
      display: block;
      font-size: 15px;
      margin-bottom: 4px;
    }

    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }

  .summary {
    padding: 0 8px;
    p {
      font-size: 14px;
      color: #444;
    }
  }
}
</style>

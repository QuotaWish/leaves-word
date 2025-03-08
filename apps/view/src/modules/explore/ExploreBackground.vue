<script setup lang="ts">
// 背景组件，不需要任何数据
</script>

<template>
  <div class="ExploreBackground absolute-layout">
    <div class="ExploreBackground-Header">
      <!-- 主背景装饰 -->
      <div class="background-decoration">
        <div class="blue-gradient" />
        <div class="decoration-shape" />
      </div>

      <!-- 玻璃态圆形装饰 -->
      <div class="glass-decorations">
        <div class="glass-circle glass-circle-1" />
        <div class="glass-circle glass-circle-2" />
        <div class="glass-circle glass-circle-3" />
        <div class="glass-pill glass-pill-1" />
        <div class="glass-pill glass-pill-2" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ExploreBackground {
  overflow: hidden;
  z-index: -1;

  // 全屏渐变背景
  background: linear-gradient(125deg, #dde9fd, #eff4ff50 50%);

  .dark & {
    background: linear-gradient(125deg, #1f2d3d, #1f2d3d50 50%);
  }
}

.ExploreBackground-Header {
  position: relative;
  width: 100%;
  height: 120px; // 增加高度以容纳更多装饰
  overflow: hidden;
}

.background-decoration {
  position: relative;
  width: 100%;
  height: 100%;
}

.blue-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background: linear-gradient(180deg, rgba(232, 240, 255, 0) 0%, rgba(232, 240, 255, 0.8) 100%);

  .dark & {
    background: linear-gradient(180deg, rgba(31, 45, 61, 0) 0%, rgba(31, 45, 61, 0.8) 100%);
  }
}

.decoration-shape {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  border-radius: 24px;
  transform: rotate(-15deg);
  opacity: 0.1;
  filter: blur(5px) saturate(180%);

  .dark & {
    opacity: 0.15;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
}

.decoration-shape::before {
  content: '';
  position: absolute;
  left: -40px;
  top: -40px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  border-radius: 16px;
  transform: rotate(30deg);

  .dark & {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
}

// 玻璃态装饰元素
.glass-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glass-circle {
  position: absolute;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));

  .dark & {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0.5;
  }
}

.glass-circle-1 {
  width: 60px;
  height: 60px;
  top: 20px;
  left: 10%;
  transform: translateY(-30%);
}

.glass-circle-2 {
  width: 40px;
  height: 40px;
  top: 40px;
  left: 25%;
}

.glass-circle-3 {
  width: 80px;
  height: 80px;
  top: -20px;
  right: 15%;
  opacity: 0.6;
}

.glass-pill {
  position: absolute;
  border-radius: 40px;
  backdrop-filter: blur(8px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));

  .dark & {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  }
}

.glass-pill-1 {
  width: 120px;
  height: 40px;
  top: 60px;
  left: 40%;
  transform: rotate(-15deg);
  opacity: 0.4;
}

.glass-pill-2 {
  width: 80px;
  height: 30px;
  top: 30px;
  right: 30%;
  transform: rotate(30deg);
  opacity: 0.3;
}
</style>

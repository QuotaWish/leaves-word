<script setup lang="ts">
</script>

<template>
  <div text-black class="transition-cubic WordSignInfoCard fake-background">
    <div class="card-container">
      <div class="card-glass" />
      <div class="card-content">
        <div class="transition-cubic WordSignInfo">
          <slot name="upper" />
        </div>

        <div class="fake-background WordSignInfo-Detail">
          <div class="detail-pattern" />
          <div class="detail-content">
            <slot name="lower" />
          </div>
        </div>
      </div>
    </div>

    <div class="WordSignInfo-Cover pointer-events-none absolute-layout">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.WordSignInfo-Detail {
  position: relative;
  padding: 1.5rem;
  width: 100%;
  height: 260px;
  border-radius: 0 0 24px 24px;
  // border-top: 1px solid rgba(255, 255, 255, 0.12);
  // backdrop-filter: blur(12px);
  transform-origin: bottom;
  transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1);

  &::before {
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    opacity: 0.05;
    --color: var(--theme-color);
    // background-color: #191a1a;
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        var(--theme-color) 25%,
        var(--theme-color-dark) 26%,
        transparent 27%,
        transparent 74%,
        var(--theme-color) 75%,
        var(--theme-color-dark) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      );
    pointer-events: none;
    background-size: 55px 55px;
  }

  z-index: 1;
  position: relative;
  padding: 0.75rem 1.5rem;
  width: 100%;
  height: 260px;
  // background: rgba(var(--theme-color-rgb), 0.95);
  //   backdrop-filter: blur(10px);
  color: var(--el-text-color-primary);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .detail-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
      radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px);
    background-position:
      0 0,
      25px 25px;
    background-size: 50px 50px;
    pointer-events: none;
    animation: patternFloat 60s linear infinite;
  }

  .detail-content {
    position: relative;
    z-index: 2;
    opacity: 0.95;
    transition: opacity 0.4s ease;
  }
}

.WordSignInfoCard {
  position: relative;
  display: flex;
  left: 5%;
  width: 90%;
  height: 390px;
  flex-direction: column;
  justify-content: center;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
  perspective: 1000px;

  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.98);
    border-radius: inherit;
    overflow: hidden;
  }
  user-select: none;
  border-radius: 25px;

  filter: drop-shadow(0 0 4px var(--theme-color));
  backdrop-filter: blur(18px) saturate(180%) brightness(120%);
  //   background-image: linear-gradient(to right, var(--theme-color), var(--theme-color-dark));

  transform: translateY(-1px) scale(0.995);

  .card-container {
    box-shadow:
      0 2px 12px -4px rgba(0, 0, 0, 0.08),
      0 8px 24px -12px rgba(0, 0, 0, 0.12);
    transform: rotateX(1deg);
  }
}

@keyframes patternFloat {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

.WordSignInfo {
  &::before {
    .card-content {
      position: relative;
      height: 100%;
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;

      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0.25;
      --color: var(--theme-color);
      // background-color: #191a1a;
      background-image: linear-gradient(
          0deg,
          transparent 24%,
          var(--theme-color) 25%,
          var(--theme-color-dark) 26%,
          transparent 27%,
          transparent 74%,
          var(--theme-color) 75%,
          var(--theme-color-dark) 76%,
          transparent 77%,
          transparent
        ),
        linear-gradient(
          90deg,
          transparent 24%,
          var(--color) 25%,
          var(--color) 26%,
          transparent 27%,
          transparent 74%,
          var(--color) 75%,
          var(--color) 76%,
          transparent 77%,
          transparent
        );
      background-size: 55px 55px;
    }
  }
}

.WordSignInfo {
  position: relative;
  display: flex;
  width: 100%;
  height: 130px;
}
</style>

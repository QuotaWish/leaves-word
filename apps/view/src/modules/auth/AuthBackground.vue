<script setup lang="ts">

</script>

<template>
  <div class="AuthBackground absolute-layout">
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[38px]">Leaf</span>
    </div>
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[24px]">Words</span>
    </div>
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[14px]">Embrace</span>
    </div>
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[24px]">Worlds</span>
    </div>
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[24px]">Learning</span>
    </div>
    <div class="auth-light-spot">
      <div class="auth-light-spot-ball" />
      <span class="font-size-[14px]">Enhance</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AuthBackground {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: linear-gradient(
      135deg,
      rgba(39, 94, 254, 0.2) 0%,
      rgba(93, 63, 211, 0.2) 50%,
      rgba(75, 123, 255, 0.2) 100%
    );
  }

  z-index: -1;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);

  .dark & {
    background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  }
}

.auth-light-spot {
  &-ball {
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 60%,
      transparent 100%
    );
    filter: blur(15px);
  }

  span {
    position: absolute;

    top: 50%;
    left: 50%;

    font-weight: 600;
    mix-blend-mode: darken;
    transform: translate(-50%, -50%);
  }

  position: absolute;
  border-radius: 50%;

  mix-blend-mode: plus-lighter;

  animation: float 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 24px rgba(255, 255, 255, 0.1),
    inset 0 2px 8px rgba(255, 255, 255, 0.1);
}

.auth-light-spot:nth-child(1) {
  width: 140px;
  height: 140px;
  top: 40px;
  left: 10%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 126, 245, 0.3) 0%,
    rgba(255, 126, 245, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -2s;
}

.auth-light-spot:nth-child(2) {
  width: 100px;
  height: 100px;
  top: 30px;
  right: 5%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(91, 247, 255, 0.3) 0%,
    rgba(91, 247, 255, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -4s;
}

.auth-light-spot:nth-child(3) {
  width: 80px;
  height: 80px;
  bottom: 30px;
  left: 5%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 222, 89, 0.3) 0%,
    rgba(255, 222, 89, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -6s;
}

.auth-light-spot:nth-child(4) {
  width: 120px;
  height: 120px;
  bottom: 60px;
  right: 10%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(130, 255, 173, 0.3) 0%,
    rgba(130, 255, 173, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -3s;
}

.auth-light-spot:nth-child(5) {
  width: 120px;
  height: 120px;
  bottom: 12%;
  right: calc(50% - 20px);
  background: radial-gradient(
    circle at 30% 30%,
    rgba(120, 240, 248, 0.3) 0%,
    rgba(110, 153, 247, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -2s;
}

.auth-light-spot:nth-child(6) {
  width: 80px;
  height: 80px;
  top: 10%;
  right: calc(50% - 80px);
  background: radial-gradient(
    circle at 30% 30%,
    rgba(248, 164, 68, 0.3) 0%,
    rgba(221, 248, 65, 0.1) 60%,
    transparent 100%
  );
  animation-delay: -0.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
  }

  25% {
    transform: translateY(-20px) translateX(20px) scale(1.1) rotate(5deg);
  }

  50% {
    transform: translateY(15px) translateX(-15px) scale(0.9) rotate(-5deg);
  }

  75% {
    transform: translateY(-10px) translateX(10px) scale(1.05) rotate(3deg);
  }
}

/* 性能优化 */
.auth-light-spot {
  will-change: transform;
  transform: translateZ(0);
}
</style>

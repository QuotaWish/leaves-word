<script>
export default {
  name: 'LeafBackground',
}
</script>

<template>
  <div class="LeafBackground">
    <div class="LeafBackground-Overlay">
      <div class="glass-overlay" />
      <div v-for="n in 6" :key="n" class="leaf" :class="`leaf-${n}`">
        <svg viewBox="0 0 24 24" class="leaf-svg">
          <path
            d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LeafBackground {
  &-Overlay {
    overflow: hidden;
    position: relative;
    height: 100%;

    // transform: scale(1.25);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 25%,
        transparent 50%
      );
      animation: shimmer 15s infinite linear;
    }
  }

  z-index: -10;
  position: absolute;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.15) 0%,
    rgba(139, 195, 74, 0.2) 25%,
    rgba(165, 214, 167, 0.15) 50%,
    rgba(129, 199, 132, 0.2) 75%,
    rgba(76, 175, 80, 0.15) 100%
  );
  animation: gradientMove 15s ease infinite;
  background-size: 400% 400%;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(12px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 32px 0 rgba(31, 38, 135, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.18);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
    animation: glassShine 10s infinite ease-in-out;
  }
}

.leaf {
  position: absolute;
  opacity: 0.12;
  animation: float 20s infinite ease-in-out;
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    background: radial-gradient(circle at center, rgba(76, 175, 80, 0.15), transparent 70%);
    filter: blur(5px);
  }
}

.leaf-svg {
  width: 48px;
  height: 48px;
  fill: #4caf50;
  filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.3)) drop-shadow(0 0 16px rgba(76, 175, 80, 0.1));
  transition: all 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 12px rgba(76, 175, 80, 0.4)) drop-shadow(0 0 24px rgba(76, 175, 80, 0.2));
  }
}

.leaf-1 {
  top: 10%;
  left: 10%;
  animation-delay: -2s;
}

.leaf-2 {
  top: 20%;
  right: 20%;
  animation-delay: -5s;
}

.leaf-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: -8s;
}

.leaf-4 {
  bottom: 15%;
  right: 25%;
  animation-delay: -11s;
}

.leaf-5 {
  top: 40%;
  left: 45%;
  animation-delay: -14s;
}

.leaf-6 {
  bottom: 40%;
  right: 35%;
  animation-delay: -17s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0) scale(1);
  }

  25% {
    transform: translateY(-20px) rotate(5deg) scale(1.05);
  }

  50% {
    transform: translateY(0) rotate(0) scale(1);
  }

  75% {
    transform: translateY(20px) rotate(-5deg) scale(0.95);
  }
}

@keyframes gradientMove {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes glassShine {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(-30%, -30%) rotate(0deg);
  }

  25% {
    opacity: 0.7;
    transform: translate(-25%, -35%) rotate(90deg);
  }

  50% {
    opacity: 0.5;
    transform: translate(-30%, -30%) rotate(180deg);
  }

  75% {
    opacity: 0.7;
    transform: translate(-35%, -25%) rotate(270deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .leaf,
  .LeafBackground,
  .glass-overlay::before,
  .LeafBackground-Overlay::before {
    animation: none;
  }
}
</style>

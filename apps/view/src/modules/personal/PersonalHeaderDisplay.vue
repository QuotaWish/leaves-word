<script setup lang="ts">

</script>

<template>
  <div class="PersonalHeaderDisplay">
    <div class="PersonalHeaderDisplay-Background">
      <!-- <div class="light-spot" />
      <div class="light-spot" />
      <div class="light-spot" />
      <div class="light-spot" /> -->
      <img src="/logo.svg">
    </div>
    <div class="PersonalHeaderDisplay-Content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PersonalHeaderDisplay {
  width: 100%;
  height: 100%;

  &-Content {
    position: absolute;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 1rem 1rem;
    display: flex;

    gap: 1rem;
    align-items: center;
    // flex-direction: column;

    .statusbar & {
      padding-top: calc(1rem + 24px);
    }
  }
}

.PersonalHeaderDisplay-Background {
  position: absolute;

  width: 100%;
  height: 100%;

  --fake-opacity: 0;
  backdrop-filter: blur(100px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    background-image: linear-gradient(to bottom, var(--theme-color), #0000);
    pointer-events: none;
  }

  img {
    z-index: -1;
    position: absolute;

    left: 50%;
    bottom: 50%;

    width: 108px;
    height: 108px;

    opacity: 0.5;
    transform: translate(-50%, 50%);
    filter: grayscale(0.5) blur(2px) brightness(120%);
  }

  // background: linear-gradient(
  //   135deg,
  //   rgba(39, 94, 254, 0.2) 0%,
  //   rgba(93, 63, 211, 0.2) 50%,
  //   rgba(75, 123, 255, 0.2) 100%
  // );

  // backdrop-filter: blur(20px);
  // -webkit-backdrop-filter: blur(20px);
  // --fake-opacity: 0.95;
  // // border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  //   pointer-events: none;
  // }

  // .light-spot {
  //   position: absolute;
  //   border-radius: 50%;
  //   background: radial-gradient(
  //     circle at 30% 30%,
  //     rgba(255, 255, 255, 0.4) 0%,
  //     rgba(255, 255, 255, 0.1) 60%,
  //     transparent 100%
  //   );
  //   mix-blend-mode: plus-lighter;
  //   filter: blur(15px);
  //   animation: float 12s infinite cubic-bezier(0.4, 0, 0.2, 1);
  //   backdrop-filter: blur(5px);
  //   border: 1px solid rgba(255, 255, 255, 0.2);
  //   box-shadow:
  //     0 4px 24px rgba(255, 255, 255, 0.1),
  //     inset 0 2px 8px rgba(255, 255, 255, 0.1);
  // }

  // .light-spot:nth-child(1) {
  //   width: 140px;
  //   height: 140px;
  //   top: -40px;
  //   left: 5%;
  //   background: radial-gradient(
  //     circle at 30% 30%,
  //     rgba(255, 126, 245, 0.3) 0%,
  //     rgba(255, 126, 245, 0.1) 60%,
  //     transparent 100%
  //   );
  //   animation-delay: -2s;
  // }

  // .light-spot:nth-child(2) {
  //   width: 100px;
  //   height: 100px;
  //   top: 20px;
  //   right: 10%;
  //   background: radial-gradient(
  //     circle at 30% 30%,
  //     rgba(91, 247, 255, 0.3) 0%,
  //     rgba(91, 247, 255, 0.1) 60%,
  //     transparent 100%
  //   );
  //   animation-delay: -4s;
  // }

  // .light-spot:nth-child(3) {
  //   width: 80px;
  //   height: 80px;
  //   bottom: -20px;
  //   left: 25%;
  //   background: radial-gradient(
  //     circle at 30% 30%,
  //     rgba(255, 222, 89, 0.3) 0%,
  //     rgba(255, 222, 89, 0.1) 60%,
  //     transparent 100%
  //   );
  //   animation-delay: -6s;
  // }

  // .light-spot:nth-child(4) {
  //   width: 120px;
  //   height: 120px;
  //   bottom: 10px;
  //   right: 20%;
  //   background: radial-gradient(
  //     circle at 30% 30%,
  //     rgba(130, 255, 173, 0.3) 0%,
  //     rgba(130, 255, 173, 0.1) 60%,
  //     transparent 100%
  //   );
  //   animation-delay: -3s;
  // }

  // @keyframes float {
  //   0%,
  //   100% {
  //     transform: translateY(0) translateX(0) scale(1) rotate(0deg);
  //   }

  //   25% {
  //     transform: translateY(-20px) translateX(20px) scale(1.1) rotate(5deg);
  //   }

  //   50% {
  //     transform: translateY(15px) translateX(-15px) scale(0.9) rotate(-5deg);
  //   }

  //   75% {
  //     transform: translateY(-10px) translateX(10px) scale(1.05) rotate(3deg);
  //   }
  // }

  // .progress-title {
  //   font-size: 15px;
  //   font-weight: 400;
  //   margin-bottom: 10px;
  //   letter-spacing: 1px;
  //   text-transform: uppercase;
  //   background: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7));
  //   -webkit-background-clip: text;
  //   -webkit-text-fill-color: transparent;
  //   position: relative;
  //   z-index: 1;
  // }

  // .progress-count {
  //   font-size: 32px;
  //   font-weight: 600;
  //   background: linear-gradient(to right, #fff, #e0e7ff);
  //   -webkit-background-clip: text;
  //   -webkit-text-fill-color: transparent;
  //   position: relative;
  //   z-index: 1;
  //   letter-spacing: 2px;
  //   filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  // }

  // /* 性能优化 */
  // .light-spot {
  //   will-change: transform;
  //   transform: translateZ(0);
  // }
}
</style>

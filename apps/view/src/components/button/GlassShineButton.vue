<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean,
}>()
</script>

<template>
  <div class="GlassShineButton">
    <button type="button" class="button fake-background">
      <strong>
        <slot />
      </strong>
      <div id="container-stars">
        <div id="stars"></div>
      </div>

      <div id="glow">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.GlassShineButton {
  position: relative;

  width: 100%;
  height: 60px;

  overflow: hidden;
}

.button {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: 100%;

  cursor: pointer;
  backdrop-filter: blur(18px) saturate(180%);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;

  &::before {
    content: "";
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    opacity: 0.5;
    border-radius: 5rem;
    background-size: 300% 300%;
    background-image:
      linear-gradient(137.48deg,
        #ffdb3b 10%,
        #fe53bb 45%,
        #8f51ea 67%,
        #0044ff 87%);

    background-origin: border-box;
    background-clip: content-box, border-box;

  }
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-family: "Avalors Personal Use";
  font-size: 1.25rem;
  letter-spacing: 5px;
  color: #fff;
  text-shadow: 0 0 4px #00000070;
}

#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 40px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.button:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.button:active .circle {
  background: #fe53bb;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>

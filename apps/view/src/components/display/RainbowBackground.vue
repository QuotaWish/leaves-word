<script lang="ts" setup>
const props = defineProps<{
  loading: boolean;
}>()
</script>

<template>
  <div :style="`opacity: ${!props.loading ? 0 : 1}`" class="RainbowBackground transition-cubic fake-background absolute-layout">
    <div class="RainbowBackground-Shadow absolute-layout" />
  </div>
</template>

<style lang="scss" scoped>
.RainbowBackground {
  --fake-opacity: 0.9;

  &:after {
    z-index: 10;
  }

  &-Shadow {
    filter: blur(18px) saturate(180%);
  }
}

.RainbowBackground-Shadow:before,
.RainbowBackground-Shadow:after {
  z-index: -2;
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  background: linear-gradient(
    45deg,
    #fb0094,
    #0000ff,
    #00ff00,
    #ffff00,
    #ff0000,
    #fb0094,
    #0000ff,
    #00ff00,
    #ffff00,
    #ff0000
  );
  background-size: 400%;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  z-index: -1;
  animation: steam 20s linear infinite;
}

@keyframes steam {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

.RainbowBackground-Shadow:after {
  filter: blur(100px);
}
</style>

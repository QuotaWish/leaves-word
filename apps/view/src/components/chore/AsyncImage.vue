<script setup lang="ts">
import { useImage } from "@vueuse/core";

const props = defineProps<{
  alt?: string;
  src: string;
}>();

const image = useImage({ src: props.src });
</script>

<template>
  <div
    :class="{
      error: image.error.value,
      loading: image.isLoading.value,
      ready: image.isReady.value,
    }"
    class="AsyncImage"
  >
    <img class="transition-cubic" :src="src" :alt="alt" />
    <div class="AsyncImage-Empty transition-cubic absolute-layout"></div>
  </div>
</template>

<style lang="scss" scoped>
.AsyncImage {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    opacity: 0;
  }

  &-Empty {
    .AsyncImage.ready & {
      opacity: 0;
    }

    &::before {
      z-index: -1;
      content: "";
      position: absolute;

      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: 0.25;
      background-image: radial-gradient(
          at 52.38761793452339% 82.31064325079734%,
          hsla(240, 96.87500000000001%, 37.64705882352941%, 1) 0%,
          hsla(240, 96.87500000000001%, 37.64705882352941%, 0) 100%
        ),
        radial-gradient(
          at 86.82007697305298% 74.65300915074025%,
          hsla(238.70967741935485, 96.87500000000001%, 37.64705882352941%, 1) 0%,
          hsla(238.70967741935485, 96.87500000000001%, 37.64705882352941%, 0)
            100%
        ),
        radial-gradient(
          at 65.59645556619355% 7.589701045235964%,
          hsla(237.72972972972974, 95.85492227979276%, 37.84313725490196%, 1) 0%,
          hsla(237.72972972972974, 95.85492227979276%, 37.84313725490196%, 0)
            100%
        );
    }
  }
}

.AsyncImage.ready img {
  opacity: 1;
}
</style>

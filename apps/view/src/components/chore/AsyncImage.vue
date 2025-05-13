<script setup lang="ts">
import { useImage } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    alt?: string;
    src: string;
    /**
     * 默认会有一个渐变色图
     * 启用之后会用 Loading 动画代替
     */
    loading?: boolean;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    /**
     * 启用之后图片会尽可能占据最大空间，而不是强制占据最大空间
     */
    normal?: boolean;
  }>(),
  {
    objectFit: "cover",
  },
);

const options = ref({ src: "" });
const image = useImage(options);

watchEffect(() => {
  options.value.src = props.src;
});
</script>

<template>
  <div
    :class="{
      error: image.error.value,
      loading: image.isLoading.value,
      ready: image.isReady.value,
      normal,
    }"
    class="AsyncImage w-full h-full"
  >
    <img class="transition-cubic" :src="src" :alt="alt" />
    <div class="AsyncImage-Empty transition-cubic absolute-layout">
      <Loading v-if="loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AsyncImage.normal img {
  position: absolute;

  top: 50%;
  left: 50%;

  max-width: 100%;
  width: unset;
  height: 100%;
  max-height: 100%;

  transform: translate(-50%, -50%);
}

.AsyncImage {
  img {
    width: 100%;
    height: 100%;
    object-fit: v-bind(objectFit);

    opacity: 0;
    filter: blur(1px);
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

  filter: blur(0px);
}
</style>

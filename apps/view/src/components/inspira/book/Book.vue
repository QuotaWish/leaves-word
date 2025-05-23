<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { computed } from "vue";
import {
  type BookColor,
  type BookRadius,
  type BookShadowSize,
  type BookSize,
  BOOK_COLOR_MAP as colorMap,
  BOOK_RADIUS_MAP as radiusMap,
  BOOK_SHADOW_SIZE_MAP as shadowSizeMap,
  BOOK_SIZE_MAP as sizeMap,
} from "./index";

interface BookProps {
  class?: HTMLAttributes["class"];
  duration?: number;
  color?: BookColor;
  isStatic?: boolean;
  size?: BookSize;
  radius?: BookRadius;
  shadowSize?: BookShadowSize;
  autoAnimate?: boolean;
}

const props = withDefaults(defineProps<BookProps>(), {
  duration: 1000,
  color: "zinc",
  isStatic: false,
  size: "md",
  radius: "md",
  shadowSize: "lg",
});

const animated = ref(false);
const computedGradient = computed(() => {
  return colorMap[props.color] || colorMap.zinc;
});

onMounted(() => {
  if (props.autoAnimate) {
    setTimeout(() => {
      animated.value = true;
    }, 500); // 0.5 秒延迟
  }
});
</script>

<template>
  <div
    :class="
      cn(
        'z-10 group [perspective:800px] w-min [--shadowColor:#bbb] dark:[--shadowColor:#111]',
        $props.class,
        { 'simulated-hover': animated && !isStatic },
      )
    "
  >
    <div
      :style="{
        width: sizeMap[size].width,
        transition: animated
          ? 'transform 2000ms ease'
          : `transform ${props.duration}ms ease`,
      }"
      class="[transform-style:preserve-3d] relative aspect-[3/4]"
      :class="[
        isStatic
          ? '[transform:rotateY(-30deg)]'
          : animated
            ? '[transform:rotateY(-30deg)]'
            : '[transform:rotateY(0deg)] group-hover:[transform:rotateY(-30deg)]',
        radiusMap[radius],
      ]"
    >
      <div
        :class="`
          absolute inset-y-0 overflow-hidden size-full left-0
          text-white flex flex-col justify-end p-6
          bg-gradient-to-tr
          ${computedGradient.from}
          ${computedGradient.to}
          ${radiusMap[radius]}
        `"
        :style="{
          transform: 'translateZ(25px)',
          boxShadow: '5px 5px 20px var(--shadowColor)',
        }"
      >
        <div
          class="absolute left-0 top-0 h-full"
          :style="{
            minWidth: '8.2%',
            background:
              'linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0) 12%, hsla(0, 0%, 100%, .25) 29.25%, hsla(0, 0%, 100%, 0) 50.5%, hsla(0, 0%, 100%, 0) 75.25%, hsla(0, 0%, 100%, .25) 91%, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .1) 12%, transparent 30%, rgba(0, 0, 0, .02) 50%, rgba(0, 0, 0, .2) 73.5%, rgba(0, 0, 0, .5) 75.25%, rgba(0, 0, 0, .15) 85.25%, transparent)',
            opacity: '0.2',
          }"
        />
        <div class="pl-1">
          <slot />
        </div>
      </div>

      <div
        class="absolute left-0 bg-white"
        :style="{
          top: '3px',
          bottom: '3px',
          width: '48px',
          transform: `translateX(${sizeMap[size].spineTranslation}) rotateY(90deg)`,
          background:
            'linear-gradient(90deg, rgba(255,255,255,1) 50%, rgba(249,249,249,1) 50%)',
        }"
      />

      <div
        :class="`
          absolute inset-y-0 overflow-hidden size-full left-0
          text-white flex flex-col justify-end p-6
          bg-gradient-to-tr
          ${computedGradient.from}
          ${computedGradient.to}
          ${radiusMap[radius]}
        `"
        :style="{
          transform: 'translateZ(-25px)',
          boxShadow: shadowSizeMap[shadowSize],
        }"
      />
    </div>
  </div>
</template>

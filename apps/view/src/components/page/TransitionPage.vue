<script setup lang="ts">
interface TransitionElement extends HTMLElement {
  $transition: {
    name: string;
    mode: string;
    levels: number;
    enable: boolean;
  };
}

const route = useRoute();

// 在元素被插入到 DOM 之前被调用
function onBeforeEnter(tempEl: Element) {
  const el = tempEl as TransitionElement;
  const { fullPath, meta } = route;
  const { transition } = meta;

  // 判断 fullPath 层级
  const levels = `${fullPath}`.split("/").length - 1;
  el.$transition = {
    name: transition as string,
    mode: "enter",
    levels,
    enable: true,
  };

  if (transition === "nav" && levels !== 1) {
    Object.assign(el.style, {
      transition: "none !important",
      transform: "scale(1.02)",
      opacity: 0,
    });
    return;
  }

  // 如果是一层 就代表是返回
  if (levels === 1) {
    Object.assign(el.style, {
      transition: "none !important",
      transform: "scale(0.9)",
      borderRadius: "35px",
    });
  } else {
    Object.assign(el.style, {
      zIndex: "10",
      transition: "none !important",
      transform: "translateX(120%)",
      borderRadius: "25px",
    });
  }
}

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
async function onEnter(tempEl: Element, done: any) {
  const el = tempEl as TransitionElement;
  const transitionData = el.$transition;
  if (!transitionData?.enable) return done();

  await sleep(10);

  if (transitionData.name === "nav") {
    Object.assign(el.style, {
      transition: "0.3s",
      transform: "scale(1)",
      opacity: 1,
    });
  } else {
    if (transitionData.levels === 1) {
      Object.assign(el.style, {
        transition: "0.3s",
        transform: "scale(1)",
      });
    } else {
      Object.assign(el.style, {
        zIndex: "",
        transition: "",
        transform: "translateX(0%)",
      });
    }
  }
  await sleep(200);
  el.style.borderRadius = "";
  await sleep(100);
  done();
}

// 当进入过渡完成时调用。
function onAfterEnter(tempEl: Element) {
  const el = tempEl as TransitionElement;
  const transitionData = el.$transition;
  if (!transitionData?.enable) return;

  el.$transition.mode = "leave";
  el.$transition.enable = false;
}

// 当进入过渡在完成之前被取消时调用
function onEnterCancelled(tempEl: Element) {
  const el = tempEl as TransitionElement;
  const transitionData = el.$transition;
  if (!transitionData?.enable) return;

  el.$transition.enable = false;
}

// 在 leave 钩子之前调用
function onBeforeLeave(tempEl: Element) {
  const el = tempEl as TransitionElement;

  const transitionData = el.$transition;

  if (transitionData?.mode !== "leave") return;

  const { levels } = transitionData;

  Object.assign(el.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  });

  if (transitionData.name !== "nav" && levels >= 2) {
    Object.assign(el.style, {
      transition: "0.3s",
      transform: "translateX(0%)",
      borderRadius: "35px",
    });
  }

  el.$transition.enable = true;
}

// 在离开过渡开始时调用
// 用这个来开始离开动画
async function onLeave(tempEl: Element, done: any) {
  const el = tempEl as TransitionElement;
  const transitionData = el.$transition;
  if (!transitionData?.enable) return done();

  const { fullPath } = route;

  const currentLevels = `${fullPath}`.split("/").length - 1;
  const { levels } = transitionData;

  console.log("leave", tempEl, levels);

  await sleep(1);

  if (transitionData.name === "nav" && levels < 2) {
    Object.assign(el.style, {
      zIndex: 10,
      transition: "0.3s",
      transform: "scale(0.98)",
      opacity: 0,
    });
  } else {
    // 如果不是一层 就代表是返回
    if (levels === 1) {
      Object.assign(el.style, {
        transition: "0.3s !important",
        transform: "scale(0.9)",
        borderRadius: "35px",
      });
    } else if (currentLevels > levels) {
      Object.assign(el.style, {
        transition: "0.3s !important",
        transform: "translateX(-120%)",
        borderRadius: "35px",
      });
    } else {
      Object.assign(el.style, {
        transition: "0.3s !important",
        transform: "translateX(120%)",
        borderRadius: "35px",
      });
    }
  }

  await sleep(5000);

  done();
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
// function onAfterLeave(el) {
//   console.log("after leave", el);
// }

// 仅在 v-show 过渡中可用
// function onLeaveCancelled(el) {}
</script>

<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    :css="false"
  >
    <slot />
  </Transition>
</template>

<style lang="scss"></style>
